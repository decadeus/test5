"use client";

import { FaArrowRight } from "react-icons/fa";
import Form from "./form";
import { useMemo } from "react";

export default function MainPage() {
  const containerStyle =
    "flex flex-col items-center w-full px-32 pt-32 pb-32 px-4";
  const headerStyle = "text-4xl font-bold text-black text-center mb-8";
  const subheaderStyle =
    "text-lg text-black mb-8 font-montserrat mb-32 text-center";

  const stepContainerStyle = useMemo(
    () => [
      {
        step: "Étape",
        title: "Compléter le formulaire",
        para: "Commencez par fournir les informations essentielles sur votre projet immobilier, ainsi que votre adresse email professionnelle. Cela nous permet de vérifier que vous êtes bien associé au projet.",
        nb: 1,
      },
      {
        step: "Étape",
        title: "Vérification des informations",
        para: "Nos équipes valideront les informations que vous avez fournies pour garantir la qualité de notre plateforme et éviter tout abus. Cette étape est cruciale pour assurer une expérience fiable et sécurisée.",
        nb: 2,
      },
      {
        step: "Étape",
        title: "Accès sécurisé à votre compte",
        para: "Une fois vos informations validées, vous recevrez un email avec un lien sécurisé (magic link) pour vous connecter facilement à votre compte, sans avoir à retenir de mot de passe.",
        nb: 3,
      },
      {
        step: "Étape",
        title: "Ajouter les informations du projet",
        para: "Vous pouvez maintenant entrer les détails complets de votre projet : description, photos, services inclus dans l'immeuble, et plus encore. Vous pouvez mettre votre projet en ligne à tout moment.",
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
    <div className={containerStyle}>
      <h1 className={headerStyle}>
        Avec Hoomge, ajoutez facilement et gratuitement votre projet immobilier
      </h1>
      <p className={subheaderStyle}>
        Rejoignez les nombreux projets immobiliers déjà référencés sur Hoomge. Grâce à nos outils intuitifs, vous pouvez facilement trouver des acheteurs en offrant une expérience de recherche optimisée. Les visiteurs pourront filtrer les appartements selon leurs critères : surface, nombre de chambres, services, et bien plus encore.
      </p>

      {/* Conteneur des étapes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-1 gap-8 w-full mb-16">
        {stepContainerStyle.map(({ step, title, para, nb }, index) => (
          <div
            key={index}
            className="relative text-white bg-gray-800 p-6 rounded-xl flex flex-col justify-between h-full group mx-4"
          >
            <div className="flex flex-col h-full justify-between">
              {/* Bloc Étape */}
              <div className="flex items-start pb-4">
                <p className="text-sm lg:text-lg pt-4">
                  {step} {nb}
                </p>
              </div>

              {/* Bloc Titre */}
              <div className="flex items-start pb-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
              </div>

              {/* Bloc Description */}
              <div className="flex items-start flex-grow">
                <p className="text-base">{para}</p>
              </div>

              {/* Bouton d'appel à l'action */}
              <div className="flex justify-center mt-6 mb-4">
                <button
                  onClick={scrollToSection}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Commencer à ajouter votre projet
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Informations sur le projet immobilier */}
      <div className="w-full flex flex-col justify-center my-8 bg-gray-100 p-8">
        <h2 className="text-3xl font-medium text-center mb-6">
          Informations sur le projet immobilier
        </h2>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center">
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <p className="px-4 text-xl text-center">
              Afin de faciliter les recherches des acheteurs, renseignez les informations essentielles de votre projet. Ajoutez des photos, des détails sur les services inclus dans l'immeuble et plus encore. Une fois ces informations complètes, vous pourrez mettre votre projet en ligne.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow-2xl mt-8 lg:mt-0 w-full lg:w-1/2">
            <img
              src="/Tab3.png"
              alt="Exemple de projet immobilier"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Section Mettre à jour la liste des appartements */}
      <div className="w-full flex flex-col bg-gray-100 p-8">
        <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
          <h2 className="text-3xl font-medium text-center">
            Mettre à jour la liste des appartements à la vente
          </h2>
          <p className="text-xl text-center">
            À tout moment, vous pouvez modifier les informations de chaque appartement. Si vous avez un grand nombre de biens, utilisez les filtres de recherche et les options de tri pour faciliter la gestion de votre inventaire.
          </p>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="bg-gray-900 rounded-xl shadow-2xl mt-8 p-4 w-full lg:w-fit flex justify-center items-center ">
            <img
              src="/Tab4.png"
              alt="Gestion des appartements"
              className="w-[1100px] h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout de projet */}
      <div id="formulaire" className="mt-4 w-full flex justify-center">
        <Form />
      </div>
    </div>
  );
}
