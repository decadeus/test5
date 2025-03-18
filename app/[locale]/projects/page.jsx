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

  return (
    <>
      <Head>
        <title>{generateTitle()}</title>
        <meta name="description" content={`Découvrez nos projets à ${city || "votre ville"}.`} />
      </Head>

      <Main />
    </>
  );
}
