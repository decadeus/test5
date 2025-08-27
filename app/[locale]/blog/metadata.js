export async function generateMetadata({ params: { locale } }) {

  return {
    title: 'Guide pratique - Retours d\'expérience français en Pologne',
    description: 'Retours d\'expérience français en Pologne : démarches, astuces et conseils pratiques pour s\'installer et vivre sereinement.',
    keywords: ['expatriation Pologne', 'vivre en Pologne', 'guide français Pologne', 'démarches Pologne', 'PESEL', 'NFZ', 'ZUS', 'Meldunek', 'logement Pologne', 'banque Pologne', 'micro-entreprise Pologne', 'immatriculation voiture Pologne'],
    openGraph: {
      title: 'Guide pratique - Retours d\'expérience français en Pologne',
      description: 'Retours d\'expérience français en Pologne : démarches, astuces et conseils pratiques pour s\'installer et vivre sereinement.',
      url: `/${locale}/blog`,
      siteName: 'Hoomge Blog',
      images: [
        {
          url: '/Administration.png',
          width: 1200,
          height: 630,
          alt: 'Guide d\'expatriation en Pologne',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Guide pratique - Retours d\'expérience français en Pologne',
      description: 'Retours d\'expérience français en Pologne : démarches, astuces et conseils pratiques pour s\'installer et vivre sereinement.',
      images: ['/Administration.png'],
    },
    alternates: {
      canonical: `/${locale}/blog`,
    },
  };
}

