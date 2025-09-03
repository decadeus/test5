import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// Articles data - même structure que dans l'API principale
const articles = [
  {
    id: 5,
    slug: "installer-pologne-parcours-francais-celibataire",
    title: "S'installer en Pologne : mon parcours de Français célibataire",
    excerpt: "Les démarches que j'ai réellement effectuées pour m'installer en Pologne — expliquées simplement, avec un schéma pour visualiser l'enchaînement. Dans mon cas, je ne parle pas polonais, ce qui peut compliquer certaines démarches mais reste tout à fait faisable.",
    author: "Johann Debeaumont",
    date: "2024-01-20",
    readTime: "8 min",
    imageUrl: "/Administration.png",
    draft: false,
    category: "Administration",
    tags: ["installation", "démarches", "expatriation", "pologne"],
    language: "fr",
    content: `S'installer en Pologne : mon parcours de Français célibataire

Après avoir vécu cette expérience d'installation en Pologne, je partage avec vous les étapes concrètes que j'ai suivies. Ce guide pratique vous évitera les erreurs que j'ai commises et vous donnera une vision claire du processus.

## Les étapes essentielles

### 1. Préparation depuis la France
- Rassembler tous les documents officiels
- Faire traduire les documents importants
- Ouvrir un compte bancaire international
- Souscrire une assurance santé temporaire

### 2. Arrivée en Pologne
- Trouver un logement temporaire
- S'inscrire à la mairie (meldunek)
- Obtenir le PESEL
- Ouvrir un compte bancaire local

### 3. Installation définitive
- Signer un bail de location
- S'inscrire au NFZ (sécurité sociale)
- Trouver un emploi ou créer son entreprise
- Apprendre les bases du polonais

## Les difficultés rencontrées

La barrière de la langue est le principal obstacle. Même si beaucoup de Polonais parlent anglais, les démarches administratives se font en polonais. J'ai souvent eu besoin d'aide pour remplir les formulaires.

Les délais sont également plus longs qu'en France. Il faut compter plusieurs semaines pour certaines démarches, notamment l'obtention du PESEL.

## Conseils pratiques

1. **Patience** : Les démarches prennent du temps
2. **Préparation** : Avoir tous ses documents traduits
3. **Réseau** : Se faire aider par la communauté française
4. **Apprentissage** : Commencer le polonais avant d'arriver

## Budget approximatif

- Traductions de documents : 200-300€
- Frais administratifs : 100-200€
- Logement temporaire : 800-1200€/mois
- Assurance santé : 50-100€/mois

L'installation en Pologne est tout à fait faisable, même sans parler polonais. Il faut juste être patient et bien préparé !`
  },
  {
    id: 6,
    slug: "nfz-systeme-sante-polonais-guide",
    title: "NFZ : Comment utiliser le système de santé polonais",
    excerpt: "Guide pratique pour naviguer dans le système de santé polonais : médecins, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.",
    author: "Johann Debeaumont", 
    date: "2025-07-25",
    readTime: "10 min",
    imageUrl: "/apteka.png",
    draft: false,
    category: "Santé",
    tags: ["santé", "nfz", "médecin", "pharmacie", "expatrié"],
    language: "fr",
    content: `NFZ : Comment utiliser le système de santé polonais

Le système de santé polonais peut sembler complexe au premier abord, mais une fois que vous comprenez le fonctionnement du NFZ (Narodowy Fundusz Zdrowia), tout devient plus simple.

## Qu'est-ce que le NFZ ?

Le NFZ est l'équivalent de notre Sécurité Sociale française. C'est l'organisme qui gère l'assurance maladie publique en Pologne.

## Comment s'inscrire au NFZ

### Conditions d'éligibilité
- Avoir un PESEL
- Résider légalement en Pologne
- Être employé ou cotiser volontairement

### Démarches d'inscription
1. Se rendre dans un bureau NFZ local
2. Présenter son PESEL et ses documents d'identité
3. Remplir le formulaire d'inscription
4. Attendre la confirmation (1-2 semaines)

## Choisir son médecin traitant

Contrairement à la France, vous devez choisir un médecin traitant (lekarz rodzinny) dès votre inscription.

### Comment procéder
1. Chercher un médecin qui accepte de nouveaux patients
2. Se présenter au cabinet avec sa carte NFZ
3. Signer un contrat de soins
4. Le médecin devient votre référent

## Les consultations

### Médecin traitant
- Consultation gratuite avec la carte NFZ
- Prise de rendez-vous par téléphone
- Délais variables (1 jour à 2 semaines)

### Spécialistes
- Nécessité d'une référence du médecin traitant
- Délais plus longs (1 à 6 mois selon la spécialité)
- Possibilité de payer pour aller plus vite

## Les pharmacies (Apteka)

### Médicaments remboursés
- Présenter l'ordonnance et la carte NFZ
- Paiement du ticket modérateur
- Remboursement de 50% à 100% selon le médicament

### Médicaments en vente libre
- Disponibles sans ordonnance
- Prix généralement plus bas qu'en France
- Pharmaciens très compétents

## Les urgences

### Urgences vitales
- Appeler le 999 ou 112
- Prise en charge immédiate et gratuite
- Hôpitaux publics de qualité

### Urgences non vitales
- Se rendre aux "Izba Przyjęć" (urgences hospitalières)
- Attente possible de plusieurs heures
- Gratuit avec la carte NFZ

## Conseils pratiques

1. **Toujours avoir sa carte NFZ** sur soi
2. **Apprendre quelques mots de polonais** médical de base
3. **Garder les ordonnances** pour les renouvellements
4. **Prévoir du temps** pour les rendez-vous spécialisés

## Assurance privée complémentaire

Beaucoup d'expatriés souscrivent une assurance privée pour :
- Réduire les délais d'attente
- Avoir accès à des médecins anglophones
- Bénéficier de chambres individuelles

Le système NFZ fonctionne bien une fois qu'on en comprend les règles. La qualité des soins est excellente, il faut juste s'armer de patience !`
  },
  {
    id: 7,
    slug: "immatriculer-voiture-francaise-pologne-guide",
    title: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
    excerpt: "Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.",
    author: "Johann Debeaumont",
    date: "2025-07-30", 
    readTime: "12 min",
    imageUrl: "/immatriculation.png",
    draft: false,
    category: "Transport",
    tags: ["voiture", "immatriculation", "démarches", "transport"],
    language: "fr",
    content: `Immatriculer sa voiture française en Pologne : le parcours du combattant

Je vous préviens tout de suite : l'immatriculation d'une voiture française en Pologne est LA démarche la plus complexe et la plus longue de toutes celles que j'ai dû faire. Préparez-vous psychologiquement !

## Pourquoi immatriculer sa voiture ?

Si vous résidez en Pologne plus de 6 mois, vous êtes légalement obligé d'immatriculer votre véhicule français. Pas le choix !

## Les documents nécessaires

### Documents français à traduire
- Carte grise française (certificat d'immatriculation)
- Certificat de conformité européen
- Facture d'achat ou certificat de cession
- Contrôle technique français récent

### Documents polonais à obtenir
- PESEL (indispensable)
- Certificat de résidence (zaświadczenie o zameldowaniu)
- Assurance polonaise (OC)
- Contrôle technique polonais (badanie techniczne)

## Les étapes du parcours du combattant

### 1. Traduction des documents (1-2 semaines)
Tous les documents français doivent être traduits par un traducteur assermenté polonais. Coût : 300-500€.

### 2. Contrôle technique polonais (1 semaine)
Même si votre contrôle technique français est récent, vous devez refaire un contrôle en Pologne. Coût : 50-100€.

### 3. Assurance polonaise (1 jour)
Souscrire une assurance OC (responsabilité civile) auprès d'un assureur polonais. Coût : 300-800€/an.

### 4. Expertise du véhicule (2-4 semaines)
Un expert agréé doit évaluer votre véhicule pour déterminer la taxe d'immatriculation. Coût : 100-200€.

### 5. Paiement des taxes (1 jour)
Payer la taxe d'immatriculation calculée par l'expert. Montant très variable selon l'âge et la valeur du véhicule.

### 6. Demande d'immatriculation (1-2 semaines)
Se rendre au bureau d'immatriculation (wydział komunikacji) avec tous les documents. Coût : 80€.

## Les difficultés rencontrées

### La barrière de la langue
Tous les formulaires sont en polonais. Les employés parlent rarement anglais. J'ai dû me faire accompagner par un ami polonais.

### Les délais imprévisibles
Chaque étape peut prendre plus de temps que prévu. L'expertise de mon véhicule a pris 6 semaines au lieu des 2 annoncées.

### Les documents manquants
À chaque étape, on vous demande un document supplémentaire auquel vous n'aviez pas pensé. Prévoyez plusieurs allers-retours.

## Coût total de l'opération

- Traductions : 400€
- Contrôle technique : 80€
- Assurance : 500€
- Expertise : 150€
- Taxes d'immatriculation : 800€ (variable)
- Frais administratifs : 80€

**Total : environ 2000€** pour ma voiture de 5 ans.

## Mes conseils pour survivre

1. **Commencez tôt** : Démarrez les démarches dès votre arrivée
2. **Trouvez un interprète** : Indispensable pour les rendez-vous
3. **Gardez votre calme** : Ça va prendre du temps, c'est normal
4. **Préparez le budget** : Comptez 1500-3000€ selon votre véhicule

## Alternative : vendre et racheter

Certains expatriés préfèrent vendre leur voiture en France et en racheter une en Pologne. Ça peut être plus simple et moins cher selon les cas.

L'immatriculation en Pologne est un vrai parcours du combattant, mais c'est faisable. Armez-vous de patience et de zlotys !`
  },
  {
    id: 8,
    slug: "creer-micro-entreprise-pologne-guide",
    title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
    excerpt: "Bonne nouvelle après tous les galères administratives : créer une micro-entreprise en Pologne, c'est étonnamment simple ! Voici comment j'ai fait avec l'aide de ChatGPT.",
    author: "Johann Debeaumont",
    date: "2025-08-05",
    readTime: "8 min", 
    imageUrl: "/CEIDG.png",
    draft: false,
    category: "Entreprise",
    tags: ["entreprise", "micro-entreprise", "business", "ceidg"],
    language: "fr",
    content: `Créer sa micro-entreprise en Pologne : simple et rapide !

Après toutes les galères administratives que je vous ai racontées, voici enfin une bonne nouvelle : créer une micro-entreprise en Pologne, c'est étonnamment simple et rapide !

## Qu'est-ce qu'une micro-entreprise polonaise ?

En Pologne, on parle de "działalność gospodarcza" (activité économique). C'est l'équivalent de notre micro-entreprise française, mais en mieux !

### Avantages
- Création 100% en ligne
- Gratuite (0 zloty de frais)
- Régime fiscal avantageux
- Comptabilité simplifiée

## Le système CEIDG

Tout se passe sur le site CEIDG.gov.pl (Centralna Ewidencja i Informacja o Działalności Gospodarczej). C'est le guichet unique pour créer son entreprise.

## Les prérequis

Avant de commencer, vous devez avoir :
- Un PESEL
- Une adresse de résidence en Pologne
- Un compte bancaire polonais
- Une signature électronique (ePUAP) ou se déplacer au bureau

## Étapes de création (avec ChatGPT !)

### 1. Préparation avec ChatGPT
J'ai demandé à ChatGPT de m'aider à :
- Choisir le bon code PKD (activité)
- Remplir le formulaire en polonais
- Comprendre les options fiscales

### 2. Inscription sur ePUAP (30 minutes)
Créer un compte sur ePUAP.gov.pl pour avoir une signature électronique. C'est gratuit et indispensable.

### 3. Remplissage du formulaire CEIDG (1 heure)
Le formulaire est en polonais, mais avec l'aide de ChatGPT et Google Translate, c'est faisable.

**Informations demandées :**
- Données personnelles
- Adresse de l'entreprise
- Type d'activité (code PKD)
- Régime fiscal choisi
- Début d'activité

### 4. Soumission et validation (instantané)
Une fois le formulaire soumis, vous recevez immédiatement :
- Numéro REGON
- Numéro NIP (équivalent du SIRET)
- Confirmation d'inscription

## Choix du régime fiscal

### Taxe forfaitaire (ryczałt)
- Taux fixe selon l'activité (2% à 17%)
- Comptabilité très simple
- Idéal pour débuter

### Impôt linéaire (podatek liniowy)
- Taux fixe de 19%
- Plus de flexibilité
- Mieux pour les revenus élevés

### Micro-entreprise (mała działalność)
- Exonération jusqu'à 120 000 PLN/an
- Parfait pour commencer

## Mon expérience concrète

J'ai créé ma micro-entreprise de conseil en développement web en 2 heures chrono, un dimanche soir, depuis mon canapé !

**Timeline :**
- 19h00 : Début des recherches sur Internet
- 19h30 : Discussion avec ChatGPT pour comprendre les codes PKD
- 20h00 : Création du compte ePUAP
- 20h30 : Remplissage du formulaire CEIDG
- 21h00 : Soumission et réception des confirmations

## Coûts

- Création : **0 PLN** (gratuit !)
- Signature électronique : **0 PLN** (gratuit)
- Compte bancaire pro : **10-30 PLN/mois**

Total : quasiment gratuit !

## Obligations après création

### Comptabilité
- Tenir un livre des recettes
- Conserver les factures
- Déclaration mensuelle ou trimestrielle

### Assurances
- ZUS (sécurité sociale) : obligatoire après 6 mois
- Assurance responsabilité civile : recommandée

## Conseils pratiques

1. **Utilisez ChatGPT** pour traduire et comprendre
2. **Choisissez bien votre code PKD** (activité)
3. **Commencez par le régime micro** (le plus simple)
4. **Ouvrez un compte pro** dès la création

## Comparaison avec la France

| Aspect | Pologne | France |
|--------|---------|--------|
| Délai | Instantané | 1-15 jours |
| Coût | Gratuit | Gratuit |
| Complexité | Simple | Moyenne |
| Fiscalité | Avantageuse | Correcte |

Créer une micro-entreprise en Pologne est un vrai plaisir comparé aux autres démarches administratives. En quelques clics, vous êtes entrepreneur !`
  },
  {
    id: 9,
    slug: "se-loger-deplacer-pologne-guide-2025",
    title: "Se loger et se déplacer en Pologne — Guide pratique 2025",
    excerpt: "Guide complet pour se loger et se déplacer en Pologne : loyers, charges, meldunek, transports. Conseils pratiques et budgets réels pour 2025.",
    author: "Johann Debeaumont",
    date: "2025-09-04",
    readTime: "12 min",
    imageUrl: "/Seloger.png",
    draft: true,
    category: "Logement",
    tags: ["logement", "transport", "meldunek", "budget", "2025"],
    language: "fr",
    filePath: "app/[locale]/blog/9/page.jsx"
  },
  {
    id: 10,
    slug: "pecher-pologne-permis-regles-guide-2025",
    title: "Pêcher en Pologne : permis, règles et spots — Guide 2025",
    excerpt: "Guide complet pour obtenir son permis de pêche en Pologne : démarches, coûts, règles par région, spots recommandés. Tout pour les expatriés passionnés.",
    author: "Johann Debeaumont",
    date: "2025-09-15",
    readTime: "10 min",
    imageUrl: "/Pecher-en-Pologne.png",
    draft: true,
    category: "Loisirs",
    tags: ["pêche", "permis", "loisirs", "sport", "nature"],
    language: "fr",
    filePath: "app/[locale]/blog/10/page.jsx"
  }
];

