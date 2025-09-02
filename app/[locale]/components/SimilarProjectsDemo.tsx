"use client";
import SimilarProjects from './SimilarProjects';

// Composant de démonstration avec des données factices
export default function SimilarProjectsDemo() {
  const demoProject = {
    id: 194,
    name: "Attique",
    city: "Wittelsheim",
    country: "France",
    qty: 7,
    des_fr: "Vivez l'harmonie à Wittelsheim avec la résidence Attique. Des logements modernes, espaces verts, stationnement et sécurité pour un quotidien serein.",
    des_en: "Live in harmony in Wittelsheim with the Attique residence. Modern homes, green spaces, parking and security for a peaceful daily life.",
    mainpic_url: "/appart.webp",
    cur: "EUR"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">🎯 Démonstration du composant SimilarProjects</h2>
        <p className="text-gray-700 mb-4">
          Ce composant affiche 3 projets similaires au projet actuel, basé sur une logique de recommandation intelligente :
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li><strong>Même ville</strong> : Priorité absolue (+50 points)</li>
          <li><strong>Même pays</strong> : Marché similaire (+30 points)</li>
          <li><strong>Taille similaire</strong> : Même segment (+20 points)</li>
          <li><strong>Projets récents</strong> : Actualité (+10 points)</li>
        </ul>
      </div>

      <SimilarProjects 
        currentProject={demoProject} 
        locale="fr" 
      />
    </div>
  );
}
