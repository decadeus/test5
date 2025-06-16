"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { FaAndroid, FaApple } from "react-icons/fa";
import Loading from "./loading";
import SubscribeButton from "@/app/[locale]/components/SubscribeButton";

// Import des composants
import DownloadCircle from "@/app/[locale]/components/home/DownloadCircle";
import IntroSection from "@/app/[locale]/components/home/IntroSection";
import SEO from "@/app/[locale]/components/home/SEO";
import ProjetSection from "@/app/[locale]/components/home/ProjetSection";
import ManageSection from "@/app/[locale]/components/home/ManageSection";
import Magic from "@/app/[locale]/components/home/Magic";
import FAQ from "@/app/[locale]/components/home/FAQ";

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

  if (loading) return <Loading />;

  return (
    <>
      {/* Bloc fixe à gauche avec IOS, flèche et Android */}
      <div
        className="fixed left-0 top-1/2 z-50 flex flex-col items-center gap-6 hidden md:flex"
        style={{
          transform: "translateY(-50%)",
          paddingLeft: "8px",
        }}
      >
        <DownloadCircle
          icon={<FaAndroid size={32} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=random.android.app"
          color="#3DDC84"
          label="Android"
        />
        <DownloadCircle
          icon={<FaApple size={32} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/app/id1234567890"
          color="#222"
          label="iOS"
        />
      </div>

      {/* Version mobile des liens de téléchargement */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center gap-4 bg-white/90 backdrop-blur-sm py-4 md:hidden">
        <DownloadCircle
          icon={<FaAndroid size={24} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=random.android.app"
          color="#3DDC84"
          label="Android"
        />
        <DownloadCircle
          icon={<FaApple size={24} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/app/id1234567890"
          color="#222"
          label="iOS"
        />
      </div>

      <IntroSection
        t={t}
        uniqueCompanies={uniqueCompanies}
        uniqueIdeas={uniqueIdeas}
        totalApartments={totalApartments}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fetchProjectsA={fetchProjectsA}
        loading={loading}
        router={router}
        locale={locale}
      />
      <div className="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <style jsx>{`
          .letter {
            display: inline-block;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
        `}</style>
        <SEO subtitle={subtitle} paragraphe={paragraphe} />
        <div className="relative h-[2000px]">
          <ProjetSection subtitle={subtitle} paragraphe={paragraphe} />
          <div className="h-[2000px]"></div>
        </div>
        <ManageSection subtitle={subtitle} paragraphe={paragraphe} />
        <Magic />
        <FAQ subtitle={subtitle} paragraphe={paragraphe} />
        <SubscribeButton subtitle={subtitle} paragraphe={paragraphe} />
      </div>
    </>
  );
}
