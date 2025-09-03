import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Articles data pour la recherche
const articles = [
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
    excerpt: "Guide pratique pour naviguer dans le système de santé polonais : médecins, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.",
    author: "Johann Debeaumont", 
    date: "2025-07-25",
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
    date: "2025-07-30", 
    readTime: "12 min",
    imageUrl: "/immatriculation.png",
    draft: false,
    category: "Transport",
    tags: ["voiture", "immatriculation", "démarches", "transport"],
    language: "fr"
  },
  {
    id: 8,
    slug: "creer-micro-entreprise-pologne-guide",
    title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
    excerpt: "Bonne nouvelle après tous les galères administratives : créer une micro-entreprise en Pologne, c'est étonnamment simple ! Voici comment j'ai fait avec l'aide de ChatGPT.",
    author: "Johann Debeaumont",
    date: "2025-08-05",
    readTime: "8 min", 
    imageUrl: "/CEIDG.png",
    draft: false,
    category: "Entreprise",
    tags: ["entreprise", "micro-entreprise", "business", "ceidg"],
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
    draft: true,
    category: "Logement",
    tags: ["logement", "transport", "meldunek", "budget", "2025"],
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
    draft: true,
    category: "Loisirs",
    tags: ["pêche", "permis", "loisirs", "sport", "nature"],
    language: "fr"
  }
];

// Fonction de calcul de score de pertinence
function calculateRelevanceScore(article: any, query: string): number {
  const queryLower = query.toLowerCase();
  let score = 0;
  
  // Score pour le titre (poids le plus élevé)
  if (article.title.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  
  // Score pour correspondance exacte dans le titre
  if (article.title.toLowerCase() === queryLower) {
    score += 20;
  }
  
  // Score pour l'excerpt
  if (article.excerpt.toLowerCase().includes(queryLower)) {
    score += 5;
  }
  
  // Score pour les tags
  article.tags.forEach((tag: string) => {
    if (tag.toLowerCase().includes(queryLower)) {
      score += 3;
    }
    if (tag.toLowerCase() === queryLower) {
      score += 8;
    }
  });
  
  // Score pour la catégorie
  if (article.category.toLowerCase().includes(queryLower)) {
    score += 4;
  }
  
  // Bonus pour les articles récents
  const articleDate = new Date(article.date);
  const now = new Date();
  const daysDiff = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff < 30) score += 2; // Articles de moins de 30 jours
  if (daysDiff < 7) score += 1;  // Articles de moins de 7 jours
  
  return score;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '10');
    const minScore = parseInt(searchParams.get('minScore') || '1');
    
    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Paramètre de recherche "q" requis'
      }, { status: 400 });
    }
    
    // Filtrer et scorer les articles
    let results = articles
      .filter(article => {
        // Exclure les brouillons sauf si demandé
        if (!includeDrafts && article.draft) {
          return false;
        }
        
        // Filtrer par catégorie si spécifiée
        if (category && article.category !== category) {
          return false;
        }
        
        // Filtrer par tag si spécifié
        if (tag && !article.tags.includes(tag)) {
          return false;
        }
        
        return true;
      })
      .map(article => ({
        ...article,
        relevanceScore: calculateRelevanceScore(article, query)
      }))
      .filter(article => article.relevanceScore >= minScore)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
    
    // Préparer les suggestions de recherche
    const suggestions = [];
    
    // Suggestions basées sur les tags populaires
    const queryLower = query.toLowerCase();
    const allTags = articles.flatMap(a => a.tags);
    const uniqueTags = Array.from(new Set(allTags));
    const tagSuggestions = uniqueTags
      .filter(tag => tag.toLowerCase().includes(queryLower) && tag.toLowerCase() !== queryLower)
      .slice(0, 3);
    
    suggestions.push(...tagSuggestions.map(tag => ({
      type: 'tag',
      value: tag,
      label: `Tag: ${tag}`
    })));
    
    // Suggestions basées sur les catégories
    const allCategories = articles.map(a => a.category);
    const uniqueCategories = Array.from(new Set(allCategories));
    const categorySuggestions = uniqueCategories
      .filter(cat => cat.toLowerCase().includes(queryLower) && cat.toLowerCase() !== queryLower)
      .slice(0, 2);
    
    suggestions.push(...categorySuggestions.map(cat => ({
      type: 'category',
      value: cat,
      label: `Catégorie: ${cat}`
    })));
    
    // Nettoyer les résultats (enlever le score de pertinence)
    const cleanResults = results.map(({ relevanceScore, ...article }) => article);
    
    const response = {
      success: true,
      data: {
        query,
        results: cleanResults,
        totalResults: cleanResults.length,
        suggestions: suggestions.slice(0, 5),
        searchStats: {
          executionTime: Date.now() % 100, // Simulation du temps d'exécution
          totalArticlesSearched: articles.filter(a => !a.draft || includeDrafts).length
        }
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erreur API recherche:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la recherche' 
      },
      { status: 500 }
    );
  }
}
