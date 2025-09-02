import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentId = parseInt(searchParams.get('id') || '0');
    const locale = searchParams.get('locale') || 'fr';

    if (!currentId) {
      return NextResponse.json({ error: 'ID du projet requis' }, { status: 400 });
    }

    const supabase = createClient();

    // Récupérer le projet actuel
    const { data: currentProject, error: currentError } = await supabase
      .from('project')
      .select('id, name, city, country, qty, cur')
      .eq('id', currentId)
      .eq('online', true)
      .single();

    if (currentError || !currentProject) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    // Récupérer tous les autres projets en ligne
    const { data: allProjects, error: projectsError } = await supabase
      .from('project')
      .select(`
        id, name, city, country, qty, cur, mainpic_url,
        des_fr, des_en, des_pl, des_de, des_ru, des_uk,
        created_at, updated_at
      `)
      .eq('online', true)
      .neq('id', currentId)
      .order('created_at', { ascending: false })
      .limit(20); // Limiter pour les performances

    if (projectsError) {
      console.error('Erreur lors de la récupération des projets:', projectsError);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    // Algorithme de recommandation
    const recommendations = (allProjects || []).map(project => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Même ville = +50 points (priorité absolue)
      if (project.city === currentProject.city) {
        score += 50;
        reasons.push(`Même ville (${project.city})`);
      }

      // 2. Même pays = +30 points
      if (project.country === currentProject.country && project.city !== currentProject.city) {
        score += 30;
        reasons.push(`Même pays (${project.country})`);
      }

      // 3. Taille similaire = +20 points
      const sizeDiff = Math.abs(project.qty - currentProject.qty);
      if (sizeDiff <= 3) {
        score += 20;
        reasons.push('Taille similaire');
      } else if (sizeDiff <= 7) {
        score += 10;
        reasons.push('Taille comparable');
      }

      // 4. Même monnaie = +15 points
      if (project.cur === currentProject.cur) {
        score += 15;
        reasons.push('Même marché');
      }

      // 5. Bonus pour projets récents = +10 points
      if (project.id > currentProject.id - 10) {
        score += 10;
        reasons.push('Projet récent');
      }

      // 6. Bonus pour projets de taille premium (>15 logements) = +5 points
      if (project.qty > 15) {
        score += 5;
        reasons.push('Résidence premium');
      }

      // 7. Bonus si le projet a une image = +5 points
      if (project.mainpic_url) {
        score += 5;
        reasons.push('Avec photos');
      }

      // 8. Malus pour projets très anciens
      if (project.id < currentProject.id - 20) {
        score -= 5;
      }

      return {
        ...project,
        similarity_score: score,
        similarity_reasons: reasons
      };
    });

    // Trier par score et prendre les 4 meilleurs
    const similarProjects = recommendations
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 4);

    // Statistiques pour le monitoring
    const stats = {
      total_projects: allProjects?.length || 0,
      same_city: recommendations.filter(p => p.city === currentProject.city).length,
      same_country: recommendations.filter(p => p.country === currentProject.country).length,
      similar_size: recommendations.filter(p => Math.abs(p.qty - currentProject.qty) <= 3).length,
    };

    return NextResponse.json({
      success: true,
      current_project: currentProject,
      projects: similarProjects,
      stats,
      algorithm_version: '1.0'
    });

  } catch (error) {
    console.error('Erreur dans l\'API des projets similaires:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour calculer la distance géographique (future amélioration)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
