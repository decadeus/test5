import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// Configuration des articles avec leurs métadonnées
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
    language: "fr",
    filePath: "app/[locale]/blog/5/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/6/page.jsx"
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
    language: "fr",
    filePath: "app/[locale]/blog/7/page.jsx"
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
    draft: false,
    category: "Logement",
    tags: ["logement", "transport", "budget", "pologne", "2025"],
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
    draft: false,
    category: "Loisirs",
    tags: ["pêche", "permis", "loisirs", "nature", "pologne"],
    language: "fr",
    filePath: "app/[locale]/blog/10/page.jsx"
  }
];

// Fonction pour lire le contenu pré-extrait depuis le fichier JSON
async function getPreExtractedContent(articleId: number): Promise<string> {
  try {
    const contentPath = join(process.cwd(), 'data', 'articles-content.json');
    console.log(`[API] Lecture du contenu pré-extrait depuis: ${contentPath}`);
    
    const contentData = await readFile(contentPath, 'utf-8');
    const articles = JSON.parse(contentData);
    
    const article = articles.find((a: any) => a.id === articleId);
    if (!article) {
      console.log(`[API] ❌ Article ${articleId} non trouvé dans le contenu pré-extrait`);
      return "Article non trouvé dans le contenu pré-extrait.";
    }
    
    console.log(`[API] ✅ Contenu trouvé pour l'article ${articleId}, taille: ${article.content.length} caractères`);
    return article.content;
    
  } catch (error) {
    console.error(`[API] ❌ Erreur lors de la lecture du contenu pré-extrait:`, error);
    return "Erreur lors du chargement du contenu pré-extrait. Assurez-vous que le build a été exécuté.";
  }
}

// Note: Les fonctions de parsing JSX ont été déplacées dans scripts/extract-articles-content.js
// Le contenu est maintenant pré-extrait au build time et lu depuis data/articles-content.json

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('includeContent') === 'true';
    
    const articleId = parseInt(params.id);
    const articleConfig = articlesConfig.find(a => a.id === articleId);
    
    if (!articleConfig) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Préparer la réponse de base
    const responseArticle: any = {
      id: articleConfig.id,
      slug: articleConfig.slug,
      title: articleConfig.title,
      excerpt: articleConfig.excerpt,
      author: articleConfig.author,
      date: articleConfig.date,
      readTime: articleConfig.readTime,
      imageUrl: articleConfig.imageUrl,
      draft: articleConfig.draft,
      category: articleConfig.category,
      tags: articleConfig.tags,
      language: articleConfig.language
    };

    // Ajouter le contenu si demandé
    if (includeContent) {
      const content = await getPreExtractedContent(articleConfig.id);
      responseArticle.content = content;
    }

    return NextResponse.json({
      success: true,
      data: {
        article: responseArticle
      }
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
