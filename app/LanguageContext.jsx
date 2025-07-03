// LanguageContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState(initialLanguage || "fr");

  useEffect(() => {
    setLanguage(initialLanguage || "fr");
  }, [initialLanguage]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};