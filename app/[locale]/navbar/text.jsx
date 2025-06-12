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
} from "@heroui/react";
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
      <button onClick={onOpen} className="flex items-center gap-2 px-3 py-1 h-9 rounded-full border font-semibold text-green-700 border-green-700 bg-white/70 hover:bg-green-700 hover:text-white transition select-none text-base">
        Logout
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
                  className="flex flex-col justify-center items-center p-8 bg-gray-100 rounded-lg shadow-md"
                >
                  <div className="flex flex-col justify-center items-center mb-6">
                    <h2 className="font-extrabold text-gray-800 text-2xl mb-2">
                      Are you Logging Out?
                    </h2>
                    <p className="text-gray-600">
                      You can always log back in at any time
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 text-white text-lg font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                  >
                    Log out 👋
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
