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
        <div id="ici">

        <Form />
        </div>
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
