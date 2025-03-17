"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "./getimage";

const supabase = createClient();

export default function AvatarComponent({ user }) {
  const [images, setImages] = useState({
    mainpic_url: null,
    pic2: null,
    pic3: null,
    pic4: null,
    pic5: null,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return;

      try {
        setError(null);
        const { data, error } = await supabase
          .from("project")
          .select("mainpic_url, pic2, pic3, pic4, pic5")
          .eq("ide", user.id)
          .single();

        if (error) throw error;

        setImages({
          mainpic_url: data.mainpic_url,
          pic2: data.pic2,
          pic3: data.pic3,
          pic4: data.pic4,
          pic5: data.pic5,
        });
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [user?.id]);

  const updateProfile = useCallback(
    async (field, value) => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const { error } = await supabase
          .from("project")
          .update({ [field]: value })
          .eq("ide", user.id)
          .single();

        if (error) throw error;

        alert("Updated!");
        setImages((prev) => ({ ...prev, [field]: value }));
      } catch (err) {
        setError("Error updating the data!");
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  const handleAvatarUpload = (field, url) => {
    if (loading) return;

    setImages((prev) => ({ ...prev, [field]: url }));
    updateProfile(field, url);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2">
      {error && <div className="col-span-4 text-red-500">{error}</div>}
      {loading && <div className="col-span-4 text-blue-500">Updating...</div>}
      
      <div className="col-span-2 row-span-2 h-[400px]">
        <Avatar
          id="mainpic_url"
          uid={user?.id}
          url={images.mainpic_url}
          size={550}
          onUpload={(url) => handleAvatarUpload("mainpic_url", url)}
        />
      </div>
      <div className="col-start-3">
        <Avatar
          id="pic2"
          uid={user?.id}
          url={images.pic2}
          
          onUpload={(url) => handleAvatarUpload("pic2", url)}
          className="h-full"
        />
      </div>
      <div className="col-start-4">
        <Avatar
          id="pic3"
          uid={user?.id}
          url={images.pic3}
         
          onUpload={(url) => handleAvatarUpload("pic3", url)}
          className="h-full"
        />
      </div>
      <div className="col-start-3 row-start-2 ">
        <Avatar
          id="pic4"
          uid={user?.id}
          url={images.pic4}
          
          onUpload={(url) => handleAvatarUpload("pic4", url)}
          className="h-full"
        />
      </div>
      <div className="col-start-4 row-start-2">
        <Avatar
          id="pic5"
          uid={user?.id}
          url={images.pic5}
        
          onUpload={(url) => handleAvatarUpload("pic5", url)}
          className="h-full"
        />
      </div>
    </div>
  );
}