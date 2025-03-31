"use client";
import { useState, useEffect, useRef } from "react"; // Ajout de useState et useEffect

import Image from "next/legacy/image";
import { FaLongArrowAltDown } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import useCustomCursor from "@/components/useCustomCursor";
import { Link } from "@/navigation";
import Loading from "./loading";
import { useTranslations } from "next-intl";
import { Card, CardBody } from "@heroui/react";
import { Input } from "@heroui/react";
import { useRouter } from "next/navigation"; // Pour rediriger
import { IoSearch } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Polska");

  const [fetchProjectsA, setFetchProjectsA] = useState([]); // Initialise un tableau vide

  const [searchTerm, setSearchTerm] = useState("");

  const t = useTranslations("Homepage");

  const MIN_LOADING_TIME = 1000;
  const router = useRouter(); // Initialisation du router
  const pathname = usePathname();
  const locale = pathname ? pathname.split("/")[1] : "en";
  const fetchProjects = async () => {
    const startTime = Date.now();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("*, compagny, ide, projectlist(ide, id)")
      .eq("country", selectedCountry);

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(MIN_LOADING_TIME - elapsedTime, 0);

    if (!error) {
      setProjects(data);
      // Par défaut, affiche tous les projets
    }

    setTimeout(() => {
      setLoading(false);
      if (!error) {
        setProjects(data);
      }
    }, remainingTime);
  };

  useEffect(() => {
    fetchProjectsAFromSupabase();
  }, []);

  const fetchProjectsAFromSupabase = async () => {
    setLoading(true); // Active le mode chargement
    const supabase = createClient(
      "https://your-supabase-url",
      "your-supabase-key"
    );

    try {
      const { data, error } = await supabase
        .from("project")
        .select("id, name, city, country");

      if (error) {
        console.error(
          "Erreur lors de la récupération des projets:",
          error.message
        );
      } else {
        setFetchProjectsA(data || []); // Stocke les données dans l'état
      }
    } catch (err) {
      console.error("Erreur inattendue:", err);
    } finally {
      setLoading(false); // Désactive le mode chargement
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCountry]);

  const normalizedSearchTerm = searchTerm.toLowerCase();

  const apartmentIDs = new Set(
    projects
      .filter(
        (project) =>
          project.projectlist &&
          project.projectlist.some((item) => item.ide === project.id)
      )
      .map((project) => project.id)
  );

  const totalApartments = projects.reduce((acc, project) => {
    // S'assurer que projectlist existe et est un tableau
    if (project.projectlist && Array.isArray(project.projectlist)) {
      return acc + project.projectlist.length; // Ajouter le nombre d'appartements pour ce projet
    }
    return acc; // Accumulateur si projectlist est vide
  }, 0);

  const uniqueCompanies = new Set(projects.map((project) => project.compagny));
  const uniqueIdeas = new Set(projects.map((project) => project.ide));

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <style jsx>{`
        .letter {
          display: inline-block;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
      `}</style>
      <div className="w-full maintextfull">
        <Para t={t} />
      </div>

      <div className="w-fit border-black border-2 rounded-3xl relative -mt-[400px] z-40 p-2 bg-white  ">
        {/* Champ de recherche avec bouton "X" */}
        <div className="relative w-80 ">
          <input
            type="text"
            placeholder="Paris, Warsaw, ..."
            className="w-full p-2 rounded pr-10 text-black placeholder:text-black outline-none focus:outline-none focus:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
          />

          {/* Bouton "X" pour effacer la recherche */}
          {searchTerm.length > 0 && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => setSearchTerm("")}
            >
              ✖
            </button>
          )}
        </div>

        {/* Affichage des villes uniques avec mise en évidence des lettres recherchées */}
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ul className="bg-white">
            {searchTerm.length >= 2 &&
              Array.from(
                new Map(
                  fetchProjectsA
                    .filter(
                      (project) =>
                        project.city &&
                        project.city
                          .toLowerCase()
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

                      // ⏳ Ajouter un délai avant la redirection
                      setTimeout(() => {
                        router.push(`/${locale}/projects`);
                      }, 500); // Délai de 500ms avant la redirection
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

      <div className="flex-col sm:flex sm:flex-row h-[200px] sm:mt-[0]  mt-[100px] mb-[100px] "></div>

      <div className="flex justify-center mt-20 ">
        <button
          onClick={() => handleCountryChange("France")}
          className={`flex justify-between items-center  gap-2 px-4 py-2 m-2   border-2 rounded brownborder  ${
            selectedCountry === "France"
              ? "brownbg text-white  "
              : "clearbg browntext"
          }`}
        >
          <img
            src="/france-flag-round-circle-icon.svg"
            alt="Icon"
            width="20"
            height="20"
          />{" "}
          {t("France")}
        </button>
        <button
          onClick={() => handleCountryChange("Polska")}
          className={`flex justify-between items-center  gap-2 px-4 py-2 m-2  border-2 rounded brownborder  ${
            selectedCountry === "Polska"
              ? "brownbg text-white "
              : "clearbg browntext"
          }`}
        >
          <img
            src="/monaco-flag-round-circle-icon.svg"
            alt="Icon"
            width="20"
            height="20"
          />{" "}
          {t("Pologne")}
        </button>
      </div>

      <div className="mb-32">
        <Statistics
          uniqueCompanies={uniqueCompanies}
          uniqueIdeas={uniqueIdeas}
          totalApartments={totalApartments}
        />
      </div>

      <div className="w-full flex flex-col justify-center xl:mb-32 lg:mb-28 md:mb-20 sm:mb-10 ">
        <h2 className="font-macondo text-black text-4xl text-center">
          {t("TitleNew")}
        </h2>

        <Scroll projects={projects} t={t} />
      </div>
      <div className=""></div>
      <div className="w-full flex-col  py-8 mb-16">
        <h2 className="font-macondo  text-4xl text-center pb-8 ">
          {t("TitleBeau")}
        </h2>
        <div className="flex sm:gap-4 gap-8 justify-center items-center w-full flex-col md:flex-row flex-wrap">
          {projects
            .filter((p) => p.scroll)
            .map((project, index) => (
              <ScrollImage
                key={project.id}
                projects={project}
                index={index}
                t={t}
              />
            ))}
        </div>
      </div>

      <div className="w-full flex flex-col  py-8 mb-8">
        <h2 className="font-macondo  text-4xl text-center pb-8 ">
          {t("TitleVacance")}
          {/* Utiliser le texte basé sur la langue */}
        </h2>
        {projects
          .filter((p) => p.demi)
          .map((project, index) => (
            <Demi key={project.id} projects={project} index={index} t={t} />
          ))}
      </div>
      <div className="flex justify-center  w-full my-8 ">
        <Link
          href="/projects"
          className="border-2 brownborder p-2 w-fit clearbg browntext rounded hover:bg-[#c9af95] hover:text-[#f6f6f4] hover:border-black transition-all duration-500"
        >
          {t("Tous")}
        </Link>
      </div>

      <ScrollingText />
    </>
  );
}
const Statistics = ({ uniqueCompanies, uniqueIdeas, totalApartments }) => {
  const [displayedCompanies, setDisplayedCompanies] = useState(0);
  const [displayedIdeas, setDisplayedIdeas] = useState(0);
  const [displayedApartments, setDisplayedApartments] = useState(0);

  const animateCount = (target, setDisplayed) => {
    return new Promise((resolve) => {
      let count = 0;
      const increment = Math.ceil(target / 100);
      const interval = setInterval(() => {
        if (count < target) {
          count += increment;
          setDisplayed(count > target ? target : count);
        } else {
          clearInterval(interval);
          resolve(); // Résoudre la promesse lorsque l'animation est terminée
        }
      }, 10);
    });
  };

  useEffect(() => {
    const animateAllCounts = async () => {
      await Promise.all([
        animateCount(uniqueCompanies.size, setDisplayedCompanies),
        animateCount(uniqueIdeas.size, setDisplayedIdeas),
        animateCount(totalApartments, setDisplayedApartments),
      ]);
    };

    animateAllCounts();
  }, [uniqueCompanies.size, uniqueIdeas.size, totalApartments]);

  const countstyle =
    "mt-2 text-center bg-gray-100 rounded-xl p-4 sm:w-[150px] w-[120px]";
  const countnumber = "font-semibold browntext sm:text-2xl text-lg";
  const counttext = "text-gray-600 sm:text-lg text-sm";

  return (
    <div className="flex gap-4 xl:gap-8  items-center my-8 transition-shadow duration-300 transform hover:-translate-y-1 animate-fadeIn">
      <div className={countstyle}>
        <p className={counttext}>Companies</p>
        <span className={countnumber}>{displayedCompanies}</span>
      </div>
      <div className={countstyle}>
        <p className={counttext}>Projets</p>
        <span className={countnumber}>{displayedIdeas}</span>
      </div>
      <div className={countstyle}>
        <p className={counttext}>Appartements</p>
        <span className={countnumber}>{displayedApartments}</span>
      </div>
    </div>
  );
};

function Scroll({ projects = [], index, t }) {
  const {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  } = useCustomCursor(t("EnSavoirPlus"));

  return (
    <div className="flex justify-center mx-auto  xl:w-[1100px] lg:w-[950px] md:w-[700px] sm:w-[550px] w-[350px] overflow-x-auto relative py-4">
      <ScrollArea.Root className="ScrollAreaRoot" type="always">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-8 mb-4 ml-4">
            {projects.map((item) => (
              <div
                key={item.id}
                className="flex flex-col xl:w-[450px] lg:w-[350px] md:w-[250px] sm:w-[200px] w-[250px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-black transition-shadow duration-1000 hover:shadow-xl hover:shadow-slate-950 hover:transition-shadow ease-in-out mb-4"
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
                    <p className="browntext font-satisfy  lg:text-3xl font-extrabold sm:text-lg text-2xl">
                      {item.name}
                    </p>
                    <p className="cleartext md:text-md sm:text-[12px]">
                      {item.adresse}
                    </p>
                    <p className="cleartext sm:text-[12px]">
                      {item.city}, {item.country}
                    </p>
                    <p className="cleartext sm:text-[6px] text-[12px] pt-4">
  {item.des ? (item.des.length > 300 ? item.des.substring(0, 300) + "..." : item.des) : ""}
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
    </div>
  );
}

function Demi({ projects, index, t }) {
  const {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  } = useCustomCursor(t("EnSavoirPlus")); // Custom cursor setup

  const isEven = index % 2 === 0;

  return (
    <div
      className={`w-full flex flex-col sm:flex-row ${
        isEven ? "" : "sm:flex-row-reverse"
      } darktext clearbg`}
    >
      {/* Image Container */}
      <div
        className="sm:w-1/2 w-full relative h-64 sm:h-80"
        onMouseEnter={() => {
          setShowCursor(true);
          setCursorLink(projects.link);
        }}
        onMouseLeave={() => {
          setShowCursor(false);
          setCursorLink("");
        }}
      >
        <a
          href={projects.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {projects.mainpic_url && (
            <Avatar
              url={projects.mainpic_url}
              width={270}
              height={196}
              className="rounded-sm object-cover w-full h-full"
              alt={projects.name || "Project Image"}
            />
          )}
        </a>
      </div>

      {/* Text Container */}
      <div className="sm:w-1/2 w-full flex flex-col justify-center items-center px-4 sm:px-12 py-8 sm:py-0">
        <h3 className="font-satisfy text-4xl font-extrabold pb-4 sm:pb-8 browntext text-center sm:text-left">
          {projects.name}
        </h3>
        <p className="text-center sm:text-left pb-4 sm:pb-8">{projects.des}</p>

        {projects.link && (
          <a href={projects.link} target="_blank" rel="noopener noreferrer">
            <p className="browntext hover:underline">
              {t("EnSavoirPlus")} <span>{projects.name}</span>
            </p>
          </a>
        )}
      </div>

      <div className="hidden sm:block">
        <CursorComponent />
      </div>
    </div>
  );
}

function Para({ t }) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Préchargement de l'image pour améliorer le LCP */}
      <link rel="preload" href="/buildwhite.jpg" as="image" />

      <div className="relative h-screen overflow-hidden">
        {/* Image de fond fixée pour l'effet de parallaxe */}
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
            priority={true} // Priorité élevée pour l'image de fond pour un rendu rapide
            quality={50} // Ajuste la qualité pour trouver un bon compromis entre performance et qualité
            className="object-center"
          />
        </div>

        {/* Filtre blanc sur l'image de fond */}
        <div className="absolute inset-0 bg-white opacity-60 z-10" />

        {/* Contenu au-dessus de l'image */}
        <div className="relative z-20 flex flex-col justify-between items-center  h-full text-black  xs:py-[150px] gap-0 py-[120px]  xs:gap-8">
          <h1 className="sm:text-4xl text-2xl font-bold text-center px-8">
            {t("title")}
          </h1>
          <p className="text-[20rem] text-black opacity-5 font-satisfy text-left md:pl-[150px] pl-[0px]  w-full">
            H
          </p>
          <div className="flex justify-center items-center flex-col px-8 ">
            <p className="text-3xl text-center">{t("subtitle")}</p>

            <p className="text-left text-sm pt-4 flex items-center">
              {t("defiler")} <FaLongArrowAltDown />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
const ScrollingText = () => {
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
    <div className="scrolling-text-container">
      <div
        className="scrolling-text-inner"
        style={{
          "--marquee-speed": "50s",
        }}
        role="marquee"
      >
        <div className={"scrolling-text"}>
          {/* Dupliquer le contenu pour créer un effet de continuité */}
          {announcements.map((text, index) => (
            <div key={index} className="scrolling-text-item">
              {text}
            </div>
          ))}
          {/* Répétition du contenu pour assurer un défilement continu */}
          {announcements.map((text, index) => (
            <div
              key={index + announcements.length}
              className="scrolling-text-item"
            >
              {text}
            </div>
          ))}
          {announcements.map((text, index) => (
            <div
              key={index + announcements.length}
              className="scrolling-text-item"
            >
              {text}
            </div>
          ))}
          {announcements.map((text, index) => (
            <div
              key={index + announcements.length}
              className="scrolling-text-item"
            >
              {text}
            </div>
          ))}
          {announcements.map((text, index) => (
            <div
              key={index + announcements.length}
              className="scrolling-text-item"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function ScrollImage({ projects, t }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCircleVisible, setIsCircleVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Observer pour l'animation d'entrée
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
      observer.disconnect();
    };
  }, []);

  // Suivi de la position de la souris
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isCircleVisible && imageRef.current) {
        const { left, top } = imageRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - left,
          y: event.clientY - top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isCircleVisible]);

  const handleMouseEnter = () => {
    setIsCircleVisible(true);
  };

  const handleMouseLeave = () => {
    setIsCircleVisible(false);
  };

  return (
    <div
      ref={imageRef}
      className={`transition-all duration-1000 ease-in-out   ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      style={{
        backgroundColor: isVisible ? "transparent" : "#f0f0f0",
        position: "relative",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className=" flex flex-wrap bg-red-300 ">
        <div className="relative lg:w-[250px] md:w-[350px] sm:w-[300px] sm:h-[300px] w-[350px] h-[200px] shadow-lg shadow-black hover:shadow transition-shadow duration-1000 border-black border-2">
          <a
            href={projects.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            {projects.mainpic_url && (
              <Avatar
                url={projects.mainpic_url}
                width={270}
                height={196}
                className="rounded-sm w-full h-auto"
                alt={projects.name || "Project Image"}
              />
            )}
          </a>

          <div className="hidden sm:block">
            {isCircleVisible && (
              <div
                style={{
                  position: "absolute",
                  top: `${mousePosition.y}px`,
                  left: `${mousePosition.x}px`,
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  transition: "opacity 0.2s",
                  textAlign: "center",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bolder",
                    fontSize: "16px",
                  }}
                >
                  {t("EnSavoirPlus")}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Autres éléments flexibles en colonne */}
      </div>
    </div>
  );
}
