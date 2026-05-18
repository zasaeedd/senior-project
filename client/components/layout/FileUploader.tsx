import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export type GeneratedQuizChoice = {
  text: string;
  is_correct: boolean;
};

export type GeneratedQuizQuestion = {
  text: string;
  type: "mcq" | "written";
  points: number;
  difficulty: string;
  choices?: GeneratedQuizChoice[];
};

export type GeneratedQuizDraft = {
  title: string;
  questions: GeneratedQuizQuestion[];
};

interface FileUploaderProps {
  onGeneratedQuiz?: (draft: GeneratedQuizDraft) => void;
  onProcessingStateChange?: (isProcessing: boolean) => void;
}

export default function FileUploader({
  onGeneratedQuiz,
  onProcessingStateChange,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check Supabase user when component mounts
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first!");
      return;
    }

    onProcessingStateChange?.(true);
    try {
      // Generate a unique stored filename
      const filePath = `${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("uploads") // make sure this matches your bucket name
        .upload(filePath, file, { contentType: file.type });

      if (error) {
        console.error("Upload error:", error.message);
        alert("Upload failed!");
        return;
      }

      console.log("Upload result:", data); // data.path is the stored filename

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      console.log("Public URL:", publicUrl);

      // Save metadata to backend
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const metadataResponse = await fetch(
        "http://localhost:5000/api/file/saveFileMetadata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            originalFilename: file.name,
            storedFilename: filePath,
            url: publicUrl,
            fileType: file.type,
            userId: user?.id,
          }),
        },
      );

      if (!metadataResponse.ok) {
        const errorText = await metadataResponse.text();
        throw new Error(errorText || "Failed to save file metadata");
      }

      const metadataResult = await metadataResponse.json();
      const fileRecordId = metadataResult?.data?.[0]?.id;

      if (!fileRecordId) {
        throw new Error("File metadata saved, but no record id was returned");
      }

      const processResponse = await fetch(
        `http://localhost:5000/api/file/${fileRecordId}/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            questionCount: 5,
          }),
        },
      );

      if (!processResponse.ok) {
        const errorText = await processResponse.text();
        throw new Error(errorText || "Failed to process uploaded file");
      }

      const processResult = await processResponse.json();
      if (processResult?.generatedQuiz) {
        onGeneratedQuiz?.(processResult.generatedQuiz as GeneratedQuizDraft);
      }

      alert(
        processResult?.aiError
          ? `File uploaded, but quiz generation returned a warning: ${processResult.aiError}`
          : "File uploaded and quiz draft generated successfully!",
      );
    } catch (err: any) {
      console.error("File upload/process error:", err);
      alert(err?.message || "Failed to upload and process file");
    } finally {
      onProcessingStateChange?.(false);
    }
  };

  // Conditional rendering
  if (!user) {
    return <p>You must be logged in to upload files.</p>;
  }

  return (
    <div>
      <input
        title="file ipload"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}
