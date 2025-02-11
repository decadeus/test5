"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/legacy/image";

import { CgProfile } from "react-icons/cg";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Avatar} from "@heroui/react";
import AccountForm from "@/app/account/account-form"

export default function AvatarModal({ user }) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }

      const imageUrl = URL.createObjectURL(data);
      setAvatarUrl(imageUrl);
      setLoading(false);
    } catch (error) {
      console.log("Error downloading image: ", error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getProfile() {
      try {
        const { data, error, status } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user?.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          downloadImage(data.pic_profil);
        }
      } catch (error) {
        console.error("Error loading user data!", error);
        setError(true);
        setLoading(false);
      }
    }

    getProfile();
  }, [supabase]);

  return (
    <div className="py-2">
        <Button className="hide h-fit w-fit rounded-full text-black border-black" isIconOnly onPress={onOpen}>
      {avatarUrl ? (
        <Avatar
        isBordered
          height={48}
          width={48}
          src={avatarUrl}
          alt="Avatar"
          className="object-cover h-12 w-12"
        />
      ) : (
        <div>
          <CgProfile size={48}  />
        </div>
      )}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-0 m-0"></ModalHeader>
              <ModalBody className="p-0 m-0">
               <AccountForm user={user}/>
              </ModalBody>
              <ModalFooter>
               
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}