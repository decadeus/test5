import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  return {
    title: t('title') + ' - Retours d\'expérience français',
    description: t('subtitle'),
    keywords: ['expatriation Pologne', 'vivre en Pologne', 'guide français Pologne', 'démarches Pologne', 'PESEL', 'NFZ', 'ZUS', 'Meldunek', 'logement Pologne', 'banque Pologne', 'micro-entreprise Pologne', 'immatriculation voiture Pologne'],
    openGraph: {
      title: t('title') + ' - Retours d\'expérience français',
      description: t('subtitle'),
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
      title: t('title') + ' - Retours d\'expérience français',
      description: t('subtitle'),
      images: ['/Administration.png'],
    },
    alternates: {
      canonical: `/${locale}/blog`,
    },
  };
}

