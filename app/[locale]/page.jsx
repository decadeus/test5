"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import Loading from "./loading";
import BouncingShapesSection from "@/app/[locale]/components/landingPage/BouncingBackground";
import SubscribeButton from "@/app/[locale]/components/landingPage/SubscribeButton";
import Promoteur from "@/app/[locale]/components/landingPage/promoteurIcone";
import IntroSection from "@/app/[locale]/components/landingPage/IntroSection";
import ScrollProjectList from "@/app/[locale]/components/landingPage/ScrollProjectList";
import ScrollingText from "@/app/[locale]/components/landingPage/ScrollingText";
import Interet from "@/app/[locale]/components/landingPage/Interet";

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

  const MIN_LOADING_TIME = 1000;

  useEffect(() => {
    const fetchSearchProjects = async () => {
      setLoading(true);
      const supabase = createClient("https://your-supabase-url", "your-supabase-key");
      const { data, error } = await supabase.from("project").select("id, name, city, country");
      if (!error) setFetchProjectsA(data || []);
      setLoading(false);
    };
    fetchSearchProjects();
  }, []);

  useEffect(() => {
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
    fetchProjects();
  }, [selectedCountry]);

  const totalApartments = projects.reduce((acc, p) => acc + (p.projectlist?.length || 0), 0);
  const uniqueCompanies = new Set(projects.map(p => p.compagny));
  const uniqueIdeas = new Set(projects.map(p => p.ide));

  if (loading) return <Loading />;

  return (
    <>
      <IntroSection
        t={t}
        uniqueCompanies={uniqueCompanies}
        uniqueIdeas={uniqueIdeas}
        totalApartments={totalApartments}
        searchTerm={searchTerm}
        loading={loading}
        fetchProjectsA={fetchProjectsA}
        setSearchTerm={setSearchTerm}
        locale={locale}
        router={router}
      />

      <div className="w-full flex flex-col mb-10 sm:mb-14 md:mb-20 lg:mb-28 xl:mb-32 px-4 sm:px-6 md:px-10 xl:px-16">
        <ScrollProjectList
          projects={projects}
          t={t}
          uniqueCompanies={uniqueCompanies}
          uniqueIdeas={uniqueIdeas}
          totalApartments={totalApartments}
        />
      </div>

      <Interet />
      <Promoteur />
      <ScrollingText />

      <BouncingShapesSection />
      <div className="gflex justify-center items-center px-4 py-12 w-full bg-gray-700">
        <SubscribeButton />
      </div>
    </>
  );
}
