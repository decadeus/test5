"use client";
import { createClient } from "@/utils/supabase/client";
import { Link } from "@/navigation";
import Image from "next/legacy/image";
import b from "@/components/b.png";
import Connect from "./connect";
import { Tooltip } from "@nextui-org/react";
import Text from "./text";
import ListNav from "./navclient";
import { useEffect, useState } from "react";
import LangSwitcher from "../components/LangSwitcher";
import { FiPlusCircle } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { IoSearch } from "react-icons/io5";
import { FaNetworkWired } from "react-icons/fa";
import { HiOutlinePlusCircle } from "react-icons/hi";

export default function MainNavBar({ user }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
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

        if (error) {
          console.error("Error fetching profile:", error);
          setError(error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user, supabase]);

  // Function to close the menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="relative ">
      <div className="flex justify-between items-center bg-gray-100/50 text-white px-4 py-1  w-full fixed top-0 left-0 z-50 shadow-md">
        <div className="flex justify-start items-center gap-2">
          <Link href="/">
            <div className="flex gap-2 items-center" onClick={closeMenu}>
              <div className="flex justify-center items-center gap-2">
                <div className="w-8 h-8 rounded-full">
                  <Image
                    src={b}
                    width={40}
                    height={40}
                    alt="Logo"
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-black text-sm font-bold hidden sm:block">
                    Hoomge.com
                  </h2>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Burger Menu Button */}
        <button
          className="block xl:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Main navigation for large screens */}
        <div className="hidden xl:flex gap-12 items-center">
          <div className="py-1 px-4  rounded-lg text-black transition-colors duration-300">
            <Link href="/projects" onClick={closeMenu}>
              <span className="text-sm flex items-center gap-2">
                <IoSearch size={20} />
                {n("Rechercher")}
              </span>
            </Link>
          </div>

          {!user && (
            <div className="py-1 px-4  rounded-lg text-black transition-colors duration-300 flex justify-center items-center gap-12">
              <div className="flex gap-2 justify-center items-center">
                <HiOutlinePlusCircle size={20} />

                <Link href="/addproject" onClick={closeMenu}>
                  <span className="text-sm">{n("Ajouter")}</span>
                </Link>
              </div>

             
            </div>
          )}

          {/* Grouping the /cproject link and LangSwitcher */}
          {user && (
            <div className="flex items-center gap-8">
              <div className="flex items-center text-black">
                <Link href="/cproject" onClick={closeMenu}>
                  <span className="flex items-center gap-2 text-lg">
                    <FaNetworkWired size={22} color="black" /> {n("VosProjets")}
                  </span>
                </Link>
              </div>
              <LangSwitcher />
            </div>
          )}
        </div>

        {/* User/Connect Section */}
        <div className="hidden xl:flex items-center gap-4">
          {user ? (
            <div className="flex gap-2 items-center">
              <div className="flex flex-col text-center">
                <p>{user.email}</p>
              </div>
              <div className="w-[50px] h-[50px]">
                <Text user={user} />
              </div>
            </div>
          ) : (
            <div className="flex gap-4 w-fit">
              <Connect className="py-2" />
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-8 left-0 w-full h-full bg-black bg-opacity-90 text-white flex flex-col justify-center space-y-10 transition-transform duration-300 ease-in-out lg:hidden z-50 pl-10`}
      >
        <div className="flex items-center text-white">
          <Link href="/" onClick={closeMenu}>
            <span className="flex items-center gap-2 text-2xl">
              <FaRegBuilding size={26} /> {n("Accueil")}
            </span>
          </Link>
        </div>
        <div className="flex items-center text-white">
          <Link href="/projects" onClick={closeMenu}>
            <span className="flex items-center gap-2 text-2xl">
              <IoSearch size={26} /> {n("Rechercher")}
            </span>
          </Link>
        </div>
        <div className="flex items-center ">
          <LangSwitcher />
        </div>

        {/* Conditionally display the add project link only if the user is not connected */}
        {!user && (
          <div className="flex items-center text-white">
            <Link href="/addproject" onClick={closeMenu}>
              <span className="flex items-center gap-2 text-2xl">
                <FiPlusCircle size={26} /> {n("Ajouter")}
              </span>
            </Link>
          </div>
        )}

        {/* Display the /cproject link only if the user is connected */}
        {user && (
          <div className="flex items-center text-white">
            <Link href="/cproject" onClick={closeMenu}>
              <span className="flex items-center gap-2 text-2xl">
                <IoSearch size={26} /> {n("VosProjets")}
              </span>
            </Link>
          </div>
        )}

        <div className="flex items-center ">
          <LangSwitcher />
        </div>

        {user ? (
          <div className="text-center space-y-4">
            <p className="font-bold text-lg">{profile?.username}</p>
            <p>{user.email}</p>
            <div className="w-[50px] h-[50px] mx-auto">
              <Text user={user} />
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Connect />
            <p className="text-white text-2xl">{n("Connexion")}</p>
          </div>
        )}

        {/* Close Menu Button */}
        <button
          className="absolute top-6 right-6 text-white"
          onClick={closeMenu}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function HelpAdmin() {
  return (
    <div className="pr-8">
      <Link href="/aide">
        <Tooltip content="Aide" className="bg-black text-white">
          <p className="text-center flex justify-center items-center font-bold rounded-full border text-white bg-green-500 w-8 h-8">
            ?
          </p>
        </Tooltip>
      </Link>
    </div>
  );
}
