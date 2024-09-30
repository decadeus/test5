// LanguageSelector.js
"use client";

import { useLanguage } from "./LanguageContext";

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => handleLanguageChange("fr")}
        className={`flex justify-between items-center  gap-2 px-4   border-2 rounded brownborder "
        }`}
      >
        <img
          src="/france-flag-round-circle-icon.svg"
          alt="Icon"
          width="20"
          height="20"
        />
      </button>
      <button
        onClick={() => handleLanguageChange("pl")}
        className={` flex justify-between items-center  gap-2 px-4   border-2 rounded brownborder
          /> `}
      >
        <img
          src="/monaco-flag-round-circle-icon.svg"
          alt="Icon"
          width="20"
          height="20"
        />
      </button>
      <button
        onClick={() => handleLanguageChange("en")}
        className={` flex justify-between items-center  gap-2 px-4   border-2 rounded brownborder
          /> `}
      >
        <img
          src="/united-kingdom.png"
          alt="Icon"
          width="20"
          height="20"
        />
      </button>
    </div>
  );
}
