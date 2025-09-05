"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

interface Project {
  id: number;
  name: string;
  city: string;
  country: string;
  qty: number;
  des_fr?: string;
  des_en?: string;
  mainpic_url?: string;
  cur: string;
  avatar?: string;
  compagny?: string;
  lat?: number;
  lng?: number;
  online?: boolean;
  slug?: string;
  user_id?: string;
}

interface SimilarProjectsProps {
  currentProject: Project;
  locale: string;
}

export default function SimilarProjects({ currentProject, locale }: SimilarProjectsProps) {
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectImages, setProjectImages] = useState<{[key: number]: string}>({});
  const supabase = createClient();
  const t = useTranslations('SimilarProjects');

  useEffect(() => {
    fetchSimilarProjects();
  }, [currentProject.id]);

  const fetchSimilarProjects = async () => {
    try {
      // Récupérer les projets depuis Supabase (même logique que List/page.jsx)
      const { data: projects, error } = await supabase
        .from('project')
        .select('id, name, compagny, country, city, lat, lng, online, user_id, slug')
        .eq('online', true)
        .neq('id', currentProject.id)
        .limit(20);

      if (error) {
        console.error('Erreur Supabase:', error);
        setSimilarProjects(generateSimilarProjects(currentProject));
      } else if (projects && projects.length > 0) {
        // Récupérer les projectlists pour calculer qty
        const { data: projectlists, error: errorProjectlists } = await supabase
          .from('projectlist')
          .select('ide, ref, bed, floor, price, surface, garden, rooftop, des');

        if (!errorProjectlists && projectlists) {
          // Enrichir les projets avec les données de projectlist
          const enrichedProjects = projects.map(project => {
            const lots = projectlists.filter(lot => lot.ide === project.id);
            return {
              ...project,
              qty: lots.length,
              cur: 'EUR', // Par défaut
              des_fr: lots[0]?.des || '',
              des_en: lots[0]?.des || ''
            };
          }).filter(p => p.qty > 0); // Garder seulement les projets avec des lots

          const recommendedProjects = recommendProjects(currentProject, enrichedProjects);
          setSimilarProjects(recommendedProjects);
          
          // Récupérer les images pour chaque projet
          await fetchProjectImages(recommendedProjects.slice(0, 3));
        } else {
          setSimilarProjects(generateSimilarProjects(currentProject));
        }
      } else {
        setSimilarProjects(generateSimilarProjects(currentProject));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets similaires:', error);
      setSimilarProjects(generateSimilarProjects(currentProject));
    } finally {
      setLoading(false);
    }
  };

  // Fonction identique à celle de List/page.jsx
  const getProjectImages = async (projectId: number): Promise<string[]> => {
    const { data, error } = await supabase.storage
      .from("project")
      .list(`${projectId}/`, { limit: 20, offset: 0 });
    if (error || !data) return [];
    // Filtre les images image1- à image5-
    const wanted = ["image1-", "image2-", "image3-", "image4-", "image5-"];
    return data
      .filter((file) => wanted.some((prefix) => file.name.startsWith(prefix)))
      .map(
        (file) =>
          supabase.storage
            .from("project")
            .getPublicUrl(`${projectId}/${file.name}`).data.publicUrl
      );
  };

  const fetchProjectImages = async (projects: Project[]) => {
    const imageMap: {[key: number]: string} = {};
    
    for (const project of projects) {
      try {
        const urls = await getProjectImages(project.id);
        if (urls.length > 0) {
          // Prendre la première image (index 0) comme image principale
          imageMap[project.id] = urls[0];
        }
      } catch (error) {
        console.error(`Erreur lors du chargement de l'image pour le projet ${project.id}:`, error);
      }
    }
    
    setProjectImages(imageMap);
  };

  // Logique de recommandation basée sur plusieurs critères
  const generateSimilarProjects = (current: Project): Project[] => {
    // Simuler une base de projets - remplacez par vos vraies données
    const allProjects: Project[] = [
      { id: 194, name: "Attique", city: "Wittelsheim", country: "France", qty: 7, cur: "EUR", des_fr: "Résidence moderne..." },
      { id: 193, name: "Les Jardins", city: "Mulhouse", country: "France", qty: 15, cur: "EUR", des_fr: "Appartements avec jardins..." },
      { id: 192, name: "Villa Moderne", city: "Strasbourg", country: "France", qty: 12, cur: "EUR", des_fr: "Villa contemporaine..." },
      { id: 191, name: "Résidence Parc", city: "Colmar", country: "France", qty: 8, cur: "EUR", des_fr: "Au cœur du parc..." },
      { id: 190, name: "Les Terrasses", city: "Wittelsheim", country: "France", qty: 20, cur: "EUR", des_fr: "Terrasses panoramiques..." },
    ];

    return recommendProjects(current, allProjects);
  };

  const recommendProjects = (current: Project, allProjects: Project[]): Project[] => {
    const recommendations: Array<{ project: Project; score: number; reasons: string[] }> = [];

    allProjects
      .filter(p => p.id !== current.id) // Exclure le projet actuel
      .forEach(project => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Même ville = +100 points (priorité absolue)
        if (project.city === current.city) {
          score += 100;
          reasons.push(`Même ville (${project.city})`);
        }
        // 2. Même pays (mais ville différente) = +50 points
        else if (project.country === current.country) {
          score += 50;
          reasons.push(`Même pays (${project.country})`);
        }

        // 3. Taille similaire = +20 points
        const sizeDiff = Math.abs(project.qty - current.qty);
        if (sizeDiff <= 3) {
          score += 20;
          reasons.push('Taille similaire');
        } else if (sizeDiff <= 7) {
          score += 10;
          reasons.push('Taille comparable');
        }

        // 4. Même monnaie = +15 points
        if (project.cur === current.cur) {
          score += 15;
          reasons.push('Même marché');
        }

        // 5. Bonus pour projets récents (ID élevé) = +10 points
        if (project.id > current.id - 10) {
          score += 10;
          reasons.push('Projet récent');
        }

        // 6. Bonus pour projets de taille premium (>15 logements) = +5 points
        if (project.qty > 15) {
          score += 5;
          reasons.push('Résidence premium');
        }

        recommendations.push({ project, score, reasons });
      });

    // Trier par score décroissant et prendre les 4 meilleurs
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(r => r.project);
  };

  const getRecommendationReason = (project: Project): string => {
    if (project.city === currentProject.city) {
      return `${t('sameCity')} ${project.city}`;
    }
    if (project.country === currentProject.country) {
      return `${t('sameCountry')} ${project.country}`;
    }
    if (Math.abs(project.qty - currentProject.qty) <= 3) {
      return t('similarSize');
    }
    return t('recommended');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">🏘️ {t('title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <div className="bg-gray-200 h-6 rounded mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-3 w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded mb-4 w-1/2"></div>
                <div className="bg-gray-200 h-12 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarProjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">
        🏘️ {t('title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarProjects.slice(0, 3).map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image container */}
            <div className="relative h-64 overflow-hidden">
              {projectImages[project.id] ? (
                <Image
                  src={projectImages[project.id]}
                  alt={`${project.name} - ${project.city}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-2">🏢</div>
                    <div className="text-lg font-medium">{project.name}</div>
                  </div>
                </div>
              )}
              
              {/* Badge nombre d'appartements */}
              <div className="absolute top-4 left-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {project.qty} {project.qty === 1 ? t('apartment') : t('apartments')}
                </span>
              </div>
              
              {/* Bouton favoris */}
              <div className="absolute top-4 right-4">
                <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                  <svg className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Badge de recommandation */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                  {getRecommendationReason(project)}
                </span>
              </div>
            </div>
            
            {/* Contenu de la card */}
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {project.name}
              </h4>
              
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{project.city}</span>
              </div>
              
              <div className="text-gray-500 text-sm mb-4">
                {t('by')} <span className="italic">
                  {project.compagny || 'Promoteur'}
                </span>
              </div>
              
              {/* Bouton voir le détail */}
              <Link
                href={`/${locale}/Projet/Detail/${project.slug || project.id}`}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {t('viewDetail')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link
          href={`/${locale}/Projet/List`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>{t('viewAllProjects')}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
