"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Homepage() {
  const steps = [
    { text: "Étape 1", color: "#dc2626" }, // rouge
    { text: "Étape 2", color: "#eab308" }, // jaune
    { text: "Étape 3", color: "#2563eb" }  // bleu
  ];
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prevIndex) => (prevIndex + 1) % steps.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
 
      <section className="bg-gray-50 w-full h-screen pt-24 flex flex-col items-center justify-center">
        <div className="text-center text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          <div>Découvrez les dernières</div>
          <div className="flex justify-center items-center flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              mises à jour
            </span>
            <span>de hoomge</span>
          </div>
        </div>
        
         
        <div className="mt-16 flex flex-col items-center z-10">
          <p className="mb-2 text-gray-800 text-xl font-semibold">Ligne de temps</p>
          <div className="flex gap-4">
            <div className="h-2 w-[200px] rounded-full overflow-hidden relative animate-fillup-width bg-green-600" />
            <div className="h-2 w-[200px] rounded-full overflow-hidden relative animate-fillup-width-delayed bg-green-600" />
            <div className="h-2 w-[200px] rounded-full overflow-hidden relative animate-fillup-third bg-green-600" />
          </div>
        </div>
        <div
          className="mt-12 w-[400px] h-[400px] rounded-xl flex items-center justify-center text-white font-bold text-2xl transition-all duration-500"
          style={{ backgroundColor: steps[stepIndex].color }}
        >
          {steps[stepIndex].text}
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Texte à gauche */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-green-700 mb-6">
              Mettez en valeur vos projets facilement
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Créez une fiche par résidence en quelques clics. Faites découvrir
              vos programmes neufs aux visiteurs sans passer par un développeur ou
              une agence. Partagez une page claire et à jour avec votre équipe.
            </p>

            <h2 className="text-3xl font-bold text-green-700 mb-6">
              Une interface claire pour vos commerciaux
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Ajoutez vos collaborateurs et gérez qui peut accéder à quels
              projets. L'information est toujours à jour, où qu'ils soient.
              Bientôt : envoi automatique d'e-mails aux prospects.
            </p>

            <h2 className="text-3xl font-bold text-green-700 mb-6">
              Vos projets visibles, sans interférence
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Vos résidences s'affichent simplement. Pas de publicités, pas de
              détours. Chaque projet est mis en valeur : localisation, visuels,
              équipements, informations détaillées.
            </p>

            <h2 className="text-3xl font-bold text-green-700 mb-6">
              Une solution pensée pour les promoteurs indépendants
            </h2>
            <p className="text-gray-700 text-lg mb-10">
              Pas besoin de CRM lourd ou d'outils marketing complexes. hoomge est
              léger, rapide, et orienté projet. Vous restez autonome, tout en
              gagnant en visibilité.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link href="/register">
                <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold">
                  Créer un compte promoteur
                </button>
              </Link>
              <Link href="/fr/DesignTest/Detail/1">
                <button className="bg-gray-200 hover:bg-gray-300 text-green-700 px-6 py-3 rounded-lg font-semibold">
                  Voir un exemple de fiche projet
                </button>
              </Link>
            </div>
          </div>

          {/* Image à droite */}
          <div className="lg:w-40 w-40">
            <img
              src="/iphone_search.png"
              alt="Aperçu mobile"
              className="w-full max-w-md mx-auto drop-shadow-xl rounded-3xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
