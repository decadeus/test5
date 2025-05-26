"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Avatar from './getimage';

const supabase = createClient();

export default function ImagePage({ uid }) {
  const [images, setImages] = useState({
    mainpic_url: null,
    pic2: null,
    pic3: null,
    pic4: null,
    pic5: null,
  });

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase
        .from('project')
        .select('mainpic_url, pic2, pic3, pic4, pic5')
        .eq('uid', uid)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setImages({
        mainpic_url: data.mainpic_url,
        pic2: data.pic2,
        pic3: data.pic3,
        pic4: data.pic4,
        pic5: data.pic5,
      });
    }

    fetchImages();
  }, [uid]);

  const handleAvatarUpload = (field) => async (filePath) => {
    const updates = { uid };
    updates[field] = filePath;

    const { error } = await supabase
      .from('project')
      .upsert(updates);

    if (error) {
      alert('Error uploading image!');
    } else {
      setImages((prev) => ({
        ...prev,
        [field]: filePath,
      }));
    }
  };

  return (
    <div>
      <Avatar
        uid={uid}
        url={images.mainpic_url}
        id="main_pic"
        onUpload={handleAvatarUpload('main_pic')}
      />
      <Avatar
        uid={uid}
        url={images.pic2}
        id="pic2"
        onUpload={handleAvatarUpload('pic2')}
      />
      <Avatar
        uid={uid}
        url={images.pic3}
        id="pic3"
        onUpload={handleAvatarUpload('pic3')}
      />
      <Avatar
        uid={uid}
        url={images.pic4}
        id="pic4"
        onUpload={handleAvatarUpload('pic4')}
      />
      <Avatar
        uid={uid}
        url={images.pic5}
        id="pic5"
        onUpload={handleAvatarUpload('pic5')}
      />
    </div>
  );
}
