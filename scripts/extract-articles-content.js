const fs = require('fs');
const path = require('path');

// Configuration des articles (même que dans l'API)
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

// Fonction pour parser le contenu JSX (même logique que dans l'API)
function parseJSXContent(fileContent) {
  console.log(`[BUILD] Début du parsing JSX`);
  
  // Extraire le titre depuis ArticleLayout
  const titleMatch = fileContent.match(/title="([^"]+)"/);
  let content = '';
  
  if (titleMatch) {
    content += titleMatch[1] + '\n\n';
    console.log(`[BUILD] Titre trouvé: ${titleMatch[1]}`);
  }
  
  // Extraire le contenu principal entre <ArticleLayout...> et </ArticleLayout>
  const layoutMatch = fileContent.match(/<ArticleLayout[\s\S]*?>([\s\S]*?)<\/ArticleLayout>/);
  if (!layoutMatch) {
    console.log(`[BUILD] ❌ Aucun match ArticleLayout trouvé`);
    return content + "Contenu non trouvé dans ArticleLayout.";
  }
  
  console.log(`[BUILD] ✅ ArticleLayout match trouvé, contenu de ${layoutMatch[1].length} caractères`);
  let articleContent = layoutMatch[1];
  
  // Nettoyer et convertir le JSX en markdown
  content += convertJSXToMarkdown(articleContent);
  
  return content.trim();
}

// Fonction pour convertir JSX en markdown (même logique que dans l'API)
function convertJSXToMarkdown(jsxContent) {
  let content = jsxContent;
  
  // 1. Supprimer les éléments non-textuels
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''); // Commentaires JSX
  content = content.replace(/<script[\s\S]*?<\/script>/g, ''); // Scripts
  content = content.replace(/<div className="diagram-container">[\s\S]*?<\/div>/g, ''); // Diagrammes
  content = content.replace(/<div ref=\{[^}]+\}><\/div>/g, ''); // Refs vides
  
  // 1.5. Supprimer les divs avec classes CSS complexes (bg-yellow, border, etc.)
  content = content.replace(/<div className="[^"]*bg-[^"]*"[^>]*>/g, ''); // Divs avec classes bg-*
  content = content.replace(/<div className="[^"]*border-[^"]*"[^>]*>/g, ''); // Divs avec classes border-*
  content = content.replace(/<div className="[^"]*flex[^"]*"[^>]*>/g, ''); // Divs avec classes flex
  content = content.replace(/<span className="[^"]*"[^>]*>/g, ''); // Spans avec classes
  content = content.replace(/<\/span>/g, ''); // Fermetures de span
  
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
  
  // 5. Nettoyage final agressif
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n'); // Réduire les sauts de ligne multiples
  content = content.replace(/^\s+|\s+$/gm, ''); // Supprimer espaces en début/fin de ligne
  
  // Supprimer toutes les balises HTML restantes (sécurité)
  content = content.replace(/<\/?[^>]+>/g, '');
  
  // Supprimer les attributs JSX orphelins
  content = content.replace(/className="[^"]*"/g, '');
  content = content.replace(/\{[^}]*\}/g, '');
  
  // Nettoyer les caractères spéciaux et espaces (plus conservateur)
  content = content.replace(/[ \t]+/g, ' '); // Espaces et tabs multiples -> un seul espace
  content = content.replace(/\n\s+/g, '\n'); // Supprimer espaces après saut de ligne
  content = content.replace(/\n{3,}/g, '\n\n'); // Max 2 sauts de ligne consécutifs
  
  return content;
}

// Fonction pour traiter les éléments HTML de base
function processBasicElements(content) {
  // Convertir les titres
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (match, title) => '\n## ' + cleanText(title) + '\n');
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (match, title) => '\n### ' + cleanText(title) + '\n');
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, (match, title) => '\n#### ' + cleanText(title) + '\n');
  
  // Convertir les paragraphes
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, text) => '\n' + cleanText(text) + '\n');
  
  // Convertir les listes
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, listContent) => {
    const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
    const cleanItems = items.map((item) => {
      const itemText = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/, '$1');
      return '- ' + cleanText(itemText);
    });
    return '\n' + cleanItems.join('\n') + '\n';
  });
  
  return content;
}

