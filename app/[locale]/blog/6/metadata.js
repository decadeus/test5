import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'Blog' });

  return {
    title: "NFZ : Comment utiliser le système de santé polonais - Guide pratique 2024",
    description: "Guide complet du système de santé polonais NFZ : CMP, ordonnances numériques, pharmacies, remboursements. Expérience d'un expatrié français en Pologne.",
    keywords: [
      'NFZ Pologne',
      'système santé polonais',
      'assurance santé Pologne',
      'médecin Pologne',
      'pharmacie Pologne',
      'ordonnance Pologne',
      'CMP Pologne',
      'remboursement NFZ',
      'PESEL santé',
      'spécialiste Pologne',
      'expatrié santé Pologne',
      'soins médicaux Pologne',
      'urgences Pologne',
      'SOR Pologne'
    ],
    authors: [{ name: 'Johann Debeaumont' }],
    openGraph: {
      title: "NFZ : Comment utiliser le système de santé polonais",
      description: "Guide complet du système de santé polonais NFZ : CMP, ordonnances numériques, pharmacies, remboursements.",
      url: `/${locale}/blog/6`,
      siteName: 'Hoomge Blog',
      images: [
        {
          url: '/apteka.png',
          width: 1200,
          height: 630,
          alt: "Guide du système de santé polonais NFZ - Pharmacies et soins",
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: '2024-01-25T00:00:00.000Z',
      modifiedTime: '2024-01-25T00:00:00.000Z',
      section: 'Santé',
      tags: ['Pologne', 'NFZ', 'Santé', 'Médecine', 'Expatriation'],
    },
    twitter: {
      card: 'summary_large_image',
      title: "NFZ : Comment utiliser le système de santé polonais",
      description: "Guide complet du système de santé polonais NFZ : CMP, ordonnances numériques, pharmacies, remboursements.",
      images: ['/apteka.png'],
      creator: '@hoomge',
    },
    alternates: {
      canonical: `/${locale}/blog/6`,
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
