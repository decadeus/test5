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
  let urlObject;

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('project').download(path);
      if (error) throw error;

      urlObject = URL.createObjectURL(data);
      setAvatarUrl(urlObject);
    } catch (error) {
      // Silently fail or add optional error state
    }
  }

  if (url) downloadImage(url);

  return () => {
    if (urlObject) {
      URL.revokeObjectURL(urlObject);
    }
  };
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
      <div className="relative h-full w-full flex items-center justify-center bg-white border border-black">
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
          <p className='text-black'>Download image</p>
        )}
      </div>
      <div className="absolute bg-white w-fit rounded-xl text-center border-2 border-black top-4 left-4 py-2 px-4">
        <label className="hover:cursor-pointer" htmlFor={id}>
          {uploading ? 'Uploading ...' : <FaDownload color='black' />}
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
      {uploading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <p className="text-black">Uploading...</p>
        </div>
      )}
    </div>
  );
}
