"use client";

import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { Link } from "@/navigation";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useTranslations } from "next-intl";

const siteConfig = {
  navAdmin: [
    { label: "Residence", href: "/residences" },
    { label: "Users", href: "/utilisateurs" },
    { label: "Display", href: "/addpdf" },
  ],
  navProprio: [{ label: "Your Apartment", href: "/appartement" }],
  noUser: [
    {
      label: (
        <div className="flex justify-center items-center gap-2">
          <IoSearch
            color="white"
            className="text-2xl sm:text-sm md:text-base lg:text-xl xl:text-2xl"
          />
          <span className="text-white">Voir tous les projects</span>{" "}
          {/* Fallback language */}
        </div>
      ),
      href: "/projects",
    },
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
  const n = useTranslations("Nav");
  // Get language from context

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("pic_profil, username, rules")
          .eq("id", userId)
          .single();

        if (error) {
          setError(error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [userId, supabase]);

  if (error) {
    return null; // Handle errors gracefully
  }

  const renderNavItems = (items) =>
    items.map((item) => {
      const isActive = pathname === item.href;
      return (
        <li key={item.href} className="mr-16 last:mr-0 sm:text-xl text-md">
          <Link
            href={item.href}
            className={isActive ? "text-black" : "text-black"}
          >
            {item.label}
          </Link>
        </li>
      );
    });

  // Dynamically create nav items based on user profile rules
  let navItems;
  if (profile?.rules === "Admin") {
    navItems = siteConfig.navAdmin;
  } else if (profile?.rules === "Proprio") {
    navItems = siteConfig.navProprio;
  } else if (profile?.rules === "Cproject") {
    navItems = siteConfig.Cproject;
  } else {
    navItems = siteConfig.noUser.map((item) => ({
      ...item,
      label: (
        <div className="flex items-center gap-2">
          <div className="block lg:hidden">
            {/* Taille d'icône de 20 pour les petites tailles d'écran (non responsive) */}
            <IoSearch color="white" size={30} />
          </div>
          <div className="hidden lg:block">
            {/* Taille d'icône de 30 pour les écrans plus larges (responsive) */}
            <IoSearch color="white" size={20} />
          </div>
          <span className="text-white text-2xl lg:text-lg">
            {n("Rechercher")}
          </span>{" "}
          {/* Use the correct language */}
        </div>
      ),
    }));
  }

  return (
    <div className="flex text-center  items-center">
      <ul
        className={`flex ${profile?.rules === "Admin" ? "gap-8" : "gap-4"} ${
          profile?.rules === "Proprio" ? "hidden lg:flex justify-start" : ""
        }`}
      >
        {renderNavItems(navItems)}
      </ul>
    </div>
  );
}
