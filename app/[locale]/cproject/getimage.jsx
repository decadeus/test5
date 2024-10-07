"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from "next/legacy/image";
import { FaDownload } from "react-icons/fa";

const supabase = createClient();

export default function Avatar({ uid, url, id, size, onUpload, classn, width, height }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('project').download(path);
        if (error) throw error;

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log('Error downloading image: ', error);
      }
    }

    if (url) downloadImage(url);
  }, [url]);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('project').upload(filePath, file);

      if (uploadError) throw uploadError;

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative h-full">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className={classn}
          layout="fill"
          objectFit="cover"
          width={width}
          height={height}
        />
      ) : (
        <div
          className="relative h-full flex items-center justify-center bg-white"
          style={{ width: 300, height: 200 }}
        >
          {/* Optionally, add text or an icon to indicate loading */}
          {/* <span>Loading...</span> */}
        </div>
      )}
      <div className="absolute bg-white w-fit rounded-xl text-center border-2 border-black top-4 left-4 py-2 px-4">
        <label className="hover:cursor-pointer" htmlFor={id}>
          {uploading ? 'Uploading ...' : <FaDownload />}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id={id}
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
