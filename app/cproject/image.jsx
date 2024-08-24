"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/cproject/getimage";

const supabase = createClient();

export default function AvatarComponent({ user }) {
  const [mainpicUrl, setMainpicUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return; // Early exit if no user ID

      try {
        const { data, error } = await supabase
          .from("project")
          .select("mainpic_url")
          .eq("ide", user.id)
          .single();

        if (error) throw error;

        setMainpicUrl(data.mainpic_url); // Update mainpicUrl directly
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProfile();
  }, [user?.id]); // Ensure the effect re-runs if user.id changes

  const updateProfile = useCallback(
    async (field, value) => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const { error } = await supabase
          .from("project")
          .update({ [field]: value })
          .eq("ide", user.id)
          .single();
        
        if (error) throw error;

        alert("Profile updated!");
        setMainpicUrl(value);
      } catch (error) {
        alert("Error updating the data!");
      } finally {
        setLoading(false);
      }
    },
    [user?.id] // Make sure to only update when user ID changes
  );

  const handleAvatarUpload = (field, url) => {
    if (loading) return; // Prevent updating while loading
    
    setMainpicUrl(url);
    updateProfile(field, url);
  };

  return (
    <div className="w-[400px] h-[250px] shadow-xl text-black">
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Updating...</div>} {/* Show loading message */}
      
      <Avatar
        id="mainpic_url"
        uid={user?.id}
        url={mainpicUrl}
        size={550}
        onUpload={(url) => handleAvatarUpload("mainpic_url", url)}
       
      />
    </div>
  );
}
