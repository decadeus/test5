import { createClient } from '@/utils/supabase/server';

export default async function sitemap() {
  const supabase = createClient();
  
  // Récupérer tous les projets
  const { data: projects } = await supabase
    .from('project')
    .select('id, name, city')
    .eq('online', true);

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

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