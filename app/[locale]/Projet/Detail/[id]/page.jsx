import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DetailClient from "./DetailClient";
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Chatbot from "../../../../components/Chatbot";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id, locale } = params;
  const supabase = createClient();
  const { data: project } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    return {
      title: "Projet introuvable",
      description: "Aucune description disponible.",
    };
  }

  const lang = locale || 'fr';
  const description = project[`des_${lang}`] || project.des_fr || '';

  // === Nouveau: pays dynamique localisé à partir de project.country ===
  const rawCountry = (project.country || '').trim().toLowerCase();
  const COUNTRY_SYNONYMS = {
    // Pologne
    'poland': 'PL', 'polska': 'PL', 'pologne': 'PL', 'polen': 'PL', 'польша': 'PL', 'польща': 'PL',
    // France
    'france': 'FR', 'français': 'FR', 'francja': 'FR', 'frankreich': 'FR', 'франция': 'FR', 'франція': 'FR',
    // Monaco
    'monaco': 'MC',
  };
  const COUNTRY_NAME_MAP = {
    PL: { fr: 'Pologne', en: 'Poland', pl: 'Polska', de: 'Polen', ru: 'Польша', uk: 'Польща' },
    FR: { fr: 'France', en: 'France', pl: 'Francja', de: 'Frankreich', ru: 'Франция', uk: 'Франція' },
    MC: { fr: 'Monaco', en: 'Monaco', pl: 'Monako', de: 'Monaco', ru: 'Монако', uk: 'Монако' },
  };
  const normalizedCountryCode = COUNTRY_SYNONYMS[rawCountry] || null;
  const localizedCountry = normalizedCountryCode
    ? (COUNTRY_NAME_MAP[normalizedCountryCode][lang] || COUNTRY_NAME_MAP[normalizedCountryCode]['en'])
    : (project.country || '');
  const countryPart = localizedCountry ? ` ${localizedCountry}` : '';
  // === Fin pays dynamique ===
  
  // Compter le nombre d'appartements (lots) associés au projet
  const { count: projectlistCount } = await supabase
    .from('projectlist')
    .select('id', { count: 'exact', head: true })
    .eq('ide', id);

  const apartmentsCount = projectlistCount || 0;

  // Titre dynamique selon la langue (injection du pays localisé + nb d'appartements)
  const titleTemplates = {
    fr: `${apartmentsCount} ${apartmentsCount > 1 ? "appartements neufs" : "appartement neuf"} à ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    en: `${apartmentsCount} ${apartmentsCount === 1 ? "new apartment" : "new apartments"} in ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    pl: `${apartmentsCount} ${apartmentsCount === 1 ? "nowe mieszkanie" : "nowe mieszkania"} w ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    de: `${apartmentsCount} ${apartmentsCount === 1 ? "neue Wohnung" : "neue Wohnungen"} in ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    ru: `${apartmentsCount} ${apartmentsCount === 1 ? "новая квартира" : "новые квартиры"} в ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`,
    uk: `${apartmentsCount} ${apartmentsCount === 1 ? "нова квартира" : "нові квартири"} у ${project.city}${localizedCountry ? " (" + localizedCountry + ")" : ""} – ${project.name} | Hoomge`
  };

  const title = titleTemplates[lang] || titleTemplates.fr;

  // Générer les URLs alternatives pour hreflang
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  
  const supportedLocales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];
  const alternates = {};
  
  supportedLocales.forEach(loc => {
    alternates[`${loc}`] = `${baseUrl}/${loc}/Projet/Detail/${id}`;
  });

  const ogUrl = `${baseUrl}/${lang}/Projet/Detail/${id}`;
  const ogImage = (project.avatar && project.avatar.startsWith('http'))
    ? project.avatar
    : `${baseUrl}/appart.webp`;

  return {
    title,
    description,
    alternates: {
      canonical: ogUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      url: ogUrl,
      title,
      description,
      siteName: 'Hoomge',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.name} - ${project.city}`,
        },
      ],
      locale: lang,
      alternateLocale: supportedLocales.filter(l => l !== lang),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function DetailPage({ params }) {
  const { id, locale } = params;
  const supabase = createClient();
  const { data: project } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("compagnie")
    .eq("email", project.promoter_email)
    .maybeSingle();
  const companyName = profile?.compagnie || undefined;

  const { data: lots } = await supabase
    .from("projectlist")
    .select("ref, bed, floor, price, surface")
    .eq("ide", id);
  const lotsData = lots || [];
  const apartmentsCountServer = lotsData.length;

  const headersListPage = headers();
  const hostPage = headersListPage.get('host') || 'localhost:3000';
  const protocolPage = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrlPage = `${protocolPage}://${hostPage}`;
  const langPage = locale || 'fr';
  const ogUrlPage = `${baseUrlPage}/${langPage}/Projet/Detail/${id}`;
  const ogImagePage = (project.avatar && project.avatar.startsWith('http')) ? project.avatar : `${baseUrlPage}/appart.webp`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    url: ogUrlPage,
    name: project.name,
    description: project[`des_${langPage}`] || project.des_fr || '',
    image: ogImagePage,
    dateModified: project.updated_at || undefined,
    seller: companyName ? { '@type': 'Organization', name: companyName } : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.city,
      addressCountry: project.country || undefined,
    },
    itemOffered: {
      '@type': 'ApartmentComplex',
      name: project.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.city,
        addressCountry: project.country || undefined,
      },
      geo: (project.lat && project.lng) ? {
        '@type': 'GeoCoordinates',
        latitude: Number(project.lat),
        longitude: Number(project.lng),
      } : undefined,
      numberOfUnits: apartmentsCountServer || undefined,
    },
    offers: (lotsData || []).map((lot) => ({
      '@type': 'Offer',
      url: `${ogUrlPage}#lot-${lot.ref || ''}`,
      price: typeof lot.price === 'number' ? lot.price : Number(lot.price) || undefined,
      priceCurrency: project.cur || 'EUR',
      availability: 'https://schema.org/InStock',
      itemOffered: {
        '@type': 'Apartment',
        numberOfRooms: typeof lot.bed === 'number' ? lot.bed : Number(lot.bed) || undefined,
        floorLevel: typeof lot.floor === 'number' ? lot.floor : Number(lot.floor) || undefined,
        floorSize: (lot.surface != null) ? {
          '@type': 'QuantitativeValue',
          value: typeof lot.surface === 'number' ? lot.surface : Number(lot.surface) || undefined,
          unitCode: 'MTR',
        } : undefined,
        name: `${project.name} - ${lot.ref || ''}`.trim(),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="max-w-6xl mx-auto px-4 mb-6">
        <p className="text-gray-700">
          {apartmentsCountServer} {apartmentsCountServer > 1 ? 'appartements' : 'appartement'} à {project.city}{project.country ? ` (${project.country})` : ''}. {companyName ? `Promoteur: ${companyName}.` : ''}
        </p>
        {project.updated_at && (
          <p className="text-gray-500 text-sm">
            Dernière mise à jour: <time dateTime={new Date(project.updated_at).toISOString()}>{new Date(project.updated_at).toLocaleDateString('fr-FR')}</time>
          </p>
        )}
      </section>
      <DetailClient project={project} locale={locale} />
      <Chatbot />
    </>
  );
}
