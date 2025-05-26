// app/page.jsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function IAGENERALE({ nomProjet, ville }) {
  const [types, setTypes] = useState("");
  const [atouts, setAtouts] = useState("");
  const [style, setStyle] = useState("");
  const [publicCible, setPublicCible] = useState("");
  const [langue, setLangue] = useState("fr");
  const [resultat, setResultat] = useState("");
  const [chargement, setChargement] = useState(false);
  const f = useTranslations("Projet");

  const handleGenerate = async () => {
    setChargement(true);

    const response = await fetch("/api/generateGenerale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomProjet, ville, types, atouts, style, publicCible, langue }),
    });

    const data = await response.json();
    setResultat(data.text);
    setChargement(false);
  };

  const handleCopy = async () => {
    if (resultat) {
      try {
        await navigator.clipboard.writeText(resultat);
        alert("Texte copié dans le presse-papiers !");
      } catch (err) {
        console.error("Erreur de copie :", err);
      }
    }
  };

  return (
    <main className="flex flex-col items-center gap-6 p-8 min-h-screen w-full">
      <h1 className="text-4xl font-light text-center">Générateur de présentation générale d’un projet immobilier</h1>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {/* Removed nomProjet and ville input fields */}
        <input className="border p-2 rounded" placeholder="Type d'appartements (T1 à T5, etc.)" value={types} onChange={(e) => setTypes(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Atouts (piscine, jardin, etc.)" value={atouts} onChange={(e) => setAtouts(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Style architectural (moderne, classique...)" value={style} onChange={(e) => setStyle(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Public cible (familles, investisseurs...)" value={publicCible} onChange={(e) => setPublicCible(e.target.value)} />

        <select className="border p-2 rounded" value={langue} onChange={(e) => setLangue(e.target.value)}>
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="pl">Polonais</option>
        </select>

        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white rounded p-3 hover:bg-blue-700 transition"
          disabled={chargement}
        >
          {chargement ? "Génération en cours..." : "Générer la description"}
        </button>

        {resultat && (
          <div className="bg-gray-100 p-4 rounded border mt-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Description générée :</h2>
            <p className="text-gray-700 whitespace-pre-line">{resultat}</p>
            <button
              onClick={handleCopy}
              className="bg-green-600 text-white rounded p-2 hover:bg-green-700 transition self-start"
            >
              Copier le texte
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
