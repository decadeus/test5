import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Articles data - SEULEMENT les vrais articles du site web
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

Les démarches que j'ai réellement effectuées pour m'installer en Pologne — expliquées simplement, avec un schéma pour visualiser l'enchaînement. Dans mon cas, je ne parle pas polonais, ce qui peut compliquer certaines démarches mais reste tout à fait faisable.

## 🗺️ Vue d'ensemble : le schéma des étapes

Avant de détailler chaque démarche, voici le schéma global qui m'a aidé à comprendre l'enchaînement. Chaque étape dépend des précédentes :

### 📋 Points importants du schéma
• Le **PESEL est la base de tout** - sans lui, rien n'est possible
• Le **compte bancaire est requis pour le NFZ**
• Le **Meldunek vient après le ZUS** (résidence officielle)
• L'**immatriculation de voiture** est la dernière étape

## 1️⃣ PESEL : votre numéro d'identité polonais

Le PESEL (Powszechny Elektroniczny System Ewidencji Ludności) est **absolument indispensable**. C'est votre clé d'entrée dans le système administratif polonais.

### Où l'obtenir :
- **Bureau des étrangers** (Urząd do Spraw Cudzoziemców) de votre ville
- **Mairie** (Urząd Gminy) selon les communes
- **Prendre rendez-vous** à l'avance - souvent complet

### Documents requis :
- Passeport ou carte d'identité française
- Justificatif de logement temporaire (hôtel, Airbnb)
- Formulaire de demande (disponible sur place)

### ⏰ Délai d'obtention
**Immédiat à 2 semaines** selon la commune. Certaines villes donnent le numéro le jour même, d'autres envoient la carte par courrier.

### 🚨 Important
**Gardez précieusement votre numéro PESEL.** Vous en aurez besoin pour absolument tout : banque, santé, logement, impôts, achats importants...

## 2️⃣ Compte bancaire polonais

Deuxième étape cruciale : ouvrir un compte bancaire polonais. C'est nécessaire pour recevoir votre salaire et accéder au système de santé NFZ.

### Banques recommandées pour expatriés :
- **ING Bank Śląski :** Interface en anglais, service client anglophone
- **mBank :** Application mobile excellente, procédures digitalisées
- **PKO Bank Polski :** Plus traditionnelle mais très répandue
- **Santander :** Bon service pour les étrangers

### Documents requis :
- PESEL (indispensable)
- Passeport ou carte d'identité
- Justificatif de revenus ou promesse d'embauche
- Justificatif de logement

### 💰 Frais bancaires
La plupart des banques offrent des **comptes gratuits** avec conditions (revenus minimum, âge...). Comptez 0-20 PLN/mois selon la banque et le type de compte.

## 3️⃣ NFZ : votre couverture santé

Le NFZ (Narodowy Fundusz Zdrowia) est l'équivalent de la Sécurité sociale française. Une fois inscrit, vous accédez aux soins publics gratuits.

### Comment s'inscrire :
- **En ligne :** Via le site NFZ avec votre compte bancaire polonais
- **Sur place :** Bureau NFZ local avec les documents requis
- **Via l'employeur :** Si vous êtes salarié (plus simple)

### Documents requis :
- PESEL
- Justificatif de compte bancaire polonais
- Contrat de travail ou justificatif de revenus
- Formulaire de demande

### 🏥 Utilisation pratique
Contrairement à la France, **pas de carte vitale**. Votre numéro PESEL suffit chez le médecin et en pharmacie.

## 4️⃣ ZUS : cotisations sociales

Le ZUS (Zakład Ubezpieczeń Społecznych) gère les retraites et prestations sociales. Si vous êtes salarié, votre employeur s'en charge. En freelance, vous devez vous inscrire.

### Inscription ZUS :
- **En ligne :** Plateforme ZUS PUE (Platforma Usług Elektronicznych)
- **Sur place :** Bureau ZUS local
- **Automatique :** Si création d'entreprise via CEIDG

### 💼 Cotisations volontaires
En tant qu'étranger avec NFZ, vous pouvez choisir de cotiser ou non au ZUS pour la retraite. **Cotisation minimum :** environ 300-400 PLN/mois.

## 5️⃣ Meldunek : déclaration de résidence

Le Meldunek est votre déclaration officielle de résidence. Obligatoire si vous restez plus de 3 mois, c'est l'équivalent d'un changement d'adresse officiel.

