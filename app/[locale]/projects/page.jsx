"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Head from "next/head";
import Main from "./main";

// 🔥 Initialise Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DynamicMetadata() {
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState("France");
  const [projectCount, setProjectCount] = useState(0); // 🔥 Nombre de projets

  useEffect(() => {
    const storedCity = localStorage.getItem("selectedCity");
    const storedCountry = localStorage.getItem("selectedCountry");

    if (storedCity) {
      setCity(storedCity);
    }
    if (storedCountry) {
      setCountry(storedCountry);
    }
  }, []);

  // 🔥 Fonction pour récupérer le nombre de projets depuis Supabase
  useEffect(() => {
    const fetchProjectCount = async () => {
      const supabase = createClient();
      if (city) {
        const { count, error } = await supabase
          .from("project")
          .select("*", { count: "exact", head: true })
          .eq("city", city);

        if (!error) {
          setProjectCount(count);
        } else {
          console.error("Erreur lors de la récupération des projets:", error);
        }
      }
    };

    fetchProjectCount();
  }, [city]);

  // 🔥 Génère dynamiquement le titre SEO
  const generateTitle = () => {
    if (!city) return "Chargement...";
    return country === "Polska"
      ? `${projectCount} projekty budownictwa mieszkaniowego w ${city}`
      : `${projectCount} projets d'immeuble résidentiel à ${city}`;
  };

  useEffect(() => {
    document.title = generateTitle();
  }, [city, country, projectCount]);

  return (
    <>
      <Head>
        <title>{generateTitle()}</title>
        <meta
          name="description"
          content={`Découvrez ${projectCount} projets d'immeuble résidentiel à ${city || "votre ville"}.`}
        />
      </Head>

      <Main />
    </>
  );
}
