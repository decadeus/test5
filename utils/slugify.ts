// Utilitaires pour générer des slugs SEO-friendly

/**
 * Convertit une chaîne en slug URL-safe
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remplacer les caractères spéciaux français
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ß]/g, 'ss')
    // Remplacer les caractères polonais
    .replace(/[ąćęłńóśźż]/g, (match) => {
      const map: { [key: string]: string } = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
        'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
      };
      return map[match] || match;
    })
    // Supprimer les caractères non-alphanumériques sauf espaces et tirets
    .replace(/[^a-z0-9\s-]/g, '')
    // Remplacer les espaces par des tirets
    .replace(/\s+/g, '-')
    // Supprimer les tirets multiples
    .replace(/-+/g, '-')
    // Supprimer les tirets en début/fin
    .replace(/^-|-$/g, '');
}

/**
 * Traduit les noms de villes selon la langue
 */
export function translateCity(city: string, locale: string): string {
  const cityTranslations: { [key: string]: { [key: string]: string } } = {
    // Pologne
    'warszawa': { fr: 'varsovie', en: 'warsaw', pl: 'warszawa', de: 'warschau', ru: 'варшава', uk: 'варшава' },
    'kraków': { fr: 'cracovie', en: 'krakow', pl: 'kraków', de: 'krakau', ru: 'краков', uk: 'краків' },
    'gdańsk': { fr: 'gdansk', en: 'gdansk', pl: 'gdańsk', de: 'danzig', ru: 'гданьск', uk: 'гданськ' },
    'wrocław': { fr: 'wroclaw', en: 'wroclaw', pl: 'wrocław', de: 'breslau', ru: 'вроцлав', uk: 'вроцлав' },
    'poznań': { fr: 'poznan', en: 'poznan', pl: 'poznań', de: 'posen', ru: 'познань', uk: 'познань' },
    
    // France
    'paris': { fr: 'paris', en: 'paris', pl: 'paryż', de: 'paris', ru: 'париж', uk: 'париж' },
    'lyon': { fr: 'lyon', en: 'lyon', pl: 'lyon', de: 'lyon', ru: 'лион', uk: 'ліон' },
    'marseille': { fr: 'marseille', en: 'marseille', pl: 'marsylia', de: 'marseille', ru: 'марсель', uk: 'марсель' },
    
    // Monaco
    'monaco': { fr: 'monaco', en: 'monaco', pl: 'monako', de: 'monaco', ru: 'монако', uk: 'монако' },
  };

  const cityKey = slugify(city);
  const translations = cityTranslations[cityKey];
  
  if (translations && translations[locale]) {
    return translations[locale];
  }
  
  // Si pas de traduction, retourner la ville slugifiée
  return slugify(city);
}

/**
 * Génère un slug complet pour un projet
 */
export function generateProjectSlug(
  city: string, 
  projectName: string, 
  locale: string = 'fr'
): string {
  const translatedCity = translateCity(city, locale);
  const slugifiedProject = slugify(projectName);
  
  return `${translatedCity}_${slugifiedProject}`;
}

/**
 * Parse un slug pour extraire ville et nom du projet
 */
export function parseProjectSlug(slug: string): { city: string; projectName: string } {
  const parts = slug.split('_');
  if (parts.length < 2) {
    throw new Error(`Invalid slug format: ${slug}. Expected format: ville_nomduprojet`);
  }
  
  const city = parts[0];
  const projectName = parts.slice(1).join('_'); // Au cas où le nom du projet contient des underscores
  
  return { city, projectName };
}

/**
 * Génère des slugs pour toutes les langues d'un projet
 */
export function generateMultilingualSlugs(city: string, projectName: string) {
  const locales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];
  
  return locales.reduce((acc, locale) => {
    acc[locale] = generateProjectSlug(city, projectName, locale);
    return acc;
  }, {} as { [key: string]: string });
}
