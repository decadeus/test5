import { createClient } from '@/utils/supabase/server';

export default async function sitemap() {
  const supabase = createClient();
  
  // Récupérer tous les projets
  const { data: projects } = await supabase
    .from('project')
    .select('id, name, city')
    .eq('online', true);

  // Remplace la logique baseUrl par le domaine de production
  const baseUrl = "https://www.hoomge.com";

  const supportedLocales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];
  
  // Pages statiques COMMERCIALES (à référencer)
  const staticPages = [
    '', // Accueil
    '/projects', // Liste des projets
    '/abonnement', // Page d'abonnement
  ];

  const staticUrls = staticPages.flatMap(page => 
    supportedLocales.map(locale => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  );

  // Pages de projets (à référencer)
  const projectUrls = projects?.flatMap(project => 
    supportedLocales.map(locale => ({
      url: `${baseUrl}/${locale}/Projet/Detail/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })) || []
  ) || [];

  return [...staticUrls, ...projectUrls];
} 