### Où faire la démarche :
- **Mairie** (Urząd Gminy/Urząd Miasta) de votre lieu de résidence
- **En ligne** dans certaines villes (Varsovie, Cracovie...)

### Documents requis :
- PESEL
- Passeport ou carte d'identité
- Contrat de location ou attestation du propriétaire
- Formulaire de déclaration

### ⚠️ Obligation légale
**Délai maximum : 30 jours** après votre installation. Le non-respect peut entraîner une amende de 50-5000 PLN.

## 6️⃣ Options avancées

Une fois les bases établies, vous pouvez aller plus loin selon vos besoins :

### Création d'entreprise :
Si vous souhaitez devenir freelance ou créer votre activité, la création de micro-entreprise en Pologne est étonnamment simple et rapide !

### Immatriculation de voiture :
Beaucoup plus complexe et coûteux. Préparez-vous psychologiquement...

### Carte de séjour temporaire :
- **Pas obligatoire** pour les citoyens EU
- **Recommandée** pour des séjours longs (facilite certaines démarches)
- **Validité :** 5 ans renouvelable

## 💰 Budget total à prévoir

Voici un récapitulatif des coûts pour s'installer :

- **PESEL :** Gratuit
- **Compte bancaire :** 0-20 PLN/mois
- **NFZ :** Gratuit (si éligible) ou ~300 PLN/mois
- **ZUS :** Optionnel, ~400 PLN/mois
- **Meldunek :** Gratuit
- **Traductions de documents :** 50-200 PLN
- **Déplacements/temps :** Variable

### 💸 Total estimé
**0-500 PLN** pour les démarches de base
*Plus les frais courants (NFZ, ZUS) selon votre situation*

## ⏱️ Timeline réaliste

Voici les délais que j'ai réellement expérimentés :

- **PESEL :** 1 jour à 2 semaines
- **Compte bancaire :** 2-5 jours
- **NFZ :** 1-2 semaines
- **ZUS :** 1 semaine
- **Meldunek :** 1 jour

### 📅 Durée totale
**1 à 2 mois** pour tout finaliser, selon la réactivité des administrations et votre disponibilité.

## 😤 Principales difficultés rencontrées

Voici les obstacles les plus fréquents et comment les surmonter :

### Barrière de la langue :
- **Solution :** Google Translate en mode photo pour les formulaires
- **Préparation :** Apprenez quelques mots clés en polonais
- **Aide :** Amenez un ami polonophone si possible

### Documents manquants :
- **Prévention :** Vérifiez la liste avant de partir de France
- **Traductions :** Certains documents doivent être traduits officiellement
- **Photocopies :** Toujours avoir des copies certifiées

### Délais variables :
- **Planification :** Commencez tôt, ne sous-estimez pas les délais
- **Alternatives :** Plusieurs bureaux peuvent parfois traiter le même dossier
- **Patience :** L'administration polonaise peut être lente mais efficace

## 💡 Mes conseils pour réussir

Après avoir traversé toutes ces étapes, voici mes recommandations :

### Avant de partir de France :
- **Rassemblez tous vos documents** - apostilles, traductions
- **Ouvrez un compte épargne de transition** - pour les premiers mois
- **Apprenez les bases du polonais** - au moins les formules de politesse
- **Contactez des expatriés** - groupes Facebook très actifs

### Une fois en Pologne :
- **Priorisez le PESEL** - rien n'est possible sans lui
- **Gardez tous vos reçus** - utiles pour la suite
- **Restez flexible** - les procédures peuvent changer
- **Intégrez-vous localement** - ça facilite tout le reste

### Ressources utiles :
- **Gov.pl :** Site officiel du gouvernement
- **Consulat français :** Aide en cas de problème
- **Groupes Facebook d'expatriés :** Entraide communautaire
- **Google Translate :** Votre meilleur ami pour les formulaires

## 🎯 Mon bilan personnel

S'installer en Pologne m'a pris environ 6 semaines au total. Certaines démarches sont rapides (PESEL, Meldunek), d'autres plus longues (NFZ, compte bancaire selon la banque).

### Ce qui m'a le plus aidé :
- **La préparation en amont** - documents traduits avant de partir
- **La communauté d'expatriés** - conseils précieux sur les groupes
- **L'aide d'amis polonais** - pour les démarches complexes
- **Google Translate** - indispensable pour comprendre les formulaires

