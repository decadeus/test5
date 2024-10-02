"use client";

import { texts } from "@/lib/language";
import React, { useMemo } from "react";
import Form from "./form";
import { FaArrowRight } from "react-icons/fa";

export default function MainPage() {
  
  const containerStyle = "flex flex-col items-center bgfull w-full pt-32 pb-32";
  const headerStyle =
    "text-6xl font-bold text-black mb-8 font-montserrat text-center shadowI bg-transparent";
  const subheaderStyle = "text-lg text-black mb-8 font-montserrat mb-32";

  // Use useMemo to compute stepContainerStyle only when language changes
  const stepContainerStyle = useMemo(() => [
    {
      step: "Etape",
      title: "Ils viennent de rejoindre Hoomge",
      para: "Grâce aux nombreux référencements de projets immobiliers, trouvez le bien qui vous correspond en utilisant les filtres de recherche selon l'appartement et les services dans l'immeuble.",
      nb: 1,
    },
    {
      step: "Etape",
      title: "Ils viennent de rejoindre Hoomge",
      para: "Grâce aux nombreux référencements de projets immobiliers, trouvez le bien qui vous correspond en utilisant les filtres de recherche selon l'appartement et les services dans l'immeuble.",
      nb: 2,
    },
    {
      step: "Ils viennent de rejoindre Hoomge",
      title: "Ils viennent de rejoindre Hoomge",
      para: "Grâce aux nombreux référencements de projets immobiliers, trouvez le bien qui vous correspond en utilisant les filtres de recherche selon l'appartement et les services dans l'immeuble.",
      nb: 3,
    },
    {
      step: "Ils viennent de rejoindre Hoomge",
      title: "Ils viennent de rejoindre Hoomge",
      para: "Grâce aux nombreux référencements de projets immobiliers, trouvez le bien qui vous correspond en utilisant les filtres de recherche selon l'appartement et les services dans l'immeuble.",
      nb: 4,
    },
  ], []); // Only recalculate if `language` changes

  const scrollToSection = () => {
    const section = document.getElementById("ici");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={containerStyle}>
      <h1 className={headerStyle}>Voir tous les projects</h1>
      <p className={subheaderStyle}>"Grâce aux nombreux référencements de projets immobiliers, trouvez le bien qui vous correspond en utilisant les filtres de recherche selon l'appartement et les services dans l'immeuble."</p>

      <div className="flex gap-4 mb-12 w-full">
        {stepContainerStyle.map(({ step, title, para, nb }, index) => (
          <div
            key={step}
            className="relative text-white bg-gray-800 hover:bg-black p-4 rounded-bl-2xl rounded-tl-2xl rounded-br-2xl hover:-translate-y-4 transition-transform duration-300 ease-in-out group"
          >
            <p className="colortext mt-24">{step} {nb}</p>
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

      {/* Include the form component if needed */}
      <div id="ici">
        <Form />
      </div>
    </div>
  );
}
