"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArticleLayout from "../../components/ArticleLayout";

export default function ArticlePage() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: "Se loger et se déplacer en Pologne — Guide pratique 2025",
    description: "Guide complet pour se loger et se déplacer en Pologne : loyers, charges, meldunek, transports. Conseils pratiques et budgets réels pour 2025.",
    image: [
      'https://hoomge.com/Seloger.png'
    ],
    datePublished: '2025-09-04T00:00:00+00:00',
    dateModified: '2025-09-04T00:00:00+00:00',
    author: {
      '@type': 'Person',
      name: 'Johann Debeaumont',
      url: 'https://hoomge.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hoomge',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hoomge.com/favicon.ico'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://hoomge.com/${currentLocale}/blog/se-loger-deplacer-pologne-guide-2025`
    },
    articleSection: 'Logement',
    keywords: 'logement Pologne, loyer Varsovie, meldunek, transport Pologne, czynsz, kaucja',
    wordCount: 1200,
    inLanguage: currentLocale,
    about: [
      {
        '@type': 'Thing',
        name: 'Logement en Pologne',
        description: 'Guide pour se loger en Pologne'
      },
      {
        '@type': 'Thing', 
        name: 'Transport en Pologne',
        description: 'Moyens de transport en Pologne'
      },
      {
        '@type': 'Thing',
        name: 'Meldunek',
        description: 'Déclaration de domicile en Pologne'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout
        title="Se loger et se déplacer en Pologne — Guide pratique 2025"
        author="Johann Debeaumont"
        date="4 septembre 2025"
        readTime="12 min"
        imageUrl="/Seloger.png"
        imageAlt="Se loger en Pologne - Guide pratique 2025"
      >
        <div className="prose prose-lg max-w-none">
          
          <h2>🏠 Louer un appartement</h2>
          
          <h3>Pas besoin de fiche de paie</h3>
          <p>
            En Pologne, les propriétaires demandent rarement des justificatifs de revenus. Il n'est donc pas nécessaire de fournir des fiches de paie comme en France. En revanche, on signe presque toujours un bail écrit avec caution (<strong>kaucja</strong>).
          </p>

          <h3>Impôts et charges</h3>
          <ul>
            <li>Pas d'impôts à payer en plus du loyer côté locataire.</li>
            <li>Le loyer inclut souvent eau, électricité, chauffage, internet.</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Attention :</strong> les prix affichés sur les sites d'annonces ne comprennent pas toujours les charges (<strong>czynsz administracyjny</strong>). Elles peuvent être importantes (500–1200 PLN). Vérifier si la mention "czynsz w cenie" (charges incluses) apparaît.
                </p>
              </div>
            </div>
          </div>

          <h3>Déclaration à la mairie (<Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">meldunek</Link>)</h3>
          <ul>
            <li>Permet d'obtenir un PESEL plus facilement.</li>
            <li>Donne droit à des avantages locaux (ex. transports gratuits à Piaseczno).</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Le <Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">meldunek</Link> est lié à la durée du bail : il faut le refaire à chaque renouvellement de contrat.
                </p>
              </div>
            </div>
          </div>

          <h3>Comprendre le nombre de pièces</h3>
          <p>
            En Pologne, une annonce <strong>"2 pokoje"</strong> signifie :
          </p>
          <p>
            1 chambre + 1 salon, qui est souvent considéré comme zone de couchage. ➡️ Donc un "2 pièces" polonais correspond généralement à un T2 français.
          </p>

          <h3>Conseils pratiques</h3>
          <ul>
            <li>Vérifier le montant exact du czynsz avant signature.</li>
            <li>Demander si le wifi est inclus ou séparé.</li>
            <li>Toujours faire un état des lieux avec photos (<strong>zdjęcia</strong>) à l'entrée.</li>
          </ul>

          <h3>Fourchette de loyers (2025)</h3>
          <ul>
            <li><strong>Varsovie :</strong> 2500–4000 PLN/mois pour un 2 pièces moderne ; 1800–2500 PLN pour un logement plus ancien.</li>
            <li><strong>Piaseczno :</strong> 1800–2800 PLN selon l'immeuble et la proximité avec Varsovie.</li>
            <li><strong>Łódź :</strong> 1500–2200 PLN, les loyers y sont généralement plus bas qu'à Varsovie.</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">💡 Exemple concret : Piaseczno (2025)</h4>
            <p className="text-blue-800 mb-3">
              Dans une résidence récente (moins de 10 ans) à Piaseczno, pour un appartement de 70 m² avec 2 chambres, proche du centre-ville, incluant :
            </p>
            <ul className="text-blue-800 mb-3">
              <li>place de parking souterrain,</li>
              <li>eau, électricité, internet,</li>
            </ul>
            <p className="text-blue-900 font-semibold">
              👉 le loyer total s'élève à <strong>4200 PLN/mois</strong> (environ 950 € au taux de 2025).
            </p>
            <p className="text-blue-700 text-sm mt-2">
              Ce type de logement moderne peut sembler cher comparé aux loyers moyens en Pologne, mais il reflète le confort et la situation privilégiée.
            </p>
          </div>

          <h2>🚌 Se déplacer en Pologne</h2>

          <h3>Transports en commun</h3>
          <ul>
            <li>À <strong>Piaseczno</strong>, le bus est le moyen de transport principal.</li>
            <li>À <strong>Varsovie</strong>, il existe pour l'instant 2 lignes de métro (3ᵉ prévue dans quelques années), quelques lignes de tram, mais le réseau de bus reste central.</li>
            <li>À <strong>Łódź</strong>, pas de métro, mais un réseau de tramway très développé.</li>
            <li>Bus, trams et métros sont propres et bien entretenus.</li>
            <li><strong>Aucun sentiment d'insécurité, même le soir</strong> — contrairement à Paris.</li>
          </ul>

          <h3>Trains</h3>
          <ul>
            <li>Les trains <strong>PKP Intercity</strong> relient efficacement les grandes villes.</li>
            <li>Les compagnies régionales (ex. Koleje Mazowieckie autour de Varsovie) sont pratiques pour les trajets quotidiens.</li>
            <li>Réservation facile via appli PKP.</li>
          </ul>

          <h3>Voiture</h3>
          <ul>
            <li>Utile pour les zones rurales ou hors agglomération.</li>
            <li>Assurance obligatoire (OC) et contrôles techniques réguliers.</li>
          </ul>

          <h3>Vélo et trottinettes</h3>
          <ul>
            <li>Réseaux de vélos en libre-service disponibles dans plusieurs grandes villes.</li>
            <li>À Varsovie, le centre-ville reste peu adapté au vélo pour les trajets quotidiens (trafic dense, peu d'aménagements).</li>
            <li>En dehors de Varsovie, de nombreuses petites villes développent bien leurs pistes cyclables, rendant la pratique plus agréable et sécurisée.</li>
          </ul>

          <h2>💰 Budget global : logement vs. vie quotidienne</h2>
          
          <p>
            Un appartement dans un immeuble récent peut sembler cher pour la Pologne, surtout à Varsovie ou dans les résidences modernes. Mais ces dépenses sont souvent compensées par des économies sur d'autres postes :
          </p>

          <ul>
            <li><strong>Transports en commun :</strong> abonnements abordables (env. 110 PLN/mois à Varsovie) et gratuits dans certaines villes avec le <Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">meldunek</Link> (ex. Piaseczno).</li>
            <li><strong>Alimentation :</strong> produits locaux (fruits, légumes, viande blanche, produits laitiers) moins chers qu'en France.</li>
            <li><strong>Restaurants :</strong> un repas standard coûte généralement deux à trois fois moins cher qu'à Paris.</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 my-8">
            <p className="text-green-800">
              <strong>👉 En résumé,</strong> même si le logement récent représente un poste de dépense conséquent, le coût de la vie quotidienne en Pologne permet d'équilibrer le budget global.
            </p>
          </div>

          <h2>🎯 Conclusion</h2>
          
          <p>
            Se loger en Pologne est généralement plus simple qu'en France (moins de justificatifs, charges incluses), mais il faut bien lire les annonces pour éviter les surprises. Le <Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">meldunek</Link> reste une étape importante et doit être renouvelé avec chaque bail. 
          </p>
          
          <p>
            Côté transport, bus, trams et métros sont propres et sûrs, avec des abonnements abordables, et parfois gratuits pour les résidents.
          </p>

        </div>
      </ArticleLayout>
    </>
  );
}