### Ce que j'aurais fait différemment :
- **Commencer plus tôt** - certaines démarches prennent du temps
- **Prévoir plus de budget** - frais imprévus toujours possibles
- **Apprendre plus de polonais** - ça facilite vraiment les relations

### 🌟 Conseil final
**L'installation en Pologne est faisable et gratifiante !** Oui, il y a de la paperasse, mais le jeu en vaut la chandelle. La Pologne est un pays accueillant avec une administration qui s'améliore constamment.

Une fois installé, vous pourrez envisager d'autres projets comme créer votre micro-entreprise ou même immatriculer votre voiture française (bon courage pour cette dernière !).

### 📝 Mise à jour
Guide basé sur mon expérience de janvier 2024. Les procédures peuvent évoluer. Vérifiez toujours les informations officielles sur gov.pl avant de commencer vos démarches.`
  },
  {
    id: 8,
    slug: "creer-micro-entreprise-pologne-simple-rapide",
    title: "Créer sa micro-entreprise en Pologne : simple et rapide !",
    excerpt: "Guide complet pour créer une micro-entreprise en Pologne : CEIDG, NIP, REGON, ZUS. Méthode ChatGPT et démarches simplifiées pour entrepreneurs français.",
    author: "Johann Debeaumont",
    date: "2024-02-05",
    readTime: "8 min",
    imageUrl: "/CEIDG.png",
    draft: false,
    category: "Entrepreneuriat",
    tags: ["micro-entreprise", "CEIDG", "NIP", "REGON", "ZUS", "entrepreneur", "freelance"],
    language: "fr",
    content: `Créer sa micro-entreprise en Pologne : simple et rapide !

Bonne nouvelle après toutes les galères administratives : créer une micro-entreprise en Pologne, c'est étonnamment simple ! Voici comment j'ai fait avec l'aide de ChatGPT.

## ✅ Pourquoi c'est plus simple qu'ailleurs

Contrairement à l'immatriculation de voiture qui est un cauchemar, la création d'entreprise en Pologne est **digitalisée, rapide et peu coûteuse**. Tout se fait en ligne !

## 🎯 Prérequis avant de commencer

Avant de créer votre micro-entreprise, assurez-vous d'avoir complété ces étapes de base :

- **PESEL obtenu** - Numéro d'identification polonais
- **Compte bancaire polonais ouvert**
- **Adresse de résidence déclarée (Meldunek)**
- **NFZ activé** - Couverture santé de base

### 📚 Guides préalables

Si vous n'avez pas encore fait ces démarches, consultez mon guide "S'installer en Pologne" et l'article sur le système de santé NFZ.

## 💡 Ma méthode avec ChatGPT

Ne parlant pas polonais, j'ai utilisé ChatGPT comme assistant personnel pour naviguer dans les formulaires administratifs. Voici ma technique :

### Étape 1 : Préparation avec ChatGPT

J'ai demandé à ChatGPT de me traduire et expliquer chaque champ des formulaires administratifs polonais.

**💬 Prompt que j'ai utilisé :**
"Je veux créer une micro-entreprise en Pologne via CEIDG. Peux-tu me traduire et expliquer chaque champ du formulaire ? Mon activité sera [votre activité]. Je suis résident français en Pologne avec un PESEL."

### Étape 2 : Choix du code PKD

Le code PKD définit votre activité. C'est crucial pour les taxes et obligations.

**🔍 Trouver son code PKD :**
Utilisez le site officiel GUS.gov.pl ou demandez à ChatGPT de vous aider à identifier le bon code selon votre activité. **Prenez votre temps** - ce choix impacte vos obligations fiscales.

**Exemples de codes courants :**
- **62.01.Z :** Programmation informatique
- **62.02.Z :** Conseil en informatique
- **73.11.Z :** Agences de publicité
- **74.10.Z :** Design graphique
- **85.59.B :** Formation et enseignement

## 🖥️ Créer son entreprise sur CEIDG

CEIDG (Centralna Ewidencja i Informacja o Działalności Gospodarczej) est la plateforme officielle. Tout se fait en ligne, 24h/24.

### Étape 1 : Connexion au CEIDG

