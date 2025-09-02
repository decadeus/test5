import { Metadata } from 'next';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  locale?: string;
  alternateUrls?: { [key: string]: string };
  jsonLd?: object;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  ogImage = '/appart.webp',
  ogType = 'website',
  locale = 'fr',
  alternateUrls = {},
  keywords,
  author,
  publishedTime,
  modifiedTime,
}: SEOHeadProps): Metadata {
  const baseUrl = 'https://www.hoomge.com';
  
  return {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    
    // Canonical URL
    alternates: {
      canonical: canonical || `${baseUrl}/${locale}`,
      languages: alternateUrls,
    },
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: canonical || `${baseUrl}/${locale}`,
      siteName: 'Hoomge',
      locale,
      type: ogType,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime,
      modifiedTime,
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
    },
    
    // Robots
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
    
    // Verification
    verification: {
      google: 'G-V561ZR7520',
    },
  };
}

// Composant pour JSON-LD
export function JSONLDScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
