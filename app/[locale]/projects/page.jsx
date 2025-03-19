"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Main from "./main";

export default function DynamicMetadata() {
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState("France"); // Pays par défaut

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    const storedCountry = localStorage.getItem("selectedCountry"); // Récupère le pays

    if (storedCity) {
      setCity(storedCity);
    }
    if (storedCountry) {
      setCountry(storedCountry);
    }
  }, []);

  // 🔥 Définition dynamique du titre selon le pays
  const generateTitle = () => {
    if (!city) return "Chargement...";
    return country === "Polska"
      ? `Projekty budownictwa mieszkaniowego w ${city}`
      : `Projets d'immeuble résidentiel à ${city}`;
  };

  useEffect(() => {
    document.title = generateTitle();
  }, [city, country]); // Met à jour le titre si `city` ou `country` change

  const generateDescription = () => {
    if (!city) return "Découvrez nos projets immobiliers.";
    return country === "Polska"
      ? `Odkryj nasze projekty budownictwa mieszkaniowego w ${city}.`
      : `Découvrez nos projets d'immeuble résidentiel à ${city}.`;
  };

  useEffect(() => {
    if (city) {
      document.title = generateTitle();

      // 🔥 Met à jour la meta description dynamiquement
      let metaDescription = document.querySelector('meta[name="description"]');

      if (metaDescription) {
        metaDescription.setAttribute("content", generateDescription());
      } else {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        metaDescription.content = generateDescription();
        document.head.appendChild(metaDescription);
      }
    }
  }, [city, country]);

  return (
    <>
      <Head>
        <title>{generateTitle()}</title>
        <meta name="description" content={generateDescription()} />
      </Head>

      <Main />
    </>
  );
}
