import { createClient } from "@/utils/supabase/client"; // Ensure the correct path to your Supabase client
import Link from "next/link";
import Image from "next/image";
import b from "@/components/b.png";
import Connect from "./connect";
import Avatar from "../getimage/getone_u";
import { Tooltip, Button } from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,  useDisclosure} from "@nextui-org/react";
import Text from "@/app/navbar/text"



export default async function MainNavBar({ user }) {
  const supabase = createClient();

  const profile = user ? await fetchUserProfile(supabase, user.id) : null;

  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user?.id)
    .single();

  return (
    <div className="w-full px-10 py-4 flex justify-between items-center border-b mb-8 text-black">
      <div className="w-12 h-12">
        <Link href="/">
          <Image src={b} width={50} height={50} alt="Logo" />
        </Link>
      </div>
      <div className="flex text-center justify-center items-center">
        {profile?.rules === "Admin" ? (
          <ul className="flex gap-8 ">
            {siteConfig.navAdmin.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        ) : profile?.rules === "Proprio" ? (
          <ul className="hidden lg:flex gap-4 justify-start">
            {siteConfig.navProprio.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div></div>
        )}
      </div>
      <div>
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
          <div className="flex gap-8 items-center">
            <div>
              <p>Mettre sa résidence sur Hoomge</p>
            </div>
            <Connect className="py-2" />
          </div>
        )}
      </div>
    </div>
  );
}

// Function to fetch user profile data
async function fetchUserProfile(supabase, userId) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("pic_profil, website, username, rules") // Adjust the fields as necessary
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile;
}

const siteConfig = {
  navAdmin: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Residence",
      href: "/residences",
    },
    {
      label: "Utilisateurs",
      href: "/utilisateurs",
    },
    {
      label: "Actu residence",
      href: "/",
    },
    {
      label: "Sondage",
      href: "/",
    },
    {
      label: "News",
      href: "/",
    },
  ],
  navProprio: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
  ],
};

function HelpAdmin() {
  return (
    <div className="pr-8">
      <Tooltip content="Aide" className="bg-black text-white">
        <h1 className=" text-center flex justify-center items-center font-bold rounded-full border text-white bg-green-500 w-8 h-8">
          ?
        </h1>
      </Tooltip>
    </div>
  );
}

