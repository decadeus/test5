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
import * as ScrollArea from '@radix-ui/react-scroll-area';


export default function Page() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerStyle =
    "flex flex-col items-center bgfull w-full px-64 pt-32 pb-32";
  const headerStyle =
    "text-6xl font-bold text-black mb-8 font-montserrat text-center shadowI bg-transparent";
  const subheaderStyle = "text-lg text-black mb-8 font-montserrat mb-32";

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("project")
      .select("*")
      .eq("beau", true);

    if (error) {
      setError(error);
    } else {
      setProjects(data); // Store data in state
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
        span.className = "letter"; // Classe pour le style
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transition = "opacity 0.3s ease";
        span.textContent = char === " " ? "\u00A0" : char; // Gérer les espaces
        container.appendChild(span);
      }

      // Ajouter le texte stylisé
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
              letter.style.opacity = "1"; // Afficher avec une transition
            }, index * 100); // Délai pour chaque lettre
          });
          window.removeEventListener("scroll", revealLetters); // Retirer l'écouteur après l'affichage
        }
      };

      window.addEventListener("scroll", revealLetters);
    };

    // Appeler pour le premier titre
    revealText("building-text", "Fill information about ", "the building");

    // Appeler pour le second titre
    revealText(
      "second-title-text",
      "Discover amazing features of ",
      "this project"
    );

    // Appeler pour le troisième titre
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
                <FaHeart className="text-black  animate-spin-pause" />
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
      <div className="w-full flex justify-center">
        <h1>Scroll</h1>
        <Scroll projects={projects} />
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
      <div className="flex gap-4 mb-12">
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
        <div key={item.id} className="bg-black flex justify-between h-80 w-full items-center">
          {/* Bloc 1: 3/12 */}
          <div className="w-3/12">
            <h3 className="text-gray-300 text-3xl pl-8">{item.compagny}</h3>
          </div>

          {/* Bloc 2: 6/12 */}
          <div className="relative h-72 w-6/12 flex flex-col text-center items-center">
            <div>
              <p className="text-white pr-12 flex text-center text-5xl pb-4">
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
  return (
    <div className="flex justify-center mb-8 w-full overflow-x-auto ">
      <ScrollArea.Root className="ScrollAreaRoot" type="always">
      <ScrollArea.Viewport className=" w-full">
          <div className="flex gap-4 mb-4 px-8">
            {projects.map((item) => (
              <div
                key={item.id} // Assurez-vous d'utiliser une clé unique
                className="flex flex-col w-[300px] gap-4 mt-4 shadow-lg p-4 rounded-sm bg-black transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-950"
>

                <div className="w-full relative h-64">
                  <Avatar
                    url={item.mainpic_url}
                    width={270}
                    height={196}
                    className="rounded-sm"
                    alt={item.name} // Ajoutez du texte alternatif pour l'accessibilité
                  />
                </div>
                <div className="-mt-8 z-40">
                  <p className="text-white colortext font-satisfy text-xl font-extrabold ">
                    {item.name}
                  </p>
                 
                  <p className="text-white ">{item.adresse}</p>
                  <p className="text-white">{item.city} , {item.country}</p>
                  <p className="text-white">{item.compagny}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal" >
          <ScrollArea.Thumb className="ScrollAreaThumb" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="ScrollAreaCorner" />
      </ScrollArea.Root>
    </div>
  );
}

// CSS styles remain the same...

