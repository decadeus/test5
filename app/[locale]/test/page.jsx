// app/page.jsx
"use client";

import { useState, useRef, useEffect } from "react";

const images = {
  chat: "/secure.png",
  chien: "/secure.png",
  cheval: "/secure.png",
};

export default function HomePage() {
  const [selected, setSelected] = useState("chat");
  const [fade, setFade] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  const refs = {
    chat: useRef(null),
    chien: useRef(null),
    cheval: useRef(null),
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
    chat: "#FF0066",
    chien: "#FF4500",
    cheval: "#0066FF",
  };

  const tabRGB = {
    chat: "255, 0, 102",
    chien: "255, 69, 0",
    cheval: "0, 102, 255",
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

  return (
    <main className="flex flex-col items-center gap-12 p-12 min-h-screen mt-[100px] w-full">
      <h1 className="text-7xl font-light text-center mb-6">
        Bienvenue sur la page des animaux
      </h1>
      <p className="max-w-2xl text-center text-gray-600 text-xl leading-relaxed">
        Cette page est dédiée à la découverte de quelques-uns de nos compagnons
        les plus fidèles et fascinants. Que ce soit le chat, symbole
        d'indépendance et de mystère ; le chien, loyal et protecteur ; ou le
        cheval, majestueux et libre — chacun de ces animaux occupe une place
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
              ref={refs.chat}
              onClick={() => handleTabClick("chat")}
              className={tabClass("chat")}
            >
              Chat
            </button>
            <button
              ref={refs.chien}
              onClick={() => handleTabClick("chien")}
              className={tabClass("chien")}
            >
              Chien
            </button>
            <button
              ref={refs.cheval}
              onClick={() => handleTabClick("cheval")}
              className={tabClass("cheval")}
            >
              Cheval
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
