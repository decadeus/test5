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
    headline: "S'installer en Pologne : mon parcours de Français célibataire",
    description: "Guide détaillé des démarches pour s'installer en Pologne : PESEL, compte bancaire, NFZ, ZUS, Meldunek. Mon expérience personnelle avec schéma des étapes.",
    image: [
      'https://hoomge.com/Administration.png'
    ],
    datePublished: '2024-01-20T00:00:00+00:00',
    dateModified: '2024-01-20T00:00:00+00:00',
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
      '@id': `https://hoomge.com/${currentLocale}/blog/5`
    },
    articleSection: 'Expatriation',
    keywords: 'expatriation Pologne, PESEL, NFZ, ZUS, Meldunek, installation Pologne',
    wordCount: 2500,
    inLanguage: currentLocale,
    about: [
      {
        '@type': 'Thing',
        name: 'PESEL',
        description: 'Numéro d\'identification polonais'
      },
      {
        '@type': 'Thing', 
        name: 'NFZ',
        description: 'Système de santé polonais'
      }
    ]
  };

  const mermaidRef = useRef(null);

  useEffect(() => {
    const loadMermaid = async () => {
      if (typeof window !== "undefined") {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ 
          startOnLoad: true,
          theme: 'default',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          }
        });
        
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="mermaid">
              flowchart TD
                PESEL[PESEL]
                
                subgraph SS ["🩺 Sécurité sociale"]
                  BANK["🏦 Compte bancaire"]
                  NFZ[NFZ]
                  ZUS1[ZUS]
                  BANK --> NFZ
                  NFZ -->|cotisation volontaire| ZUS1
                end
                
                PESEL --> SS
                
                ZUS1 -->|Résidence| MELDUNEK[Meldunek]
                
                subgraph MICRO ["📊 Micro-entreprise"]
                  NIP["NIP / REGON"]
                  ZUS2[ZUS]
                  NIP -->|cotisation| ZUS2
                end
                
                ZUS1 --> MICRO
                
                subgraph VOITURE ["🚗 Immatriculation de la voiture"]
                  CONTROLE["Contrôle technique"]
                  PLAQUE["Plaque polonaise"]
                  CARTE["Carte de séjour temporaire"]
                end
                
                MELDUNEK --> VOITURE
                
                style PESEL fill:#f5f5f5,stroke:#333,stroke-width:2px
                style SS fill:#fff2cc,stroke:#d6b656,stroke-width:2px
                style MICRO fill:#d5e8d4,stroke:#82b366,stroke-width:2px
                style VOITURE fill:#dae8fc,stroke:#6c8ebf,stroke-width:2px
                style MELDUNEK fill:#f5f5f5,stroke:#333,stroke-width:2px
            </div>
          `;
          
          await mermaid.run({
            querySelector: '.mermaid'
          });
        }
      }
    };

    loadMermaid();
  }, []);

  return (
    <ArticleLayout
      title="S'installer en Pologne : mon parcours de Français célibataire"
      author="Johann Debeaumont"
      date="2024-01-20"
      readTime="8 min de lecture"
      imageUrl="/Administration.png"
      imageAlt="Démarches administratives en Pologne"
      jsonLd={jsonLd}
    >
      {/* Badge */}
      <div>
        <span className="article-badge">
          💡 Retour d'expérience
        </span>
      </div>

      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Les démarches que j'ai réellement effectuées pour m'installer en Pologne — expliquées simplement, avec un schéma pour visualiser l'enchaînement. Dans mon cas, je ne parle pas polonais, ce qui peut compliquer certaines démarches mais reste tout à fait faisable.
      </p>

      <h2>🗺️ Vue d'ensemble : le schéma des étapes</h2>
      <p>
        Avant de détailler chaque démarche, voici le schéma global qui m'a aidé à comprendre l'enchaînement. Chaque étape dépend des précédentes :
      </p>

      <div className="diagram-container">
        <div ref={mermaidRef}></div>
      </div>

      <div className="info-box-gray">
        <h4 className="info-box-title">📋 Points importants du schéma</h4>
        <p className="info-box-content">
          • Le <strong>PESEL est la base de tout</strong> - sans lui, rien n'est possible<br/>
          • Le <strong>compte bancaire est requis pour le NFZ</strong><br/>
          • Le <strong>Meldunek vient après le ZUS</strong> (résidence officielle)<br/>
          • L'<strong>immatriculation de voiture</strong> est la dernière étape
        </p>
      </div>

      <h2>1️⃣ PESEL : votre numéro d'identité polonais</h2>
      <p>
        Le PESEL (Powszechny Elektroniczny System Ewidencji Ludności) est <strong>absolument indispensable</strong>. C'est votre clé d'entrée dans le système administratif polonais.
      </p>

      <h3>Où l'obtenir :</h3>
      <ul>
        <li><strong>Bureau des étrangers</strong> (Urząd do Spraw Cudzoziemców) de votre ville</li>
        <li><strong>Mairie</strong> (Urząd Gminy) selon les communes</li>
        <li><strong>Prendre rendez-vous</strong> à l'avance - souvent complet</li>
      </ul>

      <h3>Documents requis :</h3>
      <ul>
        <li>Passeport ou carte d'identité française</li>
        <li>Justificatif de logement temporaire (hôtel, Airbnb)</li>
        <li>Formulaire de demande (disponible sur place)</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">⏰ Délai d'obtention</h4>
        <p className="info-box-content">
          <strong>Immédiat à 2 semaines</strong> selon la commune. Certaines villes donnent le numéro le jour même, d'autres envoient la carte par courrier.
        </p>
      </div>

      <div className="info-box-red">
        <h4 className="info-box-title">🚨 Important</h4>
        <p className="info-box-content">
          <strong>Gardez précieusement votre numéro PESEL.</strong> Vous en aurez besoin pour absolument tout : banque, santé, logement, impôts, achats importants...
        </p>
      </div>

      <h2>2️⃣ Compte bancaire polonais</h2>
      <p>
        Deuxième étape cruciale : ouvrir un compte bancaire polonais. C'est nécessaire pour recevoir votre salaire et accéder au système de santé NFZ.
      </p>

      <h3>Banques recommandées pour expatriés :</h3>
      <ul>
        <li><strong>ING Bank Śląski :</strong> Interface en anglais, service client anglophone</li>
        <li><strong>mBank :</strong> Application mobile excellente, procédures digitalisées</li>
        <li><strong>PKO Bank Polski :</strong> Plus traditionnelle mais très répandue</li>
        <li><strong>Santander :</strong> Bon service pour les étrangers</li>
      </ul>

      <h3>Documents requis :</h3>
      <ul>
        <li>PESEL (indispensable)</li>
        <li>Passeport ou carte d'identité</li>
        <li>Justificatif de revenus ou promesse d'embauche</li>
        <li>Justificatif de logement</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">💰 Frais bancaires</h4>
        <p className="info-box-content">
          La plupart des banques offrent des <strong>comptes gratuits</strong> avec conditions (revenus minimum, âge...). Comptez 0-20 PLN/mois selon la banque et le type de compte.
        </p>
      </div>

      <h2>3️⃣ NFZ : votre couverture santé</h2>
      <p>
        Le NFZ (Narodowy Fundusz Zdrowia) est l'équivalent de la Sécurité sociale française. Une fois inscrit, vous accédez aux soins publics gratuits.
      </p>

      <h3>Comment s'inscrire :</h3>
      <ul>
        <li><strong>En ligne :</strong> Via le site NFZ avec votre compte bancaire polonais</li>
        <li><strong>Sur place :</strong> Bureau NFZ local avec les documents requis</li>
        <li><strong>Via l'employeur :</strong> Si vous êtes salarié (plus simple)</li>
      </ul>

      <h3>Documents requis :</h3>
      <ul>
        <li>PESEL</li>
        <li>Justificatif de compte bancaire polonais</li>
        <li>Contrat de travail ou justificatif de revenus</li>
        <li>Formulaire de demande</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">🏥 Utilisation pratique</h4>
        <p className="info-box-content">
          Contrairement à la France, <strong>pas de carte vitale</strong>. Votre numéro PESEL suffit chez le médecin et en pharmacie. Pour plus de détails, consultez mon guide sur <Link href={`/${currentLocale}/blog/6`} className="internal-link">le système de santé NFZ</Link>.
        </p>
      </div>

      <h2>4️⃣ ZUS : cotisations sociales</h2>
      <p>
        Le ZUS (Zakład Ubezpieczeń Społecznych) gère les retraites et prestations sociales. Si vous êtes salarié, votre employeur s'en charge. En freelance, vous devez vous inscrire.
      </p>

      <h3>Inscription ZUS :</h3>
      <ul>
        <li><strong>En ligne :</strong> Plateforme ZUS PUE (Platforma Usług Elektronicznych)</li>
        <li><strong>Sur place :</strong> Bureau ZUS local</li>
        <li><strong>Automatique :</strong> Si création d'entreprise via CEIDG</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">💼 Cotisations volontaires</h4>
        <p className="info-box-content">
          En tant qu'étranger avec NFZ, vous pouvez choisir de cotiser ou non au ZUS pour la retraite. <strong>Cotisation minimum :</strong> environ 300-400 PLN/mois.
        </p>
      </div>

      <h2>5️⃣ Meldunek : déclaration de résidence</h2>
      <p>
        Le Meldunek est votre déclaration officielle de résidence. Obligatoire si vous restez plus de 3 mois, c'est l'équivalent d'un changement d'adresse officiel.
      </p>

      <h3>Où faire la démarche :</h3>
      <ul>
        <li><strong>Mairie</strong> (Urząd Gminy/Urząd Miasta) de votre lieu de résidence</li>
        <li><strong>En ligne</strong> dans certaines villes (Varsovie, Cracovie...)</li>
      </ul>

      <h3>Documents requis :</h3>
      <ul>
        <li>PESEL</li>
        <li>Passeport ou carte d'identité</li>
        <li>Contrat de location ou attestation du propriétaire</li>
        <li>Formulaire de déclaration</li>
      </ul>

      <div className="info-box-red">
        <h4 className="info-box-title">⚠️ Obligation légale</h4>
        <p className="info-box-content">
          <strong>Délai maximum : 30 jours</strong> après votre installation. Le non-respect peut entraîner une amende de 50-5000 PLN.
        </p>
      </div>

      <h2>6️⃣ Options avancées</h2>
      <p>
        Une fois les bases établies, vous pouvez aller plus loin selon vos besoins :
      </p>

      <h3>Création d'entreprise :</h3>
      <p>
        Si vous souhaitez devenir freelance ou créer votre activité, consultez mon guide détaillé sur <Link href={`/${currentLocale}/blog/8`} className="internal-link">la création de micro-entreprise en Pologne</Link>. C'est étonnamment simple et rapide !
      </p>

      <h3>Immatriculation de voiture :</h3>
      <p>
        Beaucoup plus complexe et coûteux. J'ai détaillé tout le processus dans mon article sur <Link href={`/${currentLocale}/blog/7`} className="internal-link">l'immatriculation automobile</Link>. Préparez-vous psychologiquement...
      </p>

      <h3>Carte de séjour temporaire :</h3>
      <ul>
        <li><strong>Pas obligatoire</strong> pour les citoyens EU</li>
        <li><strong>Recommandée</strong> pour des séjours longs (facilite certaines démarches)</li>
        <li><strong>Validité :</strong> 5 ans renouvelable</li>
      </ul>

      <h2>💰 Budget total à prévoir</h2>
      <p>
        Voici un récapitulatif des coûts pour s'installer :
      </p>

      <ul>
        <li><strong>PESEL :</strong> Gratuit</li>
        <li><strong>Compte bancaire :</strong> 0-20 PLN/mois</li>
        <li><strong>NFZ :</strong> Gratuit (si éligible) ou ~300 PLN/mois</li>
        <li><strong>ZUS :</strong> Optionnel, ~400 PLN/mois</li>
        <li><strong>Meldunek :</strong> Gratuit</li>
        <li><strong>Traductions de documents :</strong> 50-200 PLN</li>
        <li><strong>Déplacements/temps :</strong> Variable</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">💸 Total estimé</h4>
        <p className="info-box-content">
          <strong>0-500 PLN</strong> pour les démarches de base<br/>
          <em>Plus les frais courants (NFZ, ZUS) selon votre situation</em>
        </p>
      </div>

      <h2>⏱️ Timeline réaliste</h2>
      <p>
        Voici les délais que j'ai réellement expérimentés :
      </p>

      <ul>
        <li><strong>PESEL :</strong> 1 jour à 2 semaines</li>
        <li><strong>Compte bancaire :</strong> 2-5 jours</li>
        <li><strong>NFZ :</strong> 1-2 semaines</li>
        <li><strong>ZUS :</strong> 1 semaine</li>
        <li><strong>Meldunek :</strong> 1 jour</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">📅 Durée totale</h4>
        <p className="info-box-content">
          <strong>1 à 2 mois</strong> pour tout finaliser, selon la réactivité des administrations et votre disponibilité.
        </p>
      </div>

      <h2>😤 Principales difficultés rencontrées</h2>
      <p>
        Voici les obstacles les plus fréquents et comment les surmonter :
      </p>

      <h3>Barrière de la langue :</h3>
      <ul>
        <li><strong>Solution :</strong> Google Translate en mode photo pour les formulaires</li>
        <li><strong>Préparation :</strong> Apprenez quelques mots clés en polonais</li>
        <li><strong>Aide :</strong> Amenez un ami polonophone si possible</li>
      </ul>

      <h3>Documents manquants :</h3>
      <ul>
        <li><strong>Prévention :</strong> Vérifiez la liste avant de partir de France</li>
        <li><strong>Traductions :</strong> Certains documents doivent être traduits officiellement</li>
        <li><strong>Photocopies :</strong> Toujours avoir des copies certifiées</li>
      </ul>

      <h3>Délais variables :</h3>
      <ul>
        <li><strong>Planification :</strong> Commencez tôt, ne sous-estimez pas les délais</li>
        <li><strong>Alternatives :</strong> Plusieurs bureaux peuvent parfois traiter le même dossier</li>
        <li><strong>Patience :</strong> L'administration polonaise peut être lente mais efficace</li>
      </ul>

      <h2>💡 Mes conseils pour réussir</h2>
      <p>
        Après avoir traversé toutes ces étapes, voici mes recommandations :
      </p>

      <h3>Avant de partir de France :</h3>
      <ul>
        <li><strong>Rassemblez tous vos documents</strong> - apostilles, traductions</li>
        <li><strong>Ouvrez un compte épargne de transition</strong> - pour les premiers mois</li>
        <li><strong>Apprenez les bases du polonais</strong> - au moins les formules de politesse</li>
        <li><strong>Contactez des expatriés</strong> - groupes Facebook très actifs</li>
      </ul>

      <h3>Une fois en Pologne :</h3>
      <ul>
        <li><strong>Priorisez le PESEL</strong> - rien n'est possible sans lui</li>
        <li><strong>Gardez tous vos reçus</strong> - utiles pour la suite</li>
        <li><strong>Restez flexible</strong> - les procédures peuvent changer</li>
        <li><strong>Intégrez-vous localement</strong> - ça facilite tout le reste</li>
      </ul>

      <h3>Ressources utiles :</h3>
      <ul>
        <li><strong>Gov.pl :</strong> Site officiel du gouvernement</li>
        <li><strong>Consulat français :</strong> Aide en cas de problème</li>
        <li><strong>Groupes Facebook d'expatriés :</strong> Entraide communautaire</li>
        <li><strong>Google Translate :</strong> Votre meilleur ami pour les formulaires</li>
      </ul>

      <h2>🎯 Mon bilan personnel</h2>
      <p>
        S'installer en Pologne m'a pris environ 6 semaines au total. Certaines démarches sont rapides (PESEL, Meldunek), d'autres plus longues (NFZ, compte bancaire selon la banque).
      </p>

      <h3>Ce qui m'a le plus aidé :</h3>
      <ul>
        <li><strong>La préparation en amont</strong> - documents traduits avant de partir</li>
        <li><strong>La communauté d'expatriés</strong> - conseils précieux sur les groupes</li>
        <li><strong>L'aide d'amis polonais</strong> - pour les démarches complexes</li>
        <li><strong>Google Translate</strong> - indispensable pour comprendre les formulaires</li>
      </ul>

      <h3>Ce que j'aurais fait différemment :</h3>
      <ul>
        <li><strong>Commencer plus tôt</strong> - certaines démarches prennent du temps</li>
        <li><strong>Prévoir plus de budget</strong> - frais imprévus toujours possibles</li>
        <li><strong>Apprendre plus de polonais</strong> - ça facilite vraiment les relations</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">🌟 Conseil final</h4>
        <p className="info-box-content">
          <strong>L'installation en Pologne est faisable et gratifiante !</strong> Oui, il y a de la paperasse, mais le jeu en vaut la chandelle. La Pologne est un pays accueillant avec une administration qui s'améliore constamment.
        </p>
      </div>

      <p>
        Une fois installé, vous pourrez envisager d'autres projets comme <Link href={`/${currentLocale}/blog/8`} className="internal-link">créer votre micro-entreprise</Link> ou même <Link href={`/${currentLocale}/blog/7`} className="internal-link">immatriculer votre voiture française</Link> (bon courage pour cette dernière !).
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">📝 Mise à jour</h4>
        <p className="info-box-content">
          Guide basé sur mon expérience de janvier 2024. Les procédures peuvent évoluer. Vérifiez toujours les informations officielles sur gov.pl avant de commencer vos démarches.
        </p>
      </div>
    </ArticleLayout>
  );
}