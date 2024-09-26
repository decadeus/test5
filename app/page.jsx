"use client";
import { useState, useEffect, useRef } from "react"; // Ajout de useState et useEffect
import d from "@/components/d.png";
import e from "@/components/e.png";
import Image from "next/legacy/image";
import { FaArrowRight, FaHeart, FaLongArrowAltDown } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { texts } from "@/lib/language";
import useCustomCursor from "@/components/useCustomCursor";
import Link from "next/link"; // Adjust the path accordingly

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("France");
  const [language, setLanguage] = useState("fr");

  const containerStyle = "flex flex-col items-center bgfull w-full pt-32 pb-32";
  const headerStyle =
    "text-6xl font-bold text-black mb-8 font-montserrat text-center shadowI bg-transparent";
  const subheaderStyle = "text-lg text-black mb-8 font-montserrat mb-32";

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("country", selectedCountry);

    if (error) {
      setError(error);
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCountry]); // Re-fetch projects when selectedCountry changes

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setLanguage(country === "Polska" ? "pl" : "fr"); // Change la langue en fonction du pays
  };

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
        <Para language={language} texts={texts} />
      </div>

      <div className="flex justify-center  -mt-32 mb-32 z-50">
        <button
          onClick={() => handleCountryChange("France")}
          className={`flex justify-between items-center  gap-2 px-4 py-2 m-2  borderfull border-2 rounded ${
            selectedCountry === "France"
              ? "brownbg clearbg"
              : "clearbg browntext"
          }`}
        >
          <img
            src="/france-flag-round-circle-icon.svg"
            alt="Icon"
            width="20"
            height="20"
          />{" "}
          France
        </button>
        <button
          onClick={() => handleCountryChange("Polska")}
          className={`flex justify-between items-center  gap-2 px-4 py-2 m-2  borderfull border-2 rounded ${
            selectedCountry === "Polska"
              ? "brownbg clearbg"
              : "clearbg browntext"
          }`}
        >
          <img
            src="/monaco-flag-round-circle-icon.svg"
            alt="Icon"
            width="20"
            height="20"
          />{" "}
          Polska
        </button>
      </div>
      <div className="flex h-[200px] mb-32 ">
        <div className="flex justify-center items-center w-1/2 pr-16 pl-48 relative z-10 ">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[20rem] text-black opacity-5 transform translate-x-1/2 font-satisfy">
              H
            </h1>
          </div>
          <h1 className="text-4xl font-bold">{texts[language].title3}</h1>
        </div>
        <div className="flex flex-col justify-left  w-1/2 pl-16 pr-48 gap-4">
          <h2 className="text-xl">{texts[language].title4}</h2>
          <Link
            href="/projects"
            className="border-2 brownborder p-2 w-fit clearbg browntext rounded hover:bg-[#c9af95] hover:text-[#f6f6f4] hover:border-black transition-all duration-500"
          >
            {texts[language].link}
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center mb-32">
        <h2 className="font-macondo text-black text-4xl text-center">
          {texts[language].title2} {/* Utiliser le texte basé sur la langue */}
        </h2>

        <Scroll projects={projects} texts={texts} language={language} />
      </div>

      <div className="w-full flex flex-col  py-8 mb-4">
        <h2 className="font-macondo  text-4xl text-center pb-8 ">
          {texts[language].title1} {/* Utiliser le texte basé sur la langue */}
        </h2>
        {projects
          .filter((p) => [10, 12, 13, 14].includes(p.id))
          .map((project, index) => (
            <Demi
              key={project.id}
              projects={project}
              index={index}
              texts={texts}
              language={language}
            />
          ))}
      </div>
      <ScrollingText />
    </>
  );
}

function Scroll({ projects = [], index, texts, language }) {
  const {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  } = useCustomCursor(texts[language].projet);

  return (
    <div className="flex justify-center w-full overflow-x-auto relative py-8">
      <ScrollArea.Root className="ScrollAreaRoot" type="always">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-8 mb-4 px-8">
            {projects.map((item) => (
              <div
                key={item.id}
                className="flex flex-col w-[450px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-black transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-950"
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
                  <div className="w-full relative h-80">
                    <Avatar
                      url={item.mainpic_url}
                      width={270}
                      height={196}
                      className="rounded-sm"
                      alt={item.name}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="browntext font-satisfy text-2xl font-extrabold">
                      {item.name}
                    </p>
                    <p className="cleartext">{item.adresse}</p>
                    <p className="cleartext">
                      {item.city}, {item.country}
                    </p>
                    <p className="cleartext">{item.compagny}</p>
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

      <CursorComponent />
    </div>
  );
}

function Demi({ projects, index, texts, language }) {
  const {
    showCursor,
    setShowCursor,
    cursorLink,
    setCursorLink,
    CursorComponent,
  } = useCustomCursor(texts[language].projet); // Pass the cursor text here

  const isEven = index % 2 === 0;

  return (
    <div
      className={`w-full flex ${
        isEven ? "" : "flex-row-reverse darktext clearbg"
      }`}
    >
      <div
        className="w-1/2 relative h-80"
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
              className="rounded-sm"
              alt={projects.name || "Project Image"}
            />
          )}
        </a>
      </div>

      <div className="w-1/2 flex flex-col full justify-center items-center">
        <p className="font-satisfy text-4xl font-extrabold pb-8 browntext ">
          {projects.name}
        </p>
        <p className="px-12 pb-8 ">{projects.Des}</p>

        {projects.link && (
          <a href={projects.link} target="_blank" rel="noopener noreferrer">
            <p className="browntext hover:underline">
              {texts[language].voir} <span>{projects.name}</span>
            </p>
          </a>
        )}
      </div>

      <CursorComponent />
    </div>
  );
}

function Para({ language, texts }) {
  // Ajoutez texts comme prop
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
    <div className="relative h-screen overflow-hidden">
      {/* Image de fond fixée pour l'effet de parallaxe */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollPosition * 0.2}px)`, // Ajuste pour un mouvement plus fluide
          transition: "none", // Aucune transition pour éviter le mouvement après l'arrêt du scroll
        }}
      >
        <Image
          src="/buildwhite.jpg" // Assure-toi que l'image est dans le bon dossier public
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="object-center" // Centre l'image
        />
      </div>

      {/* Filtre blanc sur l'image de fond */}
      <div className="absolute inset-0 bg-white opacity-60 z-10" />

      {/* Contenu au-dessus de l'image */}
      <div className="relative z-20 flex flex-col items-start justify-end h-full text-black pb-60 pl-20">
        <h1 className="text-3xl text-left">
          {texts[language].main} {/* Utiliser le texte basé sur la langue */}
        </h1>

        <p className="text-left text-sm pt-4 flex items-center">
          {texts[language].submain} <FaLongArrowAltDown />{" "}
        </p>
      </div>

      {/* Ajout de contenu supplémentaire pour voir l'effet de parallaxe */}
      <div className="h-screen bg-gray-200 flex items-center justify-center">
        <h2 className="text-3xl">Contenu Additionnel</h2>
      </div>
      <div className="h-screen bg-gray-300 flex items-center justify-center">
        <h2 className="text-3xl">Encore Plus de Contenu</h2>
      </div>
    </div>
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
          "--marquee-speed": "20s",
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
