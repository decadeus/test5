"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  RadioGroup,
  Radio,
  Input,
} from "@nextui-org/react";
import Avatar from "@/app/getimage/getone";

import { MdBalcony, MdOutlinePool, MdFitnessCenter } from "react-icons/md";
import {
  FaElevator,
  FaDog,
  FaSchoolCircleCheck,
  FaBasketShopping,
  FaBaby,
  FaGasPump,
  FaPlaneDeparture,
  FaGraduationCap,
  FaKey,
  FaMasksTheater,
  FaWheelchairMove,
} from "react-icons/fa";
import { GiParkBench } from "react-icons/gi";
import { IoMdBicycle } from "react-icons/io";
import GoogleMaps from "@/app/[residence]/googlemap";
import Adresse from "@/app/[residence]/adresse";

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

  console.log("Profile Data:", profile); // Check the profile data in the console

  return (
    <div className="w-full lg:px-20 md:px-10 sm:px-5 text-black">
      <div className="flex flex-col justify-center items-center w-full pb-4">
        <h1 className="text-4xl font-bold">
          <MainTitle
            main={profile.mainTitle}
            edited={editedData.mainTitle}
            updateProfile={() =>
              updateProfile("mainTitle", editedData.mainTitle)
            }
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
      <div>
        <div className="grid grid-cols-3 grid-rows-1 gap-4 pt-16 ">
          <div className="bg-gray-300 border-2 p-4">
            <p className="text-xl font-bold text-center">
              <IconeS
                main={profile.aut1}
                edited={editedData.aut1}
                updateProfile={() => updateProfile("aut1", editedData.aut1)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData((prevData) => ({ ...prevData, aut1: value }))
                }
                size={30}
                maxLength={400}
              />
            </p>
            <p className="text-xl font-bold pb-4">
              <MainTitle
                main={profile.taut1}
                edited={editedData.taut1}
                updateProfile={() => updateProfile("d2", editedData.taut1)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData({ ...editedData, taut1: value })
                }
                size="text-lg"
                maxLength={400}
              />
            </p>
            <MainTitle
              main={profile.daut1}
              edited={editedData.daut1}
              updateProfile={() => updateProfile("d1", editedData.daut1)}
              loading={loading}
              setEdited={(value) =>
                setEditedData({ ...editedData, daut1: value })
              }
              size="text-lg"
              maxLength={400}
            />
          </div>
          <div className="bg-gray-300 border-2 p-4">
            <p className="text-xl font-bold text-center">
              <IconeS
                main={profile.aut2}
                edited={editedData.aut2}
                updateProfile={() => updateProfile("aut2", editedData.aut2)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData((prevData) => ({ ...prevData, aut2: value }))
                }
                size={30}
                maxLength={400}
              />
            </p>
            <p className="text-xl font-bold pb-4">
              <MainTitle
                main={profile.taut2}
                edited={editedData.taut2}
                updateProfile={() => updateProfile("d2", editedData.taut2)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData({ ...editedData, taut2: value })
                }
                size="text-lg"
                maxLength={400}
              />
            </p>
            <MainTitle
              main={profile.daut2}
              edited={editedData.daut2}
              updateProfile={() => updateProfile("d2", editedData.daut2)}
              loading={loading}
              setEdited={(value) =>
                setEditedData({ ...editedData, daut2: value })
              }
              size="text-lg"
              maxLength={400}
            />
          </div>
          <div className="bg-gray-300 border-2 p-4">
            <p className="text-xl font-bold text-center">
              <IconeS
                main={profile.aut3}
                edited={editedData.aut3}
                updateProfile={() => updateProfile("aut3", editedData.aut3)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData((prevData) => ({ ...prevData, aut3: value }))
                }
                size={30}
                maxLength={400}
              />
            </p>
            <p className="text-xl font-bold pb-4">
              <MainTitle
                main={profile.taut3}
                edited={editedData.taut3}
                updateProfile={() => updateProfile("d3", editedData.taut3)}
                loading={loading}
                setEdited={(value) =>
                  setEditedData({ ...editedData, taut3: value })
                }
                size="text-lg"
                maxLength={400}
              />
            </p>
            <MainTitle
              main={profile.daut3}
              edited={editedData.daut3}
              updateProfile={() => updateProfile("d2", editedData.daut3)}
              loading={loading}
              setEdited={(value) =>
                setEditedData({ ...editedData, daut3: value })
              }
              size="text-lg"
              maxLength={400}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex pt-16">
        <div className="w-1/2 bg-red-300">
          <GoogleMaps
            lnga={profile.lng}
            lata={profile.lat}
            height="h-[300px]"
          />
        </div>
        <div className="w-1/2 flex justify-center items-center text-center">
          <FullAdress
            mainres={profile.mainTitle}
            main={profile.adresse1}
            main2={profile.adresse2}
            main3={profile.codepost}
            main4={profile.city}
            resedited={editedData.mainTitle}
            edited={editedData.adresse1}
            edited2={editedData.adresse2}
            Cp={editedData.codepost}
            City={editedData.city}
            lng={editedData.lng}
            lat={editedData.lat}
            updateProfile={() => updateProfile("t2", editedData.t2)}
            loading={loading}
            setResedited={(value) =>
              setEditedData({ ...editedData, mainTitle: value })
            }
            setEdited={(value) =>
              setEditedData({ ...editedData, adresse1: value })
            }
            setEdited2={(value) =>
              setEditedData({ ...editedData, adresse2: value })
            }
            setLng={(value) => setEditedData({ ...editedData, lng: value })}
            setLat={(value) => setEditedData({ ...editedData, lat: value })}
            setCp={(value) => setEditedData({ ...editedData, codepost: value })}
            setCity={(value) => setEditedData({ ...editedData, city: value })}
            size="text-lg"
            maxLength={400}
          />
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

function FullAdress({
  mainres,
  main,
  main2,
  main3,
  main4,
  resedited,
  edited,
  edited2,
  lng,
  lat,
  Cp,
  setCp,
  City,
  setCity,
  updateProfile,
  loading,
  setResedited,
  setEdited,
  setEdited2,
  setLng,
  setLat,
  size,
  maxLength,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button className="text-start" variant="light" onClick={onOpen}>
        <div className="text-xl font-normal border p-8">
          <p className="font-bold text-2xl">{mainres}</p>
          <p>{main}</p>
          <p>{main2}</p>
          <div>
            <div className="flex gap-2"><p>{main3}</p><p>{main4}</p></div>
           
          </div>
        </div>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-col gap-8 p-8 text-wrap font-thin">
                  <Input
                    label="Nom de la résidence"
                    placeholder=""
                    labelPlacement="outside"
                    className="font-bold"
                    id="residencename"
                    type="text"
                    value={resedited || ""}
                    onChange={(e) => setResedited(e.target.value)}
                  />
                  <Input
                    label="Adresse"
                    placeholder="Ligne 1"
                    labelPlacement="outside"
                    className="font-bold"
                    id="maintitle"
                    type="text"
                    value={edited || ""}
                    onChange={(e) => setEdited(e.target.value)}
                  />
                  <div className="">
                    <Input
                      label="Adresse"
                      placeholder="Ligne 2"
                      labelPlacement="outside"
                      className="font-bold"
                      id="maintitle2"
                      type="text"
                      value={edited2 || ""}
                      onChange={(e) => setEdited2(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 w-full">
                    <Input
                      label="Longitude"
                      placeholder="ex: 75 000"
                      labelPlacement="outside"
                      className="font-bold"
                      id="lng"
                      type="text"
                      value={Cp || ""}
                      onChange={(e) => setCp(e.target.value)}
                    />
                    <Input
                      label="Latitude"
                      placeholder="ex: Paris"
                      labelPlacement="outside"
                      className="font-bold"
                      id="lat"
                      type="text"
                      value={City || ""}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 w-full">
                    <Input
                      label="Longitude"
                      placeholder="ex: -22.289868787205"
                      labelPlacement="outside"
                      className="font-bold"
                      id="lng"
                      type="text"
                      value={lng || ""}
                      onChange={(e) => setLng(e.target.value)}
                    />
                    <Input
                      label="Latitude"
                      placeholder="ex: 30.909058057456"
                      labelPlacement="outside"
                      className="font-bold"
                      id="lat"
                      type="text"
                      value={lat || ""}
                      onChange={(e) => setLat(e.target.value)}
                    />
                  </div>
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

function IconeS({
  main,
  edited,
  updateProfile,
  loading,
  setEdited,
  size,
  maxLength,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const iconComponents = [
    { value: 1, icon: <MdBalcony size={size} /> },
    { value: 2, icon: <FaDog size={size} /> },
    { value: 3, icon: <FaBaby size={size} /> },
    { value: 4, icon: <FaGasPump size={size} /> },
    { value: 5, icon: <FaPlaneDeparture size={size} /> },
    { value: 6, icon: <FaGraduationCap size={size} /> },
    { value: 7, icon: <FaKey size={size} /> },
  ];

  const getIconByValue = (value) => {
    const iconComponent = iconComponents.find(
      (component) => component.value === value
    );
    return iconComponent ? iconComponent.icon : null;
  };

  return (
    <div className="">
      <button
        aria-label="open icon selection"
        className="text-start"
        onClick={onOpen}
      >
        {" "}
        {getIconByValue(main)}
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex justify-center items-center p-8">
                  <RadioGroup
                    value={edited}
                    onValueChange={setEdited}
                    orientation="horizontal"
                  >
                    {iconComponents.map((component) => (
                      <Radio key={component.value} value={component.value}>
                        <p className="pr-8">{component.icon}</p>
                      </Radio>
                    ))}
                  </RadioGroup>
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
    </div>
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
