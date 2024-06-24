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
import UAvatar from "../getimage/Ugetone"; // Use the original Avatar component
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
        <div className="w-[50px] h-[50px] rounded-full">
          <UAvatar url={avatarUrl} width={50} height={50} classn="rounded-full" />
        </div>
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 border-blue-400 border-2"
        shadow="lg"
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <div className="w-full h-[300px]">
                  {avatarUrl && (
                    <Avatar
                      uid={user?.id}
                      width={2000}
                      height={1000}
                      url={avatarUrl}
                      size={150}
                      onUpload={(url) => setAvatarUrl(url)}
                    />
                  )}
                </div>
                <Input
                  maxLength={16}
                  fullWidth
                  className="flex w-full"
                  id="maintitle"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  label="Votre pseudo"
                />
                <Button
                  color="primary"
                  onClick={() => {
                    updateProfile();
                    onClose();
                  }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Sauvegarder"}
                </Button>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-col w-full justify-end">
                  <Divider className="my-4 w-full" />
                  <form action="/auth/signout" method="post" className="flex justify-end">
                    <button type="submit">
                      <p className="text-red-400">Se deconnecter</p>
                    </button>
                  </form>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