// Fonction pour extraire le contenu d'un article depuis son fichier
async function extractArticleContent(filePath: string): Promise<string> {
  try {
    const fullPath = join(process.cwd(), filePath);
    const fileContent = await readFile(fullPath, 'utf-8');
    
    // Extraire le contenu JSX entre les balises ArticleLayout
    const contentMatch = fileContent.match(/<ArticleLayout[^>]*>([\s\S]*?)<\/ArticleLayout>/);
    if (contentMatch) {
      let content = contentMatch[1];
      
      // Nettoyer le JSX pour obtenir du texte lisible
      content = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Supprimer les scripts
        .replace(/<[^>]*>/g, ' ') // Supprimer les balises HTML/JSX
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .replace(/\{[^}]*\}/g, '') // Supprimer les expressions JSX
        .trim();
      
      return content;
    }
    
    return "Contenu non disponible";
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return "Erreur lors du chargement du contenu";
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('includeContent') === 'true';
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    
    // Rechercher l'article par ID ou slug
    const article = articles.find(a => 
      a.id.toString() === id || a.slug === id
    );
    
    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article non trouvé' 
        },
        { status: 404 }
      );
    }
    
    // Vérifier si c'est un brouillon
    if (article.draft && !includeDrafts) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Article non disponible' 
        },
        { status: 404 }
      );
    }
    
    // Préparer la réponse de base
    const responseArticle: any = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      date: article.date,
      readTime: article.readTime,
      imageUrl: article.imageUrl,
      category: article.category,
      tags: article.tags,
      language: article.language,
      draft: article.draft
    };
    
    // Ajouter le contenu complet si demandé
    if (includeContent && article.content) {
      responseArticle.content = article.content;
    }
    
    // Articles similaires (même catégorie, excluant l'article actuel)
    const relatedArticles = articles
      .filter(a => 
        a.id !== article.id && 
        a.category === article.category && 
        (!a.draft || includeDrafts)
      )
      .slice(0, 3)
      .map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        imageUrl: a.imageUrl,
        date: a.date,
        readTime: a.readTime
      }));
    
    const response = {
      success: true,
      data: {
        article: responseArticle,
        relatedArticles
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erreur API article:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de la récupération de l\'article' 
      },
      { status: 500 }
    );
  }
}
