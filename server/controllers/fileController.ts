import router from "../routes/inst";
import { supabaseService, supabaseAuth } from "../supabassClient";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma/prisma.config";
import { generateToken } from "../utils/jwt";
import { jwtAuthenticate } from "../middleware/authMiddleware";
import os from "os";

// save file metadata after uploading file
export const saveFMD = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  console.log("Token received:", token);
  
  if (!token) {
  res.setHeader("WWW-Authenticate", 'Bearer realm="supabase"');
  return res.status(401).json({ error: "No token provided" });
  }
  
  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.getUser(token);
  console.log("Auth error:", error);
  console.log("User object:", user);

  console.log("Anon key loaded:", process.env.SUPABASE_ANON_KEY?.slice(0, 10));
  console.log(
    "Service role key loaded:",
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10),
  );

  console.log("Authorization header:", req.headers.authorization);
  console.log("Token received:", token);

  if (!token) {
    res.setHeader("WWW-Authenticate", 'Bearer realm="supabase"');
    return res.status(401).json({ error: "No token provided" });
  }

  if (error || !user) {
    console.log("Auth error:", error);
    res.setHeader(
      "WWW-Authenticate",
      'Bearer realm="supabase", error="invalid_token"',
    );
    return res.status(401).json({ error: "Unauthorized" });
  }

  //  Insert metadata with service role client
  const { originalFilename, storedFilename, url, fileType } = req.body;

  console.log("Inserting metadata:", {
    originalFilename,
    storedFilename,
    url,
    fileType,
    uploaded_by: user.id,
  });

  const { data, error: insertError } = await supabaseService
    .from("files")
    .insert([
      {
        filename: originalFilename,
        url,
        file_type: fileType,
        uploaded_by: user.id,
      },
    ])
    .select();

  console.log("Insert error:", insertError);
  console.log("Insert data:", data);

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  res.json({ message: "Metadata saved", data });
};

// retrieve the list of files uploaded by the instructor
export const listFilesInstructor = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const instructor = await prisma.instructor.findUnique({
      where: { userID: Number(userId) },
    });

    if (!instructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    const { data, error } = await supabaseService
      .from("files")
      .select("*")
      .eq("uploaded_by", req.userId) // only return this user's files
      .order("uploaded_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ files: data });
  } catch (err) {
    res.status(500).json({ error: "Unexpected error listing files" });
  }
};

import path from "path";
import * as fs from "fs";
// import { supabase } from "../supabassClient";
import { extractDocx } from "../services/fileExtractor/docxExtractor";
import { extractPdf } from "../services/fileExtractor/pdfExtractor";
import { extractPptx } from "../services/fileExtractor/pptxExtractor";
import { generateQuizDraftFromText } from "../services/openaiQuizGenerator";

function resolveStorageObjectPath(
  fileMeta: { filename: string; url: string } | null,
) {
  if (!fileMeta) return null;
  const publicObjectPrefix = "/storage/v1/object/public/";
  const privateObjectPrefix = "/storage/v1/object/sign/";

  try {
    const url = new URL(fileMeta.url);
    const pathname = url.pathname;
    const publicIndex = pathname.indexOf(publicObjectPrefix);
    if (publicIndex >= 0) {
      return decodeURIComponent(
        pathname
          .slice(publicIndex + publicObjectPrefix.length)
          .replace(/^\/+/, ""),
      );
    }

    const privateIndex = pathname.indexOf(privateObjectPrefix);
    if (privateIndex >= 0) {
      return decodeURIComponent(
        pathname
          .slice(privateIndex + privateObjectPrefix.length)
          .replace(/^\/+/, ""),
      );
    }
  } catch (e) {
    return null;
  }

  return fileMeta.filename;
}

export const processFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const fileMeta = await prisma.files.findUnique({
      where: { id: Number(fileId) },
    });
    if (!fileMeta) return res.status(404).json({ message: "File not found" });

    // supubase storage bucket
    const bucketName =
      process.env.SUPABASE_STORAGE_BUCKET ||
      process.env.BUCKET_NAME ||
      "uploads";
      // temporarily store downloaded file on the server
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "quiz-upload-"));

    // 1. Download file from Supabase Storage
    const storageObjectPath = resolveStorageObjectPath(fileMeta);

    // If the resolved storage path accidentally includes the bucket name (from public URLs), e.g. "uploads/file.pdf"
    // strip it so the storage download call receives the object path only.
    let objectPath = storageObjectPath || fileMeta.filename;
    if (objectPath.startsWith(`${bucketName}/`)) {
      objectPath = objectPath.slice(bucketName.length + 1);
    }

    console.log("Downloading from storage", {
      bucketName,
      storageObjectPath,
      objectPath,
    });
    const { data, error } = await supabaseService.storage
      .from(bucketName)
      .download(objectPath);

    if (error || !data) {
      console.error("Supabase download error:", error);
      fs.rmSync(tempDir, { recursive: true, force: true });
      return res.status(500).json({ message: "Failed to download file" });
    }

    // 2. Convert to buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // 3. Save temporarily for extractors that need a file path
    const tempPath = path.join(tempDir, fileMeta.filename);
    fs.writeFileSync(tempPath, buffer);

    // 4. Extract based on extension
    const ext = path.extname(fileMeta.filename).toLowerCase();
    let extractedContent = "";

    if (ext === ".pdf") {
      extractedContent = await extractPdf(buffer);
    } else if (ext === ".docx") {
      extractedContent = await extractDocx(tempPath);
    } else if (ext === ".pptx") {
      extractedContent = await extractPptx(tempPath);
    } else {
      fs.rmSync(tempDir, { recursive: true, force: true });
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // generate quiz using AI
    let generatedQuiz = null;
    let aiError: string | null = null;

    try {
      generatedQuiz = await generateQuizDraftFromText({
        text: extractedContent,
        title: path.parse(fileMeta.filename).name,
        questionCount: Number(req.body?.questionCount) || 5,
      });
    } catch (aiErr: any) {
      aiError = aiErr?.message || "Failed to generate quiz draft";
    }

    // 5. Clean up temp file
    fs.rmSync(tempDir, { recursive: true, force: true });

    return res.json({
      extractedContent,
      generatedQuiz,
      aiError,
    });
  } catch (err) {
    console.error("Process file error:", err);
    return res.status(500).json({ message: "Failed to process file" });
  }
};

// export const downloadFile = async (req: Request, res: Response) => {
//   // Express params can be undefined, so we guard it
//   const filenameParam = req.params.filename;

//   if (!filenameParam || Array.isArray(filenameParam)) {
//     return res.status(400).json({ error: "Invalid filename parameter" });
//   }

//   try {
//     console.log("Downloading:", filenameParam);

//     const { data, error } = await supabase.storage
//       .from("uploads") // make sure this matches your bucket name
//       .download(filenameParam);

//     if (error) {
//       console.error("Download error:", error.message);
//       return res.status(404).json({ error: error.message });
//     }

//     const fileBuffer = Buffer.from(await data.arrayBuffer());
//     const { data: list } = await supabase.storage.from("uploads").list();
//     console.log("Files in bucket:", list);
//     res.json({ message: "File downloaded", size: fileBuffer.length });
//   } catch (err: any) {
//     console.error("Unexpected error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
