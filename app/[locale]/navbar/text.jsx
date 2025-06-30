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
  Tabs,
  Tab,
} from "@heroui/react";
import Avatar from "@/app/getimage/getone";
import UAvatar from "@/app/getimage/getone"; // Use the original Avatar component
import { createClient } from "@/utils/supabase/client";
import SubscriptionManager from "@/app/[locale]/components/SubscriptionManager";

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
        // console.error("Error fetching profile:", error);
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
      // console.error("Error updating the profile:", error);
      alert("Error updating the profile!");
    } finally {
      setLoading(false);
    }
  }, [username, avatarUrl, supabase, user?.id]);

  return (
    <>
      <button onClick={onOpen} className="flex items-center gap-2 px-3 py-1 h-9 rounded-full border font-semibold text-green-700 border-green-700 bg-white/70 hover:bg-green-700 hover:text-white transition select-none text-base">
        Mon Abonnement
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="clearbg border-2"
        shadow="lg"
        hideCloseButton={true}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold text-gray-800">Abonnement</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </ModalHeader>
              <ModalBody>
                <SubscriptionManager user={user} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
