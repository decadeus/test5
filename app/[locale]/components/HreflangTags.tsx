import { headers } from 'next/headers';

interface HreflangTagsProps {
  pathname: string;
  supportedLocales?: string[];
}

export default function HreflangTags({ pathname, supportedLocales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'] }: HreflangTagsProps) {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  // Extraire le chemin sans la locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
  
  return (
    <>
      {/* Balises hreflang pour chaque langue supportée */}
      {supportedLocales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${baseUrl}/${locale}${pathWithoutLocale}`}
        />
      ))}
      
      {/* Balise hreflang x-default (langue par défaut) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/fr${pathWithoutLocale}`}
      />
    </>
  );
} 