Rendez-vous sur **prod.ceidg.gov.pl** et connectez-vous avec votre profil personnel (Profil Zaufany) ou via banque en ligne.

**🔐 Authentification :**
Si vous n'avez pas de Profil Zaufany, utilisez l'authentification par votre banque polonaise. C'est plus simple et immédiat.

### Étape 2 : Remplir le formulaire

Le formulaire est long mais logique. Voici les sections principales :

**Informations de base :**
- Données personnelles (automatiquement remplies via PESEL)
- Adresse du siège social (votre adresse de résidence)
- Code PKD d'activité principale
- Date de début d'activité

**Choix du régime fiscal :**
- **Karta podatkowa :** Forfait fixe (rare)
- **Ryczałt :** Pourcentage du chiffre d'affaires (recommandé)
- **Skala podatkowa :** Impôt progressif

**💰 Conseil fiscal :**
Pour débuter, choisissez le **ryczałt** (forfait). C'est simple, prévisible et avantageux pour les petits chiffres d'affaires. Taux variable selon l'activité (8,5% à 17%).

### Étape 3 : Choix ZUS

ZUS gère les cotisations sociales. Vous avez plusieurs options :

**Options disponibles :**
- **Ulga na start :** 6 mois sans cotisations ZUS (pour nouveaux entrepreneurs)
- **Mały ZUS :** Cotisations réduites selon le revenu
- **ZUS standard :** Cotisations pleines (~1500 PLN/mois)

**🎁 Ulga na start :**
Si c'est votre première entreprise en Pologne, profitez de l'**"Ulga na start"** - 6 mois sans cotisations ZUS ! Économie d'environ 9000 PLN.

## 📋 Documents générés automatiquement

Une fois le formulaire validé, le système génère automatiquement :

- **NIP :** Numéro d'identification fiscale
- **REGON :** Numéro statistique d'entreprise
- **Certificat d'immatriculation**
- **Notifications automatiques** vers ZUS et l'administration fiscale

**⚡ Rapidité :**
**Tout est instantané !** Dès validation, vous recevez vos numéros et pouvez commencer à facturer. Aucune attente, contrairement à la France.

## 💰 Coûts et délais

La création d'entreprise en Pologne est remarquablement accessible :

### Coûts :
- **Inscription CEIDG :** GRATUIT
- **Obtention NIP/REGON :** GRATUIT
- **ZUS (6 premiers mois avec ulga na start) :** GRATUIT
- **Seuls frais :** Éventuellement aide comptable (~300-500 PLN/mois)

### Délais :
- **Création complète :** 1 journée
- **Réception des documents :** Immédiat (PDF téléchargeables)
- **Début d'activité :** Dès validation du formulaire

**💸 Budget total :**
**0 PLN pour commencer !** C'est l'énorme avantage du système polonais. Vous pouvez tester votre activité sans risque financier initial.

## 📊 Obligations post-création

Une fois votre entreprise créée, voici vos obligations principales :

### Obligations fiscales :
- **Déclaration mensuelle :** Avant le 20 du mois suivant
- **Tenue de registre :** Recettes et dépenses (simple tableur suffisant)
- **Facturation :** Obligatoire pour montants > 20 000 PLN/an

### Obligations ZUS :
- **Déclaration annuelle :** Revenus de l'année écoulée
- **Cotisations mensuelles :** Après la période "ulga na start"
- **Changements d'activité :** À déclarer dans les 7 jours

**📱 Outils recommandés :**
**iFirma, Fakturownia ou WFirma :** Plateformes polonaises pour gérer facilement facturation et déclarations. Interface en anglais disponible.

## 🎯 Avantages du système polonais

Après avoir créé ma micro-entreprise, voici ce qui m'a le plus impressionné :

### Simplicité administrative :
- **Tout en ligne :** Aucun déplacement physique nécessaire
- **Intégration totale :** Une seule démarche pour tous les organismes
- **Validation immédiate :** Pas d'attente comme en France
- **Documentation claire :** Formulaires bien conçus

### Avantages fiscaux :
- **Ulga na start :** 6 mois gratuits pour débuter
- **Ryczałt avantageux :** Taux fixes prévisibles
- **Seuils élevés :** Pas de TVA sous 200 000 PLN/an
- **Flexibilité :** Changement de régime possible

### Support numérique :
- **Plateforme CEIDG moderne :** Interface intuitive
- **Outils tiers développés :** Écosystème riche
- **Dématérialisation complète :** Zéro papier

