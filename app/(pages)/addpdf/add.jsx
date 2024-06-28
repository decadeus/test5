
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select a PDF file to upload.");
      }

      const file = event.target.files[0];
      if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed.");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      console.log("Selected PDF:", file); // Log selected PDF details

      const uploadResponse = await supabase.storage
      .from("avatars") // Replace 'avatars' with your bucket name
      .upload(filePath, file); // Upload file with filePath and file object
  
    if (uploadResponse.error) {
      throw new Error(uploadResponse.error.message); // Use specific error message
    }
  
    console.log("Upload response:", uploadResponse); // Log upload response
  
    onUpload(uploadResponse.data.publicUrl); // Pass the uploaded URL to Page component
  } catch (error) {
      console.error("Error uploading PDF:", error); // Log specific upload error
      alert("Error uploading avatar! Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload PDF"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="application/pdf"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
