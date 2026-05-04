import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");

    const filePath = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads") // bucket name
      .upload(filePath, file);

    if (error) {
      console.error(error);
      alert("Upload failed!");
      return;
    }

    // Get public or signed URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    const url = publicUrlData.publicUrl;
    alert("File uploaded successfully!");

    // Save metadata to backend
    await fetch("/api/saveFileMetadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, url }),
    });
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
