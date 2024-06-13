"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import Avatar from "@/app/getimage/getone";

export default function Page() {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [user, setUser] = useState(null);
  const [mainpicUrl, setMainpicUrl] = useState(null);
  const [secondpicUrl, setSecondpicUrl] = useState(null);
  const [threepicUrl, setThreepicUrl] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("residence")
          .select("*")
          .eq("ide", user.id)
          .single();
        if (error) throw error;

        setProfile(data);
        setEditedData(data);
        setMainpicUrl(data.mainpic_url);
        setSecondpicUrl(data.secondpic_url);
        setThreepicUrl(data.threepic_url);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    }

    fetchProfile();
  }, [supabase]);

  const updateProfile = useCallback(
    async (field, value) => {
      try {
        setLoading(true);
        const updatedData = { ...editedData, [field]: value };
        const { error } = await supabase
          .from("residence")
          .update(updatedData)
          .eq("ide", user?.id)
          .single();
        if (error) throw error;

        alert("Profile updated!");
        setProfile(updatedData);
        setEditedData(updatedData);
      } catch (error) {
        alert("Error updating the data!");
      } finally {
        setLoading(false);
      }
    },
    [editedData, supabase, user]
  );

  const handleAvatarUpload = (field, url) => {
    if (field === "mainpic_url") setMainpicUrl(url);
    if (field === "secondpic_url") setSecondpicUrl(url);
    if (field === "threepic_url") setThreepicUrl(url);
    updateProfile(field, url);
  };

  if (error) {
    return (
      <div className="w-full px-40 flex justify-center items-center bg-yellow-300">
        <h1 className="text-4xl font-bold">Error loading data</h1>
        <p className="bg-red-300">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full px-40 flex justify-center items-center bg-blue-300">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full lg:px-20 md:px-10 sm:px-5 text-black">
      <div className="flex flex-col justify-center items-center w-full pb-4">
        <h1 className="text-4xl font-bold">
          <MainTitle
            main={profile.mainTitle}
            edited={editedData.mainTitle}
            updateProfile={() => updateProfile("mainTitle", editedData.mainTitle)}
            loading={loading}
            setEdited={(value) =>
              setEditedData({ ...editedData, mainTitle: value })
            }
            size="text-lg"
            maxLength={400}
          />
        </h1>
      </div>
      <div className="flex flex-col gap-36 justify-center">
        <div className="flex flex-col items-center">
          <div className="w-full h-[600px]">
            {profile.mainpic_url && (
              <Avatar
                uid={user?.id}
                width={2000}
                height={1000}
                url={mainpicUrl || profile.mainpic_url}
                size={150}
                onUpload={(url) => handleAvatarUpload("mainpic_url", url)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex w-1/2 justify-center items-center">
            <div className="flex flex-col gap-8">
              <p className="text-xl font-bold">
                <MainTitle
                  main={profile.t1}
                  edited={editedData.t1}
                  updateProfile={() => updateProfile("t1", editedData.t1)}
                  loading={loading}
                  setEdited={(value) =>
                    setEditedData({ ...editedData, t1: value })
                  }
                  size="text-lg"
                  maxLength={400}
                />
              </p>
              <p>
                <MainTitle
                  main={profile.d1}
                  edited={editedData.d1}
                  updateProfile={() => updateProfile("d1", editedData.d1)}
                  loading={loading}
                  setEdited={(value) =>
                    setEditedData({ ...editedData, d1: value })
                  }
                  size="text-lg"
                  maxLength={400}
                />
              </p>
            </div>
          </div>
          <div className="w-1/2 h-[400px]">
            {profile.secondpic_url && (
              <Avatar
                uid={user?.id}
                width={2000}
                height={1000}
                url={secondpicUrl || profile.secondpic_url}
                size={150}
                onUpload={(url) => handleAvatarUpload("secondpic_url", url)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-8">
          <div className="w-1/2 h-[400px]">
            {profile.threepic_url && (
              <Avatar
                uid={user?.id}
                width={2000}
                height={1000}
                url={threepicUrl || profile.threepic_url}
                size={150}
                onUpload={(url) => handleAvatarUpload("threepic_url", url)}
              />
            )}
          </div>
          <div className="flex w-1/2 justify-center items-center">
            <div className="flex flex-col gap-8">
              <p className="text-xl font-bold">
                <MainTitle
                  main={profile.t2}
                  edited={editedData.t2}
                  updateProfile={() => updateProfile("t2", editedData.t2)}
                  loading={loading}
                  setEdited={(value) =>
                    setEditedData({ ...editedData, t2: value })
                  }
                  size="text-lg"
                  maxLength={400}
                />
              </p>
              <p>
                <MainTitle
                  main={profile.d2}
                  edited={editedData.d2}
                  updateProfile={() => updateProfile("d2", editedData.d2)}
                  loading={loading}
                  setEdited={(value) =>
                    setEditedData({ ...editedData, d2: value })
                  }
                  size="text-lg"
                  maxLength={400}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainTitle({
  main,
  edited,
  updateProfile,
  loading,
  setEdited,
  size,
  maxLength,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button className="text-start" variant="light" onClick={onOpen}>
        {main}
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex justify-center items-center p-8 text-wrap">
                  <Textarea
                    maxLength={maxLength}
                    fullWidth={true}
                    size={size}
                    className="flex w-2xl"
                    id="maintitle"
                    type="text"
                    value={edited || ""}
                    onChange={(e) => setEdited(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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
                  {loading ? "Loading ..." : "Update"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
