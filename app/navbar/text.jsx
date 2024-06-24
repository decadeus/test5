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
} from "@nextui-org/react";
import Avatar from "../getimage/getone_u";
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

  const updateProfile = useCallback(
    async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { error } = await supabase
          .from("profiles")
          .update({ username })
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
    },
    [username, supabase, user?.id]
  );

  return (
    <>
      <button onClick={onOpen}>
        <div className="w-[50px] h-[50px]">
          <Avatar
            url={avatarUrl}
            width={50}
            height={50}
            classn="rounded-full"
          />
        </div>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
              
              </ModalHeader>
              <ModalBody>
               
                <Input
                  maxLength={16}
                  fullWidth
                  className="flex w-full"
                  id="maintitle"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  defaultValue="Indiquez un pseudo"
                  label="Votre pseudo"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    updateProfile();
                    onClose();
                  }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
