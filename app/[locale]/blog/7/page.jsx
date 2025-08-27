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
    <ArticleLayout
      title="Immatriculer sa voiture française en Pologne : le parcours du combattant"
      author="Johann Debeaumont"
      date="2024-01-30"
      readTime="12 min de lecture"
      imageUrl="/immatriculation.png"
      imageAlt="Immatriculation de voiture en Pologne"
      jsonLd={jsonLd}
    >
      {/* Badge */}
      <div>
        <span className="article-badge">
          🚗 Expérience réelle
        </span>
      </div>

      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Guide complet et retour d'expérience sur l'immatriculation d'une voiture française en Pologne. Spoiler : c'est la démarche la plus longue et difficile de toutes ! Préparez-vous psychologiquement.
      </p>

      <div className="info-box-red">
        <h4 className="info-box-title">⚠️ Avertissement important</h4>
        <p className="info-box-content">
          <strong>Cette démarche est complexe, coûteuse et chronophage.</strong> Comptez entre 2 à 6 mois et un budget de 3500 à 20000+ PLN selon votre véhicule. Si votre voiture a plus de 10 ans ou une grosse cylindrée, réfléchissez bien avant de vous lancer.
        </p>
      </div>

      <h2>🗓️ Chronologie des étapes (IMPORTANTE !)</h2>
      <p>
        L'ordre des étapes est <strong>crucial</strong>. Contrairement à la France, certaines démarches ne peuvent se faire qu'après d'autres.
      </p>

      <div className="step-container">
        <h3 className="step-title">Étape 1 : Contrôle technique polonais</h3>
        <p>
          <strong>Première obligation :</strong> Faire passer votre voiture au contrôle technique polonais, même si vous avez un contrôle technique français valide.
        </p>

        <h4>Documents requis :</h4>
        <ul>
          <li>Carte grise française</li>
          <li>Permis de conduire</li>
          <li>Passeport ou carte d'identité</li>
          <li>Certificat de conformité européen (si disponible)</li>
        </ul>

        <div className="info-box-gray">
          <h4 className="info-box-title">💰 Coût</h4>
          <p className="info-box-content">
            <strong>Contrôle standard :</strong> 150-200 PLN<br/>
            <strong>Si contre-visite nécessaire :</strong> +100-150 PLN
          </p>
        </div>

        <div className="info-box-gray">
          <h4 className="info-box-title">📍 Où faire le contrôle</h4>
          <p className="info-box-content">
            Centres agréés (Stacja Kontroli Pojazdów). Prendre rendez-vous à l'avance, les délais peuvent être longs dans les grandes villes.
          </p>
        </div>
      </div>

      <div className="step-container">
        <h3 className="step-title">Étape 2 : Demande d'immatriculation (WRD)</h3>
        <p>
          Une fois le contrôle technique obtenu, vous pouvez faire la demande d'immatriculation au bureau compétent (Wydział Ruchu Drogowego).
        </p>

        <h4>Documents requis :</h4>
        <ul>
          <li>Formulaire de demande d'immatriculation (disponible sur place)</li>
          <li>Carte grise française originale</li>
          <li>Certificat de contrôle technique polonais</li>
          <li>Certificat de conformité européen</li>
          <li>Permis de conduire</li>
          <li>Justificatif de résidence (Meldunek)</li>
          <li>Preuve du paiement des taxes d'import</li>
        </ul>

        <div className="info-box-red">
          <h4 className="info-box-title">⏰ TIMING CRITIQUE</h4>
          <p className="info-box-content">
            <strong>N'assurez PAS votre voiture avant cette étape !</strong> L'assurance se fait APRÈS avoir reçu la nouvelle plaque d'immatriculation polonaise. L'assurance française reste valide pendant la procédure.
          </p>
        </div>

        <div className="info-box-gray">
          <h4 className="info-box-title">💰 Coût</h4>
          <p className="info-box-content">
            <strong>Frais d'immatriculation :</strong> 180-500 PLN (selon région)<br/>
            <strong>Nouvelles plaques :</strong> 80 PLN
          </p>
        </div>
      </div>

      <div className="step-container">
        <h3 className="step-title">Étape 3 : Assurance polonaise</h3>
        <p>
          <strong>Seulement après avoir reçu votre plaque d'immatriculation polonaise</strong>, vous devez souscrire une assurance polonaise et résilier votre assurance française.
        </p>

        <h4>Types d'assurance :</h4>
        <ul>
          <li><strong>OC (Responsabilité civile) :</strong> Obligatoire</li>
          <li><strong>AC (Tous risques) :</strong> Optionnel mais recommandé</li>
          <li><strong>NNW (Accident conducteur) :</strong> Optionnel</li>
        </ul>

        <div className="info-box-gray">
          <h4 className="info-box-title">💰 Coût annuel</h4>
          <p className="info-box-content">
            <strong>OC seule :</strong> 800-1500 PLN/an<br/>
            <strong>OC + AC :</strong> 1500-3000 PLN/an<br/>
            <em>Tarifs variables selon l'âge, bonus/malus, ville...</em>
          </p>
        </div>
      </div>

      <h2>💸 Budget à prévoir : le point crucial</h2>
      <p>
        Le coût total varie <strong>énormément</strong> selon votre véhicule. Voici le détail complet :
      </p>

      <div className="info-box-red">
        <h4 className="info-box-title">💰 COÛT MAJEUR : Taxes d'import officiel</h4>
        <p className="info-box-content mb-3">
          <strong>Le plus gros poste de dépense !</strong> Les taxes d'import dépendent de :
        </p>
        <ul className="info-box-content space-y-1 mb-3">
          <li>• <strong>Puissance du moteur</strong> (cylindrée, chevaux)</li>
          <li>• <strong>Âge du véhicule</strong> (voitures anciennes = taxes plus élevées)</li>
          <li>• <strong>Valeur estimée</strong> par l'administration</li>
          <li>• <strong>Émissions CO2</strong> et norme Euro</li>
        </ul>
        <div className="info-sub-box">
          <p className="info-box-content">
            <strong>💸 Exemples de taxes d'import :</strong><br/>
            • Petite voiture récente (&lt;5 ans) : 2000-5000 PLN<br/>
            • Voiture moyenne (5-10 ans) : 3000-8000 PLN<br/>
            • Grosse voiture ou ancienne (&gt;10 ans) : 5000-15000+ PLN
          </p>
        </div>
      </div>

      <h3>Autres coûts :</h3>
      <ul>
        <li><strong>Contrôle technique :</strong> 150-350 PLN</li>
        <li><strong>Frais d'immatriculation :</strong> 180-500 PLN</li>
        <li><strong>Nouvelles plaques :</strong> 80 PLN</li>
        <li><strong>Assurance (1ère année) :</strong> 800-3000 PLN</li>
        <li><strong>Traductions certifiées :</strong> 100-200 PLN</li>
        <li><strong>Déplacements/temps :</strong> Variable</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">💰 Total estimé</h4>
        <p className="info-box-content">
          <strong>3500-20000+ PLN (selon la voiture)</strong><br/>
          <em>Soit environ 800-4500€</em>
        </p>
      </div>

      <p>
        Pour une activité indépendante en Pologne, consultez mon guide sur <Link href={`/${currentLocale}/blog/8`} className="internal-link">la création de micro-entreprise</Link> - cela peut influencer vos choix de véhicule professionnel.
      </p>

      <h2>🔧 Documents essentiels à préparer</h2>
      <p>
        Préparez ces documents <strong>avant</strong> de commencer les démarches :
      </p>

      <h3>Documents français :</h3>
      <ul>
        <li>Carte grise originale (pas de copie)</li>
        <li>Certificat de conformité européen</li>
        <li>Dernière facture d'achat</li>
        <li>Contrôle technique français (si récent)</li>
        <li>Attestation d'assurance française</li>
      </ul>

      <h3>Documents polonais :</h3>
      <ul>
        <li>Meldunek (justificatif de résidence)</li>
        <li>Permis de conduire (français accepté)</li>
        <li>Passeport ou carte d'identité</li>
      </ul>

      <h3>Traductions :</h3>
      <ul>
        <li>Carte grise traduite et certifiée</li>
        <li>Certificat de conformité traduit</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">💡 Conseil pratique</h4>
        <p className="info-box-content">
          Faites traduire vos documents par un traducteur assermenté dès le début. Certains bureaux peuvent refuser les traductions non officielles.
        </p>
      </div>

      <h2>📍 Où faire les démarches</h2>
      <p>
        Les démarches se font dans <strong>différents endroits</strong> selon l'étape :
      </p>

      <h3>Contrôle technique :</h3>
      <ul>
        <li><strong>Stacja Kontroli Pojazdów</strong> agréée</li>
        <li>Prendre rendez-vous en ligne si possible</li>
        <li>Délais : 1-3 semaines selon la région</li>
      </ul>

      <h3>Immatriculation :</h3>
      <ul>
        <li><strong>Wydział Ruchu Drogowego (WRD)</strong> de votre commune</li>
        <li>Généralement dans les bureaux municipaux</li>
        <li>Horaires souvent restreints (8h-15h)</li>
      </ul>

      <h3>Taxes d'import :</h3>
      <ul>
        <li><strong>Urząd Celno-Skarbowy</strong> (Bureau des douanes)</li>
        <li>Calcul et paiement des taxes</li>
        <li>Peut nécessiter une expertise du véhicule</li>
      </ul>

      <h2>⏱️ Délais réalistes</h2>
      <p>
        Préparez-vous à une procédure <strong>longue</strong> :
      </p>

      <ul>
        <li><strong>Préparation documents :</strong> 2-4 semaines</li>
        <li><strong>Contrôle technique :</strong> 1-3 semaines (rdv + résultat)</li>
        <li><strong>Calcul taxes d'import :</strong> 2-6 semaines</li>
        <li><strong>Immatriculation finale :</strong> 1-2 semaines</li>
        <li><strong>Assurance :</strong> 1-3 jours</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">⏰ Délai total</h4>
        <p className="info-box-content">
          <strong>2 à 6 mois</strong> selon les complications rencontrées
        </p>
      </div>

      <h2>😤 Les principales difficultés rencontrées</h2>
      <p>
        Voici les problèmes les plus fréquents et comment les éviter :
      </p>

      <h3>Problèmes de documents :</h3>
      <ul>
        <li><strong>Certificat de conformité manquant</strong> - Contactez le constructeur en France avant de partir</li>
        <li><strong>Traductions refusées</strong> - Utilisez uniquement des traducteurs assermentés</li>
        <li><strong>Carte grise en leasing</strong> - Procédure différente, plus complexe</li>
      </ul>

      <h3>Problèmes administratifs :</h3>
      <ul>
        <li><strong>Bureaux surchargés</strong> - Prendre rdv très à l'avance</li>
        <li><strong>Langue polonaise</strong> - Venir accompagné d'un polonophone si possible</li>
        <li><strong>Délais variables</strong> - Éviter juillet-août et période de Noël</li>
      </ul>

      <h3>Problèmes financiers :</h3>
      <ul>
        <li><strong>Taxes supérieures à la valeur du véhicule</strong> - Bien calculer avant de commencer</li>
        <li><strong>Coûts cachés</strong> - Prévoir 20% de budget supplémentaire</li>
        <li><strong>Paiements en espèces</strong> - Certains bureaux n'acceptent que les espèces</li>
      </ul>

      <h2>💡 Mes conseils pour réussir</h2>
      <p>
        Après avoir traversé cette épreuve, voici mes recommandations :
      </p>

      <h3>Avant de commencer :</h3>
      <ul>
        <li><strong>Évaluez le coût total</strong> - Parfois mieux vaut vendre en France et racheter en Pologne</li>
        <li><strong>Vérifiez l'âge de votre voiture</strong> - Plus de 10 ans = taxes très élevées</li>
        <li><strong>Rassemblez TOUS les documents</strong> avant de partir de France</li>
        <li><strong>Apprenez quelques mots clés</strong> en polonais</li>
      </ul>

      <h3>Pendant la procédure :</h3>
      <ul>
        <li><strong>Gardez tous les reçus</strong> - Utiles en cas de problème</li>
        <li><strong>Prenez des photos</strong> de tous les documents remis</li>
        <li><strong>Restez patient et poli</strong> - Les fonctionnaires peuvent aider</li>
        <li><strong>Prévoyez des alternatives</strong> - Transport public, vélo, location</li>
      </ul>

      <h3>Solutions de contournement :</h3>
      <ul>
        <li><strong>Véhicule de location longue durée</strong> pendant la procédure</li>
        <li><strong>Achat d'une voiture polonaise</strong> d'occasion en attendant</li>
        <li><strong>Covoiturage et transport public</strong> - Très développés en Pologne</li>
      </ul>

      <h2>🎯 Mon retour d'expérience</h2>
      <p>
        Sincèrement, c'est <strong>la démarche la plus pénible</strong> de toutes celles que j'ai faites en Pologne. Entre les allers-retours, les documents manquants, les délais qui s'allongent et surtout le coût final qui explose...
      </p>

      <h3>Ce qui m'a le plus marqué :</h3>
      <ul>
        <li><strong>Le coût des taxes d'import</strong> - Bien plus élevé que prévu</li>
        <li><strong>La complexité administrative</strong> - Plusieurs organismes, documents spécifiques</li>
        <li><strong>Les délais imprévisibles</strong> - Compter large dans la planification</li>
        <li><strong>L'importance de la préparation</strong> - Un document manquant = tout recommencer</li>
      </ul>

      <h3>Aurais-je fait différemment ?</h3>
      <p>
        Avec le recul, <strong>j'aurais vendu ma voiture en France</strong> et acheté directement en Pologne. Le marché automobile polonais est bien fourni, les prix corrects, et ça évite tout ce parcours du combattant.
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">🚗 Alternative recommandée</h4>
        <p className="info-box-content">
          <strong>Pour les voitures de plus de 5-7 ans :</strong> Vendez en France, achetez en Pologne. Vous économiserez du temps, de l'argent et des nerfs !
        </p>
      </div>

      <h2>🔗 Ressources utiles</h2>
      <p>
        Voici les liens et contacts qui m'ont aidé :
      </p>

      <ul>
        <li><strong>Site officiel :</strong> gov.pl (infos sur l'immatriculation)</li>
        <li><strong>Contrôle technique :</strong> Rechercher "Stacja Kontroli Pojazdów" + votre ville</li>
        <li><strong>Traducteurs assermentés :</strong> Liste sur le site du consulat français</li>
        <li><strong>Calculateur de taxes :</strong> Disponible sur le site des douanes polonaises</li>
      </ul>

      <div className="info-box-gray">
        <h4 className="info-box-title">📞 En cas de problème</h4>
        <p className="info-box-content">
          N'hésitez pas à contacter le consulat français en Pologne - ils connaissent bien ces problématiques et peuvent parfois débloquer des situations.
        </p>
      </div>

      <div className="info-box-gray">
        <h4 className="info-box-title">📝 Note importante</h4>
        <p className="info-box-content">
          Guide basé sur mon expérience en 2024. Les procédures et tarifs peuvent évoluer. Vérifiez toujours les informations officielles avant de commencer vos démarches.
        </p>
      </div>
    </ArticleLayout>
  );
}