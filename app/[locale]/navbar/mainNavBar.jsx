"use client";
import { createClient } from "@/utils/supabase/client"; // Ensure the correct path to your Supabase client
import { Link } from "@/navigation";
import Image from "next/legacy/image";
import b from "@/components/b.png";
import Connect from "./connect";
import { Tooltip } from "@nextui-org/react";
import Text from "./text";
import ListNav from "./navclient";
import { useEffect, useState } from "react";
import LangSwitcher from "../components/LangSwitcher";

export default function MainNavBar({ user }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for burger menu
  const supabase = createClient();

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

  return (
    <div className="relative z-50">
      <div className="flex justify-between items-center brownbg text-white px-4 py-4 xl:px-16 w-full fixed top-0 left-0 z-50 shadow-md">
        <div className="flex justify-start items-center gap-2">
          <Link href="/">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center gap-2">
                <div className="w-8 h-8 rounded-full">
                  <Image
                    src={b}
                    width={50}
                    height={50}
                    alt="Logo"
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-white text-2xl font-bold hidden sm:block">
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
            className="w-8 h-8 text-white"
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
          <ListNav userId={user?.id} />
          <div className="py-1 px-4 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors duration-300">
            <Link href="/addproject">
              <span className="text-sm sm:text-sm md:text-base lg:text-xl xl:text-xl">
                Ajouter un projet
              </span>
            </Link>
          </div>
          <LangSwitcher />
        </div>

        {/* User/Connect Section */}
        <div className="hidden xl:flex items-center gap-4">
          {user ? (
            <div className="flex gap-2 items-center">
              <HelpAdmin />
              <div className="flex flex-col text-center">
                <p className="font-bold">{profile?.username}</p>
                <p>{user.email}</p>
              </div>
              <div className="w-[50px] h-[50px]">
                <Text user={user} />
              </div>
            </div>
          ) : (
            <div className="flex gap-4 w-fit">
              <LangSwitcher />
              <Connect className="py-2" />
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 text-white flex flex-col items-center justify-center space-y-6 transition-transform duration-300 ease-in-out xl:hidden z-40`}
      >
        <ListNav userId={user?.id} />
        <div className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg text-white">
          <Link href="/addproject">
            <span className="text-lg">Ajouter un projet</span>
          </Link>
        </div>
        <LangSwitcher />

        {user ? (
          <div className="text-center space-y-4">
            <p className="font-bold text-lg">{profile?.username}</p>
            <p>{user.email}</p>
            <div className="w-[50px] h-[50px] mx-auto">
              <Text user={user} />
            </div>
          </div>
        ) : (
          <Connect className="py-2 text-lg" />
        )}

        {/* Close Menu Button */}
        <button
          className="absolute top-6 right-6 text-white"
          onClick={() => setMenuOpen(false)}
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
