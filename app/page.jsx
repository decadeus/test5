"use client";
import React, { useEffect, useState } from "react";
import Form from "@/app/addproject/form";
import d from "@/components/d.png";
import e from "@/components/e.png";
import Image from "next/legacy/image";
import { FaArrowRight } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/app/getimage/project";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { motion } from "framer-motion";
import { FaLongArrowAltDown } from "react-icons/fa";

export default function Page() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerStyle = "flex flex-col items-center bgfull w-full pt-32 pb-32";
  const headerStyle =
    "text-6xl font-bold text-black mb-8 font-montserrat text-center shadowI bg-transparent";
  const subheaderStyle = "text-lg text-black mb-8 font-montserrat mb-32";

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("project").select("*");

    if (error) {
      setError(error);
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    const revealText = (id, text, buildingText) => {
      const container = document.getElementById(id);
      container.innerHTML = "";

      for (let char of text) {
        const span = document.createElement("span");
        span.className = "letter";
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transition = "opacity 0.3s ease";
        span.textContent = char === " " ? "\u00A0" : char;
        container.appendChild(span);
      }
      const buildingSpan = document.createElement("span");
      buildingSpan.className =
        "bg-gradient-to-r from-fuchsia-400 via-pink-500 to-sky-500 bg-clip-text text-transparent";
      buildingSpan.textContent = buildingText;

      container.appendChild(buildingSpan);

      const letters = document.querySelectorAll(`#${id} .letter`);

      const revealLetters = () => {
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          letters.forEach((letter, index) => {
            setTimeout(() => {
              letter.style.opacity = "1";
            }, index * 100);
          });
          window.removeEventListener("scroll", revealLetters);
        }
      };

      window.addEventListener("scroll", revealLetters);
    };
    revealText("building-text", "Fill information about ", "the building");
    revealText(
      "second-title-text",
      "Discover amazing features of ",
      "this project"
    );
    revealText("third-title-text", "Follow all new ", "projects");
  }, []);

  return (
    <>
      <style jsx>{`
        .letter {
          display: inline-block; /* Pour pouvoir les révéler individuellement */
          opacity: 0; /* Invisible au départ */
          transition: opacity 0.3s ease; /* Transition douce */
        }
      `}</style>
      <div className="w-full">
        <Para />
      </div>
      <div className={containerStyle}>
        <h1 className={headerStyle}>
          The Largest Collection of <br /> Residential Real Estate Projects
        </h1>
        <p className={subheaderStyle}>
          List Your Residential Apartments for Sale in Minutes, Completely Free.
        </p>
        <button className="bg-blue-500 text-white py-2 px-4 text-xl mb-16 font-satisfy">
          Add your project
        </button>
        <Step />
        <div className="flex flex-col justify-start items-start w-full mb-16">
          <p className="text-black mb-4">Updates</p>
          <h2 className="text-black text-5xl font-bold mb-8">
            <span id="third-title-text">
              {/* Le contenu sera ajouté via JavaScript */}
            </span>
          </h2>
          <p className="text-gray-400 text-xl mb-20 font-kenia">
            Stay informed about our latest developments and offerings.
          </p>
        </div>

        <div className="flex flex-col justify-start items-start w-full mb-16">
          <p className="text-black mb-4">Building</p>
          <h2 className="text-black text-5xl font-bold mb-8">
            <span id="building-text">
              {/* Le contenu sera ajouté via JavaScript */}
            </span>
          </h2>
          <p className="text-gray-400 text-xl mb-20">
            Present the advantages of the residence by highlighting and
            selecting specific features to facilitate the apartment search. Once
            all the information is provided, you can immediately list your
            available apartments for sale online.
          </p>
          <div className="w-[450px] shadowW">
            <Image src={d} width={450} height={450} alt="Logo" className="" />
          </div>
        </div>

        <div className="flex flex-col justify-start items-start w-full mb-16">
          <p className="text-black mb-4">Features</p>
          <h2 className="text-black text-5xl font-bold mb-8 text-wrap">
            <span id="second-title-text">
              {/* Le contenu sera ajouté via JavaScript */}
            </span>
          </h2>
          <p className="font-kenia">
            Explore the unique characteristics that make this project stand out.
          </p>
          <div className="flex items-center justify-center ">
            <p className="flex items-center text-6xl">
              We{" "}
              <span className="px-2">
                <FaHeart className="colortext animate-spin-pause" />
              </span>{" "}
              go far
            </p>
          </div>
          <div className="relative w-[670px] shadowW">
            <Image
              src={e}
              layout="fill"
              objectFit="cover"
              alt="Logo"
              className=""
            />
          </div>
          <Black projects={projects} />
        </div>

        <Form />
      </div>
      <div className="w-full flex flex-col justify-center bg-[#18191C] py-8">
        <h2 className="font-macondo text-white text-4xl text-center">
          CECI EST UN TEST
        </h2>

        <Scroll projects={projects.filter(p => [10, 12, 13, 14].includes(p.id))} />
      </div>

      <div className="w-full flex flex-col bg-[#18191C] py-8">
      <h2 className="font-macondo text-white text-4xl text-center pb-8">
          CECI EST UN TEST
        </h2>
        {projects
          .filter((p) => [10, 12, 14].includes(p.id))
          .map((project, index) => (
            <Demi key={project.id} projects={project} index={index} />
          ))}
      </div>
      

    </>
  );
}
function Step() {
  const stepContainerStyle = [
    {
      step: "1",
      title: "Fill the form",
      para: "Fill in the information about the building and the apartments",
    },
    {
      step: "2",
      title: "Template 2",
      para: "Fill in the information about the building and the apartments",
    },
    {
      step: "3",
      title: "Template 3",
      para: "Fill in the information about the building and the apartments",
    },
    {
      step: "4",
      title: "Template 4",
      para: "Fill in the information about the building and the apartments",
    },
  ];

  const scrollToSection = () => {
    const section = document.getElementById("ici");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-12 w-full">
        {stepContainerStyle.map(({ step, title, para }) => (
          <div
            key={step}
            className="relative text-white bg-gray-800 hover:bg-black p-4 rounded-bl-2xl rounded-tl-2xl rounded-br-2xl hover:-translate-y-4 transition-transform duration-300 ease-in-out group"
          >
            <div className="absolute top-[20px] left-1/4 transform -translate-x-1/2 transition-transform duration-1000 ease-in-out group-hover:rotate-180">
              <svg
                width="70"
                height="70"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="10"
                  stroke="white"
                  strokeWidth="4"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="164.64"
                  y2="35.36"
                  stroke="white"
                  strokeWidth="12"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="190"
                  y2="100"
                  stroke="white"
                  strokeWidth="4"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="164.64"
                  y2="164.64"
                  stroke="white"
                  strokeWidth="12"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="190"
                  stroke="white"
                  strokeWidth="4"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="35.36"
                  y2="164.64"
                  stroke="white"
                  strokeWidth="12"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="10"
                  y2="100"
                  stroke="white"
                  strokeWidth="4"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="35.36"
                  y2="35.36"
                  stroke="white"
                  strokeWidth="12"
                />
                <circle cx="100" cy="100" r="8" fill="white" />
              </svg>
            </div>

            <p className="colortext mt-24">STEP {step}</p>
            <h1 className="text-2xl mt-4">{title}</h1>
            <p className="mt-4">{para}</p>
            <div className="my-4">
              <hr className="border-t border-gray-300" />
            </div>
            <button
              onClick={scrollToSection}
              className="flex items-center text-white cursor-pointer colortext group"
            >
              GET STARTED
              <FaArrowRight className="ml-2 transition-transform duration-300 ease-in-out group-hover:rotate-90" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Black({ projects }) {
  return (
    <div className="flex flex-col w-full gap-2 mt-12">
      {projects.map((item) => (
        <div
          key={item.id}
          className="bg-black flex justify-between h-80 w-full items-center"
        >
          {/* Bloc 1: 3/12 */}
          <div className="w-3/12">
            <h3 className="text-gray-300 text-3xl pl-8">{item.compagny}</h3>
          </div>

          {/* Bloc 2: 6/12 */}
          <div className="relative h-72 w-6/12 flex flex-col text-center items-center">
            <div>
              <p className="text-white pr-12 flex text-center text-5xl pb-4 font-satisfy colortext">
                {item.name}
              </p>
            </div>
            <div className="w-full relative h-80">
              <Avatar
                url={item.mainpic_url}
                width={270}
                height={196}
                classn="rounded-sm"
              />
            </div>
          </div>

          {/* Bloc 3: 3/12 */}
          <div className="w-3/12 pl-4">
            <p className="text-white pr-12 flex items-center text-base font-thin">
              {item.Des}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Scroll({ projects = [] }) {
  const [showCursor, setShowCursor] = useState(false);
  const [cursorLink, setCursorLink] = useState("");

  useEffect(() => {
    const handleMouseMove = (event) => {
      const cursor = document.querySelector(".cursor-circle");
      if (cursor) {
        const cursorWidth = 80; // Largeur du curseur
        const cursorHeight = 80; // Hauteur du curseur
        const offsetY = 20; // Déplacement vers le bas (ajustez cette valeur selon vos besoins)

        // Ajustez la position du curseur pour le centrer et le décaler légèrement vers le bas
        cursor.style.left = `${event.clientX - cursorWidth / 2}px`;
        cursor.style.top = `${event.clientY - cursorHeight / 2 - offsetY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex justify-center  w-full overflow-x-auto relative  py-8">
      <ScrollArea.Root className="ScrollAreaRoot" type="always">
        <ScrollArea.Viewport className="w-full">
          <div className="flex gap-8 mb-4 px-8">
            {projects.map((item) => (
              <div
                key={item.id} // Assurez-vous d'utiliser une clé unique
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
                      alt={item.name} // Ajoutez du texte alternatif pour l'accessibilité
                    />
                  </div>
                  <div className="mt-4 ">
                    <p className="text-white colortext font-satisfy text-2xl font-extrabold ">
                      {item.name}
                    </p>
                    <p className="text-white">{item.adresse}</p>
                    <p className="text-white">
                      {item.city}, {item.country}
                    </p>
                    <p className="text-white">{item.compagny}</p>
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

      {showCursor && cursorLink && (
        <motion.a href={cursorLink} target="_blank" rel="noopener noreferrer">
          <motion.div
            className="cursor-circle"
            initial={{ scale: 0 }} // État initial
            animate={{ scale: 1 }} // État d'animation à l'apparition
            exit={{ scale: 0 }} // État d'animation à la disparition
            transition={{ duration: 0.3 }} // Durée de l'animation
            style={{
              position: "fixed",
              pointerEvents: "none",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent
              backdropFilter: "blur(8px)", // Ajout de l'effet blur
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "black",
              fontSize: "12px",
              textAlign: "center", // Centre le texte
              margin: 0,
            }}
          >
            See project
          </motion.div>
        </motion.a>
      )}
    </div>
  );
}

// CSS styles remain the same...

function Demi({ projects, index }) {
  // Vérifier si l'index est pair ou impair pour changer l'ordre des blocs
  const isEven = index % 2 === 0;

  return (
    <div className={`w-full flex ${isEven ? "" : "flex-row-reverse"}`}>
      {/* Bloc A - Image */}
      <div className="w-1/2 relative h-80">
        {projects.mainpic_url && (
          <Avatar
            url={projects.mainpic_url}
            width={270}
            height={196}
            className="rounded-sm"
            alt={projects.name || "Project Image"}
          />
        )}
      </div>

      {/* Bloc B - Texte */}
      <div className="w-1/2 flex flex-col bg-[#18191C] justify-center items-center">
        <p className="text-white colortext font-satisfy text-2xl font-extrabold">
          {projects.name || "Nom du projet non disponible"}
        </p>
        <p className="text-white">
          {projects.adresse || "Adresse non disponible"}
        </p>
        <p className="text-white">
          {projects.city
            ? `${projects.city}, ${projects.country}`
            : "Ville et pays non disponibles"}
        </p>
        <p className="text-white">
          {projects.compagny || "Compagnie non disponible"}
        </p>
        {projects.link && (
          <a
            href={projects.link}
            target="_blank"
            rel="noopener noreferrer"
            
          >
            <p className="colortext">
              Learn more about {projects.name || "ce projet"}
            </p>
          </a>
        )}
      </div>
    </div>
  );
}


function Para() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Image de fond fixée pour l'effet de parallaxe */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollPosition * 0.2}px)`, // Ajuste pour un mouvement plus fluide
          transition: 'none', // Aucune transition pour éviter le mouvement après l'arrêt du scroll
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
      <div className="relative z-20 flex flex-col items-start justify-end h-full text-black pb-32 pl-20">
    <h1 className="text-3xl text-left">
        FIND RESIDENTIAL <br /> BUILDING PROJECTS
    </h1>
    
    <p className="text-left text-sm pt-4 flex items-center">SCROLL TO EXPLORE <FaLongArrowAltDown /> </p>
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
