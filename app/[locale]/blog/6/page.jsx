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
    headline: "NFZ : Comment utiliser le système de santé polonais",
    description: "Guide complet du système de santé polonais NFZ : CMP, ordonnances numériques, pharmacies, remboursements. Expérience d'un expatrié français en Pologne.",
    image: [
      'https://hoomge.com/apteka.png'
    ],
    datePublished: '2024-01-25T00:00:00+00:00',
    dateModified: '2024-01-25T00:00:00+00:00',
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
      '@id': `https://hoomge.com/${currentLocale}/blog/6`
    },
    articleSection: 'Santé',
    keywords: 'NFZ Pologne, système santé polonais, médecin Pologne, pharmacie, ordonnance numérique',
    wordCount: 2200,
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🏥 Guide pratique
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NFZ : Comment utiliser le système de santé polonais
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Guide pratique pour naviguer dans le système de santé polonais : CMP, ordonnances par code, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.
          </p>
          <div className="flex items-center text-gray-600 mb-4">
            <span>Johann Debeaumont</span>
            <span className="mx-2">•</span>
            <span>25 janvier 2024</span>
            <span className="mx-2">•</span>
            <span>10 min de lecture</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-xl max-w-none text-lg">
          
          <p>
            Après avoir obtenu ma couverture NFZ, j'ai dû apprendre à naviguer dans le système de santé polonais. Voici mon retour d'expérience concret : CMP, ordonnances par code, pharmacies, remboursements et tous les détails pratiques qui m'ont servi au quotidien.
          </p>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">1️⃣ Comprendre le système NFZ</h3>
            <p className="text-gray-800 text-base">
              Le <strong>NFZ (Narodowy Fundusz Zdrowia)</strong> est l'équivalent de la Sécurité sociale française. Une fois inscrit, vous avez accès aux soins de santé publics en Pologne.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-sm mb-0">
                <strong>📋 Différence importante avec la France :</strong> Il n'y a pas de <strong>carte de sécurité sociale</strong> comme en France. Votre numéro PESEL suffit pour tous vos rendez-vous médicaux et à la pharmacie.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-sm mb-0">
                <strong>📚 Prérequis :</strong> Pour obtenir le NFZ, vous devez d'abord avoir votre PESEL. Consultez mon guide <Link href={`/${currentLocale}/blog/5`} className="text-blue-600 hover:text-blue-800 underline">"S'installer en Pologne"</Link> pour les démarches PESEL et autres prérequis administratifs.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">2️⃣ Choisir son médecin généraliste (POZ)</h3>
            <p className="text-gray-800 text-base">
              Première étape importante : <strong>choisir et s'inscrire chez un médecin généraliste</strong>. De mon côté, je me suis inscrit chez un <strong>CMP (Centre Médical Pluridisciplinaire)</strong>.
            </p>
            
            <h4 className="text-lg font-medium text-gray-900 mt-4 mb-2">Les avantages d'un CMP :</h4>
            <ul className="text-gray-800 text-base">
              <li>Centre regroupant <strong>plusieurs médecins</strong></li>
              <li>Plus de <strong>disponibilité</strong> pour les rendez-vous</li>
              <li><strong>Services en ligne</strong> développés</li>
              <li>Continuité des soins même si votre médecin habituel n'est pas disponible</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-900 mt-4 mb-2">Comment prendre rendez-vous :</h4>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-100 border border-blue-300 rounded p-3">
                <h5 className="font-semibold text-blue-800 mb-2">📱 En ligne</h5>
                <p className="text-blue-700 text-sm">Via le site web du CMP - pratique et disponible 24h/24</p>
              </div>
              <div className="bg-orange-100 border border-orange-300 rounded p-3">
                <h5 className="font-semibold text-orange-800 mb-2">🏥 Sur place</h5>
                <p className="text-orange-700 text-sm">Directement au centre médical - idéal pour les urgences</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">3️⃣ Le système d'ordonnances par code</h3>
            <p className="text-gray-800 text-base">
              Le système polonais est <strong>entièrement numérique</strong> pour les ordonnances. Fini le papier !
            </p>

            <h4 className="text-lg font-medium text-gray-900 mt-4 mb-2">Après la consultation :</h4>
            <ol className="text-gray-800 text-base space-y-2">
              <li>1. Le médecin vous donne une <strong>ordonnance avec un code numérique</strong></li>
              <li>2. Il <strong>n'est pas nécessaire</strong> de venir avec l'ordonnance papier à la pharmacie</li>
              <li>3. Le code est automatiquement enregistré dans le système NFZ</li>
            </ol>

            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <h5 className="font-semibold text-gray-800 mb-2">🔄 Renouvellement de médicaments</h5>
              <p className="text-gray-800 text-base">Pour renouveler des médicaments, <strong>pas besoin de revenir voir le médecin</strong> !</p>
              <ol className="text-gray-700 text-sm mt-2 space-y-1">
                <li>1. Faites la demande de renouvellement <strong>en ligne sur le site du CMP</strong></li>
                <li>2. Vous recevez un <strong>nouveau code par email ou SMS</strong></li>
                <li>3. Donnez ce code au pharmacien avec votre PESEL</li>
              </ol>
              <p className="text-green-700 text-sm mt-2">
                <strong>✅ Gain de temps énorme !</strong> Plus besoin de consultation pour un simple renouvellement.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">4️⃣ À la pharmacie (Apteka)</h3>
            
            <h4 className="text-lg font-medium text-gray-900 mb-2">Procédure simple :</h4>
            <ol className="text-gray-800 text-base space-y-2">
              <li>1. Donnez le <strong>code de l'ordonnance</strong> au pharmacien</li>
              <li>2. Présentez votre <strong>numéro PESEL</strong></li>
              <li>3. Le remboursement est <strong>automatique</strong> selon le niveau de prise en charge</li>
              <li>4. Vous payez seulement la <strong>part non remboursée</strong></li>
            </ol>

            <div className="bg-orange-100 border border-orange-300 rounded p-3 mt-3">
              <p className="text-orange-800 text-sm mb-0">
                <strong>💡 Astuce pratique</strong><br/>
                Gardez vos codes d'ordonnance dans votre téléphone. En cas de perte, le pharmacien peut retrouver vos ordonnances avec votre PESEL, mais c'est plus long.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">5️⃣ Spécialistes et hôpital</h3>
            
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mb-4">
              <p className="text-gray-800 text-sm mb-0">
                <strong>⚠️ Règle importante</strong><br/>
                Pour obtenir des rendez-vous avec des <strong>spécialistes ou à l'hôpital</strong>, il faut <strong>obligatoirement un papier (référence) venant du médecin généraliste</strong>.
              </p>
            </div>

            <h4 className="text-lg font-medium text-green-800 mb-2">Comment ça marche :</h4>
            <ol className="text-gray-800 text-base space-y-2">
              <li>1. Consultez votre <strong>médecin généraliste</strong> en premier</li>
              <li>2. Il vous donne une <strong>référence (skierowanie)</strong> si nécessaire</li>
              <li>3. Avec cette référence, vous pouvez prendre rendez-vous chez le spécialiste</li>
              <li>4. Le médecin généraliste est votre <strong>"porte d'entrée"</strong> vers les soins spécialisés</li>
            </ol>

            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <h5 className="font-semibold text-gray-800 mb-2">⏰ Délais d'attente</h5>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Délais plus longs dans le <strong>secteur public</strong></li>
                <li>• Option <strong>privée payante</strong> pour éviter l'attente</li>
                <li>• Certains spécialistes ont des créneaux d'urgence</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">6️⃣ Système de remboursement</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-100 border border-green-300 rounded p-3">
                <h5 className="font-semibold text-green-800 mb-2">100% remboursé</h5>
                <p className="text-green-700 text-sm">Médicaments vitaux (insuline, etc.)</p>
              </div>
              <div className="bg-blue-100 border border-blue-300 rounded p-3">
                <h5 className="font-semibold text-blue-800 mb-2">70% remboursé</h5>
                <p className="text-blue-700 text-sm">Médicaments essentiels</p>
              </div>
              <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                <h5 className="font-semibold text-yellow-800 mb-2">50% remboursé</h5>
                <p className="text-yellow-700 text-sm">Médicaments courants</p>
              </div>
              <div className="bg-orange-100 border border-orange-300 rounded p-3">
                <h5 className="font-semibold text-orange-800 mb-2">30% remboursé</h5>
                <p className="text-orange-700 text-sm">Médicaments de confort</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">7️⃣ Mes conseils pour réussir avec le NFZ</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-100 border border-green-300 rounded p-3">
                <h5 className="font-semibold text-green-800 mb-2">✅ À faire</h5>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Inscrivez-vous dans un bon CMP</li>
                  <li>• Gardez vos codes d'ordonnance dans votre téléphone</li>
                  <li>• Utilisez les services en ligne pour les renouvellements</li>
                  <li>• Demandez une référence au médecin généraliste pour les spécialistes</li>
                  <li>• Mémorisez votre PESEL pour la pharmacie</li>
                </ul>
              </div>
              <div className="bg-red-100 border border-red-300 rounded p-3">
                <h5 className="font-semibold text-red-800 mb-2">❌ À éviter</h5>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Aller directement chez un spécialiste sans référence</li>
                  <li>• Perdre ses codes d'ordonnance</li>
                  <li>• Oublier son PESEL à la pharmacie</li>
                  <li>• Négliger les services en ligne du CMP</li>
                  <li>• Attendre trop longtemps pour prendre rendez-vous</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">💬 Mon expérience personnelle avec le NFZ</h3>
            <p className="text-gray-800 text-base">
              Après avoir eu des difficultés avec l'inscription NFZ au début, j'ai découvert que le système de santé polonais est <strong>très efficace une fois qu'on comprend son fonctionnement</strong>.
            </p>
            <p className="text-gray-800 text-base mt-2">
              Le système d'ordonnances numériques et les services en ligne du CMP sont vraiment pratiques au quotidien. Plus besoin de garder des papiers, tout est digitalisé !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-red-100 border border-red-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">🚨 SOR</div>
              <h4 className="font-semibold text-red-800">Szpitalny Oddział Ratunkowy</h4>
              <p className="text-red-700 text-sm">(Service d'urgences hospitalier)</p>
            </div>
            <div className="bg-blue-100 border border-blue-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">📞 999</div>
              <h4 className="font-semibold text-blue-800">Numéro d'urgence médical polonais</h4>
            </div>
            <div className="bg-orange-100 border border-orange-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">🚨 112</div>
              <h4 className="font-semibold text-orange-800">Numéro d'urgence européen universel</h4>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Mon retour d'expérience</h3>
            <p className="text-gray-800 text-base">
              Le système de santé polonais est <strong>bien plus numérique que le système français</strong> ! Les ordonnances par code et les renouvellements en ligne sont très pratiques.
            </p>
            <p className="text-gray-800 text-base mt-2">
              Le CMP a été un excellent choix : disponibilité, services en ligne, et continuité des soins. Mon conseil : prenez le temps de bien choisir votre centre médical.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <p className="text-gray-800 text-base">
              Guide basé sur mon expérience personnelle avec le système NFZ. Les procédures peuvent varier selon les régions et centres médicaux. En cas de doute, n'hésitez pas à demander directement à votre CMP !
            </p>
          </div>

        </article>
      </div>
      </div>
    </>
  );
}