## ⚠️ Points d'attention

Quelques aspects à surveiller pour éviter les erreurs :

### Choix du code PKD :
- **Impact fiscal :** Différents codes = différents taux de ryczałt
- **Activités multiples :** Possible mais complexifie la fiscalité
- **Changement ultérieur :** Possible mais procédure administrative

### Gestion ZUS :
- **Fin d'ulga na start :** Anticiper les cotisations qui arrivent
- **Revenus minimum :** Attention aux seuils pour mały ZUS
- **Arrêt d'activité :** Bien déclarer pour éviter les cotisations

### Aspects internationaux :
- **Double imposition :** Vérifier les accords France-Pologne
- **TVA européenne :** Règles spécifiques selon vos clients
- **Facturation en devise :** Implications comptables

**🏦 Important pour les finances :**
**Ouvrez un compte bancaire professionnel dédié.** Bien que non obligatoire légalement, c'est fortement recommandé pour la clarté comptable et les relations bancaires.

## 💼 Mon expérience concrète

J'ai créé ma micro-entreprise un dimanche soir, en 2 heures, depuis mon canapé. Comparé aux démarches françaises que j'avais connues, c'était un autre monde !

### Ce qui m'a le plus marqué :
- **La rapidité :** Tout validé en une soirée
- **La gratuité totale :** Aucun frais de création
- **L'intégration :** Tous les organismes notifiés automatiquement
- **La flexibilité :** Possibilité de modifier facilement

### Mes premiers pas :
- **Première facture :** Émise dès le lendemain
- **Compte bancaire pro :** Ouvert la semaine suivante
- **Plateforme de facturation :** iFirma configurée rapidement
- **Première déclaration :** Simple grâce aux outils en ligne

## 🚀 Conseils pour bien commencer

Voici mes recommandations pour optimiser votre lancement :

### Avant la création :
- **Définissez précisément votre activité** - Impact sur le code PKD
- **Estimez votre chiffre d'affaires** - Influence le choix du régime fiscal
- **Préparez vos documents** - PESEL, adresse, coordonnées bancaires
- **Choisissez votre date de début** - Peut être différée

### Juste après la création :
- **Téléchargez tous les certificats** - Gardez-les précieusement
- **Configurez votre outil de facturation** - iFirma, Fakturownia, etc.
- **Ouvrez un compte bancaire professionnel** - Séparez personnel et pro
- **Notez vos échéances** - Déclarations mensuelles et annuelles

### Développement de l'activité :
- **Surveillez vos seuils** - TVA, changement de régime ZUS
- **Anticipez la fin d'ulga na start** - Cotisations ZUS qui arrivent
- **Envisagez un comptable** - Quand l'activité se développe
- **Optimisez fiscalement** - Révision annuelle du régime

## 🎊 Conclusion : enfin du simple !

Après l'enfer de l'immatriculation automobile et autres complexités administratives, créer une micro-entreprise en Pologne fut un vrai plaisir !

**✨ Le système polonais en résumé :**
**Gratuit, rapide, simple et flexible.** Tout ce qu'on aimerait avoir en France ! Si vous hésitez à vous lancer, n'hésitez plus - le risque financier est quasi nul.

L'entrepreneuriat en Pologne est vraiment accessible. Que vous soyez freelance, consultant, ou que vous lanciez une petite activité, le système vous facilite la vie au maximum.

Si vous avez d'autres questions sur l'installation en Pologne, consultez aussi mes guides sur les démarches administratives de base et le système de santé NFZ.

**📝 Mise à jour :**
Guide basé sur mon expérience de février 2024. Les procédures et avantages fiscaux peuvent évoluer. Vérifiez toujours les informations officielles sur CEIDG.gov.pl avant de commencer.`
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('includeContent') === 'true';
    
    const articleId = parseInt(params.id);
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Prepare response article
    const responseArticle: any = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author,
      date: article.date,
      readTime: article.readTime,
      imageUrl: article.imageUrl,
      draft: article.draft,
      category: article.category,
      tags: article.tags,
      language: article.language
    };

    // Add content if requested
    if (includeContent && article.content) {
      responseArticle.content = article.content;
    }

    return NextResponse.json({
      success: true,
      data: {
        article: responseArticle
      }
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}