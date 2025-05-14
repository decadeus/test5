"use client";

import { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { IoSearch } from "react-icons/io5";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import useCustomCursor from "@/components/useCustomCursor";
import Loading from "./loading";
import Lp1Component from "@/app/[locale]/component/lp1";
import SubscribeButton from "@/app/[locale]/components/SubscribeButton";

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
                  placeholder="Piaseczno, Warsaw, ..."
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

function ScrollProjectList({
  projects,
  t,
  uniqueCompanies,
  uniqueIdeas,
  totalApartments,
}) {
  const {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  } = useCustomCursor(t("EnSavoirPlus"));

  return (
    <div className="flex flex-col justify-center mx-auto xl:w-[1100px] lg:w-[950px] md:w-[700px] sm:w-[550px] w-[350px] overflow-x-auto relative pt-24">
      <h2 className="font-macondo text-black text-4xl ">{t("TitleNew")}</h2>
      <ScrollArea.Root className="ScrollAreaRoot" type="always">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-8 mb-4 ml-4">
            {projects.map((item) => (
              <div
                key={item.id}
                className="flex flex-col xl:w-[450px] lg:w-[350px] md:w-[250px] sm:w-[200px] w-[250px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-white transition-shadow duration-1000 hover:shadow-xl hover:shadow-slate-950"
                onMouseEnter={() => {
                  setShowCursor(true);
                  setCursorLink(item.link);
                }}
                onMouseLeave={() => {
                  setShowCursor(false);
                  setCursorLink("");
                }}
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <div className="w-full relative xl:h-80 lg:h-[200px] md:h-28 sm:h-24 h-[150px]">
                    <Avatar
                      url={item.mainpic_url}
                      width={270}
                      height={196}
                      className="rounded-sm"
                      alt={item.name}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700 font-satisfy lg:text-3xl font-extrabold sm:text-lg text-2xl">
                      {item.name}
                    </p>
                    <p className="text-gray-700 md:text-md sm:text-[12px]">
                      {item.adresse}
                    </p>
                    <p className="text-gray-700 sm:text-[12px]">
                      {item.city}, {item.country}
                    </p>
                    <p className="text-gray-700 text-sm pt-4">
                      {item.des
                        ? item.des.length > 300
                          ? item.des.substring(0, 300) + "..."
                          : item.des
                        : ""}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="ScrollAreaScrollbar"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="ScrollAreaCorner" />
      </ScrollArea.Root>
      <div className="hidden sm:block">
        <CursorComponent />
      </div>

      <div className="flex justify-center mt-12">
        <Statistics
          uniqueCompanies={uniqueCompanies}
          uniqueIdeas={uniqueIdeas}
          totalApartments={totalApartments}
        />
      </div>
    </div>
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
        <p className={labelStyle}>Companies</p>
      </div>
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedIdeas}</span>
        <p className={labelStyle}>Projets</p>
      </div>
      <div className={boxStyle}>
        <span className={numberStyle}>{displayedApartments}</span>
        <p className={labelStyle}>Appartements</p>
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
  return (
    <section
  className="relative py-16 text-black w-full"
  style={{ backgroundColor: '#e8e9eb' }}
>
      <div className="grid md:grid-cols-2 gap-12 items-center px-28 py-24">
        {/* Texte explicatif */}
        <div className="">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Concentrez-vous sur vos projets, on s’occupe du reste
          </h2>
          <p className="text-lg leading-relaxed text-gray-800">
            Hoomge a été conçue avec un objectif clair :{" "}
            <strong>mettre en valeur vos projets immobiliers sur Google</strong>{" "}
            grâce à une structure optimisée pour le SEO.
            <br />
            <br />
            Chaque projet est{" "}
            <strong>géré directement par le promoteur ou son agence</strong>,
            pour garantir des informations toujours à jour et pertinentes.
            <br />
            <br />
            Plus besoin de manipuler des CMS complexes : vous vous concentrez
            sur les projets,{" "}
            <strong>nous nous occupons de la visibilité</strong>.
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
