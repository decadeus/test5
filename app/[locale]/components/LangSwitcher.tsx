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
  const options: Option[] = [
    { country: "English", code: "en" },
    { country: "Français", code: "fr" },
    { country: "Polska", code: "pl" },
    { country: "Deutsch", code: "de" },
    { country: "Русский", code: "ru" },
  ];

  const menuRef = useRef<HTMLDivElement>(null);

  // Gestion du clic en dehors du menu
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
      <div ref={menuRef}>
        <button
          className=""
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
        >
          <div className="flex lg:hidden gap-2 justify-center items-center">
            <FiGlobe color="white" size={26} />
            <p className="text-2xl">Language</p>
          </div>

          <div className="hidden lg:flex lg:gap-2 justify-center items-center ">
            <FiGlobe color="black" size={18} />
            <p className="text-sm">Language</p>
          </div>
        </button>
        {isOptionsExpanded && (
          <div className="absolute right-0 mt-2 w-full origin-top-right rounded-md shadow-lg z-50">
            <div
              className=""
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((lang) => {
                return (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}/${urlSegments.join("/")}`}
                  >
                    <button
                      lang={lang.code}
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm bg-white hover:bg-gray-300 ${
                        pathname === `/${lang.code}`
                          ? "bg-gray-500 text-black hover:bg-gray-300 hover:text-white"
                          : "bg-red-300 text-blue-800"
                      }`}
                    >
                      {capitalize(lang.country)}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LangSwitcher;
