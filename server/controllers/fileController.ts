import router from "../routes/inst";
import { supabaseService, supabaseAuth  } from "../supabassClient"; 
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../prisma/prisma.config';
import { generateToken } from "../utils/jwt";
import { jwtAuthenticate } from "../middleware/authMiddleware";

export const saveFMD = async (req: Request, res: Response) => {
const token = req.headers.authorization?.replace("Bearer ", "");
console.log("Token received:", token);

const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
console.log("Auth error:", error);
console.log("User object:", user);


  console.log("Anon key loaded:", process.env.SUPABASE_ANON_KEY?.slice(0, 10));
  console.log("Service role key loaded:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));

  console.log("Authorization header:", req.headers.authorization);
  console.log("Token received:", token);

  if (!token) {
    res.setHeader("WWW-Authenticate", 'Bearer realm="supabase"');
    return res.status(401).json({ error: "No token provided" });
  }


  if (error || !user) {
    console.log("Auth error:", error);
    res.setHeader("WWW-Authenticate", 'Bearer realm="supabase", error="invalid_token"');
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
    .insert([{
      filename: originalFilename,
      url,
      file_type: fileType,
      uploaded_by: user.id,
    }])
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
      .eq("uploaded_by", req.userId)   // only return this user's files
      .order("uploaded_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ files: data });
  } catch (err) {
    res.status(500).json({ error: "Unexpected error listing files" });
  }
}


import path from "path";
import * as fs from "fs";
// import { supabase } from "../supabassClient";
import { extractDocx } from "../services/fileExtractor/docxExtractor";
import { extractPdf } from "../services/fileExtractor/pdfExtractor";
import { extractPptx } from "../services/fileExtractor/pptxExtractor";

export const processFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const fileMeta = await prisma.files.findUnique({ where: { id: Number(fileId) } });
    if (!fileMeta) return res.status(404).json({ message: "File not found" });

    // 1. Download file from Supabase Storage
    const { data, error } = await supabaseService
      .storage
      .from("your-bucket") // replace with your bucket name
      .download(fileMeta.filename);

    if (error || !data) {
      console.error("Supabase download error:", error);
      return res.status(500).json({ message: "Failed to download file" });
    }

    // 2. Convert to buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // 3. Save temporarily (optional)
    const tempPath = path.join(__dirname, "../uploads", fileMeta.filename);
    fs.writeFileSync(tempPath, buffer);

    // 4. Extract based on extension
    const ext = path.extname(fileMeta.filename).toLowerCase();
    let extractedContent = "";

    if (ext === ".pdf") {
  extractedContent = await extractPdf(buffer);    }
   else if (ext === ".docx") {
      extractedContent = await extractDocx(tempPath);
    } else if (ext === ".pptx") {
      extractedContent = await extractPptx(tempPath);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // 5. Clean up temp file
    fs.unlinkSync(tempPath);

    return res.json({ extractedContent });
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
