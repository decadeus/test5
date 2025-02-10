"use client";

import { capitalize } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FiGlobe } from "react-icons/fi";

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string;
    code: string;
  }

  const pathname = usePathname();
  const urlSegments = useSelectedLayoutSegments();
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const options: Option[] = [
    { country: "English", code: "en" },
    { country: "Français", code: "fr" },
    { country: "Polska", code: "pl" },
    { country: "Deutsch", code: "de" },
    { country: "Русский", code: "ru" },
  ];

  // Find the current language, fallback to "Select Language"
  const currentLang =
    options.find((option) => pathname.startsWith(`/${option.code}`))?.country ||
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
          className="flex items-center gap-2 p-2 rounded-md transition-all"
        >
          {/* Mobile View */}
          <div className="flex lg:hidden gap-2 items-center">
            <FiGlobe color="white" size={26} />
            <p className="text-2xl">{capitalize(currentLang)}</p>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex gap-2 items-center">
            <FiGlobe color="black" size={18} />
            <p className="text-sm">{capitalize(currentLang)}</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOptionsExpanded && (
          <div
            id="language-options"
            className="absolute right-0 left-1 top-full mt-2 ml-4 w-48  shadow-lg rounded-md z-50 border"
          >
            <div role="menu" aria-orientation="vertical">
              {options.map((lang) => (
                <Link key={lang.code} href={`/${lang.code}/${urlSegments.join("/")}`}>
                  <button
                    lang={lang.code}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`block w-full px-4 py-2 text-left text-sm rounded-md transition-colors 
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

export default LangSwitcher;
