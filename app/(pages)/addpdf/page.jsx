"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { MdOutlinePool, MdFitnessCenter } from "react-icons/md";
import PDFViewer from "./add";

export default function Page() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [ida, setIda] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) throw new Error("User not authenticated");


        const { data, error } = await supabase
          .from("profiles")
          .select("ida")
          .eq("id", user?.id)
          .single();
        if (error) throw error;

        setIda(data.ida);
        


      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    }

    fetchProfile();
  }, [supabase]);

  async function uploadPdf(file) {
    try {
      if (!file) {
        throw new Error("You must select a PDF file to upload.");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      setUploading(true);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars") // Replace 'avatars' with your bucket name
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from("avatars") // Replace 'avatars' with your bucket name
        .getPublicUrl(filePath);

      if (urlError) {
        throw new Error(urlError.message);
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading PDF:", error.message);
      alert("Error uploading PDF. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  const handleUpload = async (event) => {
    try {
      setLoading(true);

      const file = event.target.files[0];
      if (!file) {
        throw new Error("You must select a PDF file to upload.");
      }
      if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed.");
      }

      const uploadedUrl = await uploadPdf(file);

      if (!uploadedUrl) {
        return;
      }

      const updatedData = {
        ide: user.id,
        ida: ida,
        pdf_url: uploadedUrl,
      };
      console.log("Updated data:", updatedData);

      const { data, error } = await supabase.from("pdf").upsert([updatedData]);

      if (error) throw error;

      console.log("PDF added or updated:", data);
      alert("PDF added or updated!");
      setPdfUrl(uploadedUrl);
    } catch (error) {
      console.error("Error adding or updating PDF:", error.message);
      alert("Error uploading PDF or updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  function Up() {
    const up = <MdOutlinePool size={30} />;
    return (
      <div className="bg-gray-300 flex justify-center items-center text-center flex-col rounded-full w-16 h-16 shadow-xl border hover:rotate-12 ">
        <p className="text-5xl">+</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center gap-16">
      {user && (
        <div style={{ width: "100px" }}>
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading ..." : <Up />}
          </label>
          <input
            style={{ visibility: "hidden", position: "absolute" }}
            type="file"
            id="single"
            accept="application/pdf"
            onChange={handleUpload}
            disabled={isLoading}
          />
        </div>
      )}
      <PDFViewer />
    </div>
  );
}
