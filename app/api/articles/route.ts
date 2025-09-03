import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Configuration des articles - SEULE SOURCE DE VÉRITÉ
const articlesConfig = [
  {
    id: 5,
    slug: "installer-pologne-parcours-francais-celibataire",
    title: "S'installer en Pologne : mon parcours de Français célibataire",
    excerpt: "Les démarches que j'ai réellement effectuées pour m'installer en Pologne — expliquées simplement, avec un schéma pour visualiser l'enchaînement. Dans mon cas, je ne parle pas polonais, ce qui peut compliquer certaines démarches mais reste tout à fait faisable.",
    author: "Johann Debeaumont",
    date: "2024-01-20",
    readTime: "8 min",
    imageUrl: "/Administration.png",
    draft: false,
    category: "Administration",
    tags: ["installation", "démarches", "expatriation", "pologne"],
    language: "fr"
  },
  {
    id: 6,
    slug: "nfz-systeme-sante-polonais-guide",
    title: "NFZ : Comment utiliser le système de santé polonais",
    excerpt: "Guide pratique pour naviguer dans le système de santé polonais : CMP, ordonnances par code, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.",
    author: "Johann Debeaumont",
    date: "2024-07-25",
    readTime: "10 min",
    imageUrl: "/apteka.png",
    draft: false,
    category: "Santé",
    tags: ["santé", "nfz", "médecin", "pharmacie", "expatrié"],
    language: "fr"
  },
  {
    id: 7,
    slug: "immatriculer-voiture-francaise-pologne-guide",
    title: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
    excerpt: "Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.",
    author: "Johann Debeaumont",
    date: "2024-03-15",
    readTime: "12 min",
    imageUrl: "/Immatriculation.png",
    draft: false,
    category: "Transport",
    tags: ["voiture", "immatriculation", "transport", "démarches"],
    language: "fr"
  },
  {
    id: 8,
    slug: "creer-micro-entreprise-pologne-simple-rapide",
    title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
    excerpt: "Guide complet pour créer une micro-entreprise en Pologne : CEIDG, NIP, REGON, ZUS. Méthode ChatGPT et démarches simplifiées pour entrepreneurs français.",
    author: "Johann Debeaumont",
    date: "2024-02-05",
    readTime: "8 min",
    imageUrl: "/CEIDG.png",
    draft: false,
    category: "Entrepreneuriat",
    tags: ["micro-entreprise", "CEIDG", "NIP", "REGON", "ZUS", "entrepreneur", "freelance"],
    language: "fr"
  },
  {
    id: 9,
    slug: "se-loger-deplacer-pologne-guide-2025",
    title: "Se loger et se déplacer en Pologne — Guide pratique 2025",
    excerpt: "Guide complet pour se loger et se déplacer en Pologne : loyers, charges, meldunek, transports. Conseils pratiques et budgets réels pour 2025.",
    author: "Johann Debeaumont",
    date: "2025-09-04",
    readTime: "12 min",
    imageUrl: "/Seloger.png",
    draft: false,
    category: "Logement",
    tags: ["logement", "transport", "budget", "pologne", "2025"],
    language: "fr"
  },
  {
    id: 10,
    slug: "pecher-pologne-permis-regles-guide-2025",
    title: "Pêcher en Pologne : permis, règles et spots — Guide 2025",
    excerpt: "Guide complet pour obtenir son permis de pêche en Pologne : démarches, coûts, règles par région, spots recommandés. Tout pour les expatriés passionnés.",
    author: "Johann Debeaumont",
    date: "2025-09-15",
    readTime: "10 min",
    imageUrl: "/Pecher-en-Pologne.png",
    draft: false,
    category: "Loisirs",
    tags: ["pêche", "permis", "loisirs", "nature", "pologne"],
    language: "fr"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const draft = searchParams.get('draft');

    let filteredArticles = [...articlesConfig];

    // Filtrer par catégorie si spécifiée
    if (category) {
      filteredArticles = filteredArticles.filter(
        article => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtrer par statut draft si spécifié
    if (draft !== null) {
      const isDraft = draft === 'true';
      filteredArticles = filteredArticles.filter(
        article => article.draft === isDraft
      );
    }

    // Trier par date (plus récent en premier)
    filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Limiter le nombre de résultats si spécifié
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredArticles = filteredArticles.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        articles: filteredArticles,
        total: filteredArticles.length
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}