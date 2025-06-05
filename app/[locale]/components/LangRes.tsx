"use client";

import { capitalize } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FiGlobe } from "react-icons/fi";

const LangRes: React.FC = () => {
  interface Option {
    country: string;
    code: string;
  }

  const pathname = usePathname();
  const urlSegments = useSelectedLayoutSegments();
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const options: Option[] = [
    { country: "English", code: "en" },
    { country: "Français", code: "fr" },
    { country: "Polska", code: "pl" },
    { country: "Deutsch", code: "de" },
    { country: "Русский", code: "ru" },
  ];

  useEffect(() => {
    // Charger la langue stockée au montage
    const storedLanguage = localStorage.getItem("selectedLanguage");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const handleLanguageChange = (code: string) => {
    localStorage.setItem("selectedLanguage", code);
    setSelectedLanguage(code);
  };

  // Trouver la langue actuelle en fonction de l'URL ou de `localStorage`
  const currentLang =
    options.find((option) => pathname.startsWith(`/${option.code}`))?.country ||
    options.find((option) => option.code === selectedLanguage)?.country ||
    "Select Language";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOptionsExpanded(false);
      }
    };

    if (isOptionsExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOptionsExpanded]);

  return (
    <div className="flex justify-center items-center">
      <Link href={`/${selectedLanguage || "fr"}/projects`} className="flex items-center gap-2 p-2 rounded-md transition-all bg-gray-200 hover:bg-gray-300">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
        <span className="text-sm font-medium">{typeof window !== 'undefined' ? (require('next-intl').useTranslations("Nav")("Rechercher")) : "Rechercher"}</span>
      </Link>
    </div>
  );
};

export default LangRes;