// Fonction pour nettoyer le texte des balises et expressions JSX
function cleanText(text) {
  let cleaned = text;
  
  // Supprimer d'abord toutes les balises ouvrantes avec classes CSS
  cleaned = cleaned.replace(/<div className="[^"]*"[^>]*>/g, '');
  cleaned = cleaned.replace(/<span className="[^"]*"[^>]*>/g, '');
  cleaned = cleaned.replace(/<p className="[^"]*"[^>]*>/g, '');
  
  // Convertir les liens internes
  cleaned = cleaned.replace(/<Link href=\{`\/\$\{currentLocale\}\/blog\/([^`]+)`\}[^>]*>([\s\S]*?)<\/Link>/g, '$2');
  cleaned = cleaned.replace(/<Link[^>]*>([\s\S]*?)<\/Link>/g, '$1');
  
  // Convertir la mise en forme
  cleaned = cleaned.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, '**$1**');
  cleaned = cleaned.replace(/<em[^>]*>([\s\S]*?)<\/em>/g, '*$1*');
  
  // Supprimer TOUTES les balises HTML restantes (plus agressif)
  cleaned = cleaned.replace(/<\/?[^>]+>/g, '');
  
  // Nettoyer les expressions JSX
  cleaned = cleaned.replace(/\{[^}]+\}/g, '');
  
  // Supprimer les attributs JSX orphelins
  cleaned = cleaned.replace(/className="[^"]*"/g, '');
  // NE PAS supprimer les ** - ils sont utiles pour la mise en forme
  
  // Décoder les entités HTML
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&quot;/g, '"');
  
  // Nettoyer les espaces multiples et caractères spéciaux
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/^\s*[\*\-\+]\s*/, ''); // Supprimer les puces orphelines
  
  return cleaned;
}

// Fonction principale d'extraction
async function extractAllArticlesContent() {
  console.log('[BUILD] 🚀 Début de l\'extraction du contenu des articles...');
  
  const articlesWithContent = [];
  
  for (const article of articlesConfig) {
    try {
      console.log(`[BUILD] 📖 Traitement de l'article ${article.id}: ${article.title}`);
      
      const filePath = path.join(process.cwd(), article.filePath);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      console.log(`[BUILD] ✅ Fichier lu: ${filePath} (${fileContent.length} caractères)`);
      
      const content = parseJSXContent(fileContent);
      
      articlesWithContent.push({
        ...article,
        content: content
      });
      
      console.log(`[BUILD] ✅ Article ${article.id} traité avec succès`);
      
    } catch (error) {
      console.error(`[BUILD] ❌ Erreur pour l'article ${article.id}:`, error.message);
      
      // Ajouter l'article avec un contenu d'erreur
      articlesWithContent.push({
        ...article,
        content: `Erreur lors de l'extraction du contenu: ${error.message}`
      });
    }
  }
  
  // Créer le dossier data s'il n'existe pas
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Sauvegarder le contenu extrait
  const outputPath = path.join(dataDir, 'articles-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(articlesWithContent, null, 2));
  
  console.log(`[BUILD] 🎉 Extraction terminée ! ${articlesWithContent.length} articles sauvegardés dans ${outputPath}`);
  
  return articlesWithContent;
}

// Exécuter le script si appelé directement
if (require.main === module) {
  extractAllArticlesContent()
    .then(() => {
      console.log('[BUILD] ✅ Script d\'extraction terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[BUILD] ❌ Erreur lors de l\'extraction:', error);
      process.exit(1);
    });
}

module.exports = { extractAllArticlesContent };
