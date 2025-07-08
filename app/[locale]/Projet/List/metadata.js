// Génération dynamique des balises meta SEO pour la page List

export async function generateMetadata({ searchParams }) {
  // Récupération des filtres depuis l'URL (Next.js app router)
  const city = searchParams?.city || 'Tous';
  const bed = searchParams?.bed || null;
  const priceMin = searchParams?.priceMin || null;
  const priceMax = searchParams?.priceMax || null;

  let title = 'Liste des appartements – Hoomge';
  let description = 'Découvrez tous nos appartements disponibles à la vente ou à la location. Filtrez par prix, surface, jardin, rooftop, etc.';

  if (city && city !== 'Tous') {
    title = `Appartements à ${city} – Hoomge`;
    description = `Découvrez les appartements disponibles à ${city}`;
    if (bed) {
      title = `Appartements ${bed} chambres à ${city} – Hoomge`;
      description = `Découvrez les appartements ${bed} chambres à ${city} disponibles à la vente ou à la location.`;
    }
    if (priceMin && priceMax) {
      description += ` Prix entre ${priceMin}€ et ${priceMax}€.`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
} 