"use client";
import { createClient } from "@/utils/supabase/client";
import { Link } from "@/navigation";
import Image from "next/legacy/image";
import H from "@/components/H.png";
import Connect from "./connect";
import ConnectRes from "./connectRes";
import { Tooltip } from "@heroui/tooltip";
import Text from "./text";
import { FiPlusCircle } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { IoSearch } from "react-icons/io5";
import { FaNetworkWired } from "react-icons/fa";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import LangSwitcher from "../components/LangSwitcher";
import LangRes from "../components/LangRes";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function MainNavBar({ user }) {
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();
  const n = useTranslations("Nav");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url, username, rules")
          .eq("id", user.id)
          .single();
        if (!error) setProfile(data);
      }
    };
    fetchProfile();
  }, [user, supabase]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <Respon n={n} user={user} />
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Search & Language Switcher - Completely Left */}
        <div className="flex items-center gap-4 pl-4">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-black text-sm"
          >
            <IoSearch size={20} /> {n("Rechercher")}
          </Link>
          <LangSwitcher />
        </div>

        {/* Logo - Centered */}
        <Link
          href="/"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3"
        >
          <Image
            src={H}
            width={48}
            height={48}
            alt="Logo"
            className="rounded-full"
          />
          <h2 className="text-black text-lg font-bold hidden sm:block">
            Hoomge.com
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex gap-6 items-center">
          {user && (
            <Link
              href="/cproject"
              className="flex items-center gap-2 text-black text-sm"
            >
              <FaNetworkWired size={20} /> {n("VosProjets")}
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-black">{user.email}</p>
              <Text user={user} />
            </div>
          ) : (
            <Connect />
          )}
          <Link
            href="/addproject"
            className="flex items-center gap-2 bg-gray-500 text-white px-4 h-full py-2 text-sm"
          >
            <HiOutlinePlusCircle size={20} /> {n("Ajouter")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Respon({ n, user }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="flex md:hidden ">
      <Button className=" text-black" variant="light" onPress={onOpen}>
        <FiMenu size={24} />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        color="primary"
      >
        <DrawerContent className="bg-gray-900 text-white">
          {(onClose) => (
            <>
              <DrawerBody color="primary">
                <div className="flex flex-col gap-4 pl-4 items-start text-sm mt-8">
                  <Link href="/projects" className="flex gap-2">
                    <div className="w-8 flex justify-center items-center text-center">
                      <IoSearch size={18} />
                    </div>
                    <div className="w-fit flex items-start text-center">
                      {n("Rechercher")}
                    </div>
                  </Link>
                  
                  {user && (
                    <Link href="/cproject" className="">
                      <FaNetworkWired size={20} /> {n("VosProjets")}
                    </Link>
                  )}
                  {user ? (
                    <div className="">
                      <p className="">{user.email}</p>
                      <Text user={user} />
                    </div>
                  ) : (
                    <ConnectRes />
                  )}
                  <Link href="/addproject" className="flex gap-2">
                    <div className="w-8 flex justify-center items-center text-center">
                      <HiOutlinePlusCircle size={20} />
                    </div>
                    <div className="w-fit flex items-start text-center">
                      {n("Ajouter")}
                    </div>
                  </Link>
                  <LangRes />
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Logo - Centered */}
      <Link
        href="/"
        className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3"
      >
        <Image
          src={H}
          width={48}
          height={48}
          alt="Logo"
          className="rounded-full"
        />
        <h2 className="text-black text-lg font-bold">Hoomge.com</h2>
      </Link>
    </div>
  );
}
