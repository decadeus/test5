"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@nextui-org/react";
import Avatar from "./avatar";

export default function AccountForm({ user }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  const [pic_profil, setAvatarUrl] = useState(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, pic_profil`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);

        setAvatarUrl(data.pic_profil);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username, pic_profil }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        username,
        pic_profil,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div className="flex flex-col w-full items-center justify-center  bg-gray-700">
        <div className="pt-20">
          <Avatar
            uid={user?.id}
            url={pic_profil}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ pic_profil: url });
            }}
          />
        </div>
      </div>
      <div className="p-4 pt-20 flex flex-col justify-center items-center">
        {user.email}
      </div>
      <div>
        <label htmlFor="username">username</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <Button
          color="primary"
          className="button primary block"
          onClick={() => updateProfile({ pseudo, pic_profil })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </div>
    </div>
  );
}