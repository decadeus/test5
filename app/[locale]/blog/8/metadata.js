import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  return {
    title: "Créer sa micro-entreprise en Pologne : guide simple et rapide 2024",
    description: "Guide complet pour créer une micro-entreprise en Pologne : CEIDG, NIP, REGON, ZUS. Méthode ChatGPT et démarches simplifiées pour entrepreneurs français.",
    keywords: [
      'micro-entreprise Pologne',
      'CEIDG Pologne',
      'créer entreprise Pologne',
      'NIP REGON Pologne',
      'ZUS entrepreneur Pologne',
      'freelance Pologne',
      'auto-entrepreneur Pologne',
      'code PKD Pologne',
      'cotisations ZUS Pologne',
      'ChatGPT administration Pologne',
      'entrepreneur français Pologne',
      'business Pologne',
      'startup Pologne',
      'travailleur indépendant Pologne'
    ],
    authors: [{ name: 'Johann Debeaumont' }],
    openGraph: {
      title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
      description: "Guide complet pour créer une micro-entreprise en Pologne : CEIDG, NIP, REGON, ZUS. Méthode ChatGPT et démarches simplifiées.",
      url: `/${locale}/blog/8`,
      siteName: 'Hoomge Blog',
      images: [
        {
          url: '/CEIDG.png',
          width: 1200,
          height: 630,
          alt: "Guide création micro-entreprise en Pologne - CEIDG",
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: '2024-02-05T00:00:00.000Z',
      modifiedTime: '2024-02-05T00:00:00.000Z',
      section: 'Entrepreneuriat',
      tags: ['Pologne', 'Micro-entreprise', 'CEIDG', 'Entrepreneuriat', 'Business'],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
      description: "Guide complet pour créer une micro-entreprise en Pologne : CEIDG, NIP, REGON, ZUS.",
      images: ['/CEIDG.png'],
      creator: '@hoomge',
    },
    alternates: {
      canonical: `/${locale}/blog/8`,
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
