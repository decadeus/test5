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
