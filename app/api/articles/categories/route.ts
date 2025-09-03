import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Articles data pour extraire les catégories et tags
const articles = [
  {
    id: 5,
    category: "Administration",
    tags: ["installation", "démarches", "expatriation", "pologne"],
    draft: false
  },
  {
    id: 6,
    category: "Santé",
    tags: ["santé", "nfz", "médecin", "pharmacie", "expatrié"],
    draft: false
  },
  {
    id: 7,
    category: "Transport",
    tags: ["voiture", "immatriculation", "démarches", "transport"],
    draft: false
  },
  {
    id: 8,
    category: "Entreprise",
    tags: ["entreprise", "micro-entreprise", "business", "ceidg"],
    draft: false
  },
  {
    id: 9,
    category: "Logement",
    tags: ["logement", "transport", "meldunek", "budget", "2025"],
    draft: true
  },
  {
    id: 10,
    category: "Loisirs",
    tags: ["pêche", "permis", "loisirs", "sport", "nature"],
    draft: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    
    // Filtrer les articles selon les brouillons
    const filteredArticles = articles.filter(article => 
      !article.draft || includeDrafts
    );
    
    // Extraire les catégories uniques avec comptage
    const categoryMap = new Map<string, number>();
    filteredArticles.forEach(article => {
      const count = categoryMap.get(article.category) || 0;
      categoryMap.set(article.category, count + 1);
    });
    
    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-')
    }));
    
    // Extraire tous les tags uniques avec comptage
    const tagMap = new Map<string, number>();
    filteredArticles.forEach(article => {
      article.tags.forEach(tag => {
        const count = tagMap.get(tag) || 0;
        tagMap.set(tag, count + 1);
      });
    });
    
    const tags = Array.from(tagMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }))
      .sort((a, b) => b.count - a.count); // Trier par popularité
    
    const response = {
      success: true,
      data: {
        categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
        tags,
        totalArticles: filteredArticles.length
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erreur API catégories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la récupération des catégories' 
      },
      { status: 500 }
    );
  }
}
