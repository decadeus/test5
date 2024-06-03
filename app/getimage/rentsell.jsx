"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { createClient } from "@/utils/supabase/client";

export default function Avatar({ url, width, height }) {
  const supabase = createClient();
  const [pic, setPic] = useState(null);

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('rensell').download(path)
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
    <div>
      {pic ? (
        <Image
          width={width}
          height={height}
          src={pic}
          alt="Avatar"
          className="rounded-2xl"
          style={{ objectFit: "cover" }}
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