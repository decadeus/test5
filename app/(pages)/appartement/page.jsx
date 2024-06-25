"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
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

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("appartement")
          .select("*")
          .eq("ide", user.id)
          .single();
        if (error) throw error;

        setProfile(data);
        setEditedData(data);
        setMainpicUrl(data.mainpic_url);
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
          .from("appartement")
          .update(updatedData)
          .eq("ide", user?.id) // Ensure the correct column is used
          .single();
        if (error) throw error;

        alert("Profile updated!");
        setProfile(updatedData);
        setEditedData(updatedData);
      } catch (error) {
        console.error("Error updating the data:", error); // Log the error details
        alert("Error updating the data! " + error.message); // Show error message
      } finally {
        setLoading(false);
      }
    },
    [editedData, supabase, user]
  );

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
    <div className="flex-col xl:flex-col md:flex-row px-4 pb-4 w-full">
      <h1 className="text-center font-bold text-2xl pt-4">
        <MainTitle
          main={profile.maintitle}
          edited={editedData.maintitle}
          updateProfile={(value) => updateProfile("maintitle", value)}
          loading={loading}
          setEdited={(value) =>
            setEditedData({ ...editedData, maintitle: value })
          }
          size="text-lg"
          maxLength={400}
        />
      </h1>

      <div className="pt-4 hidden sm:flex flex-col xl:flex-row md:flex-col">
        <div className="w-full xl:w-2/3 xl:h-[600px] xl:pr-4 xl:pb-0 sm:w-full sm:h-[300px] sm:pb-4">
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
        <div className="flex xl:flex-col xl:w-1/3 sm:flex-row sm:w-full">
          <div className="h-[200px] xl:w-full sm:w-1/3">
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
          <div className="h-[200px] xl:w-full xl:py-4 xl:px-0 sm:px-4 sm:py-0 sm:w-1/3">
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
          <div className="h-[200px] xl:w-full sm:w-1/3">
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
      </div>

      <div className="py-4 flex gap4 bg-white mt-4 px-4 rounded-lg gap-8">
        <div className="flex flex-col gap-4 w-2/3">
          <h2 className="font-bold text-xl"></h2>
          <div> <div className="flex gap-2">
        <div>
          {profile.surface !== 0 ? (
            <div className="flex gap-1">
              <MainTitle
          main={profile.surface}
          edited={editedData.surface}
          updateProfile={(value) => updateProfile("surface", value)}
          loading={loading}
          setEdited={(value) =>
            setEditedData({ ...editedData, surface: value })
          }
          size="text-lg"
          maxLength={400}
        />
              <p>m2</p>
            </div>
          ) : null}
        </div>
        <p>.</p>
        <div>
          {profile.bed !== 0 ? (
            <div className="flex gap-1">
               <MainTitle
          main={profile.bed}
          edited={editedData.bed}
          updateProfile={(value) => updateProfile("bed", value)}
          loading={loading}
          setEdited={(value) =>
            setEditedData({ ...editedData, bed: value })
          }
          size="text-lg"
          maxLength={400}
        />
              <p>chambre(s)</p>
            </div>
          ) : null}
        </div>
        <p>.</p>
        <div>
          {profile.bath !== 0 ? (
            <div className="flex gap-1">
              <MainTitle
          main={profile.bath}
          edited={editedData.bath}
          updateProfile={(value) => updateProfile("bath", value)}
          loading={loading}
          setEdited={(value) =>
            setEditedData({ ...editedData, bath: value })
          }
          size="text-lg"
          maxLength={400}
        />
              <p>salle de bain</p>
            </div>
          ) : null}
        </div>
      </div></div>
          <hr />
          <div>
          <p style={{ whiteSpace: "pre-wrap" }}> <MainTitle
          main={profile.d1}
          edited={editedData.d1}
          updateProfile={(value) => updateProfile("d1", value)}
          loading={loading}
          setEdited={(value) =>
            setEditedData({ ...editedData, d1: value })
          }
          size="text-lg"
          maxLength={1000}
        /></p>
          </div>
        </div>
        <div className="w-1/3 ">
          {" "}
          <div className="shadow-lg p-4 rounded-xl flex flex-col gap-4">
            <div className="w-fit text-xl">
              <span className="font-bold">
                {" "}
                <MainTitle
          main={profile.maintitle}
          edited={editedData.maintitle}
          updateProfile={(value) => updateProfile("maintitle", value)}
          loading={loading}
          setEdited={(value) =>
            setEditedData({ ...editedData, maintitle: value })
          }
          size="text-lg"
          maxLength={400}
        />
              </span>{" "}
              €/mois
            </div>
            <p>
              {" "}
              <MainTitle
                main={profile.desprix}
                edited={editedData.desprix}
                updateProfile={(value) => updateProfile("desprix", value)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData({ ...editedData, desprix: value })
                }
                size="text-lg"
                maxLength={2000}
              />
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-full">
              contacter le proprietairer
            </button>
          </div>
        </div>
      </div>
      <div className="pt-16 flex justify-center items-center">
        <Online online={profile.online} />
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
                    updateProfile(edited);
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

function Online({ online }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
      <div className="flex flex-col justify-center items-center border-2 w-fit p-4 border-black">
        <Button
          onPress={onOpen}
          isIconOnly
          size="sm"
          className="bg-gray-300 rounded-full p-4 border-2 text-sm border-black font-bold"
        >
          ?
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Modal Title
                </ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat
                    consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                    incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                    aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                    nisi consectetur esse laborum eiusmod pariatur proident Lorem
                    eiusmod et. Culpa deserunt nostrud ad veniam.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
  
        <div className=" px-4 py-2 flex w-fit justify-center items-center text-center font-bold text-xl ">
          <p className={online ? "text-green-500" : "text-red-500"}>
            {online ? "votre page est en ligne" : "votre page est hors ligne"}
          </p>
        </div>
      </div>
    );
  }
