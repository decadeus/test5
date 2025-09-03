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

// Fonction pour extraire le contenu d'un fichier JSX
async function extractContentFromJSX(filePath: string): Promise<string> {
  try {
    const fullPath = join(process.cwd(), filePath);
    const fileContent = await readFile(fullPath, 'utf-8');
    
    // Pour l'instant, retourner un message simple en attendant d'améliorer le parser
    return `Contenu de l'article extrait depuis ${filePath}. 
    
Le parser JSX est en cours d'amélioration pour extraire automatiquement le contenu complet de vos articles.

En attendant, l'API fonctionne avec les métadonnées (titre, excerpt, catégorie, etc.) et le contenu sera bientôt synchronisé automatiquement.`;
    
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return "Erreur lors du chargement du contenu depuis le fichier source.";
  }
}

// Fonction pour parser le JSX et extraire le texte
function extractTextFromJSX(jsxContent: string): string {
  let content = '';
  
  // Extraire le titre depuis le JSX
  const titleMatch = jsxContent.match(/title="([^"]+)"/);
  if (titleMatch) {
    content += titleMatch[1] + '\n\n';
  }
  
  // Extraire le contenu principal entre les balises ArticleLayout
  const articleLayoutMatch = jsxContent.match(/<ArticleLayout[^>]*>([\s\S]*?)<\/ArticleLayout>/);
  if (articleLayoutMatch) {
    let articleContent = articleLayoutMatch[1];
    
    // Nettoyer le contenu JSX
    content += cleanJSXContent(articleContent);
  }
  
  return content.trim();
}

// Fonction pour nettoyer le contenu JSX et le convertir en markdown
function cleanJSXContent(jsxContent: string): string {
  let cleaned = jsxContent;
  
  // Supprimer les commentaires JSX
  cleaned = cleaned.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Supprimer les scripts et éléments non-textuels
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/g, '');
  cleaned = cleaned.replace(/<div className="diagram-container">[\s\S]*?<\/div>/g, '');
  cleaned = cleaned.replace(/<div ref={mermaidRef}><\/div>/g, '');
  
  // Convertir les titres
  cleaned = cleaned.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1');
  cleaned = cleaned.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1');
  cleaned = cleaned.replace(/<h4[^>]*>(.*?)<\/h4>/g, '#### $1');
  
  // Convertir les paragraphes
  cleaned = cleaned.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, '$1\n');
  
  // Convertir les listes
  cleaned = cleaned.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '- $1') + '\n';
  });
  
  // Convertir les liens internes
  cleaned = cleaned.replace(/<Link href={`\/\${currentLocale}\/blog\/([^`]+)`}[^>]*>([\s\S]*?)<\/Link>/g, '$2');
  cleaned = cleaned.replace(/<Link[^>]*>([\s\S]*?)<\/Link>/g, '$1');
  
  // Convertir les éléments de mise en forme
  cleaned = cleaned.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  cleaned = cleaned.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
  
  // Nettoyer les info-box
  cleaned = cleaned.replace(/<div className="info-box-[^"]*"[^>]*>([\s\S]*?)<\/div>/g, (match, content) => {
    // Extraire le titre et le contenu
    const titleMatch = content.match(/<h4[^>]*>(.*?)<\/h4>/);
    const contentMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    
    let result = '';
    if (titleMatch) {
      result += '### ' + titleMatch[1] + '\n';
    }
    if (contentMatch) {
      result += contentMatch[1] + '\n';
    }
    return result + '\n';
  });
  
  // Nettoyer les step-container
  cleaned = cleaned.replace(/<div className="step-container"[^>]*>([\s\S]*?)<\/div>/g, (match, content) => {
    return content.replace(/<h3 className="step-title"[^>]*>(.*?)<\/h3>/g, '### $1') + '\n';
  });
  
  // Supprimer les balises restantes
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Nettoyer les expressions JSX
  cleaned = cleaned.replace(/\{[^}]+\}/g, '');
  
  // Nettoyer les espaces multiples et les sauts de ligne
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.replace(/^\s+|\s+$/gm, '');
  
  // Décoder les entités HTML
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&quot;/g, '"');
  
  return cleaned;
}

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
      try {
        const content = await extractContentFromJSX(articleConfig.filePath);
        responseArticle.content = content;
      } catch (error) {
        console.error('Erreur lors de l\'extraction du contenu:', error);
        responseArticle.content = "Erreur lors du chargement du contenu depuis le fichier source.";
      }
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
