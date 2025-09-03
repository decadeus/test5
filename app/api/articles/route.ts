import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Articles data - même structure que dans blog/page.jsx
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
    language: "fr",
    content: "Contenu complet de l'article sur l'installation en Pologne avec toutes les démarches détaillées..."
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Paramètres de requête
    const includeContent = searchParams.get('includeContent') === 'true';
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    
    // Filtrer les articles
    let filteredArticles = articles.filter(article => {
      // Exclure les brouillons sauf si demandé
      if (!includeDrafts && article.draft) {
        return false;
      }
      
      // Filtrer par catégorie
      if (category && article.category !== category) {
        return false;
      }
      
      // Filtrer par tag
      if (tag && !article.tags.includes(tag)) {
        return false;
      }
      
      // Recherche textuelle
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.tags.some(t => t.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
    
    // Trier par date (plus récent en premier)
    filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Pagination
    const total = filteredArticles.length;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);
    
    // Préparer la réponse
    const responseArticles = paginatedArticles.map(article => {
      const baseArticle = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        date: article.date,
        readTime: article.readTime,
        imageUrl: article.imageUrl,
        category: article.category,
        tags: article.tags,
        language: article.language,
        draft: article.draft
      };
      
      // Ajouter le contenu complet si demandé
      if (includeContent) {
        // Ici vous pourriez charger le contenu depuis les fichiers
        // Pour l'instant, on retourne juste l'excerpt étendu
        return {
          ...baseArticle,
          content: `${article.excerpt}\n\n[Contenu complet à implémenter]`
        };
      }
      
      return baseArticle;
    });
    
    const response = {
      success: true,
      data: {
        articles: responseArticles,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        },
        filters: {
          category,
          tag,
          search,
          includeDrafts
        }
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erreur API articles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la récupération des articles' 
      },
      { status: 500 }
    );
  }
}
