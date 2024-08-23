'use client'
import { createClient } from "@/utils/supabase/client"; // Ensure the correct path to your Supabase client
import Link from "next/link";
import Image from "next/legacy/image";
import b from "@/components/b.png";
import Connect from "./connect";
import { Tooltip } from "@nextui-org/react";
import Text from "@/app/navbar/text";
import ListNav from "@/app/navbar/navclient";
import { useEffect, useState } from "react";

export default function MainNavBar({ user }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
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
    <div className="w-full px-10  py-4 flex justify-between items-center bg-white  text-black  sticky top-0 z-50 opacity-90">
      <div className="flex justify-center items-center gap-2">
        <Link href="/">
          <div className="flex gap-2 items-center">
            <div className="flex justify-center items-center gap-2">
              <div className="w-8 h-8">
              <Image src={b} width={50} height={50} alt="Logo" />
              </div>
              <div>
              <h2 className="text-black text-2xl font-bold hidden sm:block ">Hoomge.com</h2>
            </div>
            </div>
          </div>
        </Link>
      </div>

      <ListNav userId={user?.id} />

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
          <div className="flex gap-4">
          <div className="flex gap-8 items-center">
            <Connect className="py-2" />
          </div>
          <div className="bg-gray-300 py-1 px-2 rounded-sm flex justify-center items-center"> <Link href="/addproject">Add your project</Link></div>
          </div>
        )}
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
