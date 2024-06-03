'use client'
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Username({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("username, website")
        .eq("id", user?.id)  // Ensure user.id is accessed correctly
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setError("Error loading profile");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <p>{profile.website}</p>
      <p>{profile.username}</p>
    </div>
  );
}
