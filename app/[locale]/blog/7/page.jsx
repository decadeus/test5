"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ArticlePage() {
  const t = useTranslations("Blog");
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
    description: "Guide détaillé pour immatriculer une voiture française en Pologne : étapes, documents, taxes d'import, assurance. Expérience réelle et coûts détaillés.",
    image: [
      'https://hoomge.com/immatriculation.png'
    ],
    datePublished: '2024-01-30T00:00:00+00:00',
    dateModified: '2024-01-30T00:00:00+00:00',
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
      '@id': `https://hoomge.com/${currentLocale}/blog/7`
    },
    articleSection: 'Transport',
    keywords: 'immatriculation voiture Pologne, taxes import voiture, plaque polonaise, assurance voiture Pologne',
    wordCount: 3000,
    inLanguage: currentLocale
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 pt-40 pb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href={`/${currentLocale}/blog`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          {t("backToBlog")}
        </Link>

        {/* Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            ⚠️ Démarche complexe
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Immatriculer sa voiture française en Pologne : le parcours du combattant
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.
          </p>
          <div className="flex items-center text-gray-600 mb-4">
            <span>Johann Debeaumont</span>
            <span className="mx-2">•</span>
            <span>30 janvier 2024</span>
            <span className="mx-2">•</span>
            <span>12 min de lecture</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-xl max-w-none text-lg">
          
          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">⚠️ Avertissement important</h3>
            <p className="text-gray-800 text-base">
              L'immatriculation d'une voiture française en Pologne est <strong>de loin la démarche la plus complexe et chronophage</strong> de toute l'expatriation. Bien plus difficile que le NFZ, ZUS ou même la création d'une micro-entreprise. Comptez plusieurs mois, beaucoup de patience et un budget conséquent.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">📋 ✅ Informations authentiques</h3>
            <p className="text-gray-800 text-base">
              Cet article contient des <strong>informations officielles</strong> provenant directement de l'administration polonaise (Urząd Miasta). Les documents requis et les montants mentionnés correspondent <strong>exactement aux exigences réelles</strong> que j'ai rencontrées lors de ma propre démarche d'immatriculation.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">🔄 📝 Article en évolution</h3>
            <p className="text-gray-800 text-base">
              <strong>Démarche en cours !</strong> Je suis actuellement en train de récupérer tous les documents nécessaires pour ma propre immatriculation. Cet article sera <strong>mis à jour au fur et à mesure</strong> avec les nouvelles informations que je reçois de l'administration. Chaque mise à jour apporte des détails concrets et vérifiés sur le terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-semibold text-gray-900">Durée</h4>
              <p className="text-gray-800 text-base">3-6 mois minimum</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <h4 className="font-semibold text-gray-900">Difficulté</h4>
              <p className="text-gray-800 text-base">Très élevée</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">€</div>
              <h4 className="font-semibold text-gray-900">Coût estimé</h4>
              <p className="text-gray-800 text-base">3500-20000+ PLN</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">1️⃣ Prérequis absolus avant de commencer</h2>
          
          <p><strong>Avant même d'envisager l'immatriculation, vous DEVEZ avoir :</strong></p>
          <ul className="space-y-2">
            <li><strong>PESEL</strong> - Numéro d'identification polonais</li>
            <li><strong>Meldunek</strong> - Déclaration de résidence (indispensable !)</li>
            <li><strong>Compte bancaire polonais</strong> - Pour les paiements officiels</li>
            <li><strong>Assurance polonaise</strong> - L'assurance française ne suffit pas</li>
            <li><strong>Documents français</strong> - Carte grise, certificat de conformité</li>
          </ul>

          <div className="bg-gray-100 border border-gray-300 rounded p-3 my-4">
            <p className="text-gray-800 text-sm mb-0">
              <strong>📚 Référence :</strong> Pour les démarches PESEL et Meldunek, consultez mon guide <Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">"S'installer en Pologne"</Link>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">2️⃣ Les étapes dans l'ordre chronologique</h2>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Étape 1 : Contrôle technique polonais</h3>
            <p className="text-gray-800">
              Votre véhicule doit passer un contrôle technique polonais (Stacja Kontroli Pojazdów - SKP), même s'il a un contrôle technique français valide.
            </p>
            <ul className="text-gray-800 mt-2 space-y-1">
              <li>• <strong>Durée :</strong> 1 journée (mais attente possible)</li>
              <li>• <strong>Coût :</strong> 80-150 PLN</li>
              <li>• <strong>Validité :</strong> 1 an pour les voitures de plus de 3 ans</li>
            </ul>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Étape 2 : Demande d'immatriculation (WRD)</h3>
            <p className="text-gray-800">
              C'est ici que ça se complique. Rendez-vous au bureau d'immatriculation (Wydział Ruchu Drogowego) avec TOUS vos documents. Cette étape peut prendre des mois.
            </p>
            
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">📋 Documents requis pour la demande d'immatriculation :</h4>
              <ul className="text-gray-800 text-sm space-y-1">
                <li>• <strong>Wniosek</strong> - Formulaire de demande rempli</li>
                <li>• <strong>Dowód osobisty</strong> - Pièce d'identité (passeport)</li>
                <li>• <strong>Meldunek</strong> - Déclaration de résidence</li>
                <li>• <strong>Karta pojazdu</strong> - Carte grise française traduite</li>
                <li>• <strong>Świadectwo homologacji</strong> - Certificat d'homologation (COC)</li>
                <li>• <strong>Badanie techniczne</strong> - Contrôle technique polonais</li>
                <li>• <strong>Opłata 180 PLN</strong> - Taxe d'immatriculation</li>
                <li>• <strong>Zaświadczenie wyrejestrowania</strong> - Certificat de radiation française</li>
              </ul>
              <div className="bg-gray-200 border border-gray-400 rounded p-2 mt-3">
                <p className="text-gray-800 text-xs mb-0">
                  <strong>⚠️ Note :</strong> L'assurance polonaise ne peut être souscrite qu'APRÈS réception des plaques polonaises
                </p>
              </div>
              <p className="text-gray-700 text-xs mt-2">
                ⚠️ Cette liste provient directement de l'administration polonaise (Urząd Miasta)
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Étape 3 : Assurance polonaise - IMMÉDIAT après réception des plaques !</h3>
            <div className="bg-red-100 border border-red-300 rounded p-3 mb-4">
              <p className="text-red-800 text-sm mb-0">
                <strong>⚠️ TIMING CRITIQUE :</strong><br/>
                <strong>Aucune assurance ne voudra vous assurer tant que vous êtes en plaque française !</strong> Il faut attendre d'avoir reçu vos plaques polonaises et votre nouvelle carte grise.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3">
              <p className="text-gray-800 text-sm mb-0">
                <strong>✅ CRUCIAL :</strong><br/>
                Dès que vous récupérez vos <strong>plaques polonaises et votre nouvelle carte grise</strong>, vous devez vous assurer <strong>le jour même</strong>. Rouler sans assurance est illégal !
              </p>
            </div>
            <ul className="text-gray-800 mt-3 space-y-1">
              <li>• <strong>Coût :</strong> 800-1500 PLN/an selon le véhicule</li>
              <li>• <strong>Documents requis :</strong> PESEL, permis de conduire, nouvelle carte grise polonaise</li>
              <li>• <strong>Timing critique :</strong> assurance le jour même de réception des plaques</li>
              <li>• <strong>Obligation :</strong> impossible d'assurer avant d'avoir les plaques polonaises</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">3️⃣ Les principales difficultés</h2>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">🚫 Barrière linguistique majeure</h3>
            <p className="text-gray-800 text-base">
              Contrairement aux autres démarches, Google Traduction ne suffit absolument pas. Les termes techniques automobiles et administratifs sont complexes. Une aide humaine est <strong>INDISPENSABLE</strong>.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">⏰ Délais imprévisibles</h3>
            <p className="text-gray-800 text-base">
              Les délais varient énormément selon les bureaux et les périodes. Certaines démarches peuvent prendre des semaines sans prévenir. Patience et persévérance sont essentielles.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">🚗 Paperasse complexe</h3>
            <p className="text-gray-800 text-base">
              Chaque document français doit être traduit, certifié, apostillé... La moindre erreur peut faire recommencer le processus depuis le début.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">4️⃣ Budget à prévoir</h2>

          <div className="bg-gray-100 border border-gray-400 rounded p-4 my-6">
            <h4 className="font-semibold text-gray-900 mb-3">💰 COÛT MAJEUR : Taxes d'import officiel</h4>
            <p className="text-gray-800 text-sm mb-3">
              <strong>Le plus gros poste de dépense !</strong> Les taxes d'import dépendent de :
            </p>
            <ul className="text-gray-800 text-sm space-y-1 mb-3">
              <li>• <strong>Puissance du moteur</strong> (cylindrée, chevaux)</li>
              <li>• <strong>Âge du véhicule</strong> (voitures anciennes = taxes plus élevées)</li>
              <li>• <strong>Valeur estimée</strong> par l'administration</li>
              <li>• <strong>Émissions CO2</strong> et norme Euro</li>
            </ul>
            <div className="bg-gray-200 border border-gray-500 rounded p-3">
              <p className="text-gray-900 text-sm mb-0">
                <strong>💸 Exemples de taxes d'import :</strong><br/>
                • Petite voiture récente (&lt;5 ans) : 2000-5000 PLN<br/>
                • Voiture moyenne (5-10 ans) : 3000-8000 PLN<br/>
                • Grosse voiture ou ancienne (&gt;10 ans) : 5000-15000+ PLN
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Autres frais obligatoires :</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Assurance : 800-1500 PLN/an</li>
                <li>• Contrôle technique : 80-150 PLN</li>
                <li>• Traductions : 200-500 PLN</li>
                <li>• Taxes d'immatriculation : <strong>180 PLN</strong> (montant officiel)</li>
                <li>• Nouvelles plaques : 80 PLN</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Frais optionnels mais recommandés :</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Aide d'un professionnel : 500-1000 PLN</li>
                <li>• Déplacements multiples : 200-400 PLN</li>
                <li>• Documents supplémentaires : 100-300 PLN</li>
              </ul>
            </div>
          </div>

          <p className="text-center font-semibold text-lg text-gray-800 my-4">
            <strong>Total estimé : 3500-20000+ PLN (selon la voiture)</strong>
          </p>

          <div className="bg-gray-100 border border-gray-300 rounded p-4 my-4">
            <p className="text-gray-800 text-sm mb-0">
              <strong>⚠️ Important :</strong> Les taxes d'import représentent souvent 50-80% du coût total de l'immatriculation. Dans de nombreux cas, il est plus économique de vendre sa voiture en France et d'en racheter une en Pologne !
            </p>
          </div>
          
          <div className="bg-gray-100 border border-gray-300 rounded p-4 my-4">
            <p className="text-gray-800 text-sm mb-0">
              <strong>💼 Entrepreneurs :</strong> Si vous travaillez en freelance, pensez à créer votre micro-entreprise polonaise ! C'est beaucoup plus simple que l'immatriculation de voiture. Consultez mon guide <Link href={`/${currentLocale}/blog/8`} className="text-blue-600 hover:text-blue-800 underline">"Créer sa micro-entreprise en Pologne : simple et rapide !"</Link>
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">5️⃣ Mes conseils pour survivre à cette épreuve</h2>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">✅ À faire absolument</h3>
            <ul className="text-gray-800 space-y-1">
              <li>• Trouvez un interprète ou professionnel spécialisé</li>
              <li>• Préparez TOUS les documents avant de commencer</li>
              <li>• Gardez des copies de tout</li>
              <li>• Prenez rendez-vous le plus tôt possible</li>
              <li>• Vérifiez les horaires et jours d'ouverture</li>
            </ul>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">❌ À éviter</h3>
            <ul className="text-gray-800 space-y-1">
              <li>• Y aller seul sans parler polonais</li>
              <li>• Sous-estimer les délais</li>
              <li>• Négliger un document (tout est important)</li>
              <li>• S'énerver avec les fonctionnaires</li>
              <li>• Essayer de faire l'économie d'une aide professionnelle</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">6️⃣ Alternatives à considérer</h2>

          <div className="bg-gray-100 border border-gray-300 rounded p-4 my-6">
            <h4 className="font-semibold text-gray-900 mb-2">Avant de vous lancer, réfléchissez :</h4>
            <ul className="text-gray-800 space-y-2">
              <li>🚗 <strong>Vendre en France et racheter en Pologne :</strong> Souvent plus simple et économique</li>
              <li>🚗 <strong>Location longue durée :</strong> Évite toute la paperasse administrative</li>
              <li>🚗 <strong>Transports en commun :</strong> En ville, souvent plus pratique qu'une voiture</li>
            </ul>
            <p className="text-gray-800 mt-3">
              Calculez bien le rapport coût/bénéfice avant de vous lancer dans cette aventure !
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">En résumé</h3>
            <p className="text-gray-800">
              L'immatriculation d'une voiture française en Pologne est un véritable marathon administratif. C'est la démarche la plus complexe de toute l'expatriation, bien plus que le NFZ ou la micro-entreprise.
            </p>
            <p className="text-gray-800 mt-2">
              Mon conseil : <strong>pesez bien le pour et le contre</strong>. Dans certains cas, il est plus sage (et économique) de vendre sa voiture en France et d'en racheter une en Pologne. Si vous vous lancez quand même, armez-vous de patience et entourez-vous de professionnels !
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-gray-400 p-4 my-6">
            <p className="text-gray-700 text-sm">
              Cet article sera mis à jour au fur et à mesure de nouvelles expériences. Si vous avez des questions spécifiques ou des retours d'expérience, n'hésitez pas à les partager !
            </p>
          </div>

        </article>
      </div>
      </div>
    </>
  );
}
