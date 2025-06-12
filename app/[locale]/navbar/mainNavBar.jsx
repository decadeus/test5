"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/legacy/image";
import H from "@/components/H.png";
import Connect from "./connect";
import Text from "./text";
import { FaNetworkWired } from "react-icons/fa";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MainNavBar({ user }) {
  const [profile, setProfile] = useState(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const n = useTranslations("Nav");

  // Gestion langue (dropdown drapeau)
  const match = pathname.match(/^\/(fr|en|pl|de|ru)(\/.*)?$/);
  const currentLocale = match ? match[1] : "fr";
  const currentPath = match && match[2] ? match[2] : "/";
  const locales = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "pl", label: "Polska", flag: "🇵🇱" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];
  const currentLang = locales.find(l => l.code === currentLocale);
  const otherLangs = locales.filter(l => l.code !== currentLocale);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Synchronise la langue courante avec le localStorage à chaque navigation
  useEffect(() => {
    if (typeof window !== "undefined" && currentLocale) {
      localStorage.setItem("selectedLanguage", currentLocale);
    }
  }, [currentLocale]);

  // Force re-render sur changement de pathname pour que le drapeau soit toujours à jour
  const [_, forceRerender] = useState(0);
  useEffect(() => {
    forceRerender(n => n + 1);
  }, [pathname]);

  // Liens principaux (adaptés à la navbar principale)
  const links = [
    { href: `/${currentLocale}/`, label: n("Accueil") },
    { href: `/${currentLocale}/projects`, label: "Projects" },
    { href: `/${currentLocale}/cproject`, label: n("VosProjets") },
    { href: `/${currentLocale}/addproject`, label: n("Ajouter") },
  ];

  // Je remets la fonction handleLocaleChange pour le dropdown langue
  const handleLocaleChange = (locale) => {
    setOpen(false);
    if (locale !== currentLocale) {
      setTimeout(() => {
        router.push(`/${locale}${currentPath}`);
      }, 50);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 px-2 py-2 flex gap-6 items-center rounded-full bg-white/40 backdrop-blur shadow-lg w-auto z-50 whitespace-nowrap flex-nowrap border-1 border-[#ffffff60] " style={{width: 'fit-content'}}>
      {/* Sélecteur de langue dropdown à gauche */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-3 py-1 rounded-full border font-semibold text-green-700 border-green-700 bg-white/70 hover:bg-green-700 hover:text-white transition select-none"
        >
          <span className="text-xl">{currentLang.flag}</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="absolute left-0 mt-2 w-32 bg-white rounded-xl shadow-lg border z-50 animate-fade-in">
            {otherLangs.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-green-100 rounded-xl text-green-700 text-base"
              >
                <span className="text-xl">{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Liens principaux */}
      {links.map(link => {
        // Normalisation pour ignorer le slash final
        const normalize = (str) => str.replace(/\/$/, "");
        const isActive = normalize(pathname) === normalize(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              `font-semibold px-4 py-2 rounded-full transition flex items-center gap-2 ` +
              (isActive
                ? "bg-green-700 text-white"
                : "text-green-700 hover:text-green-900")
            }
          >
            {link.label}
          </Link>
        );
      })}
      {/* Utilisateur/connexion à droite */}
      {user ? (
        <div className="flex items-center gap-3 ml-4">
          <Text user={user} />
        </div>
      ) : (
        <div className="flex items-center gap-3 ml-4">
          <Connect selectedLanguage={currentLocale} />
        </div>
      )}
    </nav>
  );
}
