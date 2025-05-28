import React from "react";
import DualLayerFadeSection from "./DualLayerFadeSection";

const BouncingShapesSection = ({
  title = "Titre principal",
  subtitle = "Sous-titre",
  width = "100%",
  height = "90vh",
  locale = "fr"
}) => (
  <section className="bouncing-section flex flex-col lg:flex-row" style={{ width, height }}>
    {/* Grandes formes animées en background */}
    <div className="shape shape1" />
    <div className="shape shape2" />

    {/* Texte centré avec cartes animées */}
    <div className="w-full lg:w-1/3 flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="flex items-start flex-col">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-gray-700 font-bold flex flex-col">
          <span>Rejoignez</span>
          <span>Hoomge</span>
        </h2>
        <p className="text-sm sm:text-base md:text-lg pt-4 sm:pt-6 md:pt-8">En moyenne, il suffit de 20 minutes pour ajouter votre projet</p>
        <button className="bg-[#FF0066] text-white rounded-full px-4 py-2 mt-4 flex items-center justify-center">
          <a
            href={`https://hoomge.com/${locale}/addproject`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base md:text-lg font-bold w-full h-full text-center"
          >
            En savoir plus
          </a>
        </button>
      </div>
    </div>

    <div className="fade-container w-full lg:w-2/3 px-4 sm:px-6">
      <DualLayerFadeSection />
    </div>

    <style jsx>{`
      .bouncing-section {
        background: #fff;
        position: relative;
        overflow: hidden;
      }
      .shape {
        position: absolute;
        opacity: 0.8;
        border-radius: 50%;
        mix-blend-mode: multiply;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
      .shape1 {
        width: 65vw;
        height: 60vw;
        background-color: #979899;
        top: 0;
        right: 0;
        clip-path: ellipse(46% 22% at 50% 50%);
        animation: bounce1 24s infinite;
      }
      .shape2 {
        width: 45vw;
        height: 45vw;
        background-color: #e8e9eb;
        top: 0;
        right: 0;
        clip-path: ellipse(30% 60% at 50% 50%);
        animation: bounce2 36s infinite;
      }
      .shape3 {
        width: 22vw;
        height: 12vw;
        background-color: #000000;
        bottom: 0;
        left: 0;
        clip-path: ellipse(40% 70% at 50% 50%);
        animation: bounce3 32s infinite;
      }
      .fade-container {
        position: relative;
        z-index: 5;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 3rem;
      }
      @keyframes bounce1 {
        0% {
          transform: translate(0, 0%) rotate(0deg);
        }
        20% {
          transform: translate(20%, 40%) rotate(30deg);
        }
        50% {
          transform: translate(40%, 20%) rotate(60deg);
        }
        80% {
          transform: translate(20%, 60%) rotate(90deg);
        }
        100% {
          transform: translate(0, 0%) rotate(0deg);
        }
      }
      @keyframes bounce2 {
        0% {
          transform: translate(0, 0) rotate(0deg);
        }
        20% {
          transform: translate(-40%, 0) rotate(30deg);
        }
        50% {
          transform: translate(-40%, 40%) rotate(60deg);
        }
        80% {
          transform: translate(0, 40%) rotate(90deg);
        }
        100% {
          transform: translate(0, 0) rotate(0deg);
        }
      }
      @keyframes bounce3 {
        0% {
          transform: translate(200%, -150%) rotate(0deg);
        }
        20% {
          transform: translate(300%, -260%) rotate(30deg);
        }
        50% {
          transform: translate(250%, -140%) rotate(60deg);
        }
        80% {
          transform: translate(320%, -100%) rotate(90deg);
        }
        100% {
          transform: translate(150%, -200%) rotate(120deg);
        }
      }
    `}</style>
  </section>
);

export default BouncingShapesSection;
