"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import Loading from "../loading";
import SubscribeButton from "@/app/[locale]/components/SubscribeButton";
import { FaRocket, FaGlobe, FaChartBar, FaHandsHelping } from "react-icons/fa";
import Image from "next/image";

// Import des composants
import IntroSection from "@/app/[locale]/components/home/IntroSection";
import SEO from "@/app/[locale]/components/home/SEO";
import ProjetSection from "@/app/[locale]/components/home/ProjetSection";
import ManageSection from "@/app/[locale]/components/home/ManageSection";
import Magic from "@/app/[locale]/components/home/Magic";
import FAQ from "@/app/[locale]/components/home/FAQ";
import AutoTranslationInfo from "@/app/[locale]/components/AutoTranslationInfo";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [fetchProjectsA, setFetchProjectsA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Polska");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname ? pathname.split("/")[1] : "en";
  const t = useTranslations("Homepage");

  const subtitle = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold w-full lg:w-[620px] text-left leading-tight pb-8 sm:pb-12 md:pb-16 lg:pb-20";
  const paragraphe = "text-base sm:text-lg md:text-xl lg:text-2xl font-normal pb-4 sm:pb-6 md:pb-8";
  const MIN_LOADING_TIME = 1000;

  const fetchProjects = async () => {
    const startTime = Date.now();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("*, compagny, ide, projectlist(ide, id)")
      .eq("country", selectedCountry);
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(MIN_LOADING_TIME - elapsedTime, 0);
    setTimeout(() => {
      if (!error) setProjects(data);
      setLoading(false);
    }, remainingTime);
  };

  const fetchSearchProjects = async () => {
    setLoading(true);
    const supabase = createClient(
      "https://your-supabase-url",
      "your-supabase-key"
    );
    try {
      const { data, error } = await supabase
        .from("project")
        .select("id, name, city, country");
      if (!error) setFetchProjectsA(data || []);
    } catch (err) {
      console.error("Erreur inattendue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchProjects();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedCountry]);

  const totalApartments = projects.reduce((acc, project) => {
    if (Array.isArray(project.projectlist)) {
      return acc + project.projectlist.length;
    }
    return acc;
  }, 0);

  const uniqueCompanies = new Set(projects.map((project) => project.compagny));
  const uniqueIdeas = new Set(projects.map((project) => project.ide));

  // Header marketing
  const headerTitle = "Développez votre activité immobilière avec Hoomge";
  const headerSubtitle = "Touchez une audience internationale en bénéficiant de la traduction automatique";

  return (
    <>
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[400px] px-4 sm:px-8 flex flex-col items-center text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg_Promoteur.png"
            alt="Fond promoteur Hoomge"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-green-500/60 backdrop-blur-sm"></div>
        </div>
        <div className="absolute inset-0 bg-white/70 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full w-full">
          <div className="flex flex-col items-center gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-24 text-center justify-center h-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-6 max-w-7xl">{headerTitle}</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-900 mb-8 max-w-2xl">{headerSubtitle}</p>
            <button
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-lg transition"
              onClick={() => {
                const el = document.getElementById('abonnements');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Publier un projet
            </button>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style jsx>{`
          .letter {
            display: inline-block;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
        `}</style>
        <SEO subtitle={subtitle} paragraphe={paragraphe} />
        <AutoTranslationInfo />
        <div className="relative h-[2000px]">
          <ProjetSection subtitle={subtitle} paragraphe={paragraphe} />
          <div className="h-[2000px]"></div>
        </div>
        <ManageSection subtitle={subtitle} paragraphe={paragraphe} />
        <Magic />
        <FAQ subtitle={subtitle} paragraphe={paragraphe} />
        <div id="abonnements">
          <SubscribeButton subtitle={subtitle} paragraphe={paragraphe} />
        </div>
      </div>
    </>
  );
} 