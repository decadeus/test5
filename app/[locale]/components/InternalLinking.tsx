import Link from 'next/link';

interface InternalLinkingProps {
  currentPage: string;
  locale: string;
}

export default function InternalLinking({ currentPage, locale }: InternalLinkingProps) {
  // Liens internes stratégiques pour améliorer le PageRank interne
  const importantPages = [
    { url: `/${locale}`, title: "Accueil - Projets immobiliers", priority: "high" },
    { url: `/${locale}/Projet/List`, title: "Tous les projets", priority: "high" },
    { url: `/${locale}/blog`, title: "Blog immobilier", priority: "medium" },
    { url: `/${locale}/prix-m2`, title: "Prix au m² par pays", priority: "medium" },
    { url: `/${locale}/prix-m2/france`, title: "Prix immobilier France", priority: "medium" },
    { url: `/${locale}/prix-m2/pologne`, title: "Prix immobilier Pologne", priority: "medium" },
  ];

  // Articles de blog pour le maillage
  const blogArticles = [
    { url: `/${locale}/blog/5`, title: "S'installer en Pologne", priority: "medium" },
    { url: `/${locale}/blog/6`, title: "Système de santé NFZ", priority: "medium" },
    { url: `/${locale}/blog/7`, title: "Immatriculation voiture", priority: "medium" },
    { url: `/${locale}/blog/8`, title: "Créer une micro-entreprise", priority: "medium" },
  ];

  // Projets similaires pour le maillage interne
  const relatedProjects = [
    { url: `/${locale}/Projet/Detail/193`, title: "Projet similaire - Découvrir", priority: "medium" },
    { url: `/${locale}/Projet/Detail/192`, title: "Autre opportunité immobilière", priority: "medium" },
  ];

  // Filtrer pour éviter le lien vers la page actuelle
  const relevantLinks = [...importantPages, ...blogArticles, ...relatedProjects]
    .filter(link => link.url !== currentPage)
    .slice(0, 8); // Augmenter à 8 liens pour plus de maillage

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📖 Articles et pages recommandés
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {relevantLinks.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-center">
              <span className="text-blue-600 mr-2 group-hover:text-blue-700">→</span>
              <span className="text-gray-800 group-hover:text-blue-700 text-sm font-medium">
                {link.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Liens internes pour améliorer la navigation et le référencement
      </p>
    </div>
  );
}
