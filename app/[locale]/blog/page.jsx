"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import "./article-styles.css";

// Articles data
const articles = [
  {
    id: 5,
    title: "S'installer en Pologne : mon parcours de Français célibataire",
    excerpt: "Les démarches que j'ai réellement effectuées pour m'installer en Pologne — expliquées simplement, avec un schéma pour visualiser l'enchaînement. Dans mon cas, je ne parle pas polonais, ce qui peut compliquer certaines démarches mais reste tout à fait faisable.",
    author: "Johann Debeaumont",
    date: "2024-01-20",
    readTime: "8 min",
    imageUrl: "/Administration.png"
  },
  {
    id: 6,
    title: "NFZ : Comment utiliser le système de santé polonais",
    excerpt: "Guide pratique pour naviguer dans le système de santé polonais : médecins, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.",
    author: "Johann Debeaumont", 
    date: "2025-07-25",
    readTime: "10 min",
    imageUrl: "/apteka.png"
  },
  {
    id: 7,
    title: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
    excerpt: "Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.",
    author: "Johann Debeaumont",
    date: "2025-07-30", 
    readTime: "12 min",
    imageUrl: "/immatriculation.png"
  },
  {
    id: 8,
    title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
    excerpt: "Bonne nouvelle après tous les galères administratives : créer une micro-entreprise en Pologne, c'est étonnamment simple ! Voici comment j'ai fait avec l'aide de ChatGPT.",
    author: "Johann Debeaumont",
    date: "2025-08-05",
    readTime: "8 min", 
    imageUrl: "/CEIDG.png"
  }
];

export default function BlogPage() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-40 pb-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guide pratique
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Retours d'expérience français en Pologne : démarches, astuces et conseils pratiques pour s'installer et vivre sereinement.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <div className="h-40 sm:h-48 md:h-full relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <FaUser className="text-blue-600" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-600" />
                        <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span className="text-blue-600 font-medium">{article.readTime}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                                                    <Link
                                  href={`/${currentLocale}/blog/${article.id}`}
                                  className="blog-button"
                                >
                      Lire la suite
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun article disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
