"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/legacy/image";
import H from "@/components/H.png";
import Connect from "./connect";
import Text from "./text";
import { FaNetworkWired, FaSignOutAlt } from "react-icons/fa";
import { HiOutlinePlusCircle, HiMenu, HiX } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MainNavBar({ user }) {
  const [profile, setProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const n = useTranslations("Nav");
  const mobileMenuRef = useRef(null);

  // Gestion langue (dropdown drapeau)
  const match = pathname.match(/^\/(fr|en|pl|de|ru|uk)(\/.*)?$/);
  const currentLocale = match ? match[1] : "fr";
  const currentPath = match && match[2] ? match[2] : "/";
  const locales = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "pl", label: "Polska", flag: "🇵🇱" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "uk", label: "Українська", flag: "🇺🇦" },
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

  // Après la déclaration de const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (!error && data) setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  // Liens principaux (adaptés à la navbar principale)
  const links = [
    { href: `/${currentLocale}/`, label: n("Accueil") },
    { href: `/${currentLocale}/promoteur`, label: "Espace Promoteur" },
    ...(
      profile && (profile.role === "promoteur" || profile.role === "collaborateur")
        ? [{ href: `/${currentLocale}/cproject`, label: n("VosProjets") }]
        : []
    ),
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

  // Fermer le menu mobile si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log('USER PASSED TO NAVBAR:', user);

  return (
    <>
      {/* Version Mobile */}
      <div className="md:hidden">
        {/* Bouton menu mobile flottant */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-3 rounded-full bg-black text-white shadow-lg hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Menu mobile */}
        <div
          ref={mobileMenuRef}
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute right-0 top-0 w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col">
              {/* En-tête du menu mobile */}
              <div className="flex justify-end items-center p-4 border-b">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <HiX size={24} />
                </button>
              </div>

              {/* Contenu du menu mobile */}
              <div className="p-4">
                {/* Liens de navigation mobile */}
                <div className="space-y-2">
                  {links.map(link => {
                    const normalize = (str) => str.replace(/\/$/, "");
                    const isActive = normalize(pathname) === normalize(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-green-700 text-white"
                            : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Sélecteur de langue mobile (dropdown) */}
                <div className="mt-6 pt-6 border-t">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-800"
                    onClick={() => setOpen(o => !o)}
                  >
                    <span className="text-xl">{currentLang.flag}</span>
                    {currentLang.label}
                    <svg className={`ml-auto w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {open && (
                    <div className="mt-2 space-y-2 bg-white rounded-lg shadow border">
                      {otherLangs.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            handleLocaleChange(lang.code);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
                        >
                          <span className="text-xl">{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connexion/Utilisateur mobile */}
                <div className="mt-6 pt-6 border-t">
                  {user ? (
                    <Text user={user} />
                  ) : (
                    <Connect selectedLanguage={currentLocale} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Desktop */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 px-3 py-2 flex gap-6 items-center rounded-full bg-white/40 backdrop-blur shadow-lg w-auto z-50 whitespace-nowrap flex-nowrap border-1 border-[#ffffff60] hidden md:flex" style={{width: 'fit-content'}}>
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
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-700 text-green-700 font-semibold bg-white/70 hover:bg-green-700 hover:text-white transition text-base"
              >
                <FaSignOutAlt size={20} />
                Déconnexion
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3 ml-4">
            <Connect selectedLanguage={currentLocale} />
          </div>
        )}
      </nav>
    </>
  );
}
