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
import LangSwitcher from '../components/LangSwitcher'



export default function MainNavBar({ user }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const supabase = createClient();
    // Get language and setter from context

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

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem("selectedLanguage", lang); // Store selected language in localStorage
    };

    return (
        <div className="flex justify-between items-center brownbg text-white z-50 opacity-90 px-4 py-4 xl:px-16 w-full">
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
                                <h2 className="text-white text-2xl font-bold hidden sm:block ">
                                    Hoomge.com
                                </h2>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
<div className="z-50">
            <LangSwitcher />
            </div>

            <div>
                <ListNav userId={user?.id} />
            </div>

            <div className="flex justify-end">
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
                        <div className="py-1 xl:px-2 rounded-sm flex justify-center items-center w-fit">
                            <Link href="/addproject">
                                <span className="hidden sm:inline">Ajouter un projet</span>
                            </Link>
                        </div>

                        <div className="flex gap-8 items-center">
                            <Connect className="py-2" />
                        </div>
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
