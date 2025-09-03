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
  },
  {
    id: 6,
    slug: "nfz-systeme-sante-polonais-guide",
    title: "NFZ : Comment utiliser le système de santé polonais",
    excerpt: "Guide pratique pour naviguer dans le système de santé polonais : CMP, ordonnances par code, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.",
    author: "Johann Debeaumont",
    date: "2024-07-25",
    readTime: "10 min",
    imageUrl: "/apteka.png",
    draft: false,
    category: "Santé",
    tags: ["santé", "nfz", "médecin", "pharmacie", "expatrié"],
    language: "fr",
    content: `NFZ : Comment utiliser le système de santé polonais

Guide pratique pour naviguer dans le système de santé polonais : CMP, ordonnances par code, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.

Après avoir obtenu ma couverture NFZ, j'ai dû apprendre à naviguer dans le système de santé polonais. Voici mon retour d'expérience concret : CMP, ordonnances par code, pharmacies, remboursements et tous les détails pratiques qui m'ont servi au quotidien.

## 1️⃣ Comprendre le système NFZ

Le **NFZ (Narodowy Fundusz Zdrowia)** est l'équivalent de la Sécurité sociale française. Une fois inscrit, vous avez accès aux soins de santé publics en Pologne.

### 📋 Différence importante avec la France
Il n'y a pas de **carte de sécurité sociale** comme en France. Votre numéro PESEL suffit pour tous vos rendez-vous médicaux et à la pharmacie.

## 2️⃣ Le médecin traitant (CMP)

En Pologne, vous devez choisir un **CMP (Centrum Medyczne Podstawowe)** - l'équivalent du médecin traitant français.

### Comment choisir son CMP :
- **Proximité géographique** - Important car c'est votre point d'entrée
- **Disponibilité des créneaux** - Certains CMP sont saturés
- **Langues parlées** - Cherchez un CMP parlant anglais si nécessaire

### Inscription au CMP :
1. Se présenter avec son PESEL
2. Remplir le formulaire d'inscription
3. Choisir son médecin référent dans le centre
4. Recevoir sa carte de patient

### 💡 Conseil pratique
Contrairement à la France, vous pouvez **changer de CMP facilement** et à tout moment. N'hésitez pas à tester plusieurs centres pour trouver celui qui vous convient.

## 3️⃣ Prendre rendez-vous

### Méthodes de prise de rendez-vous :
- **Par téléphone** - Le plus courant
- **En ligne** - Via les plateformes comme Luxmed, Medicover
- **Sur place** - Directement au secrétariat
- **Applications mobiles** - De plus en plus répandues

### Délais d'attente :
- **Médecin généraliste** : 1-7 jours
- **Spécialistes** : 2 semaines à 3 mois selon la spécialité
- **Urgences** : Immédiat dans les hôpitaux

### 🚨 Urgences
Pour les urgences, rendez-vous directement aux **SOR (Szpitalny Oddział Ratunkowy)** - équivalent des urgences françaises. Votre PESEL suffit.

## 4️⃣ Consultation et ordonnances

### Déroulement d'une consultation :
1. **Arrivée** - Présenter son PESEL au secrétariat
2. **Attente** - Souvent plus courte qu'en France
3. **Consultation** - Généralement plus longue et approfondie
4. **Prescription** - Ordonnance électronique ou papier

### Ordonnances électroniques :
- **Code à 4 chiffres** donné par le médecin
- **Valable dans toutes les pharmacies** de Pologne
- **Plus pratique** que les ordonnances papier

### 💊 Spécificités des ordonnances
Les médicaments sont souvent prescrits par **nom générique**. Le pharmacien peut proposer différentes marques du même principe actif.

## 5️⃣ Pharmacies (Apteka)

### Fonctionnement :
- **Horaires étendus** - Beaucoup ouvrent jusqu'à 22h
- **Pharmacies de garde** - Service 24h/24 dans les grandes villes
- **Conseil pharmaceutique** - Pharmaciens très compétents

### Remboursements NFZ :
- **Médicaments gratuits** - Liste spécifique NFZ
- **Médicaments partiellement remboursés** - Vous payez la différence
- **Médicaments non remboursés** - Prix libre

### 💳 Paiement
Vous payez directement à la pharmacie. Le remboursement NFZ est automatiquement déduit si vous présentez votre PESEL.

## 6️⃣ Spécialistes et examens

### Accès aux spécialistes :
- **Via CMP** - Orientation recommandée mais pas obligatoire
- **Directement** - Possible mais délais plus longs
- **Privé** - Plus rapide mais payant

### Examens médicaux :
- **Analyses de sang** - Souvent le matin à jeun
- **Radiographies** - Disponibles rapidement
- **IRM/Scanner** - Délais plus longs (1-3 mois)

### 📋 Résultats d'examens
Les résultats sont généralement disponibles en ligne via les portails patients des laboratoires.

## 7️⃣ Système privé vs public

### Avantages du public (NFZ) :
- **Gratuit** pour les assurés
- **Couverture complète** des soins de base
- **Qualité correcte** des soins

### Avantages du privé :
- **Délais courts** - Rendez-vous sous 48h généralement
- **Confort** - Cliniques modernes
- **Langues étrangères** - Personnel anglophone

### 💰 Coûts du privé
- **Consultation généraliste** : 150-300 PLN
- **Spécialiste** : 200-500 PLN
- **Examens** : Variables selon le type

## 8️⃣ Assurances complémentaires

### Types d'assurances :
- **Assurance employeur** - Souvent incluse dans les contrats
- **Assurance privée individuelle** - Luxmed, Medicover, PZU
- **Assurance voyage** - Pour les séjours temporaires

### 🏥 Avantages
L'assurance privée donne accès aux **cliniques privées** avec des délais réduits et un meilleur confort.

## 9️⃣ Cas particuliers

### Grossesse et maternité :
- **Suivi gratuit** via NFZ
- **Choix de l'hôpital** pour l'accouchement
- **Congés maternité** bien couverts

### Dentaire :
- **Soins de base** couverts par NFZ
- **Soins esthétiques** généralement privés
- **Urgences dentaires** prises en charge

### Optique :
- **Examens ophtalmologiques** couverts
- **Lunettes** partiellement remboursées selon les cas

## 🔟 Conseils pratiques d'expatrié

### Préparation avant consultation :
- **Apprenez quelques mots** de vocabulaire médical polonais
- **Préparez vos antécédents** traduits si nécessaire
- **Amenez une liste** de vos médicaments actuels

### Applications utiles :
- **Google Translate** - Mode photo pour les ordonnances
- **Aplikacje NFZ** - App officielle pour gérer ses droits
- **Portails des cliniques** - Prise de rendez-vous en ligne

### 📱 Numéros d'urgence
- **112** - Numéro d'urgence européen
- **999** - Ambulance
- **998** - Pompiers
- **997** - Police

## 💡 Mon bilan après 2 ans

### Ce qui fonctionne bien :
- **Rapidité des soins urgents** - Très efficace
- **Qualité des spécialistes** - Niveau élevé
- **Modernité des équipements** - Souvent plus récents qu'en France
- **Disponibilité des pharmacies** - Très pratique

### Points d'amélioration :
- **Délais pour certains spécialistes** - Parfois longs
- **Barrière de la langue** - Encore présente
- **Complexité administrative** - Différente de la France

### 🌟 Conseil final
Le système de santé polonais est **globalement efficace et moderne**. Une fois qu'on comprend son fonctionnement, il offre une bonne qualité de soins. L'investissement dans une assurance privée complémentaire peut être judicieux pour plus de confort.

### 📝 Mise à jour
Guide basé sur mon expérience de juillet 2024. Les procédures peuvent évoluer. Consultez toujours le site officiel NFZ.gov.pl pour les informations les plus récentes.`
  },
  {
    id: 7,
    slug: "immatriculer-voiture-francaise-pologne-guide",
    title: "Immatriculer sa voiture française en Pologne : le parcours du combattant",
    excerpt: "Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.",
    author: "Johann Debeaumont",
    date: "2024-03-15",
    readTime: "12 min",
    imageUrl: "/Immatriculation.png",
    draft: false,
    category: "Transport",
    tags: ["voiture", "immatriculation", "transport", "démarches"],
    language: "fr",
    content: `Immatriculer sa voiture française en Pologne : le parcours du combattant

Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.

### ⚠️ Avertissement important
**Cette démarche est complexe, coûteuse et chronophage.** Comptez entre 2 à 6 mois et un budget de 3500 à 20000+ PLN selon votre véhicule. Si votre voiture a plus de 10 ans ou une grosse cylindrée, réfléchissez bien avant de vous lancer.

## 🗓️ Chronologie des étapes (IMPORTANTE !)

L'ordre des étapes est **crucial**. Contrairement à la France, certaines démarches ne peuvent se faire qu'après d'autres.

### Étape 1 : Contrôle technique polonais
**Première obligation :** Faire passer votre voiture au contrôle technique polonais, même si vous avez un contrôle technique français valide.

**Où :** Stations de contrôle technique agréées (SKP - Stacja Kontroli Pojazdów)
**Coût :** 80-120 PLN
**Délai :** 1-2 semaines pour obtenir un rendez-vous

### Étape 2 : Expertise de valeur
**Obligatoire** pour le calcul des taxes d'immatriculation.

**Où :** Expert agréé par le ministère des Finances
**Coût :** 150-300 PLN
**Délai :** 1-3 semaines

### Étape 3 : Assurance polonaise
**Indispensable** avant l'immatriculation.

**Types :** OC (responsabilité civile) minimum obligatoire
**Coût :** 800-2000 PLN/an selon le véhicule
**Délai :** Immédiat

### Étape 4 : Paiement des taxes
**Calcul complexe** basé sur la cylindrée, l'âge et la valeur du véhicule.

**Où :** Bureau des impôts (Urząd Skarbowy)
**Coût :** 3,1% de la valeur expertisée + taxes cylindrée
**Délai :** 1-2 jours

### Étape 5 : Immatriculation finale
**Dernière étape** au bureau d'immatriculation.

**Où :** Wydział Komunikacji
**Coût :** 80 PLN + plaques (180 PLN)
**Délai :** 1-2 semaines

## 💰 Budget détaillé (exemple concret)

Voici les coûts que j'ai payés pour ma Peugeot 308 de 2019 :

- **Contrôle technique :** 98 PLN
- **Expertise de valeur :** 200 PLN
- **Traduction documents :** 400 PLN
- **Assurance OC (1 an) :** 1200 PLN
- **Taxes d'immatriculation :** 4500 PLN
- **Frais d'immatriculation :** 260 PLN
- **Divers (photocopies, déplacements) :** 150 PLN

**Total : 6808 PLN (environ 1500€)**

### 💸 Taxes selon la cylindrée
- **Jusqu'à 2000 cm³ :** 3,1% de la valeur
- **Plus de 2000 cm³ :** 18,6% de la valeur + taxe CO2

## 📋 Documents nécessaires

### Documents français à traduire :
- **Carte grise** (certificat d'immatriculation)
- **Certificat de conformité européen**
- **Facture d'achat** (si moins de 6 mois)
- **Contrôle technique français** (si valide)

### Documents polonais à obtenir :
- **Contrôle technique polonais**
- **Expertise de valeur**
- **Attestation d'assurance**
- **Justificatif de paiement des taxes**

### Documents personnels :
- **PESEL**
- **Meldunek** (déclaration de résidence)
- **Passeport ou carte d'identité**

## 🚗 Cas particuliers

### Voitures de plus de 10 ans
**Attention :** Contrôle technique plus strict, risque de non-conformité élevé.

### Véhicules diesel
**Malus écologique** important dans certaines villes.

### Voitures de sport/luxe
**Taxes prohibitives** - Calculez bien avant de vous lancer.

## 😤 Difficultés rencontrées

### Barrière de la langue
**Tous les formulaires** sont en polonais uniquement. Google Translate devient votre meilleur ami.

### Bureaucratie complexe
**Chaque bureau** a ses propres exigences. Ce qui est accepté dans un bureau peut être refusé dans un autre.

### Délais imprévisibles
**Planifiez large** - Les délais annoncés sont rarement respectés.

### Coûts cachés
**Frais supplémentaires** apparaissent souvent en cours de route.

## 💡 Mes conseils pour survivre

### Avant de commencer :
- **Évaluez le coût total** - Parfois, vendre en France et racheter en Pologne est plus économique
- **Vérifiez l'état de votre voiture** - Tout défaut sera détecté au contrôle technique
- **Préparez un budget confortable** - Comptez 20% de plus que prévu

### Pendant les démarches :
- **Armez-vous de patience** - C'est un marathon, pas un sprint
- **Gardez tous les reçus** - Vous en aurez besoin à chaque étape
- **Faites-vous accompagner** - Un ami polonophone est précieux

### Alternatives à considérer :
- **Vente en France + achat en Pologne** - Souvent plus simple
- **Location longue durée** - Pour éviter les démarches
- **Transports en commun** - Très développés dans les grandes villes

## 🎯 Mon bilan personnel

**Durée totale :** 4 mois et demi
**Coût total :** 6808 PLN
**Niveau de stress :** 9/10
**Satisfaction finale :** 6/10

### Ce que j'aurais fait différemment :
- **Mieux évaluer les coûts** au départ
- **Commencer plus tôt** les démarches
- **Envisager sérieusement** la vente/rachat

### Points positifs :
- **Voiture légalement immatriculée** en Pologne
- **Assurance locale** plus pratique
- **Expérience acquise** pour aider d'autres expatriés

## 🚨 Cas où il vaut mieux éviter

### Voitures à éviter d'immatriculer :
- **Plus de 15 ans** - Risque de non-conformité
- **Cylindrée > 3000 cm³** - Taxes prohibitives
- **Valeur > 100 000 PLN** - Coûts d'expertise élevés
- **Modifications techniques** - Complications administratives

### Alternatives recommandées :
- **Vendre en France** et racheter en Pologne
- **Leasing** d'un véhicule neuf en Pologne
- **Voiture d'occasion** achetée localement

## 🌟 Conclusion

L'immatriculation d'une voiture française en Pologne est **faisable mais éprouvante**. C'est de loin la démarche administrative la plus complexe que j'ai eu à faire en Pologne.

**Mon conseil :** Évaluez sérieusement l'alternative vente/rachat. Dans beaucoup de cas, c'est plus simple et parfois même plus économique.

Si vous vous lancez quand même, **armez-vous de patience, de zlotys et de nerfs solides** !

### 📝 Mise à jour
Guide basé sur mon expérience de mars 2024. Les procédures et tarifs peuvent évoluer. Vérifiez toujours les informations officielles avant de commencer.`
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
    draft: false,
    category: "Logement",
    tags: ["logement", "transport", "budget", "pologne", "2025"],
    language: "fr",
    content: `Se loger et se déplacer en Pologne — Guide pratique 2025

Louer un appartement, comprendre les charges, utiliser les transports : tout ce qu'il faut savoir pour bien s'installer en Pologne en 2025.

## Louer un appartement

### Pas besoin de fiche de paie
En Pologne, les propriétaires demandent rarement des justificatifs de revenus. Il n'est donc pas nécessaire de fournir des fiches de paie comme en France. En revanche, on signe presque toujours un bail écrit avec caution (kaucja).

### Impôts et charges
Pas d'impôts à payer en plus du loyer côté locataire. Le loyer inclut souvent eau, électricité, chauffage, internet.

⚠️ **Attention :** les prix affichés sur les sites d'annonces ne comprennent pas toujours les charges (czynsz administracyjny). Elles peuvent être importantes (500–1200 PLN). Vérifier si la mention "czynsz w cenie" (charges incluses) apparaît.

### Déclaration à la mairie (meldunek)
Permet d'obtenir un PESEL plus facilement. Donne droit à des avantages locaux (ex. transports gratuits à Piaseczno).

⚠️ Le meldunek est lié à la durée du bail : il faut le refaire à chaque renouvellement de contrat.

### Comprendre le nombre de pièces
En Pologne, une annonce "2 pokoje" signifie : 1 chambre + 1 salon, qui est souvent considéré comme zone de couchage.

➡️ Donc un "2 pièces" polonais correspond généralement à un T2 français.

### Conseils pratiques
- Vérifier le montant exact du czynsz avant signature
- Demander si le wifi est inclus ou séparé
- Toujours faire un état des lieux avec photos (zdjęcia) à l'entrée

## Fourchette de loyers (2025)

**Varsovie :** 2500–4000 PLN/mois pour un 2 pièces moderne ; 1800–2500 PLN pour un logement plus ancien.

**Piaseczno :** 1800–2800 PLN selon l'immeuble et la proximité avec Varsovie.

**Łódź :** 1500–2200 PLN, les loyers y sont généralement plus bas qu'à Varsovie.

### Exemple concret : Piaseczno (2025)
Dans une résidence récente (moins de 10 ans) à Piaseczno, pour un appartement de 70 m² avec 2 chambres, proche du centre-ville, incluant : place de parking souterrain, eau, électricité, internet,

👉 le loyer total s'élève à **4200 PLN/mois** (environ 950 € au taux de 2025).

Ce type de logement moderne peut sembler cher comparé aux loyers moyens en Pologne, mais il reflète le confort et la situation privilégiée.

## Se déplacer en Pologne

### Transports en commun
À Piaseczno, le bus est le moyen de transport principal. À Varsovie, il existe pour l'instant 2 lignes de métro (3ᵉ prévue dans quelques années), quelques lignes de tram, mais le réseau de bus reste central. À Łódź, pas de métro, mais un réseau de tramway très développé.

Bus, trams et métros sont propres et bien entretenus. Aucun sentiment d'insécurité, même le soir — contrairement à Paris.

### Trains
Les trains PKP Intercity relient efficacement les grandes villes. Les compagnies régionales (ex. Koleje Mazowieckie autour de Varsovie) sont pratiques pour les trajets quotidiens. Réservation facile via appli PKP.

### Voiture
Utile pour les zones rurales ou hors agglomération. Assurance obligatoire (OC) et contrôles techniques réguliers.

### Vélo et trottinettes
Réseaux de vélos en libre-service disponibles dans plusieurs grandes villes. À Varsovie, le centre-ville reste peu adapté au vélo pour les trajets quotidiens (trafic dense, peu d'aménagements).

En dehors de Varsovie, de nombreuses petites villes développent bien leurs pistes cyclables, rendant la pratique plus agréable et sécurisée.

## Conclusion

Se loger en Pologne est généralement plus simple qu'en France (moins de justificatifs, charges incluses), mais il faut bien lire les annonces pour éviter les surprises. Le meldunek reste une étape importante et doit être renouvelé avec chaque bail.

Côté transport, bus, trams et métros sont propres et sûrs, avec des abonnements abordables, et parfois gratuits pour les résidents.

## Budget global : logement vs. vie quotidienne

Un appartement dans un immeuble récent peut sembler cher pour la Pologne, surtout à Varsovie ou dans les résidences modernes. Mais ces dépenses sont souvent compensées par des économies sur d'autres postes :

**Transports en commun :** abonnements abordables (env. 110 PLN/mois à Varsovie) et gratuits dans certaines villes avec le meldunek (ex. Piaseczno).

**Alimentation :** produits locaux (fruits, légumes, viande blanche, produits laitiers) moins chers qu'en France.

**Restaurants :** un repas standard coûte généralement deux à trois fois moins cher qu'à Paris.

👉 En résumé, même si le logement récent représente un poste de dépense conséquent, le coût de la vie quotidienne en Pologne permet d'équilibrer le budget global.`
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
    draft: false,
    category: "Loisirs",
    tags: ["pêche", "permis", "loisirs", "nature", "pologne"],
    language: "fr",
    content: `Pêcher en Pologne : permis, règles et spots — Guide 2025

Vous êtes passionné de pêche et vous venez de vous installer en Pologne ? Ce guide complet vous explique tout ce qu'il faut savoir pour pêcher légalement : obtenir votre permis, comprendre les règles locales, et découvrir les meilleurs spots.

## 🎣 Le système de pêche en Pologne

### Deux types de permis
En Pologne, il existe deux niveaux d'autorisation pour pêcher :

**1. Carte de pêche (Karta wędkarska)**
- Permis national obligatoire
- Valable dans toute la Pologne
- Durée : 1 an, 3 ans ou 10 ans

**2. Permis local (Zezwolenie)**
- Autorisation spécifique à chaque plan d'eau
- À acheter en plus de la carte nationale
- Durée variable : journée, semaine, mois, saison

### 📋 Différence avec la France
Contrairement à la France où une carte de pêche suffit souvent, en Pologne vous devez **toujours** avoir les deux : la carte nationale ET le permis local du plan d'eau.

## 🏛️ Obtenir sa carte de pêche nationale

### Où l'obtenir :
- **En ligne** : via le site officiel PZW (Polski Związek Wędkarski)
- **Bureaux PZW** : dans les grandes villes
- **Magasins de pêche** : la plupart sont habilités
- **Certaines mairies** : selon les communes

### Documents nécessaires :
- **PESEL** (numéro d'identification polonais)
- **Pièce d'identité** (passeport ou carte UE)
- **Photo d'identité** (pour la carte physique)
- **Justificatif de domicile** (meldunek recommandé)

### 💰 Tarifs 2025 :
- **1 an** : 150 PLN
- **3 ans** : 400 PLN  
- **10 ans** : 1000 PLN

### ⏰ Délais :
- **En ligne** : Carte temporaire immédiate, carte physique sous 2 semaines
- **Sur place** : Immédiat si tous les documents sont OK

## 🗺️ Permis locaux par région

### Voïvodie de Mazovie (Varsovie, Piaseczno)
**Organisme** : Okręg PZW Warszawa
**Tarifs moyens** :
- Journée : 25-40 PLN
- Semaine : 80-120 PLN
- Mois : 150-250 PLN
- Saison : 400-600 PLN

### Voïvodie de Łódź
**Organisme** : Okręg PZW Łódź
**Tarifs moyens** :
- Journée : 20-35 PLN
- Semaine : 70-100 PLN
- Mois : 120-200 PLN
- Saison : 350-500 PLN

### Voïvodie de Petite-Pologne (Cracovie)
**Organisme** : Okręg PZW Kraków
**Tarifs moyens** :
- Journée : 30-45 PLN
- Semaine : 90-130 PLN
- Mois : 180-280 PLN
- Saison : 450-700 PLN

## 🐟 Règles générales de pêche

### Périodes d'interdiction (Ochrona)
**Brochet** : 1er février - 30 avril
**Sandre** : 1er février - 31 mai
**Perche** : 1er avril - 31 mai
**Truite** : 1er octobre - dernière semaine de février

### Tailles minimales (Wymiar ochronny)
- **Brochet** : 50 cm
- **Sandre** : 45 cm
- **Carpe** : 30 cm
- **Truite** : 30 cm
- **Perche** : 15 cm

### 🕐 Horaires autorisés
**Été (avril-septembre)** : 1h avant le lever du soleil - 1h après le coucher
**Hiver (octobre-mars)** : 1h avant le lever du soleil - 1h après le coucher

### Matériel autorisé
- **Maximum 2 cannes** par pêcheur
- **Hameçons sans ardillon** recommandés
- **Épuisette obligatoire** pour la remise à l'eau
- **Interdiction** des filets, nasses, et pêche électrique

## 🏞️ Meilleurs spots autour de Varsovie

### Lac de Zegrze (30 km de Varsovie)
**Espèces** : Brochet, sandre, perche, carpe
**Accès** : Train + bus ou voiture
**Permis** : Okręg Warszawa
**Conseil** : Excellent pour le brochet au printemps

### Rivière Bug (Est de Varsovie)
**Espèces** : Barbeau, chevesne, gardon
**Accès** : Voiture recommandée
**Permis** : Okręg Warszawa
**Conseil** : Pêche au coup très productive

### Lac Białe près de Piaseczno
**Espèces** : Carpe, tanche, rotengle
**Accès** : 15 min en voiture de Piaseczno
**Permis** : Okręg Warszawa
**Conseil** : Idéal pour débuter, poisson abondant

### Vistule (Wisła) à Varsovie
**Espèces** : Sandre, brochet, asp
**Accès** : Métro/tram jusqu'aux berges
**Permis** : Okręg Warszawa
**Conseil** : Pêche urbaine, attention aux bateaux

## 🎯 Spots recommandés par région

### Région des Lacs de Mazurie
**Distance de Varsovie** : 200-300 km
**Espèces** : Brochet, sandre, perche, corégone
**Hébergement** : Nombreux campings et gîtes
**Saison idéale** : Mai-septembre

### Montagnes des Tatras (Sud)
**Distance de Varsovie** : 400 km
**Espèces** : Truite fario, ombre commun
**Spécialité** : Pêche à la mouche en rivière
**Saison idéale** : Juin-août

### Côte Baltique
**Distance de Varsovie** : 300-400 km
**Espèces** : Morue, flet, hareng (pêche en mer)
**Permis** : Différent pour la pêche maritime
**Saison idéale** : Avril-octobre

## 🛒 Où acheter son matériel

### Chaînes nationales
**Decathlon** : Matériel de base, prix abordables
**Jula** : Outillage et matériel de pêche
**Leroy Merlin** : Section pêche dans certains magasins

### Magasins spécialisés
**Sklepy wędkarskie** : Dans chaque ville moyenne
**Marchés locaux** : Matériel d'occasion intéressant
**Vente en ligne** : Livraison dans toute la Pologne

### 💰 Budget matériel débutant
- **Canne polyvalente** : 100-200 PLN
- **Moulinet** : 80-150 PLN
- **Accessoires de base** : 150-250 PLN
- **Total** : 330-600 PLN

## 📱 Applications utiles

### Applications officielles
**PZW Mobile** : Carte de pêche digitale
**Mapa Łowisk** : Localisation des plans d'eau autorisés
**Pogoda Wędkarska** : Météo spécialisée pêche

### Applications météo
**Windy** : Prévisions détaillées vent/pluie
**Barometr** : Pression atmosphérique
**Solunar** : Calendrier lunaire pour la pêche

## ⚖️ Contrôles et amendes

### Qui contrôle
- **Straż Rybacka** : Garde-pêche officielle
- **Policja** : Police nationale
- **Straż Miejska** : Police municipale

### Amendes courantes (2025)
- **Pêche sans permis** : 500-2000 PLN
- **Non-respect des tailles** : 200-800 PLN
- **Pêche en période interdite** : 300-1200 PLN
- **Dépassement du quota** : 100-500 PLN

### 📋 Documents à avoir sur soi
- **Carte de pêche nationale** (physique ou digitale)
- **Permis local** du plan d'eau
- **Pièce d'identité**
- **Règlement local** (recommandé)

## 🌟 Conseils pour bien débuter

### Avant votre première sortie
- **Étudiez le règlement** du plan d'eau choisi
- **Vérifiez les périodes** d'ouverture des espèces
- **Préparez votre matériel** la veille
- **Consultez la météo** et les prévisions

### Sur place
- **Respectez la nature** et les autres pêcheurs
- **Remettez à l'eau** les poissons sous la taille légale
- **Emportez vos déchets**
- **Soyez discret** pour ne pas effrayer le poisson

### Intégration locale
- **Rejoignez un club** de pêche local (Koło PZW)
- **Participez aux concours** organisés
- **Échangez avec les pêcheurs** locaux
- **Apprenez le vocabulaire** de base en polonais

## 🎊 Conclusion

La pêche en Pologne offre une grande diversité de plans d'eau et d'espèces. Le système de permis, bien qu'un peu complexe au début, garantit une gestion durable des ressources.

**Points clés à retenir :**
- **Toujours avoir** carte nationale + permis local
- **Respecter** les périodes et tailles légales  
- **Se renseigner** sur les règlements locaux
- **Profiter** de la richesse des eaux polonaises !

### 🎣 Bon à savoir
La Pologne compte plus de 9000 lacs et de nombreuses rivières poissonneuses. C'est un véritable paradis pour les pêcheurs, avec des poissons souvent plus gros qu'en Europe de l'Ouest grâce à une pression de pêche moindre.

**Powodzenia na rybach !** (Bonne chance à la pêche !)

### 📝 Mise à jour
Guide basé sur la réglementation 2025. Les règles peuvent évoluer. Consultez toujours le site officiel PZW.org.pl pour les informations les plus récentes.`
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