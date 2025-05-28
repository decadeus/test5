// app/[locale]/cproject/iaseo.jsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

export default function IASEO({ project, onClose }) {
  const t = useTranslations("Projet");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [formData, setFormData] = useState({
    types: "",
    atouts: "",
    style: "",
    publicCible: "",
  });

  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generateSEO", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          nomProjet: project?.name || "",
          ville: project?.city || "",
          langue: project?.langue || "fr",
        }),
      });

      const data = await response.json();
      setGeneratedText(data.text);
      setCharacterCount(data.text.length);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    onClose();
  };

  return (
    <div className="p-6">
    
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 bg-gray-50 p-4 rounded-lg">
          {/* Types d'appartements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("IADESCRIPTIONTYPE")}
            </label>
            <input
              type="text"
              name="types"
              value={formData.types}
              onChange={handleInputChange}
              placeholder={t("PLACEHOLDER_TYPES")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Points forts du projet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("IADESCRIPTIONATOUT")}
            </label>
            <input
              type="text"
              name="atouts"
              value={formData.atouts}
              onChange={handleInputChange}
              placeholder={t("PLACEHOLDER_ATOUTS")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Style architectural */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("IADESCRIPTIONSTYLE")}
            </label>
            <select
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">{t("SELECT_STYLE")}</option>
              <option value="moderne">{t("STYLE_MODERNE")}</option>
              <option value="contemporain">{t("STYLE_CONTEMPORAIN")}</option>
              <option value="classique">{t("STYLE_CLASSIQUE")}</option>
              <option value="écologique">{t("STYLE_ECOLOGIQUE")}</option>
              <option value="luxe">{t("STYLE_LUXE")}</option>
            </select>
          </div>

          {/* Public cible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("IADESCRIPTIONPUBLIC")}
            </label>
            <select
              name="publicCible"
              value={formData.publicCible}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">{t("SELECT_PUBLIC")}</option>
              <option value="familles">{t("PUBLIC_FAMILLES")}</option>
              <option value="jeunes actifs">{t("PUBLIC_JEUNES")}</option>
              <option value="investisseurs">{t("PUBLIC_INVESTISSEURS")}</option>
              <option value="seniors">{t("PUBLIC_SENIORS")}</option>
              <option value="étudiants">{t("PUBLIC_ETUDIANTS")}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t("GENERATION_EN_COURS")}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{t("GENERER_DESCRIPTION")}</span>
              </>
            )}
          </button>
        </div>

        {generatedText && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-3">
              <p className="text-gray-800 text-lg font-medium break-words">
                {generatedText}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {characterCount}/160 {t("CARACTERES")}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>{t("COPIER_ET_FERMER")}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
