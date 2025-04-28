"use client";

import { useState } from "react";
import Form from "./form";

const steps = [
  {
    title: "1. Remplir le formulaire",
    icon: "📤",
    text: "Remplissez en 2 minutes le formulaire de demande pour référencer votre projet : nom, ville, coordonnées.",
  },
  {
    title: "2. Validation & Magic Link",
    icon: "✅",
    text: "Nous vérifions la conformité (24 h max). Si tout est OK, vous recevez par e‑mail un lien de connexion sécurisé (Magic Login). Aucun mot de passe à retenir !",
  },
  {
    title: "3. Créez votre fiche projet",
    icon: "📝",
    text: "Connecté ? Complétez la fiche : description, visuels, lots disponibles, prix… Tout apparaît instantanément dans le moteur de recherche.",
  },
];

export default function PromoGuidePage() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % steps.length);
  const prev = () => setIndex((i) => (i - 1 + steps.length) % steps.length);
  const { title, text, icon } = steps[index];

  return (
    <main className="min-h-screen w-full bg-gray-100 text-gray-900 flex flex-col items-center pt-28 pb-28 px-24">
      {/* SLIDER */}
      <section className="w-full flex flex-col items-center gap-6 p-6 shadow-sm">
        {/* Carte hauteur fixe & répartition 1/4 – 1/4 – 1/2 */}
        <div className="w-full max-w-xl rounded-xl   bg-white shadow-lg flex flex-col gap-4 py-6">
          {/* 1/4 : icône */}
          <div className="flex-none  flex items-center justify-center">
            <span className="text-5xl">{icon}</span>
          </div>
          {/* 1/4 : titre – reste toujours à la même position */}
          <div className="flex-none flex items-center justify-center px-4 text-center">
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
          </div>
          {/* 1/2 : texte */}
          <div className="flex-grow flex items-center justify-center px-6 text-center">
            <p className="text-base leading-relaxed">{text}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="rounded-full border border-gray-300 p-2 hover:bg-gray-200 text-xl"
            onClick={prev}
            aria-label="Précédent"
          >
            ‹
          </button>
          <span className="text-sm text-gray-600">
            {index + 1} / {steps.length}
          </span>
          <button
            className="rounded-full border border-gray-300 p-2 hover:bg-gray-200 text-xl"
            onClick={next}
            aria-label="Suivant"
          >
            ›
          </button>
        </div>
      </section>
      {/* IMAGE + PARAGRAPH 1 : Formulaire projet */}
      <section className="w-full flex flex-col md:flex-row items-center gap-8 p-8">
        <img
          src="/Tab5.png"
          alt="Real estate project example"
          className="w-1/2 h-full object-cover rounded-lg"
        />

        <p className="w-full md:w-1/2 text-lg leading-relaxed">
          <strong>Imaginez&nbsp;:</strong>&nbsp;en quelques secondes, vous
          dévoilez l’âme de votre programme&nbsp;: de l’adresse au moindre
          service premium. Renseignez les infos clés, ajoutez vos atouts
          (piscine, vidéosurveillance, accès PMR…) et, d’un simple clic, mettez
          votre projet en ligne quand <em>vous</em> êtes prêt. Votre vision
          prend vie&nbsp;!
        </p>
      </section>

      {/* IMAGE + PARAGRAPH 2 : Tableau des appartements */}
      <section className="w-full  flex flex-col md:flex-row-reverse items-center gap-8 p-8 ">
        <img
          src="/Tab6.png"
          alt="Real estate project example"
          className="w-1/2 h-full object-cover rounded-lg"
        />
        <p className="w-full md:w-1/2 text-lg leading-relaxed">
          <strong>
            Prêt&nbsp;à matcher chaque acquéreur avec son futur chez‑soi&nbsp;?
          </strong>
          &nbsp;Pilotez vos lots dans un tableau ultra‑fluide : référence,
          surface, prix, nombre de chambres… Un clic pour masquer un tarif,
          ajouter un jardin ou signaler une promo flash. <em>Edit</em>,{" "}
          <em>Delete</em>, terminé : vos données sont toujours lumineuses, vos
          ventes accélèrent.
        </p>
      </section>

      <Form />
    </main>
  );
}
