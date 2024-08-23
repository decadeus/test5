"use client";

import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const siteConfig = {
  navAdmin: [
    { label: "Residence", href: "/residences" },
    { label: "Users", href: "/utilisateurs" },
    { label: "Display", href: "/addpdf" },
  ],
  navProprio: [
    { label: "Your Apartment", href: "/appartement" },
  ],
  noUser: [
    // { label: "Home", href: "/" },
    // { label: "Completed Residential Building", href: "/completed" },
    { label: "Search", href: "/projects" },

  ],
  Cproject: [
    { label: "Home", href: "/" },
    { label: "project", href: "/cproject" },
 
  ],
};

export default function ListNav({ userId }) {
  const supabase = createClient();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("pic_profil, username, rules")
          .eq("id", userId)
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
  }, [userId, supabase]);

  if (error) {
    return null;
  }

  const renderNavItems = (items) =>
    items.map((item) => {
        const isActive = pathname === item.href;
      return (
     
        <li key={item.href} className="mr-16 last:mr-0 sm:text-xl text-md">
          <Link href={item.href} className={isActive ? " text-black " : "text-black"}>
            {item.label}
          </Link>
        </li>
       
      );
    });

  let navItems;
  if (profile?.rules === "Admin") {
    navItems = siteConfig.navAdmin;
  } else if (profile?.rules === "Proprio") {
    navItems = siteConfig.navProprio;
  } else if (profile?.rules === "Cproject") {
    navItems = siteConfig.Cproject;
  } else {
    navItems = siteConfig.noUser;
  }

  return (
    <div className="flex text-center justify-center items-center">
      <ul className={`flex gap-${profile?.rules === "Admin" ? '8' : '4'} ${profile?.rules === "Proprio" ? 'hidden lg:flex justify-start' : ''}`}>
        {renderNavItems(navItems)}
      </ul>
    </div>
  );
}
