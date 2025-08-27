"use client";
import { useEffect, useRef } from "react";
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
          mermaid.run();
        }
      }
    };

    loadMermaid();
  }, []);

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
            💡 Retour d'expérience
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            S'installer en Pologne : mon parcours de Français célibataire
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Les démarches que j'ai réellement effectuées pour m'installer en Pologne — expliquées simplement, avec un schéma pour visualiser l'enchaînement. Dans mon cas, je ne parle pas polonais, ce qui peut compliquer certaines démarches mais reste tout à fait faisable.
          </p>
          <div className="flex items-center text-gray-600 mb-4">
            <span>Johann Debeaumont</span>
            <span className="mx-2">•</span>
            <span>20 janvier 2024</span>
            <span className="mx-2">•</span>
            <span>8 min de lecture</span>
          </div>
        </header>

        {/* Mermaid Diagram */}
        <div ref={mermaidRef} className="my-8 bg-white p-6 rounded-lg border shadow-sm"></div>
        <p className="text-center text-sm text-gray-500 mb-8">Mon fil rouge : l'ordre des grandes étapes administratives.</p>

        {/* Article Content */}
        <article className="prose prose-xl max-w-none text-lg">
          
          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">1️⃣ Trouver un logement</h3>
            <p className="text-gray-800 text-base">
              Avant toute démarche administrative, il faut bien sûr un logement. Dans mon expérience personnelle, j'ai loué <strong>3 appartements différents en Pologne</strong> : à Włocławek, Łódź et Piaseczno. À chaque fois, le processus était plus simple qu'en France.
            </p>
            <p className="text-gray-800 mt-2 text-base">
              Il ne m'a jamais été demandé de feuille de salaire ou de preuve que j'avais assez d'argent. À chaque fois, il s'agissait d'un <strong>appartement meublé</strong>.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>💰 Avantage :</strong> La mensualité comprenait les frais d'eau, électricité, internet. Il n'y a pas de taxe à payer, tout est inclus dans le loyer. C'est très pratique pour budgéter !
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">2️⃣ Le PESEL : la clé de tout</h3>
            <p className="text-gray-800 text-base">
              <strong>Le PESEL</strong> est le numéro d'identification national. Sans lui, impossible d'avancer.
            </p>
            <p className="text-gray-800 mt-2 text-base">
              Je l'ai demandé à la mairie (Urząd Miasta) avec mon passeport et mon contrat de location. L'administration est stricte mais polie, ça se fait sans stress. Ce numéro est ensuite utilisé partout : banque, ZUS, impôts, etc.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📱 Communication :</strong> Pour le PESEL, Google Traduction a été suffisant pour communiquer avec l'administration. Les documents à fournir sont simples et les employés sont habitués aux étrangers.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">3️⃣ Le compte bancaire polonais</h3>
            <p className="text-gray-800 text-base">
              Juste après, il m'a fallu ouvrir un <strong>compte bancaire polonais</strong>. C'est indispensable : sans compte polonais, impossible de payer ses cotisations ZUS ou de gérer une micro-entreprise.
            </p>
            <p className="text-gray-800 mt-2 text-base">
              Certaines banques demandent le <strong>PESEL</strong> et parfois le <strong>Meldunek</strong> (déclaration de résidence). Pour ma part, ça s'est fait rapidement avec juste le PESEL et mon passeport. Je suis chez <strong>Millennium</strong>, ils ont leur app en anglais, ce qui facilite grandement la gestion au quotidien.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📱 Communication :</strong> Google Traduction a également suffi pour communiquer avec les conseillers bancaires. Ils parlent souvent anglais et la procédure est standardisée.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>💡 Conseil financier :</strong> Si vous avez des comptes bancaires en France, je conseille fortement de prendre une banque en ligne comme <strong>Revolut</strong> pour minimiser les frais de conversion euros/PLN. Les frais de change chez Revolut sont <strong>gratuits en semaine</strong> ! Je vous conseille de transférer une partie de votre argent en euros, convertir en PLN et charger au fur et à mesure votre compte chez Millennium. Cela évite les frais de change exorbitants des banques traditionnelles.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">4️⃣ Sécurité sociale : NFZ et ZUS</h3>
            <p className="text-gray-800 text-base">
              Avec le compte en poche, direction la <strong>sécurité sociale</strong>.
            </p>
            <ul className="text-gray-800 mt-2 mb-2 text-base">
              <li><strong>NFZ</strong> (Narodowy Fundusz Zdrowia) gère la santé publique.</li>
              <li><strong>ZUS</strong> (Zakład Ubezpieczeń Społecznych) s'occupe des cotisations sociales, retraites et assurances.</li>
            </ul>
            <p className="text-gray-800 text-base">
              En tant que célibataire, j'ai opté pour la <strong>cotisation volontaire</strong> au NFZ pour être couvert. C'est une étape assez "paperasse", mais une fois payé, on est tranquille.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>⚠️ Important :</strong> Pour obtenir une sécurité sociale polonaise, il faut un papier de la sécurité sociale française attestant que tu n'es plus lié à leur système. À faire rapidement car le montant à payer dépend de la date à laquelle tu n'es plus lié à la sécu française.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>🤝 Conseil :</strong> Je conseille fortement de venir avec une personne qui parle polonais et qui pourra m'expliquer en français ou anglais ce qui est demandé, car c'est une démarche assez difficile à comprendre mais primordiale.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>🚫 Communication :</strong> Contrairement aux autres démarches, Google Traduction n'a PAS suffi pour communiquer avec l'administration du NFZ. Les concepts sont complexes et les nuances importantes. Une aide humaine est indispensable.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📚 Pour aller plus loin :</strong> Consultez mon guide détaillé <Link href={`/${currentLocale}/blog/6`} className="text-blue-600 hover:text-blue-800 underline">"NFZ : Comment utiliser le système de santé polonais"</Link> pour tout savoir sur les rendez-vous médicaux, pharmacies et remboursements.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">5️⃣ Meldunek : la déclaration de résidence</h3>
            <p className="text-gray-800 text-base">
              Ensuite, place au <strong>Meldunek</strong>, c'est-à-dire la déclaration de résidence en mairie.
            </p>
            <p className="text-gray-800 mt-2 text-base">
              Je l'ai fait à Piaseczno, avec mon contrat de location. C'est une formalité rapide mais importante, car certaines démarches ne sont possibles qu'avec ce papier. Ça permet d'officialiser ton adresse polonaise.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📱 Communication :</strong> Google Traduction a suffi pour communiquer avec l'administration pour le Meldunek aussi. C'est un formulaire simple à remplir avec des informations basiques.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>🚗 Important pour les voitures :</strong> Le Meldunek est obligatoire si vous voulez immatriculer votre voiture française en Pologne. Sans ce document, impossible de faire les démarches d'immatriculation.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">6️⃣ Immatriculer la voiture française en Pologne</h3>
            <p className="text-gray-800 text-base">
              Actuellement <strong>en cours</strong> ! Je suis en train de faire immatriculer ma voiture française avec plaque polonaise. Les étapes principales identifiées jusqu'à présent :
            </p>
            <ul className="text-gray-800 mt-2 mb-2 text-base">
              <li>un <strong>contrôle technique</strong> polonais,</li>
              <li>le changement de <strong>plaque polonaise</strong>,</li>
              <li>l'obtention d'une <strong>carte grise polonaise</strong>,</li>
              <li>et une montagne de <strong>documents à fournir</strong> (liste officielle reçue).</li>
            </ul>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>🔄 Démarche en cours :</strong> Je documente actuellement ma propre démarche d'immatriculation. Au fur et à mesure que je reçois des informations de l'administration, je mets à jour mes guides avec les détails réels et les documents officiels demandés.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>⚠️ Attention :</strong> L'immatriculation de voiture est de loin <strong>la partie la plus longue et difficile</strong> de toutes les démarches administratives en Pologne. C'est bien plus complexe que de déclarer sa micro-entreprise ou même que les démarches NFZ/ZUS. Prévoyez du temps et de la patience !
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📖 Guide complet :</strong> J'ai rédigé un guide détaillé <Link href={`/${currentLocale}/blog/7`} className="text-blue-600 hover:text-blue-800 underline">"Immatriculer sa voiture française en Pologne : le parcours du combattant"</Link> avec toutes les étapes, coûts et difficultés rencontrées (mis à jour en temps réel).
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">7️⃣ Créer une micro-entreprise</h3>
            <p className="text-gray-800 text-base">
              Comme je travaille à mon compte, j'ai ouvert une <strong>micro-entreprise</strong>. La démarche se fait <strong>entièrement en ligne</strong> sur CEIDG : en une déclaration, tu obtiens un <strong>NIP</strong> (numéro fiscal) et un <strong>REGON</strong> (numéro statistique).
            </p>
            <p className="text-gray-800 mt-2 text-base">
              Ensuite, retour au ZUS pour les cotisations. Bonne nouvelle : il existe des régimes de cotisations réduites au démarrage, ce qui aide à se lancer.
            </p>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>🤖 Communication :</strong> L'ouverture de micro-entreprise se fait online. J'ai utilisé <strong>ChatGPT</strong> qui m'a aidé à traduire et m'expliquer ce qui était demandé. Ça a été assez facile et rapide !
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📚 Guide détaillé :</strong> J'ai écrit un article complet <Link href={`/${currentLocale}/blog/8`} className="text-blue-600 hover:text-blue-800 underline">"Créer sa micro-entreprise en Pologne : simple et rapide !"</Link> avec ma méthode ChatGPT et toutes les étapes détaillées.
              </p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-3">
              <p className="text-gray-800 text-base mb-0">
                <strong>📝 Astuce :</strong> garde des copies PDF de tous tes documents (PESEL, meldunek, confirmations ZUS/NFZ). Ça évite de repartir à la chasse au papier.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 my-6">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Conclusion</h3>
            <p className="text-gray-800 text-base">
              Article rédigé comme un retour d'expérience personnel. Si tu prévois de t'installer en Pologne, j'espère que ces notes te seront utiles. N'hésite pas à poser tes questions !
            </p>
          </div>

        </article>
      </div>
      </div>
    </>
  );
}