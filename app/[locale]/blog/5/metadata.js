import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  return {
    title: "S'installer en Pologne : mon parcours de Français célibataire - Guide complet 2024",
    description: "Guide détaillé des démarches pour s'installer en Pologne : PESEL, compte bancaire, NFZ, ZUS, Meldunek. Mon expérience personnelle avec schéma des étapes.",
    keywords: [
      'expatriation Pologne',
      'PESEL Pologne', 
      'installer Pologne français',
      'démarches administratives Pologne',
      'NFZ assurance santé Pologne',
      'ZUS cotisations Pologne',
      'Meldunek résidence Pologne',
      'banque polonaise',
      'logement Pologne',
      'micro-entreprise Pologne',
      'immatriculation voiture Pologne',
      'expatrié français Pologne',
      'vivre en Pologne',
      'guide installation Pologne'
    ],
    authors: [{ name: 'Johann Debeaumont' }],
    openGraph: {
      title: "S'installer en Pologne : mon parcours de Français célibataire",
      description: "Guide détaillé des démarches pour s'installer en Pologne : PESEL, compte bancaire, NFZ, ZUS, Meldunek. Mon expérience personnelle avec schéma des étapes.",
      url: `/${locale}/blog/5`,
      siteName: 'Hoomge Blog',
      images: [
        {
          url: '/Administration.png',
          width: 1200,
          height: 630,
          alt: "Guide d'installation en Pologne - Démarches administratives",
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: '2024-01-20T00:00:00.000Z',
      modifiedTime: '2024-01-20T00:00:00.000Z',
      section: 'Expatriation',
      tags: ['Pologne', 'Expatriation', 'PESEL', 'NFZ', 'Administration'],
    },
    twitter: {
      card: 'summary_large_image',
      title: "S'installer en Pologne : mon parcours de Français célibataire",
      description: "Guide détaillé des démarches pour s'installer en Pologne : PESEL, compte bancaire, NFZ, ZUS, Meldunek.",
      images: ['/Administration.png'],
      creator: '@hoomge',
    },
    alternates: {
      canonical: `/${locale}/blog/5`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
