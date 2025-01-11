"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Divider,
} from "@nextui-org/react";
import Avatar from "@/app/getimage/getone";
import UAvatar from "@/app/getimage/getone"; // Use the original Avatar component
import { createClient } from "@/utils/supabase/client";

export default function Text({ user }) {
  const supabase = createClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, username")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setAvatarUrl(data.avatar_url);
        setUsername(data.username);
      }
    };
    fetchProfile();
  }, [user?.id, supabase]);

  const updateProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({ username, avatar_url: avatarUrl })
        .eq("id", user.id)
        .single();
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      console.error("Error updating the profile:", error);
      alert("Error updating the profile!");
    } finally {
      setLoading(false);
    }
  }, [username, avatarUrl, supabase, user?.id]);

  return (
    <>
      <button onClick={onOpen}>
        <div className="rounded-lg  border-2 p-2 border-black">
          <p className="text-black text-sm">Logout</p>
        </div>
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="clearbg border-2"
        shadow="lg"
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              
              <ModalBody>
               
                <form
                  action="/auth/signout"
                  method="post"
                  className="flex justify-center flex-col items-center"
                >
                  <div className="flex flex-col justify-center items-center mb-4 p-8">
                   <h2 className="font-extrabold text-gray-700 text-xl pb-4">Are you Logging Out?</h2>
                   <p>You can always log back in at any time</p>
                   </div>
                  <button type="submit">
                    <p className="text-white text-2xl text-bold border-2 p-2 rounded-xl bg-black  ">Log out 👋</p>
                  </button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
