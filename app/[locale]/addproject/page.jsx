"use client";

import { FaArrowRight } from "react-icons/fa";
import Form from "./form";
import { useMemo, useState, useRef, useEffect } from "react";


const images = {
  step_1: "/secure.png",
  step_2: "/secure.png",
  step_3: "/secure.png",
  step_4: "/secure.png",
};

export default function MainPage() {

  const [selected, setSelected] = useState("step_1");
  const [fade, setFade] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const refs = {
    step_1: useRef(null),
    step_2: useRef(null),
    step_3: useRef(null),
    step_4: useRef(null),
  };

  useEffect(() => {
    const el = refs[selected].current;
    if (el) {
      setIndicatorStyle({
        width: `${el.offsetWidth}px`,
        left: `${el.offsetLeft}px`,
      });
    }
  }, [selected]);

  const tabColors = {
    step_1: "#FF0066",
    step_2: "#FF4500",
    step_3: "#0066FF",
    step_4: "#B060FF",
  };

  const tabRGB = {
    step_1: "255, 0, 102",
    step_2: "255, 69, 0",
    step_3: "0, 102, 255",
    step_4: "255, 52, 255",
  };

  const tabClass = (tab) => {
    const base =
      "relative z-10 px-4 text-center py-2 text-base font-bold rounded-full transition-all duration-300 ease-in-out transform";
    const selectedTab = selected === tab;
    return `${base} ${
      selectedTab
        ? `text-white bg-[${tabColors[tab]}]  scale-105`
        : "bg-white text-gray-500  hover:text-black scale-100"
    }`;
  };

  const handleTabClick = (tab) => {
    if (tab !== selected) {
      setFade(false);
      setTimeout(() => {
        setSelected(tab);
        setFade(true);
      }, 150);
    }
  };

  const containerStyle =
    "flex flex-col items-center w-full px-32 pt-32 pb-32 px-4";
  const headerStyle = "text-4xl font-bold text-black text-center mb-8";
  const subheaderStyle =
    "text-lg text-black mb-8 font-montserrat mb-32 text-center";

  const stepContainerStyle = useMemo(
    () => [
      {
        step: "Step",
        title: "Fill out the form",
        para: "Start by providing the basic information about your real estate project and your professional email address. This helps us verify that you are associated with the project.",
        nb: 1,
      },
      {
        step: "Step",
        title: "Information verification",
        para: "Our team will validate the information you provided to ensure the quality of our platform and prevent abuse. This step is crucial to guarantee a reliable and secure experience.",
        nb: 2,
      },
      {
        step: "Step",
        title: "Secure access to your account",
        para: "Once your information is validated, you will receive an email with a secure link (magic link) to easily log into your account, without needing to remember a password.",
        nb: 3,
      },
      {
        step: "Step",
        title: "Add project details",
        para: "You can now enter the full details of your project: description, photos, services included in the building, and more. You can put your project online at any time.",
        nb: 4,
      },
    ],
    []
  );

  const scrollToSection = () => {
    const section = document.getElementById("formulaire");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="flex flex-col items-center gap-12 p-12 min-h-screen mt-[100px] w-full">
       <h1 className="text-7xl font-light text-center mb-6">
        Bienvenue sur la page des animaux
      </h1>
      <p className="max-w-2xl text-center text-gray-600 text-xl leading-relaxed">
        Cette page est dédiée à la découverte de quelques-uns de nos compagnons
        les plus fidèles et fascinants. Que ce soit le step_1, symbole
        d'indépendance et de mystère ; le step_2, loyal et protecteur ; ou le
        step_3, majestueux et libre — chacun de ces animaux occupe une place
        unique dans notre vie et notre imaginaire. Faites votre choix ci-dessous
        pour en apprendre davantage.
      </p>
      <div className="rounded-3xl border-[25px] border-black bg-black">
      <div
        className={` bg-black h-fit flex items-center justify-center transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src={images[selected]}
          alt={selected}
          className="w-[800px] h-[600px] object-cover rounded-2xl"
        />
      </div>
      </div>

      <div
        className="rounded-full"
        style={{
          boxShadow: `0 0 42px 4px rgba(${tabRGB[selected]}, 0.3)`,
          transition: "box-shadow 400ms ease, background-color 400ms ease",
        }}
      >
        <div className="relative w-fit max-w-md ">
          <div className="relative flex gap-2 justify-center bg-white rounded-full py-3 px-4 border border-transparent transition-colors duration-500 ease-in-out">
            <div
              className="absolute top-2 bottom-2 rounded-full transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: `rgba(${tabRGB[selected]})`,
                transition:
                  "background-color 200ms ease, left 300ms ease, width 300ms ease",
                ...indicatorStyle,
              }}
            />
            <button
              ref={refs.step_1}
              onClick={() => handleTabClick("step_1")}
              className={tabClass("step_1")}
            >
              Step 1
            </button>
            <button
              ref={refs.step_2}
              onClick={() => handleTabClick("step_2")}
              className={tabClass("step_2")}
            >
              Step 2
            </button>
            <button
              ref={refs.step_3}
              onClick={() => handleTabClick("step_3")}
              className={tabClass("step_3")}
            >
              Step 3
            </button>
            <button
              ref={refs.step_4}
              onClick={() => handleTabClick("step_4")}
              className={tabClass("step_4")}
            >
              Step 4
            </button>
          </div>
        </div>
      </div>
   
    
      {/* Real Estate Project Information Section */}
      <div className="w-full flex flex-col justify-center my-8 bg-white p-8">
        <h2 className="text-3xl font-medium text-center mb-6">
          Real Estate Project Information
        </h2>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center">
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <p className="px-4 text-xl text-center">
              To facilitate the search for buyers, provide the essential information about your project. Add photos, details about the services included in the building, and more. Once this information is complete, you can go live with your project.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow-2xl mt-8 lg:mt-0 w-full lg:w-1/2">
            <img
              src="/Tab5.png"
              alt="Real estate project example"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Update Apartment List Section */}
      <div className="w-full flex flex-col bg-white p-8">
        <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
          <h2 className="text-3xl font-medium text-center">
            Update the list of apartments for sale
          </h2>
          <p className="text-xl text-center">
            At any time, you can modify the information for each apartment. If you have a large number of properties, use the search filters and sorting options to make inventory management easier.
          </p>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="bg-gray-900 rounded-xl shadow-2xl mt-8 p-4 w-full lg:w-fit flex justify-center items-center ">
            <img
              src="/Tab6.png"
              alt="Apartment management"
              className="w-[1100px] h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Project Addition Form */}
      <div id="formulaire" className="mt-4 w-full flex justify-center">
        <Form />
      </div>
    </main>
  );
}
