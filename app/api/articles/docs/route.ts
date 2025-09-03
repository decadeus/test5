import { NextResponse } from 'next/server';

const apiDocumentation = {
  title: "Hoomge Articles API",
  version: "1.0.0",
  description: "API pour accéder aux articles de blog Hoomge depuis l'application mobile",
  baseUrl: "https://www.hoomge.com/api/articles",
  
  endpoints: {
    
    // Liste des articles
    "GET /api/articles": {
      description: "Récupère la liste des articles avec pagination et filtres",
      parameters: {
        includeContent: {
          type: "boolean",
          default: false,
          description: "Inclure le contenu complet des articles"
        },
        includeDrafts: {
          type: "boolean", 
          default: false,
          description: "Inclure les articles en brouillon"
        },
        category: {
          type: "string",
          optional: true,
          description: "Filtrer par catégorie"
        },
        tag: {
          type: "string",
          optional: true,
          description: "Filtrer par tag"
        },
        limit: {
          type: "number",
          default: 10,
          description: "Nombre d'articles par page (max 50)"
        },
        offset: {
          type: "number",
          default: 0,
          description: "Décalage pour la pagination"
        },
        search: {
          type: "string",
          optional: true,
          description: "Recherche textuelle dans titre, excerpt et tags"
        }
      },
      example: "/api/articles?limit=5&category=Administration&includeDrafts=false",
      response: {
        success: true,
        data: {
          articles: [
            {
              id: 5,
              slug: "installer-pologne-parcours-francais-celibataire",
              title: "S'installer en Pologne : mon parcours de Français célibataire",
              excerpt: "Les démarches que j'ai réellement effectuées...",
              author: "Johann Debeaumont",
              date: "2024-01-20",
              readTime: "8 min",
              imageUrl: "/Administration.png",
              category: "Administration",
              tags: ["installation", "démarches", "expatriation", "pologne"],
              language: "fr",
              draft: false
            }
          ],
          pagination: {
            total: 6,
            limit: 10,
            offset: 0,
            hasMore: false
          }
        }
      }
    },
    
    // Article spécifique
    "GET /api/articles/[id]": {
      description: "Récupère un article spécifique par ID ou slug",
      parameters: {
        id: {
          type: "string|number",
          description: "ID numérique ou slug de l'article"
        },
        includeContent: {
          type: "boolean",
          default: false,
          description: "Inclure le contenu complet de l'article"
        },
        includeDrafts: {
          type: "boolean",
          default: false,
          description: "Permettre l'accès aux brouillons"
        }
      },
      example: "/api/articles/5?includeContent=true",
      response: {
        success: true,
        data: {
          article: {
            id: 5,
            slug: "installer-pologne-parcours-francais-celibataire",
            title: "S'installer en Pologne : mon parcours de Français célibataire",
            content: "Contenu complet de l'article...",
            // ... autres champs
          },
          relatedArticles: [
            {
              id: 7,
              title: "Immatriculer sa voiture française en Pologne",
              // ... champs de base
            }
          ]
        }
      }
    },
    
    // Catégories et tags
    "GET /api/articles/categories": {
      description: "Récupère toutes les catégories et tags disponibles",
      parameters: {
        includeDrafts: {
          type: "boolean",
          default: false,
          description: "Inclure les catégories des brouillons"
        }
      },
      example: "/api/articles/categories",
      response: {
        success: true,
        data: {
          categories: [
            {
              name: "Administration",
              count: 2,
              slug: "administration"
            }
          ],
          tags: [
            {
              name: "pologne",
              count: 4,
              slug: "pologne"
            }
          ],
          totalArticles: 6
        }
      }
    },
    
    // Recherche
    "GET /api/articles/search": {
      description: "Recherche avancée dans les articles",
      parameters: {
        q: {
          type: "string",
          required: true,
          description: "Terme de recherche"
        },
        includeDrafts: {
          type: "boolean",
          default: false,
          description: "Inclure les brouillons dans la recherche"
        },
        category: {
          type: "string",
          optional: true,
          description: "Limiter la recherche à une catégorie"
        },
        tag: {
          type: "string",
          optional: true,
          description: "Limiter la recherche à un tag"
        },
        limit: {
          type: "number",
          default: 10,
          description: "Nombre de résultats maximum"
        },
        minScore: {
          type: "number",
          default: 1,
          description: "Score de pertinence minimum"
        }
      },
      example: "/api/articles/search?q=pologne&limit=5",
      response: {
        success: true,
        data: {
          query: "pologne",
          results: [
            // Articles triés par pertinence
          ],
          totalResults: 3,
          suggestions: [
            {
              type: "tag",
              value: "expatriation",
              label: "Tag: expatriation"
            }
          ],
          searchStats: {
            executionTime: 45,
            totalArticlesSearched: 6
          }
        }
      }
    }
  },
  
  // Codes d'erreur
  errorCodes: {
    400: "Paramètres de requête invalides",
    404: "Article non trouvé",
    500: "Erreur serveur interne"
  },
  
  // Exemples d'utilisation pour mobile
  mobileExamples: {
    
    // React Native / Expo
    reactNative: `
// Récupérer la liste des articles
const fetchArticles = async () => {
  try {
    const response = await fetch('https://www.hoomge.com/api/articles?limit=10');
    const data = await response.json();
    
    if (data.success) {
      setArticles(data.data.articles);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Récupérer un article spécifique avec contenu
const fetchArticle = async (articleId) => {
  try {
    const response = await fetch(\`https://www.hoomge.com/api/articles/\${articleId}?includeContent=true\`);
    const data = await response.json();
    
    if (data.success) {
      setCurrentArticle(data.data.article);
      setRelatedArticles(data.data.relatedArticles);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Recherche d'articles
const searchArticles = async (query) => {
  try {
    const response = await fetch(\`https://www.hoomge.com/api/articles/search?q=\${encodeURIComponent(query)}\`);
    const data = await response.json();
    
    if (data.success) {
      setSearchResults(data.data.results);
      setSuggestions(data.data.suggestions);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};
    `,
    
    // Flutter / Dart
    flutter: `
// Service pour les articles
class ArticleService {
  static const String baseUrl = 'https://www.hoomge.com/api/articles';
  
  static Future<List<Article>> getArticles({int limit = 10, int offset = 0}) async {
    final response = await http.get(
      Uri.parse('\$baseUrl?limit=\$limit&offset=\$offset')
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success']) {
        return (data['data']['articles'] as List)
            .map((json) => Article.fromJson(json))
            .toList();
      }
    }
    throw Exception('Erreur lors du chargement des articles');
  }
  
  static Future<Article> getArticle(String id, {bool includeContent = false}) async {
    final response = await http.get(
      Uri.parse('\$baseUrl/\$id?includeContent=\$includeContent')
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['success']) {
        return Article.fromJson(data['data']['article']);
      }
    }
    throw Exception('Article non trouvé');
  }
}
    `
  },
  
  // Modèles de données
  dataModels: {
    Article: {
      id: "number",
      slug: "string",
      title: "string", 
      excerpt: "string",
      author: "string",
      date: "string (YYYY-MM-DD)",
      readTime: "string",
      imageUrl: "string",
      category: "string",
      tags: "string[]",
      language: "string",
      draft: "boolean",
      content: "string (optionnel)"
    },
    
    Category: {
      name: "string",
      count: "number",
      slug: "string"
    },
    
    Tag: {
      name: "string", 
      count: "number",
      slug: "string"
    }
  }
};

export async function GET() {
  return NextResponse.json(apiDocumentation, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
