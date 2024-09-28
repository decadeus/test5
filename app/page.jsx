"use client";
import { useState, useEffect, useRef } from "react"; // Ajout de useState et useEffect

import Image from "next/legacy/image";
import { FaLongArrowAltDown } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { texts } from "@/lib/language";
import useCustomCursor from "@/components/useCustomCursor";
import Link from "next/link";
import Loading from "@/app/loading";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Polska");
  const [language, setLanguage] = useState("pl");

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
        <Para language={language} texts={texts} />
      </div>

      <div className="flex justify-center  -mt-[300px]  sm:-mt-[200px] sm:mb-[200px] mb-[200px] z-50">
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
          France
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
          Polska
        </button>
      </div>
      <div className="flex-col sm:flex sm:flex-row h-[200px] sm:mt-[0]  mt-[100px] mb-[100px] ">
        <div className="flex justify-center items-center sm:w-1/2  sm:pl-4 relative z-10 ">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[20rem] text-black opacity-5 transform font-satisfy">
              H
            </h1>
          </div>
          <h1 className="sm:text-4xl text-2xl font-bold px-4 text-center pb-[20px]">{texts[language].title3}</h1>
        </div>
        <div className="flex flex-col sm:justify-center sm:items-center sm:w-1/2 px-4 sm:pr-48 gap-4">
          <h2 className="sm:text-md ">{texts[language].title4}</h2>
          <Link
            href="/projects"
            className="border-2 brownborder p-2 w-fit clearbg browntext rounded hover:bg-[#c9af95] hover:text-[#f6f6f4] hover:border-black transition-all duration-500"
          >
            {texts[language].link}
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center xl:mb-32 lg:mb-28 md:mb-20 sm:mb-10 ">
        <h2 className="font-macondo text-black text-4xl text-center">
          {texts[language].title2} {/* Utiliser le texte basé sur la langue */}
        </h2>

        <Scroll projects={projects} texts={texts} language={language} />
      </div>
      <div className=""></div>
      <div className="w-full flex-col  py-8 mb-16">
        <h2 className="font-macondo  text-4xl text-center pb-8 ">
          {texts[language].title1} {/* Utiliser le texte basé sur la langue */}
        </h2>
        <div className="flex sm:gap-4 gap-8 justify-center items-center w-full flex-col md:flex-row">
          {projects
            .filter((p) => [10, 12, 13, 14].includes(p.id))
            .map((project, index) => (
              <ScrollImage
                key={project.id}
                projects={project}
                index={index}
                texts={texts}
                language={language}
              />
            ))}
        </div>
      </div>

      <div className="w-full flex flex-col  py-8 mb-8">
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
      <div className="flex justify-center  w-full my-8 ">
        <Link
          href="/projects"
          className="border-2 brownborder p-2 w-fit clearbg browntext rounded hover:bg-[#c9af95] hover:text-[#f6f6f4] hover:border-black transition-all duration-500"
        >
          {texts[language].link}
        </Link>
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
    <div className="flex justify-center mx-auto  xl:[1100px] lg:w-[800px] md:w-[600px] sm:w-[550px] w-[350px] overflow-x-auto relative py-8">
  <ScrollArea.Root className="ScrollAreaRoot" type="always">
    <ScrollArea.Viewport className="w-full">
      <div className="flex gap-8 mb-4">
        {projects.map((item) => (
          <div
            key={item.id}
            className="flex flex-col xl:w-[450px] lg:w-[250px] md:w-[250px] sm:w-[200px] w-[250px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-black transition-shadow duration-1000 hover:shadow-xl hover:shadow-slate-950 hover:transition-shadow ease-in-out mb-4"
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
              <div className="w-full relative xl:h-80 lg:h-40 md:h-28 sm:h-24 h-[150px]">
                <Avatar
                  url={item.mainpic_url}
                  width={270}
                  height={196}
                  className="rounded-sm"
                  alt={item.name}
                />
              </div>
              <div className="mt-4">
                <p className="browntext font-satisfy  lg:text-xl font-extrabold sm:text-lg text-md">
                  {item.name}
                </p>
                <p className="cleartext md:text-md sm:text-[12px]">{item.adresse}</p>
                <p className="cleartext sm:text-[12px]">
                  {item.city}, {item.country}
                </p>
                <p className="cleartext sm:text-[12px]">{item.compagny}</p>
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
  } = useCustomCursor(texts[language].projet); // Custom cursor setup

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
        <p className="font-satisfy text-4xl font-extrabold pb-4 sm:pb-8 browntext text-center sm:text-left">
          {projects.name}
        </p>
        <p className="text-center sm:text-left pb-4 sm:pb-8">
          {projects.Des}
        </p>

        {projects.link && (
          <a href={projects.link} target="_blank" rel="noopener noreferrer">
            <p className="browntext hover:underline">
              {texts[language].voir} <span>{projects.name}</span>
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
          className="object-center"
          quality={20}// Centre l'image
        />
      </div>

      {/* Filtre blanc sur l'image de fond */}
      <div className="absolute inset-0 bg-white opacity-60 z-10" />

      {/* Contenu au-dessus de l'image */}
      <div className="relative z-20 flex flex-col items-start justify-end h-full text-black pb-80 pl-20">
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

function ScrollImage({ projects, language, texts }) {
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
      <div className="items-center justify-center space-y-4 md:space-y-0 md:space-x-4 ">
        <div className="relative  sm:w-[350px] sm:h-[250px] w-[350px] h-[200px] shadow-lg shadow-black hover:shadow transition-shadow duration-1000">
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

          {/* Cercle au-dessus du pointeur */}
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
                {texts[language].projet}
              </span>
            </div>
          )}
        </div>
        {/* Autres éléments flexibles en colonne */}
      </div>
    </div>
  );
}
