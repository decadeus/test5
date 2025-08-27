"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ArticleLayout from "../../components/ArticleLayout";

export default function ArticlePage() {
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
    <ArticleLayout
      title="Créer sa micro-entreprise en Pologne : simple et rapide !"
      author="Johann Debeaumont"
      date="2024-02-05"
      readTime="8 min de lecture"
      imageUrl="/CEIDG.png"
      imageAlt="CEIDG - Création d'entreprise en Pologne"
      jsonLd={jsonLd}
    >
      {/* Badge */}
      <div>
        <span className="article-badge">
          💼 Success story
        </span>
      </div>

      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Bonne nouvelle après toutes les galères administratives : créer une micro-entreprise en Pologne, c'est étonnamment simple ! Voici comment j'ai fait avec l'aide de ChatGPT.
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">✅ Pourquoi c'est plus simple qu'ailleurs</h4>
        <p className="info-box-content">
          Contrairement à <Link href={`/${currentLocale}/blog/7`} className="internal-link">l'immatriculation de voiture</Link> qui est un cauchemar, la création d'entreprise en Pologne est <strong>digitalisée, rapide et peu coûteuse</strong>. Tout se fait en ligne !
        </p>
      </div>

      <h2>🎯 Prérequis avant de commencer</h2>
      <p>
        Avant de créer votre micro-entreprise, assurez-vous d'avoir complété ces étapes de base :
      </p>

      <ul>
        <li><strong>PESEL obtenu</strong> - Numéro d'identification polonais</li>
        <li><strong>Compte bancaire polonais ouvert</strong></li>
        <li><strong>Adresse de résidence déclarée (Meldunek)</strong></li>
        <li><strong>NFZ activé</strong> - Couverture santé de base</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">📚 Guides préalables</h4>
        <p className="info-box-content">
          Si vous n'avez pas encore fait ces démarches, consultez mon guide <Link href={`/${currentLocale}/blog/5`} className="internal-link">"S'installer en Pologne"</Link> et l'article sur <Link href={`/${currentLocale}/blog/6`} className="internal-link">le système de santé NFZ</Link>.
        </p>
      </div>

      <h2>💡 Ma méthode avec ChatGPT</h2>
      <p>
        Ne parlant pas polonais, j'ai utilisé ChatGPT comme assistant personnel pour naviguer dans les formulaires administratifs. Voici ma technique :
      </p>

      <div className="step-container">
        <h3 className="step-title">Étape 1 : Préparation avec ChatGPT</h3>
        <p>
          J'ai demandé à ChatGPT de me traduire et expliquer chaque champ des formulaires administratifs polonais.
        </p>

        <div className="info-box-gray">
          <h4 className="info-box-title">💬 Prompt que j'ai utilisé</h4>
          <p className="info-box-content">
            "Je veux créer une micro-entreprise en Pologne via CEIDG. Peux-tu me traduire et expliquer chaque champ du formulaire ? Mon activité sera [votre activité]. Je suis résident français en Pologne avec un PESEL."
          </p>
        </div>
      </div>

      <div className="step-container">
        <h3 className="step-title">Étape 2 : Choix du code PKD</h3>
        <p>
          Le code PKD définit votre activité. C'est crucial pour les taxes et obligations.
        </p>

        <div className="info-box-gray">
          <h4 className="info-box-title">🔍 Trouver son code PKD</h4>
          <p className="info-box-content">
            Utilisez le site officiel GUS.gov.pl ou demandez à ChatGPT de vous aider à identifier le bon code selon votre activité. <strong>Prenez votre temps</strong> - ce choix impacte vos obligations fiscales.
          </p>
        </div>

        <h4>Exemples de codes courants :</h4>
        <ul>
          <li><strong>62.01.Z :</strong> Programmation informatique</li>
          <li><strong>62.02.Z :</strong> Conseil en informatique</li>
          <li><strong>73.11.Z :</strong> Agences de publicité</li>
          <li><strong>74.10.Z :</strong> Design graphique</li>
          <li><strong>85.59.B :</strong> Formation et enseignement</li>
        </ul>
      </div>

      <h2>🖥️ Créer son entreprise sur CEIDG</h2>
      <p>
        CEIDG (Centralna Ewidencja i Informacja o Działalności Gospodarczej) est la plateforme officielle. Tout se fait en ligne, 24h/24.
      </p>

      <div className="step-container">
        <h3 className="step-title">Étape 1 : Connexion au CEIDG</h3>
        <p>
          Rendez-vous sur <strong>prod.ceidg.gov.pl</strong> et connectez-vous avec votre profil personnel (Profil Zaufany) ou via banque en ligne.
        </p>

        <div className="info-box-gray">
          <h4 className="info-box-title">🔐 Authentification</h4>
          <p className="info-box-content">
            Si vous n'avez pas de Profil Zaufany, utilisez l'authentification par votre banque polonaise. C'est plus simple et immédiat.
          </p>
        </div>
      </div>

      <div className="step-container">
        <h3 className="step-title">Étape 2 : Remplir le formulaire</h3>
        <p>
          Le formulaire est long mais logique. Voici les sections principales :
        </p>

        <h4>Informations de base :</h4>
        <ul>
          <li>Données personnelles (automatiquement remplies via PESEL)</li>
          <li>Adresse du siège social (votre adresse de résidence)</li>
          <li>Code PKD d'activité principale</li>
          <li>Date de début d'activité</li>
        </ul>

        <h4>Choix du régime fiscal :</h4>
        <ul>
          <li><strong>Karta podatkowa :</strong> Forfait fixe (rare)</li>
          <li><strong>Ryczałt :</strong> Pourcentage du chiffre d'affaires (recommandé)</li>
          <li><strong>Skala podatkowa :</strong> Impôt progressif</li>
        </ul>

        <div className="info-box-gray">
          <h4 className="info-box-title">💰 Conseil fiscal</h4>
          <p className="info-box-content">
            Pour débuter, choisissez le <strong>ryczałt</strong> (forfait). C'est simple, prévisible et avantageux pour les petits chiffres d'affaires. Taux variable selon l'activité (8,5% à 17%).
          </p>
        </div>
      </div>

      <div className="step-container">
        <h3 className="step-title">Étape 3 : Choix ZUS</h3>
        <p>
          ZUS gère les cotisations sociales. Vous avez plusieurs options :
        </p>

        <h4>Options disponibles :</h4>
        <ul>
          <li><strong>Ulga na start :</strong> 6 mois sans cotisations ZUS (pour nouveaux entrepreneurs)</li>
          <li><strong>Mały ZUS :</strong> Cotisations réduites selon le revenu</li>
          <li><strong>ZUS standard :</strong> Cotisations pleines (~1500 PLN/mois)</li>
        </ul>

        <div className="info-box-gray">
          <h4 className="info-box-title">🎁 Ulga na start</h4>
          <p className="info-box-content">
            Si c'est votre première entreprise en Pologne, profitez de l'<strong>"Ulga na start"</strong> - 6 mois sans cotisations ZUS ! Économie d'environ 9000 PLN.
          </p>
        </div>
      </div>

      <h2>📋 Documents générés automatiquement</h2>
      <p>
        Une fois le formulaire validé, le système génère automatiquement :
      </p>

      <ul>
        <li><strong>NIP :</strong> Numéro d'identification fiscale</li>
        <li><strong>REGON :</strong> Numéro statistique d'entreprise</li>
        <li><strong>Certificat d'immatriculation</strong></li>
        <li><strong>Notifications automatiques</strong> vers ZUS et l'administration fiscale</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">⚡ Rapidité</h4>
        <p className="info-box-content">
          <strong>Tout est instantané !</strong> Dès validation, vous recevez vos numéros et pouvez commencer à facturer. Aucune attente, contrairement à la France.
        </p>
      </div>

      <h2>💰 Coûts et délais</h2>
      <p>
        La création d'entreprise en Pologne est remarquablement accessible :
      </p>

      <h3>Coûts :</h3>
      <ul>
        <li><strong>Inscription CEIDG :</strong> GRATUIT</li>
        <li><strong>Obtention NIP/REGON :</strong> GRATUIT</li>
        <li><strong>ZUS (6 premiers mois avec ulga na start) :</strong> GRATUIT</li>
        <li><strong>Seuls frais :</strong> Éventuellement aide comptable (~300-500 PLN/mois)</li>
      </ul>

      <h3>Délais :</h3>
      <ul>
        <li><strong>Création complète :</strong> 1 journée</li>
        <li><strong>Réception des documents :</strong> Immédiat (PDF téléchargeables)</li>
        <li><strong>Début d'activité :</strong> Dès validation du formulaire</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">💸 Budget total</h4>
        <p className="info-box-content">
          <strong>0 PLN pour commencer !</strong> C'est l'énorme avantage du système polonais. Vous pouvez tester votre activité sans risque financier initial.
        </p>
      </div>

      <h2>📊 Obligations post-création</h2>
      <p>
        Une fois votre entreprise créée, voici vos obligations principales :
      </p>

      <h3>Obligations fiscales :</h3>
      <ul>
        <li><strong>Déclaration mensuelle :</strong> Avant le 20 du mois suivant</li>
        <li><strong>Tenue de registre :</strong> Recettes et dépenses (simple tableur suffisant)</li>
        <li><strong>Facturation :</strong> Obligatoire pour montants &gt; 20 000 PLN/an</li>
      </ul>

      <h3>Obligations ZUS :</h3>
      <ul>
        <li><strong>Déclaration annuelle :</strong> Revenus de l'année écoulée</li>
        <li><strong>Cotisations mensuelles :</strong> Après la période "ulga na start"</li>
        <li><strong>Changements d'activité :</strong> À déclarer dans les 7 jours</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">📱 Outils recommandés</h4>
        <p className="info-box-content">
          <strong>iFirma, Fakturownia ou WFirma :</strong> Plateformes polonaises pour gérer facilement facturation et déclarations. Interface en anglais disponible.
        </p>
      </div>

      <h2>🎯 Avantages du système polonais</h2>
      <p>
        Après avoir créé ma micro-entreprise, voici ce qui m'a le plus impressionné :
      </p>

      <h3>Simplicité administrative :</h3>
      <ul>
        <li><strong>Tout en ligne :</strong> Aucun déplacement physique nécessaire</li>
        <li><strong>Intégration totale :</strong> Une seule démarche pour tous les organismes</li>
        <li><strong>Validation immédiate :</strong> Pas d'attente comme en France</li>
        <li><strong>Documentation claire :</strong> Formulaires bien conçus</li>
      </ul>

      <h3>Avantages fiscaux :</h3>
      <ul>
        <li><strong>Ulga na start :</strong> 6 mois gratuits pour débuter</li>
        <li><strong>Ryczałt avantageux :</strong> Taux fixes prévisibles</li>
        <li><strong>Seuils élevés :</strong> Pas de TVA sous 200 000 PLN/an</li>
        <li><strong>Flexibilité :</strong> Changement de régime possible</li>
      </ul>

      <h3>Support numérique :</h3>
      <ul>
        <li><strong>Plateforme CEIDG moderne :</strong> Interface intuitive</li>
        <li><strong>Outils tiers développés :</strong> Écosystème riche</li>
        <li><strong>Dématérialisation complète :</strong> Zéro papier</li>
      </ul>

      <h2>⚠️ Points d'attention</h2>
      <p>
        Quelques aspects à surveiller pour éviter les erreurs :
      </p>

      <h3>Choix du code PKD :</h3>
      <ul>
        <li><strong>Impact fiscal :</strong> Différents codes = différents taux de ryczałt</li>
        <li><strong>Activités multiples :</strong> Possible mais complexifie la fiscalité</li>
        <li><strong>Changement ultérieur :</strong> Possible mais procédure administrative</li>
      </ul>

      <h3>Gestion ZUS :</h3>
      <ul>
        <li><strong>Fin d'ulga na start :</strong> Anticiper les cotisations qui arrivent</li>
        <li><strong>Revenus minimum :</strong> Attention aux seuils pour mały ZUS</li>
        <li><strong>Arrêt d'activité :</strong> Bien déclarer pour éviter les cotisations</li>
      </ul>

      <h3>Aspects internationaux :</h3>
      <ul>
        <li><strong>Double imposition :</strong> Vérifier les accords France-Pologne</li>
        <li><strong>TVA européenne :</strong> Règles spécifiques selon vos clients</li>
        <li><strong>Facturation en devise :</strong> Implications comptables</li>
      </ul>

      <div className="info-box-red">
        <h4 className="info-box-title">🏦 Important pour les finances</h4>
        <p className="info-box-content">
          <strong>Ouvrez un compte bancaire professionnel dédié.</strong> Bien que non obligatoire légalement, c'est fortement recommandé pour la clarté comptable et les relations bancaires.
        </p>
      </div>

      <h2>💼 Mon expérience concrète</h2>
      <p>
        J'ai créé ma micro-entreprise un dimanche soir, en 2 heures, depuis mon canapé. Comparé aux démarches françaises que j'avais connues, c'était un autre monde !
      </p>

      <h3>Ce qui m'a le plus marqué :</h3>
      <ul>
        <li><strong>La rapidité :</strong> Tout validé en une soirée</li>
        <li><strong>La gratuité totale :</strong> Aucun frais de création</li>
        <li><strong>L'intégration :</strong> Tous les organismes notifiés automatiquement</li>
        <li><strong>La flexibilité :</strong> Possibilité de modifier facilement</li>
      </ul>

      <h3>Mes premiers pas :</h3>
      <ul>
        <li><strong>Première facture :</strong> Émise dès le lendemain</li>
        <li><strong>Compte bancaire pro :</strong> Ouvert la semaine suivante</li>
        <li><strong>Plateforme de facturation :</strong> iFirma configurée rapidement</li>
        <li><strong>Première déclaration :</strong> Simple grâce aux outils en ligne</li>
      </ul>

      <h2>🚀 Conseils pour bien commencer</h2>
      <p>
        Voici mes recommandations pour optimiser votre lancement :
      </p>

      <h3>Avant la création :</h3>
      <ul>
        <li><strong>Définissez précisément votre activité</strong> - Impact sur le code PKD</li>
        <li><strong>Estimez votre chiffre d'affaires</strong> - Influence le choix du régime fiscal</li>
        <li><strong>Préparez vos documents</strong> - PESEL, adresse, coordonnées bancaires</li>
        <li><strong>Choisissez votre date de début</strong> - Peut être différée</li>
      </ul>

      <h3>Juste après la création :</h3>
      <ul>
        <li><strong>Téléchargez tous les certificats</strong> - Gardez-les précieusement</li>
        <li><strong>Configurez votre outil de facturation</strong> - iFirma, Fakturownia, etc.</li>
        <li><strong>Ouvrez un compte bancaire professionnel</strong> - Séparez personnel et pro</li>
        <li><strong>Notez vos échéances</strong> - Déclarations mensuelles et annuelles</li>
      </ul>

      <h3>Développement de l'activité :</h3>
      <ul>
        <li><strong>Surveillez vos seuils</strong> - TVA, changement de régime ZUS</li>
        <li><strong>Anticipez la fin d'ulga na start</strong> - Cotisations ZUS qui arrivent</li>
        <li><strong>Envisagez un comptable</strong> - Quand l'activité se développe</li>
        <li><strong>Optimisez fiscalement</strong> - Révision annuelle du régime</li>
      </ul>

      <h2>🎊 Conclusion : enfin du simple !</h2>
      <p>
        Après <Link href={`/${currentLocale}/blog/7`} className="internal-link">l'enfer de l'immatriculation automobile</Link> et autres complexités administratives, créer une micro-entreprise en Pologne fut un vrai plaisir !
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">✨ Le système polonais en résumé</h4>
        <p className="info-box-content">
          <strong>Gratuit, rapide, simple et flexible.</strong> Tout ce qu'on aimerait avoir en France ! Si vous hésitez à vous lancer, n'hésitez plus - le risque financier est quasi nul.
        </p>
      </div>

      <p>
        L'entrepreneuriat en Pologne est vraiment accessible. Que vous soyez freelance, consultant, ou que vous lanciez une petite activité, le système vous facilite la vie au maximum.
      </p>

      <p>
        Si vous avez d'autres questions sur l'installation en Pologne, consultez aussi mes guides sur <Link href={`/${currentLocale}/blog/5`} className="internal-link">les démarches administratives de base</Link> et <Link href={`/${currentLocale}/blog/6`} className="internal-link">le système de santé NFZ</Link>.
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">📝 Mise à jour</h4>
        <p className="info-box-content">
          Guide basé sur mon expérience de février 2024. Les procédures et avantages fiscaux peuvent évoluer. Vérifiez toujours les informations officielles sur CEIDG.gov.pl avant de commencer.
        </p>
      </div>
    </ArticleLayout>
  );
}