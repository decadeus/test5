"use client";

import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { IoSearch } from "react-icons/io5";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Loading from "./loading";
import Lp1Component from "@/app/[locale]/components/landingPage/lp1";
import SubscribeButton from "@/app/[locale]/components/landingPage/SubscribeButton";
import Promoteur from "@/app/[locale]/components/landingPage/promoteurIcone";
import ScrollProjectList from "@/app/[locale]/components/landingPage/ScrollProjectList";

import Link from "next/link";
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
      <style jsx>{`
        .letter {
          display: inline-block;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      `}</style>

      <IntroSection
        t={t}
        uniqueCompanies={uniqueCompanies}
        uniqueIdeas={uniqueIdeas}
        totalApartments={totalApartments}
        searchTerm={searchTerm}
        loading={loading}
      />

      <div className="w-full flex flex-col xl:mb-32 lg:mb-28 md:mb-20 sm:mb-10">
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
      <Lp1Component />
<div className="gflex justify-center items-center px-4 py-12 w-full bg-gray-700">
        <SubscribeButton />
      </div>
    </>
  );
}

function IntroSection({
  t,
  uniqueCompanies,
  uniqueIdeas,
  totalApartments,
  searchTerm,
  loading,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <link rel="preload" href="/buildwhite.jpg" as="image" />

      <div className="relative overflow-hidden w-full pb-10">
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollPosition * 0.2}px)`,
            transition: "none",
          }}
        >
          <Image
            src="/buildwhite.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            priority
            quality={50}
            className="object-center"
          />
        </div>
        <div className="absolute inset-0 bg-white opacity-60 z-10" />

        <div className="relative z-20 flex flex-col justify-between px-4 text-black">
          <div className="flex flex-col items-center gap-6 mt-16 sm:mt-24 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">
              {t("title")}
            </h1>
            <p className="text-xl sm:text-2xl">{t("subtitle")}</p>
          </div>

          <div className="absolute left-0 w-full">
            <p className="text-[15rem] sm:text-[20rem] text-black opacity-5 font-satisfy text-left pl-4 sm:pl-40 leading-none select-none">
              H
            </p>
          </div>
          <div className="w-full flex justify-center pt-24">
            <div className="w-fit border-black border-2 rounded-3xl relative z-40 p-2 bg-white ">
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Warsaw, Piaseczno, ..."
                  className="w-full p-2 rounded pr-10 text-black placeholder:text-black outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearch
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                />
                {searchTerm.length > 0 && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
                    onClick={() => setSearchTerm("")}
                  >
                    ✖
                  </button>
                )}
              </div>

              {!loading && searchTerm.length >= 2 && (
                <ul className="bg-white">
                  {Array.from(
                    new Map(
                      fetchProjectsA
                        .filter((project) =>
                          project.city
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((project) => [
                          project.city.toLowerCase(),
                          {
                            city: project.city,
                            country: project.country || "N/A",
                          },
                        ])
                    ).values()
                  ).map(({ city, country }, index) => {
                    const regex = new RegExp(`(${searchTerm})`, "gi");
                    const highlightedText = city.split(regex).map((part, i) =>
                      part.toLowerCase() === searchTerm.toLowerCase() ? (
                        <strong key={i} className="text-red-500">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    );

                    return (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between"
                        onClick={() => {
                          setSearchTerm(city);
                          localStorage.setItem("selectedCity", city);
                          localStorage.setItem("selectedCountry", country);
                          setTimeout(() => {
                            router.push(`/${locale}/projects`);
                          }, 500);
                        }}
                      >
                        <span>{highlightedText}</span>
                        <span className="text-gray-500 ml-2">{country}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Statistics({ uniqueCompanies, uniqueIdeas, totalApartments }) {
  const [displayedCompanies, setDisplayedCompanies] = useState(0);
  const [displayedIdeas, setDisplayedIdeas] = useState(0);
  const [displayedApartments, setDisplayedApartments] = useState(0);

  const animateCount = (target, setDisplayed) =>
    new Promise((resolve) => {
      let count = 0;
      const increment = Math.ceil(target / 100);
      const interval = setInterval(() => {
        if (count < target) {
          count += increment;
          setDisplayed(count > target ? target : count);
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });

  useEffect(() => {
    const animateAll = async () => {
      await Promise.all([
        animateCount(uniqueCompanies.size, setDisplayedCompanies),
        animateCount(uniqueIdeas.size, setDisplayedIdeas),
        animateCount(totalApartments, setDisplayedApartments),
      ]);
    };
    animateAll();
  }, [uniqueCompanies.size, uniqueIdeas.size, totalApartments]);

  const boxStyle = "mt-2 text-center rounded-xl p-4 sm:w-[150px] w-[120px]";
  const numberStyle = "font-semibold text-gray-700 font-macondo text-5xl";
  const labelStyle = "text-gray-600 sm:text-lg text-sm";

  return (
    <div className="flex gap-4 xl:gap-8 items-center my-8 transition-shadow duration-300 transform hover:-translate-y-1 animate-fadeIn">
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedCompanies}</span>
        <p className={labelStyle}>{t("Homepage:companies")}</p>
      </div>
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedIdeas}</span>
        <p className={labelStyle}>{t("Homepage:projects")}</p>
      </div>
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedApartments}</span>
        <p className={labelStyle}>{t("Homepage:apartments")}</p>
      </div>
    </div>
  );
}

function ScrollingText() {
  const announcements = [
    "Eiffage",
    "Bouygues",
    "Marvipol",
    "Ronson",
    "Develia",
    "Archicom",
    "Budlex",
    "Profbud",
    "Vinci",
    "Procivis",
    "Icade",
    "Bassac",
  ];

  return (
    <div className="scrolling-text-container pt-24">
      <div
        className="scrolling-text-inner"
        style={{ "--marquee-speed": "50s" }}
        role="marquee"
      >
        <div className="scrolling-text">
          {Array(5)
            .fill(announcements)
            .flat()
            .map((text, index) => (
              <div key={index} className="scrolling-text-item">
                {text}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Interet() {
  const t = useTranslations("Homepage");

  return (
    <section
      className="relative py-16 text-black w-full"
      style={{ backgroundColor: "#e8e9eb" }}
    >
      <div className="grid md:grid-cols-2 gap-12 items-center px-28 py-24">
        {/* Texte explicatif */}
        <div className="">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            {t("Homepage:focusTitle")}
          </h2>
          <p className="text-lg leading-relaxed text-gray-800">
            {t("Homepage:focusText")}
          </p>
        </div>

        {/* Illustration ou visuel */}
        <div className="w-full h-64 relative rounded-2xl overflow-hidden border border-white/20">
          <Image
            src="/Land.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            priority
            quality={50}
            className="object-center"
          />
        </div>
      </div>
    </section>
  );
}
