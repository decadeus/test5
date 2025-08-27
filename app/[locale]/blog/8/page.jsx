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
    headline: "Créer sa micro-entreprise en Pologne : simple et rapide !",
    description: "Guide complet pour créer une micro-entreprise en Pologne : CEIDG, NIP, REGON, ZUS. Méthode ChatGPT et démarches simplifiées pour entrepreneurs français.",
    image: [
      'https://hoomge.com/CEIDG.png'
    ],
    datePublished: '2024-02-05T00:00:00+00:00',
    dateModified: '2024-02-05T00:00:00+00:00',
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
      '@id': `https://hoomge.com/${currentLocale}/blog/8`
    },
    articleSection: 'Entrepreneuriat',
    keywords: 'micro-entreprise Pologne, CEIDG, NIP REGON, ZUS entrepreneur, freelance Pologne',
    wordCount: 2800,
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
          className="inline-flex items-center text-blue-600 hover:text-gray-900 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          {t("backToBlog")}
        </Link>

        {/* Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-medium bg-gray-100 text-gray-800">
            ✅ Démarche facile
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Créer sa micro-entreprise en Pologne : simple et rapide !
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Bonne nouvelle après tous les galères administratives : créer une micro-entreprise en Pologne, c'est étonnamment simple ! Voici comment j'ai fait avec l'aide de ChatGPT.
          </p>
          <div className="flex items-center text-gray-600 mb-4">
            <span>Johann Debeaumont</span>
            <span className="mx-2">•</span>
            <span>5 février 2024</span>
            <span className="mx-2">•</span>
            <span>8 min de lecture</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-xl max-w-none text-lg">
          
          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">🎉 ✅ Enfin une bonne nouvelle !</h3>
            <p className="text-gray-800 text-base">
              Après les galères du NFZ, l'interminable immatriculation de voiture, voici une démarche <strong>vraiment simple et rapide</strong>. En quelques heures, c'est plié !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-semibold text-gray-900">Durée</h4>
              <p className="text-gray-800 text-base">1-2 heures en ligne</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-semibold text-gray-900">Difficulté</h4>
              <p className="text-gray-800 text-base">Très facile</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center">
              <div className="text-2xl mb-2">€</div>
              <h4 className="font-semibold text-gray-900">Coût</h4>
              <p className="text-gray-800 text-base">Gratuit</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">1️⃣ Ce qu'il faut avoir avant de commencer</h2>
          
          <p className="text-gray-800 text-base">Heureusement, pas besoin de beaucoup de choses :</p>
          <ul className="space-y-2 text-gray-800 text-base">
            <li><strong>PESEL</strong> - Votre numéro d'identification polonais</li>
            <li><strong>Compte bancaire polonais</strong> - Pour recevoir les paiements</li>
            <li><strong>Adresse polonaise</strong> (Meldunek pas forcément obligatoire)</li>
            <li><strong>Une idée de votre activité</strong> - Pour choisir le bon code PKD</li>
          </ul>

          <div className="bg-gray-100 border border-gray-300 rounded p-3 my-4">
            <p className="text-gray-800 text-base mb-0">
              <strong>✅ Bonne nouvelle :</strong> Contrairement au NFZ ou à l'immatriculation de voiture, pas besoin de dizaines de documents traduits. Les bases suffisent !
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">2️⃣ Mon secret : ChatGPT comme assistant de traduction</h2>

          <p className="text-gray-800 text-base">
            Le site CEIDG (Centralna Ewidencja i Informacja o Działalności Gospodarczej) est entièrement en polonais. Mais voici <strong>ma technique qui a parfaitement fonctionné</strong> :
          </p>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">🤖 Ma méthode avec ChatGPT :</h3>
            
            <ol className="text-gray-800 text-base space-y-3">
              <li><strong>1. Je fais une capture d'écran</strong> de la section du formulaire qui me pose problème</li>
              <li><strong>2. Je l'envoie dans ChatGPT avec la demande :</strong> "Traduis en français et explique ce qui est demandé"</li>
              <li><strong>3. ChatGPT analyse l'image et me donne la traduction + des explications claires</strong></li>
              <li><strong>4. Je remplis en connaissance de cause</strong></li>
            </ol>

            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Pourquoi une capture d'écran et pas un copier-coller ?</h4>
              <p className="text-gray-800 text-base">
                Les formulaires CEIDG ont beaucoup de <strong>cases à cocher, menus déroulants et boutons radio</strong>. Avec une capture d'écran, ChatGPT voit la mise en page complète et peut expliquer chaque option. Le copier-coller de texte, c'est compliqué et on perd le contexte visuel !
              </p>
            </div>

            <p className="text-gray-800 text-base mt-3">
              <strong>Résultat :</strong> aucune erreur, aucun malentendu. ChatGPT explique même les nuances juridiques !
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">3️⃣ Les étapes sur le site CEIDG</h2>

          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Étape 1 : Accéder au site CEIDG</h3>
              <p className="text-gray-800 text-base">
                Rendez-vous sur <strong>prod.ceidg.gov.pl</strong> et cliquez sur "Załóż działalność" (Créer une activité). Pas de panique pour la langue, ChatGPT va nous aider !
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Étape 2 : Remplir ses informations personnelles</h3>
              <p className="text-gray-800 text-base">
                PESEL, nom, prénom, adresse... Rien de compliqué. Si un terme vous pose problème, hop, un copier-coller vers ChatGPT et c'est réglé.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Étape 3 : Choisir son code PKD (activité)</h3>
              <p className="text-gray-800 text-base">
                C'est là que ChatGPT brille ! Expliquez-lui votre activité en français, il vous trouvera le bon code PKD et vous expliquera ce qu'il couvre.
              </p>
              <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
                <p className="text-gray-800 text-base mb-0">
                  <strong>💡 Astuce :</strong><br/>
                  Demandez à ChatGPT : "Je fais du développement web freelance, quel code PKD choisir en Pologne ?" Il vous donnera des options précises avec explications.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <h3 className="text-lg font-medium text-orange-800 mb-2">Étape 4 : Validation et soumission</h3>
              <p className="text-orange-700">
                Relecture finale (avec ChatGPT si besoin), signature électronique avec votre PESEL, et c'est parti ! Vous recevez une confirmation par email.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">4️⃣ Ce que vous obtenez automatiquement</h2>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">📋 Vos nouveaux numéros :</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-100 border border-blue-300 rounded p-3">
                <h4 className="font-semibold text-gray-900 mb-1">NIP (numéro fiscal) :</h4>
                <p className="text-gray-800 text-base text-base">Votre identifiant fiscal pour toutes les déclarations d'impôts et factures.</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded p-3">
                <h4 className="font-semibold text-gray-900 mb-1">REGON (numéro statistique) :</h4>
                <p className="text-gray-800 text-base text-base">Numéro d'identification statistique pour l'administration.</p>
              </div>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-4">
              <p className="text-gray-900 text-base mb-0">
                <strong>✅ Et voilà !</strong> Votre micro-entreprise est officiellement créée
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">5️⃣ Les démarches qui suivent</h2>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">✅ Inscription au ZUS (cotisations sociales)</h3>
            <p className="text-gray-800 text-base">
              Maintenant direction le ZUS pour déclarer votre activité et choisir vos cotisations. Bonne nouvelle : il existe des régimes préférentiels pour les débutants !
            </p>
            
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>⚠️ Important - Si vous cotisiez déjà au NFZ :</strong><br/>
                Si vous aviez des cotisations volontaires NFZ avant la micro-entreprise, <strong>il faut retourner au bureau NFZ pour les stopper</strong>. Désormais, c'est ZUS qui gérera votre couverture santé et calculera vos cotisations selon vos revenus de micro-entreprise.
              </p>
            </div>
            
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📚 Guide NFZ :</strong> Pour tout comprendre sur le système de santé polonais et les démarches NFZ/ZUS, consultez mon guide détaillé <Link href={`/${currentLocale}/blog/6`} className="text-blue-600 hover:text-blue-800 underline">"NFZ : Comment utiliser le système de santé polonais"</Link>.
              </p>
            </div>
            
            <div className="bg-blue-100 border border-blue-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>💡 Conseil :</strong> Renseignez-vous sur "Ulga na start" (exonération de début) et "Mały ZUS" (petites cotisations).
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-800 mb-2">Choix du régime fiscal</h3>
          <p>
            Vous devrez choisir entre différents régimes (taxe forfaitaire, impôt linéaire...). Là aussi, ChatGPT peut vous aider à comprendre les différences !
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">6️⃣ Mes conseils pour réussir</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-100 border border-gray-300 rounded p-3">
              <h5 className="font-semibold text-gray-900 mb-2">✅ À faire</h5>
              <ul className="text-gray-800 text-base text-base space-y-1">
                <li>• Utilisez ChatGPT pour traduire et comprendre</li>
                <li>• Préparez vos infos de base à l'avance</li>
                <li>• Choisissez bien votre code PKD</li>
                <li>• Gardez une copie de tous les documents</li>
                <li>• Notez vos NIP et REGON quelque part de sûr</li>
              </ul>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3">
              <h5 className="font-semibold text-gray-900 mb-2">❌ À éviter</h5>
              <ul className="text-gray-800 text-base text-base space-y-1">
                <li>• Se presser sans comprendre les champs</li>
                <li>• Choisir un mauvais code PKD</li>
                <li>• Oublier de noter ses nouveaux numéros</li>
                <li>• Ne pas faire les démarches ZUS après</li>
                <li>• Paniquer devant le polonais (ChatGPT est là !)</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">💬 Mon expérience personnelle</h3>
            <p className="text-gray-800 text-base">
              Franchement, après avoir galéré des mois avec l'immatriculation de voiture et les complications du NFZ, créer ma micro-entreprise m'a pris <strong>2 heures chrono</strong> un dimanche après-midi.
            </p>
            <p className="text-gray-800 text-base mt-2">
              ChatGPT a été un game-changer total. Non seulement il traduit, mais il explique le contexte juridique, ce qui change tout par rapport à Google Traduction. Je recommande cette méthode à 100% !
            </p>
          </div>

          <div className="bg-blue-100 border-l-4 border-blue-400 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">En résumé</h3>
            <p className="text-gray-800 text-base">
              Créer une micro-entreprise en Pologne, c'est la <strong>bonne surprise</strong> de l'expatriation ! Contrairement aux autres démarches, c'est vraiment simple, rapide et gratuit.
            </p>
            <p className="text-gray-800 text-base mt-2">
              Mon conseil : <strong>n'ayez pas peur du polonais</strong>. Avec ChatGPT comme assistant de traduction, vous allez comprendre chaque étape et éviter les erreurs. C'est parti !
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-gray-400 p-4 my-6">
            <p className="text-gray-700 text-base">
              Si vous avez des questions spécifiques sur les codes PKD ou les régimes fiscaux, n'hésitez pas ! L'écosystème entrepreneurial polonais est plutôt accueillant pour les freelances.
            </p>
          </div>

        </article>
      </div>
      </div>
    </>
  );
}
