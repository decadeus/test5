'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

export default function Avatar({ uid, url, size, classn, width, height}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState(null)


  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

 

  return (
    <div className="relative h-full m-h-[100px]">
      {avatarUrl ? (
        <Image
         
          src={avatarUrl}
          alt="Avatar"
          className={classn}
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <div className=" bg-gray-300 object-cover w-full h-full"></div>
        
      )}
    
    </div>
  )
}