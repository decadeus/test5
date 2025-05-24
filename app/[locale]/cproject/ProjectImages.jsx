'use client'

import { useState, useEffect } from "react";
import { MdImageNotSupported, MdUpload } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";

export default function ProjectImages({ projectId }) {
  const supabase = createClient();
  const [images, setImages] = useState([null, null, null, null, null]);
  // Memorize the file names for each image slot
  const [imageFiles, setImageFiles] = useState([null, null, null, null, null]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadExistingImages = async () => {
      if (!projectId) return;

      const loadedImages = await Promise.all(
        Array.from({ length: 5 }, async (_, index) => {
          const prefix = `image${index + 1}-`;

          const { data: files, error } = await supabase.storage
            .from("project")
            .list(projectId);

          if (error || !files) return null;

          const matching = files
            .filter((f) => f.name.startsWith(prefix))
            .sort((a, b) => b.name.localeCompare(a.name)); // dernier en premier

          if (!matching.length) return null;

          const path = `${projectId}/${matching[0].name}`;
          const { data } = supabase.storage.from("project").getPublicUrl(path);
          // Memorize both url and file name
          return { url: data.publicUrl, file: matching[0].name };
        })
      );

      setImages(loadedImages.map((img) => img?.url || null));
      setImageFiles(loadedImages.map((img) => img?.file || null));
    };
    loadExistingImages();
  }, [projectId]);

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file || !projectId) return;
    // Limite de taille à 3 Mo
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("L’image dépasse 3 Mo. Merci de choisir une image plus légère.");
      return;
    }
    setUploading(true);

    // Remove previous file if exists before upload
    if (imageFiles[index]) {
      await supabase.storage.from("project").remove([`${projectId}/${imageFiles[index]}`]);
    }

    const filePath = `${projectId}/image${index + 1}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("project").upload(filePath, file, { upsert: true });
    if (error) {
      console.error("Upload error:", error.message);
      alert("Échec de l'envoi.");
    } else {
      // Après upload, recharge la liste pour prendre la plus récente
      // (on ne peut pas deviner le nom exact sinon)
      // On reprend la logique de loadExistingImages mais pour ce slot
      const prefix = `image${index + 1}-`;
      const { data: files, error: listError } = await supabase.storage
        .from("project")
        .list(projectId);
      let newUrl = null;
      let newFileName = null;
      if (!listError && files) {
        const matching = files
          .filter((f) => f.name.startsWith(prefix))
          .sort((a, b) => b.name.localeCompare(a.name));
        if (matching.length) {
          const path = `${projectId}/${matching[0].name}`;
          const { data } = supabase.storage.from("project").getPublicUrl(path);
          newUrl = data.publicUrl;
          newFileName = matching[0].name;
        }
      }
      const newImages = [...images];
      newImages[index] = newUrl;
      setImages(newImages);
      // Update imageFiles with new file name
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = newFileName;
      setImageFiles(newImageFiles);
    }
    setUploading(false);
  };

  // Rendu d'une image avec son upload intégré
  const renderZone = (img, index) => (
    <div
      key={index}
      className="relative w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden"
    >
      {img ? (
        <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
      ) : (
        <MdImageNotSupported className="text-5xl text-gray-400" />
      )}
      <label className="absolute bottom-2 right-2 cursor-pointer text-blue-600 hover:text-blue-800 bg-white bg-opacity-80 rounded-full p-1 shadow">
        <MdUpload className="text-xl" />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileChange(e, index)}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );

  // Nouvelle grille personnalisée avec grid-area pour chaque image
  return (
    <div className="parent grid grid-cols-4 grid-rows-2 gap-2 w-full h-[400px]">
      <div
        className="div2"
        style={{ gridArea: "1 / 1 / 3 / 3" }}
      >
        {renderZone(images[0], 0)}
      </div>
      <div
        className="div4"
        style={{ gridArea: "1 / 3 / 2 / 4" }}
      >
        {renderZone(images[1], 1)}
      </div>
      <div
        className="div3"
        style={{ gridArea: "1 / 4 / 2 / 5" }}
      >
        {renderZone(images[2], 2)}
      </div>
      <div
        className="div5"
        style={{ gridArea: "2 / 3 / 3 / 4" }}
      >
        {renderZone(images[3], 3)}
      </div>
      <div
        className="div6"
        style={{ gridArea: "2 / 4 / 3 / 5" }}
      >
        {renderZone(images[4], 4)}
      </div>
    </div>
  );
}