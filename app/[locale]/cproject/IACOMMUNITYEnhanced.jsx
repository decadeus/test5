import { useLanguage } from "@/app/LanguageContext";
import { useEffect, useState } from "react";

export default function IACOMMUNITYEnhanced({ projectData, formData, onResult, onClose }) {
  const { language } = useLanguage();
  const langLabel = { fr: "FR", en: "EN", pl: "PL", de: "DE", ru: "RU", uk: "UK" }[language] || (language ? language.toUpperCase() : "");
  const [langue, setLangue] = useState(language || "fr");
  useEffect(() => {
    setLangue(language || "fr");
  }, [language]);

  // ... rest of the component code ...
} 