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
  const defaultLocale = 'fr';

  // Helper: construire les alternates hreflang pour un chemin sans locale
  const buildAlternates = (pathNoLocale: string) => ({
    languages: supportedLocales.reduce<Record<string, string>>((acc, loc) => {
      acc[loc] = `${baseUrl}/${loc}${pathNoLocale}`;
      return acc;
    }, { 'x-default': `${baseUrl}/${defaultLocale}${pathNoLocale}` }),
  });
  
  // Pages statiques COMMERCIALES (à référencer)
  const staticPages = [
    '', // Accueil
    '/projects', // Liste des projets
    '/abonnement', // Page d'abonnement
  ];

  // Une seule entrée par page (locale par défaut), avec toutes les alternates hreflang
  const staticUrls = staticPages.map(page => ({
    url: `${baseUrl}/${defaultLocale}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
    alternates: buildAlternates(page || ''),
  }));

  // Pages de projets (à référencer) — une seule entrée par projet (locale par défaut)
  const projectUrls = (projects?.map(project => ({
    url: `${baseUrl}/${defaultLocale}/Projet/Detail/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
    alternates: buildAlternates(`/Projet/Detail/${project.id}`),
  })) || []);

  return [...staticUrls, ...projectUrls];
} 