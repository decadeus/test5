"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ArticleLayout from '../../components/ArticleLayout';

export default function PecherPologneGuide() {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'fr';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: "Pêcher en Pologne : permis, règles et spots — Guide 2025",
    description: "Guide complet pour obtenir son permis de pêche en Pologne : démarches, coûts, règles par région, spots recommandés. Tout pour les expatriés passionnés.",
    image: [
      'https://hoomge.com/Pecher-en-Pologne.png'
    ],
    datePublished: '2025-09-15T00:00:00+00:00',
    dateModified: '2025-09-15T00:00:00+00:00',
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
      '@id': `https://hoomge.com/${currentLocale}/blog/pecher-pologne-permis-regles-guide-2025`
    },
    articleSection: 'Loisirs',
    keywords: 'permis pêche Pologne, karta wędkarska, PZW, pêche Vistule, spots pêche Varsovie, règles pêche Pologne, expatrié pêcheur',
    wordCount: 1500,
    inLanguage: currentLocale,
    about: [
      {
        '@type': 'Thing',
        name: 'Karta wędkarska',
        description: 'Permis de pêche obligatoire en Pologne'
      },
      {
        '@type': 'Organization',
        name: 'PZW',
        description: 'Polski Związek Wędkarski - Fédération polonaise de pêche'
      },
      {
        '@type': 'Place',
        name: 'Vistule',
        description: 'Principal fleuve de Pologne'
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
        title="Pêcher en Pologne : permis, règles et spots — Guide 2025"
        description="Guide complet pour obtenir son permis de pêche en Pologne : démarches, coûts, règles par région, spots recommandés. Tout pour les expatriés passionnés."
        author="Johann Debeaumont"
        date="15 septembre 2025"
        readTime="10 min"
        imageUrl="/Pecher-en-Pologne.png"
        imageAlt="Pêcher en Pologne - Guide des permis et règles"
      >
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Vous êtes passionné de pêche et vous venez de vous installer en Pologne ? Ce guide complet vous explique tout ce qu'il faut savoir pour pêcher légalement : obtenir votre permis, comprendre les règles locales, et découvrir les meilleurs spots.
          </p>

          <h2>Obtenir le permis de pêche (Karta wędkarska)</h2>
          
          <h3>Où s'adresser ?</h3>
          <p>
            En Pologne, le permis de pêche s'obtient auprès du <strong>PZW (Polski Związek Wędkarski)</strong>, la fédération polonaise de pêche. Vous pouvez vous rendre dans :
          </p>
          <ul>
            <li>Les bureaux locaux du PZW dans votre région</li>
            <li>Certains magasins de pêche agréés</li>
            <li>En ligne sur le site officiel du PZW (pour certaines régions)</li>
          </ul>

          <h3>Documents nécessaires</h3>
          <ul>
            <li><strong>PESEL</strong> (numéro d'identification polonais) - obligatoire</li>
            <li><strong>Pièce d'identité</strong> (passeport ou carte d'identité)</li>
            <li><strong>Photo d'identité</strong> récente</li>
            <li><strong>Formulaire de demande</strong> rempli (disponible sur place)</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-400 text-xl">💡</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Astuce :</strong> Si vous n'avez pas encore de PESEL, vous pouvez obtenir un permis temporaire avec votre passeport, mais il faudra le régulariser rapidement.
                </p>
              </div>
            </div>
          </div>

          <h3>Coûts 2025</h3>
          <ul>
            <li><strong>Permis annuel</strong> : environ 80-120 PLN selon la région</li>
            <li><strong>Permis journalier</strong> : 15-25 PLN</li>
            <li><strong>Permis hebdomadaire</strong> : 40-60 PLN</li>
            <li><strong>Frais d'adhésion PZW</strong> : 20-30 PLN (première fois)</li>
          </ul>

          <h2>Types de permis et restrictions</h2>

          <h3>Pêche en eau douce</h3>
          <p>
            Le permis standard couvre la pêche dans les rivières, lacs et étangs publics. Chaque région (voïvodie) peut avoir ses propres règles spécifiques.
          </p>

          <h3>Pêche en mer Baltique</h3>
          <p>
            La pêche depuis la côte est généralement libre, mais certaines zones protégées nécessitent des autorisations spéciales. La pêche en bateau suit d'autres réglementations.
          </p>

          <h3>Quotas et tailles minimales</h3>
          <p>Principales espèces et leurs restrictions :</p>
          <ul>
            <li><strong>Sandre</strong> : taille min. 45 cm, quota 3 par jour</li>
            <li><strong>Brochet</strong> : taille min. 50 cm, quota 2 par jour</li>
            <li><strong>Carpe</strong> : taille min. 30 cm, quota 5 par jour</li>
            <li><strong>Truite</strong> : taille min. 25 cm, quota 3 par jour</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important :</strong> Ces quotas peuvent varier selon les régions et les périodes. Vérifiez toujours les règles locales avant de pêcher.
                </p>
              </div>
            </div>
          </div>

          <h2>Règles spécifiques à connaître</h2>

          <h3>Équipement autorisé</h3>
          <ul>
            <li><strong>Maximum 2 cannes</strong> par pêcheur</li>
            <li><strong>Appâts vivants</strong> : interdits dans certaines zones protégées</li>
            <li><strong>Hameçons sans ardillon</strong> recommandés (obligatoires dans certains lacs)</li>
          </ul>

          <h3>Périodes de fermeture (Ochrona)</h3>
          <p>Principales périodes où la pêche est interdite :</p>
          <ul>
            <li><strong>Sandre</strong> : 1er avril - 31 mai (période de frai)</li>
            <li><strong>Brochet</strong> : 1er février - 30 avril</li>
            <li><strong>Truite</strong> : 1er octobre - 28 février</li>
          </ul>

          <h3>Zones protégées</h3>
          <p>
            Certaines zones sont totalement interdites à la pêche : réserves naturelles, zones de reproduction, proximité des barrages. Respectez la signalisation locale.
          </p>

          <h2>Spots recommandés par région</h2>

          <h3>Région de Varsovie</h3>
          <ul>
            <li><strong>Vistule</strong> : sandres et brochets, accès facile depuis la ville</li>
            <li><strong>Lac Zegrzyński</strong> : carpes et brèmes, très populaire</li>
            <li><strong>Rivière Bug</strong> : pêche plus sauvage, moins fréquentée</li>
          </ul>

          <h3>Mazurie (Région des lacs)</h3>
          <ul>
            <li><strong>Lac Śniardwy</strong> : le plus grand lac de Pologne</li>
            <li><strong>Lac Mamry</strong> : excellent pour les carnassiers</li>
            <li><strong>Lac Niegocin</strong> : truites et corégones</li>
          </ul>

          <h3>Côte Baltique</h3>
          <ul>
            <li><strong>Gdańsk</strong> : pêche depuis les jetées du port</li>
            <li><strong>Sopot</strong> : pêche de nuit depuis la plage</li>
            <li><strong>Kołobrzeg</strong> : excellent pour la pêche en surf-casting</li>
          </ul>

          <h2>Matériel et magasins spécialisés</h2>

          <h3>Chaînes de magasins</h3>
          <ul>
            <li><strong>Sklep Wędkarski</strong> : présent dans toutes les grandes villes</li>
            <li><strong>Jaxon</strong> : marque polonaise réputée</li>
            <li><strong>Robinson</strong> : magasins spécialisés pêche et chasse</li>
          </ul>

          <h3>Appâts locaux populaires</h3>
          <ul>
            <li><strong>Robaki</strong> : vers de terre, très efficaces</li>
            <li><strong>Kukurydza</strong> : maïs, excellent pour les carpes</li>
            <li><strong>Chleb</strong> : mie de pain, appât traditionnel</li>
          </ul>

          <h2>Aspect culturel et social</h2>

          <h3>Clubs de pêche locaux (Koła wędkarskie)</h3>
          <p>
            Rejoindre un club local est un excellent moyen de :
          </p>
          <ul>
            <li>Découvrir les meilleurs spots secrets</li>
            <li>Apprendre les techniques locales</li>
            <li>Participer à des concours et événements</li>
            <li>Pratiquer votre polonais !</li>
          </ul>

          <h3>Étiquette au bord de l'eau</h3>
          <ul>
            <li><strong>Respectez les distances</strong> : minimum 50m entre pêcheurs</li>
            <li><strong>Saluez</strong> : un simple "Dzień dobry" est apprécié</li>
            <li><strong>Partagez vos prises</strong> : tradition locale de solidarité</li>
            <li><strong>Nettoyez</strong> : ramassez vos déchets et ceux des autres</li>
          </ul>

          <h2>Contrôles et sanctions</h2>

          <h3>Que faire lors d'un contrôle ?</h3>
          <p>
            La garde-pêche (Straż rybacka) peut contrôler à tout moment :
          </p>
          <ul>
            <li>Présentez votre permis et pièce d'identité</li>
            <li>Montrez vos prises et matériel</li>
            <li>Restez poli et coopératif</li>
            <li>En cas de problème, demandez un interprète</li>
          </ul>

          <h3>Sanctions courantes</h3>
          <ul>
            <li><strong>Pêche sans permis</strong> : amende 200-500 PLN</li>
            <li><strong>Non-respect des quotas</strong> : amende 100-300 PLN par poisson</li>
            <li><strong>Pêche en période fermée</strong> : amende 300-1000 PLN</li>
          </ul>

          <h2>Conseils pratiques pour débuter</h2>

          <h3>Première sortie réussie</h3>
          <ul>
            <li>Commencez par un lac facile d'accès près de chez vous</li>
            <li>Privilégiez les weekends pour rencontrer d'autres pêcheurs</li>
            <li>Emportez un dictionnaire français-polonais</li>
            <li>Téléchargez l'app "Fishing Points" pour localiser les spots</li>
          </ul>

          <h3>Applications utiles</h3>
          <ul>
            <li><strong>PZW Mobile</strong> : infos officielles et règlements</li>
            <li><strong>Fishing Points</strong> : cartographie des spots</li>
            <li><strong>Pogoda</strong> : météo spécialisée pêche</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400 text-xl">🎣</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  <strong>Conseil d'expert :</strong> La Pologne offre une pêche de qualité exceptionnelle avec des eaux moins pressées qu'en France. Prenez le temps d'apprendre les règles locales, vous serez récompensé par de belles prises !
                </p>
              </div>
            </div>
          </div>

          <h2>Conclusion</h2>
          <p>
            La pêche en Pologne est accessible et réglementée de manière claire. Avec votre permis en poche et le respect des règles locales, vous découvrirez des spots magnifiques et une communauté de pêcheurs accueillante. 
          </p>
          <p>
            N'hésitez pas à vous rapprocher des clubs locaux pour enrichir votre expérience et découvrir les secrets des eaux polonaises !
          </p>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Articles connexes</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">
                  S'installer en Pologne : mon parcours de Français célibataire
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/blog/se-loger-deplacer-pologne-guide-2025`} className="text-blue-600 hover:text-blue-800 underline">
                  Se loger et se déplacer en Pologne — Guide pratique 2025
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </ArticleLayout>
    </>
  );
}
