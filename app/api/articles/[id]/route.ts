import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Articles data - même structure que dans l'API principale
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
    filePath: "app/[locale]/blog/5/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/6/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/7/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/8/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/9/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/10/page.jsx"
  }
];

// Fonction pour extraire le contenu d'un article depuis son fichier
async function extractArticleContent(filePath: string): Promise<string> {
  try {
    const fullPath = join(process.cwd(), filePath);
    const fileContent = await readFile(fullPath, 'utf-8');
    
    // Extraire le contenu JSX entre les balises ArticleLayout
    const contentMatch = fileContent.match(/<ArticleLayout[^>]*>([\s\S]*?)<\/ArticleLayout>/);
    if (contentMatch) {
      let content = contentMatch[1];
      
      // Nettoyer le JSX pour obtenir du texte lisible
      content = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Supprimer les scripts
        .replace(/<[^>]*>/g, ' ') // Supprimer les balises HTML/JSX
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .replace(/\{[^}]*\}/g, '') // Supprimer les expressions JSX
        .trim();
      
      return content;
    }
    
    return "Contenu non disponible";
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return "Erreur lors du chargement du contenu";
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('includeContent') === 'true';
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    
    // Rechercher l'article par ID ou slug
    const article = articles.find(a => 
      a.id.toString() === id || a.slug === id
    );
    
    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article non trouvé' 
        },
        { status: 404 }
      );
    }
    
    // Vérifier si c'est un brouillon
    if (article.draft && !includeDrafts) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article non disponible' 
        },
        { status: 404 }
      );
    }
    
    // Préparer la réponse de base
    const responseArticle: any = {
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
    if (includeContent && article.filePath) {
      responseArticle.content = await extractArticleContent(article.filePath);
    }
    
    // Articles similaires (même catégorie, excluant l'article actuel)
    const relatedArticles = articles
      .filter(a => 
        a.id !== article.id && 
        a.category === article.category && 
        (!a.draft || includeDrafts)
      )
      .slice(0, 3)
      .map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        imageUrl: a.imageUrl,
        date: a.date,
        readTime: a.readTime
      }));
    
    const response = {
      success: true,
      data: {
        article: responseArticle,
        relatedArticles
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erreur API article:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la récupération de l\'article' 
      },
      { status: 500 }
    );
  }
}
