"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { createClient } from "@/utils/supabase/client";

export default function Avatar({ url, width, height, classn, style }) {
  const supabase = createClient();
  const [pic, setPic] = useState(null);

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setPic(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  return (
    <div className="relative h-full m-h-[100px]">
      {pic ? (
        <Image
         
          src={pic}
          alt="Avatar"
          className={classn}
          layout="fill"
          objectFit="cover"
        
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: height, width: width }}
        />
      )}
    </div>
  );
}