"use client";

import { FaArrowRight } from "react-icons/fa";
import Form from "./form";
import { useMemo } from "react";

export default function MainPage() {
  const containerStyle =
    "flex flex-col items-center  w-full px-32 pt-32 pb-32 px-4";
  const headerStyle = "text-4xl font-bold text-black text-center mb-8";
  const subheaderStyle =
    "text-lg text-black mb-8 font-montserrat mb-32 text-center";

  const stepContainerStyle = useMemo(
    () => [
      {
        step: "Step",
        title: "Remplir le formulaire",
        para: "Dans un premier temps, donnez les informations basiques du projet et votre email. Afin de s'assurer que vous travaillez pour le projet, nous acceptons que les emails professionnels contiennent le nom de la compagnie.",
        nb: 1,
      },
      {
        step: "Step",
        title: "Verification des informations",
        para: "Comme il s'agit d'une web app gratuite et afin d'éviter les spams, nous vérifions les informations que vous nous avez fournies dans le formulaire.",
        nb: 2,
      },
      {
        step: "Step",
        title: "Obtenez un lien pour accéder à votre compte",
        para: "Vous recevrez un email contenant un lien sécurisé pour accéder à votre compte. Nous utilisons le système de 'magic link' qui permet de se connecter sans mot de passe.",
        nb: 3,
      },
      {
        step: "Step",
        title: "Remplir les informations du projet",
        para: "Vos informations sont modifiables à tout moment. Avec un simple bouton, passez de 'offline' à 'online' quand vous êtes prêt à afficher votre projet.",
        nb: 4,
      },
    ],
    []
  ); // Only recalculate if `language` changes

  const scrollToSection = () => {
    const section = document.getElementById("ici");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={containerStyle}>
      <h1 className={headerStyle}>
        Avec Hoomge, c'est facile de rajouter un projet immobilier gratuitement
      </h1>
      <p className={subheaderStyle}>
        "Grâce aux nombreux référencements de projets immobiliers, trouvez le
        bien qui vous correspond en utilisant les filtres de recherche selon
        l'appartement et les services dans l'immeuble."
      </p>

      {/* Conteneur Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 grid-rows-1 gap-2 w-full ">
        {stepContainerStyle.map(({ step, title, para, nb }, index) => (
          <div
            key={index}
            className="relative text-white bg-gray-800 p-6 rounded-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out group mx-4 h-fit"
          >
            {/* Parent Grid Container */}
            <div className="flex flex-col h-fit">
              {/* Bloc 1 : Step */}
              <div className="flex items-start pb-4 ">
                <p className="text-sm lg:text-lg pt-4">
                  {step} {nb}
                </p>
              </div>

              {/* Bloc 2 : Title */}
              <div className="flex items-start pb-4 ">
                <h2 className="text-2xl font-semibold ">{title}</h2>
              </div>

              {/* Bloc 3 : Para */}
              <div className="flex items-start">
                <p className="text-base">{para}</p>
              </div>

              {/* Bouton pour scroll */}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col justify-center  my-8 bg-gray-100 p-8">
        <h2 className="text-3xl font-medium w-full  text-center">
         Informations sur le projet immobilier
        </h2>
        <div className="w-full flex">
          <div className="w-1/2 flex justify-center items-center">
            <p className="px-4 text-xl">
              Afin de faciliter les recherches des appartements des futurs acquéreurs, fournissez les informations de base du projet. Vous pouvez ajouter une photo, les infomations generales, les services inclus dans l'immeuble. Une fois ces informations remplis, vous pouvez mettre votre projet en ligne sur le site et commencer à ajouter les appartements et mettre à jour à tout instant.
            </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl shadow-2xl mt-12 w-1/2">
            <img
              src="/Tab3.png"
              alt="Tab2"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col bg-gray-100 p-8">
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <h2 className="text-3xl font-medium">
            Mettre à jour la liste des appartements à la vente
          </h2>
          <p>
            A tout moment, pour pouvez modifier les informations pour chaque
            appartement. Si un grand nombre de biens, nous avons inclus un
            filtre de recherche et un trie par colonne.
          </p>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="bg-gray-900 rounded-xl shadow-2xl mt-12 p-4 w-fit flex justify-center items-center ">
            <img
              src="/Tab4.png"
              alt="Tab2"
              className="w-[1100px] h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div id="ici" className="mt-4">
        {/* Inclure le formulaire */}
        <Form />
      </div>
    </div>
  );
}
