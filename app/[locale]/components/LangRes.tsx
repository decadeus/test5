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
      <div ref={menuRef} className="relative">
        {/* Toggle Button */}
        <button
          aria-expanded={isOptionsExpanded}
          aria-controls="language-options"
          aria-label="Select language"
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          className="flex items-center gap-2  transition-all"
        >
       
          <div className="w-8 flex justify-center items-center text-center">
            <FiGlobe color="white" size={18} />
            </div>
            <div className="w-fit flex items-start text-center">{capitalize(currentLang)}</div>
          

          
        </button>

        {/* Dropdown Menu */}
        {isOptionsExpanded && (
          <div
            id="language-options"
            className="absolute right-0 left-1 top-full mt-2 ml-4 w-48 shadow-lg rounded-md z-50 border"
          >
            <div role="menu" aria-orientation="vertical">
              {options.map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}/${urlSegments.join("/")}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <button
                    lang={lang.code}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors 
                      ${
                        pathname.startsWith(`/${lang.code}`)
                          ? "brownbg text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-300"
                      }`}
                  >
                    {capitalize(lang.country)}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LangRes;
