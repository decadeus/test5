"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function IACOMMUNITY({ project, onClose }) {
  const t = useTranslations("Projet");
  const [formData, setFormData] = useState({
    equipementsInterieurs: "",
    equipementsExterieurs: "",
    services: "",
    securite: ""
  });
  const [resultat, setResultat] = useState("");
  const [chargement, setChargement] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    setChargement(true);

    const response = await fetch("/api/generateCommunity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...formData,
        langue: project?.langue || "fr" 
      }),
    });

    const data = await response.json();
    setResultat(data.text);
    setChargement(false);
  };

  const handleCopy = async () => {
    if (resultat) {
      try {
        await navigator.clipboard.writeText(resultat);
        onClose();
      } catch (err) {
        console.error("Erreur de copie :", err);
      }
    }
  };

  return (
    <div className="p-6">

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
          {/* Équipements intérieurs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("EQUIPEMENTS_INTERIEURS")}
            </label>
            <input
              type="text"
              name="equipementsInterieurs"
              value={formData.equipementsInterieurs}
              onChange={handleInputChange}
              placeholder={t("PLACEHOLDER_EQUIPEMENTS_INTERIEURS")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Équipements extérieurs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("EQUIPEMENTS_EXTERIEURS")}
            </label>
            <input
              type="text"
              name="equipementsExterieurs"
              value={formData.equipementsExterieurs}
              onChange={handleInputChange}
              placeholder={t("PLACEHOLDER_EQUIPEMENTS_EXTERIEURS")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Services à proximité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("SERVICES_PROXIMITE")}
            </label>
            <input
              type="text"
              name="services"
              value={formData.services}
              onChange={handleInputChange}
              placeholder={t("PLACEHOLDER_SERVICES")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Sécurité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("SECURITE")}
            </label>
            <input
              type="text"
              name="securite"
              value={formData.securite}
              onChange={handleInputChange}
              placeholder={t("PLACEHOLDER_SECURITE")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
            disabled={chargement}
          >
            {chargement ? (
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

        {resultat && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-3">
              <p className="text-gray-800 text-lg font-medium break-words">
                {resultat}
              </p>
            </div>
            <div className="flex justify-end">
              <button
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
      </div>
    </div>
  );
}
