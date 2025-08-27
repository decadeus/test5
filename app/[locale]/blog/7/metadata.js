import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  return {
    title: "Immatriculer sa voiture française en Pologne : guide complet et coûts 2024",
    description: "Guide détaillé pour immatriculer une voiture française en Pologne : étapes, documents, taxes d'import, assurance. Expérience réelle et coûts détaillés.",
    keywords: [
      'immatriculation voiture Pologne',
      'voiture française Pologne',
      'taxes import voiture Pologne',
      'plaque polonaise',
      'assurance voiture Pologne',
      'contrôle technique Pologne',
      'WRD Pologne',
      'carte grise Pologne',
      'expatrié voiture Pologne',
      'coût immatriculation Pologne',
      'démarches voiture Pologne',
      'documents voiture Pologne',
      'Meldunek voiture',
      'PESEL immatriculation'
    ],
    authors: [{ name: 'Johann Debeaumont' }],
    openGraph: {
      title: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
      description: "Guide détaillé pour immatriculer une voiture française en Pologne : étapes, documents, taxes d'import, assurance.",
      url: `/${locale}/blog/7`,
      siteName: 'Hoomge Blog',
      images: [
        {
          url: '/immatriculation.png',
          width: 1200,
          height: 630,
          alt: "Guide d'immatriculation de voiture française en Pologne",
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: '2024-01-30T00:00:00.000Z',
      modifiedTime: '2024-01-30T00:00:00.000Z',
      section: 'Transport',
      tags: ['Pologne', 'Voiture', 'Immatriculation', 'Transport', 'Expatriation'],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
      description: "Guide détaillé pour immatriculer une voiture française en Pologne : étapes, documents, taxes d'import.",
      images: ['/immatriculation.png'],
      creator: '@hoomge',
    },
    alternates: {
      canonical: `/${locale}/blog/7`,
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
