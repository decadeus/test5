import { useLanguage } from "@/app/LanguageContext";
import { useEffect, useState } from "react";

export default function IASEOShort({ projectData, formData, onResult, onClose }) {
  const { language } = useLanguage();
  const langLabel = { fr: "FR", en: "EN", pl: "PL", de: "DE", ru: "RU" }[language] || (language ? language.toUpperCase() : "");
  const [langue, setLangue] = useState(language || "fr");

  useEffect(() => {
    setLangue(language || "fr");
  }, [language]);

  // ... rest of the component code ...

  return (
    <>
      <h2>SEO-Beschreibung generieren ({langLabel})</h2>
      <h3 className="text-xl font-bold text-gray-800">{t("IASEO")} ({language.toUpperCase()})</h3>
      {/* ... reste du composant ... */}
    </>
  );
} 