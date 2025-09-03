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
    console.log(`[DEBUG] Tentative de lecture du fichier: ${fullPath}`);
    
    const fileContent = await readFile(fullPath, 'utf-8');
    console.log(`[DEBUG] Fichier lu avec succès, taille: ${fileContent.length} caractères`);
    
    // Vérifier si ArticleLayout est présent
    const hasArticleLayout = fileContent.includes('ArticleLayout');
    console.log(`[DEBUG] ArticleLayout trouvé: ${hasArticleLayout}`);
    
    // Extraire le contenu entre les balises ArticleLayout
    const content = parseJSXContent(fileContent);
    console.log(`[DEBUG] Contenu extrait, taille: ${content.length} caractères`);
    
    return content;
    
  } catch (error) {
    console.error(`[ERROR] Erreur lors de la lecture du fichier ${filePath}:`, error);
    return "Erreur lors du chargement du contenu depuis le fichier source.";
  }
}

// Fonction principale pour parser le contenu JSX
function parseJSXContent(fileContent: string): string {
  console.log(`[DEBUG] Début du parsing JSX`);
  
  // Extraire le titre depuis ArticleLayout
  const titleMatch = fileContent.match(/title="([^"]+)"/);
  let content = '';
  
  if (titleMatch) {
    content += titleMatch[1] + '\n\n';
    console.log(`[DEBUG] Titre trouvé: ${titleMatch[1]}`);
  } else {
    console.log(`[DEBUG] Aucun titre trouvé`);
  }
  
  // Extraire le contenu principal entre <ArticleLayout...> et </ArticleLayout>
  // Regex plus robuste pour gérer les props sur plusieurs lignes
  const layoutMatch = fileContent.match(/<ArticleLayout[\s\S]*?>([\s\S]*?)<\/ArticleLayout>/);
  if (!layoutMatch) {
    console.log(`[DEBUG] Aucun match ArticleLayout trouvé`);
    // Essayons de voir ce qu'il y a dans le fichier
    const preview = fileContent.substring(0, 500);
    console.log(`[DEBUG] Aperçu du fichier: ${preview}`);
    return content + "Contenu non trouvé dans ArticleLayout.";
  }
  
  console.log(`[DEBUG] ArticleLayout match trouvé, contenu de ${layoutMatch[1].length} caractères`);
  let articleContent = layoutMatch[1];
  
  // Nettoyer et convertir le JSX en markdown
  content += convertJSXToMarkdown(articleContent);
  
  return content.trim();
}

// Fonction robuste pour convertir JSX en markdown
function convertJSXToMarkdown(jsxContent: string): string {
  let content = jsxContent;
  
  // 1. Supprimer les éléments non-textuels
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''); // Commentaires JSX
  content = content.replace(/<script[\s\S]*?<\/script>/g, ''); // Scripts
  content = content.replace(/<div className="diagram-container">[\s\S]*?<\/div>/g, ''); // Diagrammes
  content = content.replace(/<div ref=\{[^}]+\}><\/div>/g, ''); // Refs vides
  
  // 2. Convertir les info-boxes avec leur contenu
  content = content.replace(/<div className="info-box-[^"]*"[^>]*>([\s\S]*?)<\/div>/g, (match, boxContent) => {
    let result = '\n';
    
    // Extraire le titre de l'info-box
    const titleMatch = boxContent.match(/<h4 className="info-box-title"[^>]*>([\s\S]*?)<\/h4>/);
    if (titleMatch) {
      result += '### ' + cleanText(titleMatch[1]) + '\n';
    }
    
    // Extraire le contenu de l'info-box
    const contentMatch = boxContent.match(/<p className="info-box-content"[^>]*>([\s\S]*?)<\/p>/);
    if (contentMatch) {
      result += cleanText(contentMatch[1]) + '\n';
    }
    
    return result + '\n';
  });
  
  // 3. Convertir les step-containers
  content = content.replace(/<div className="step-container"[^>]*>([\s\S]*?)<\/div>/g, (match, stepContent) => {
    let result = '\n';
    
    // Extraire le titre du step
    const titleMatch = stepContent.match(/<h3 className="step-title"[^>]*>([\s\S]*?)<\/h3>/);
    if (titleMatch) {
      result += '### ' + cleanText(titleMatch[1]) + '\n';
    }
    
    // Traiter le reste du contenu du step
    result += processBasicElements(stepContent) + '\n';
    
    return result;
  });
  
  // 4. Traiter les éléments de base
  content = processBasicElements(content);
  
  // 5. Nettoyage final
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Réduire les sauts de ligne multiples
  content = content.replace(/^\s+|\s+$/gm, ''); // Supprimer espaces en début/fin de ligne
  
  return content;
}

// Fonction pour traiter les éléments HTML de base
function processBasicElements(content: string): string {
  // Convertir les titres
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (match, title) => '\n## ' + cleanText(title) + '\n');
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (match, title) => '\n### ' + cleanText(title) + '\n');
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, (match, title) => '\n#### ' + cleanText(title) + '\n');
  
  // Convertir les paragraphes
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, text) => '\n' + cleanText(text) + '\n');
  
  // Convertir les listes
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, listContent) => {
    const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
    const cleanItems = items.map((item: string) => {
      const itemText = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/, '$1');
      return '- ' + cleanText(itemText);
    });
    return '\n' + cleanItems.join('\n') + '\n';
  });
  
  return content;
}

// Fonction pour nettoyer le texte des balises et expressions JSX
function cleanText(text: string): string {
  let cleaned = text;
  
  // Convertir les liens internes
  cleaned = cleaned.replace(/<Link href=\{`\/\$\{currentLocale\}\/blog\/([^`]+)`\}[^>]*>([\s\S]*?)<\/Link>/g, '$2');
  cleaned = cleaned.replace(/<Link[^>]*>([\s\S]*?)<\/Link>/g, '$1');
  
  // Convertir la mise en forme
  cleaned = cleaned.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**');
  cleaned = cleaned.replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '*$1*');
  
  // Supprimer les balises restantes
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Nettoyer les expressions JSX
  cleaned = cleaned.replace(/\{[^}]+\}/g, '');
  
  // Décoder les entités HTML
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&quot;/g, '"');
  
  // Nettoyer les espaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
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
