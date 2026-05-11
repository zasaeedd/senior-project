import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check Supabase user when component mounts
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first!");
      return;
    }

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

    alert("File uploaded successfully!");

    // Save metadata to backend

const { data: { session } } = await supabase.auth.getSession();
console.log("Fetch headers:", {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${session?.access_token}`
});

    await fetch("http://localhost:5000/api/file/saveFileMetadata", {
      method: "POST",    
         headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session?.access_token}`
       },
      body: JSON.stringify({
        originalFilename: file.name,   // for display
        storedFilename: filePath,      // actual key in bucket
        url: publicUrl,
        fileType: file.type,
        userId: user?.id,
      }),
    });

    console.log("Frontend token2:", session?.access_token);
  };

  // Conditional rendering
  if (!user) {
    return <p>You must be logged in to upload files.</p>;
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
