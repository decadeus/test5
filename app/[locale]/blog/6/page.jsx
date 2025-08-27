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
    <ArticleLayout
      title="NFZ : Comment utiliser le système de santé polonais"
      author="Johann Debeaumont"
      date="2024-01-25"
      readTime="10 min de lecture"
      imageUrl="/apteka.png"
      imageAlt="Pharmacie en Pologne - système NFZ"
      jsonLd={jsonLd}
    >
      {/* Badge */}
      <div>
        <span className="article-badge">
          🏥 Guide pratique
        </span>
      </div>

      <p className="text-xl text-gray-700 leading-relaxed mb-8">
        Guide pratique pour naviguer dans le système de santé polonais : CMP, ordonnances par code, pharmacies, remboursements. Mon expérience concrète avec le NFZ en tant qu'expatrié français.
      </p>

      <p>
        Après avoir obtenu ma couverture NFZ, j'ai dû apprendre à naviguer dans le système de santé polonais. Voici mon retour d'expérience concret : CMP, ordonnances par code, pharmacies, remboursements et tous les détails pratiques qui m'ont servi au quotidien.
      </p>

      <h2>1️⃣ Comprendre le système NFZ</h2>
      <p>
        Le <strong>NFZ (Narodowy Fundusz Zdrowia)</strong> est l'équivalent de la Sécurité sociale française. Une fois inscrit, vous avez accès aux soins de santé publics en Pologne.
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">📋 Différence importante avec la France</h4>
        <p className="info-box-content">
          Il n'y a pas de <strong>carte de sécurité sociale</strong> comme en France. Votre numéro PESEL suffit pour tous vos rendez-vous médicaux et à la pharmacie.
        </p>
      </div>

      <div className="info-box-gray">
        <h4 className="info-box-title">📚 Prérequis</h4>
        <p className="info-box-content">
          Pour obtenir le NFZ, vous devez d'abord avoir votre PESEL. Consultez mon guide <Link href={`/${currentLocale}/blog/5`} className="internal-link">"S'installer en Pologne"</Link> pour les démarches PESEL et autres prérequis administratifs.
        </p>
      </div>

      <h2>2️⃣ Choisir son médecin généraliste (POZ)</h2>
      <p>
        Première étape importante : <strong>choisir et s'inscrire chez un médecin généraliste</strong>. De mon côté, je me suis inscrit chez un <strong>CMP (Centre Médical Pluridisciplinaire)</strong>.
      </p>
      
      <h3>Les avantages d'un CMP :</h3>
      <ul>
        <li>Centre regroupant <strong>plusieurs médecins</strong></li>
        <li>Plus de <strong>disponibilité</strong> pour les rendez-vous</li>
        <li><strong>Services en ligne</strong> développés</li>
        <li>Continuité des soins même si votre médecin habituel n'est pas disponible</li>
      </ul>

      <h3>Comment prendre rendez-vous :</h3>
      <p><strong>En ligne :</strong> Via le site web du CMP - pratique et disponible 24h/24</p>
      <p><strong>Sur place :</strong> Directement au centre médical - idéal pour les urgences</p>

      <h2>3️⃣ Le système d'ordonnances par code</h2>
      <p>
        Le système polonais est <strong>entièrement numérique</strong> pour les ordonnances. Fini le papier !
      </p>

      <h3>Après la consultation :</h3>
      <ol>
        <li>Le médecin rédige l'ordonnance dans son système</li>
        <li>Vous recevez un <strong>code par SMS</strong> sur votre téléphone</li>
        <li>Ce code vous permet de récupérer vos médicaments en pharmacie</li>
        <li>Durée de validité : <strong>30 jours</strong> en général</li>
      </ol>

      <div className="info-box-gray">
        <h4 className="info-box-title">🔄 Renouvellement automatique</h4>
        <p className="info-box-content">
          <strong>Gain de temps énorme !</strong> Plus besoin de consultation pour un simple renouvellement.
        </p>
      </div>

      <h2>4️⃣ À la pharmacie (Apteka)</h2>
      <h3>Procédure simple :</h3>
      <ol>
        <li>Donnez le <strong>code de l'ordonnance</strong> au pharmacien</li>
        <li>Présentez votre <strong>numéro PESEL</strong></li>
        <li>Le remboursement est <strong>automatique</strong> selon le niveau de prise en charge</li>
        <li>Vous payez seulement la <strong>part non remboursée</strong></li>
      </ol>

      <div className="info-box-gray">
        <h4 className="info-box-title">💡 Astuce pratique</h4>
        <p className="info-box-content">
          Gardez vos codes d'ordonnance dans votre téléphone. En cas de perte, le pharmacien peut retrouver vos ordonnances avec votre PESEL, mais c'est plus long.
        </p>
      </div>

      <h2>5️⃣ Spécialistes et hôpital</h2>
      
      <div className="info-box-red">
        <h4 className="info-box-title">⚠️ Règle importante</h4>
        <p className="info-box-content">
          Pour obtenir des rendez-vous avec des <strong>spécialistes ou à l'hôpital</strong>, il faut <strong>obligatoirement un papier (référence) venant du médecin généraliste</strong>.
        </p>
      </div>

      <h3>Comment ça marche :</h3>
      <ol>
        <li>Consultez votre <strong>médecin généraliste</strong> en premier</li>
        <li>Il vous donne une <strong>référence (skierowanie)</strong> si nécessaire</li>
        <li>Avec cette référence, vous pouvez prendre rendez-vous chez le spécialiste</li>
        <li>Le remboursement NFZ s'applique automatiquement</li>
      </ol>

      <h2>6️⃣ Système de remboursement</h2>
      <p>
        Le NFZ fonctionne avec <strong>différents niveaux de remboursement</strong> selon le type de médicament et votre situation.
      </p>

      <h3>Niveaux de prise en charge :</h3>
      <ul>
        <li><strong>100% :</strong> Médicaments essentiels</li>
        <li><strong>70% :</strong> Médicaments courants</li>
        <li><strong>30% :</strong> Médicaments de confort</li>
        <li><strong>0% :</strong> Médicaments non remboursés</li>
      </ul>

      <h2>7️⃣ Mes conseils pour réussir avec le NFZ</h2>
      <p>Après plusieurs mois d'utilisation du système NFZ, voici mes recommandations pratiques :</p>

      <h3>Pour optimiser vos démarches :</h3>
      <ul>
        <li><strong>Gardez toujours votre PESEL</strong> - c'est votre identifiant universel</li>
        <li><strong>Utilisez les services en ligne</strong> de votre CMP quand possible</li>
        <li><strong>Prévoyez à l'avance</strong> - les délais peuvent être longs pour certains spécialistes</li>
        <li><strong>Apprenez quelques mots clés</strong> en polonais pour faciliter les consultations</li>
      </ul>

      <h3>Applications utiles :</h3>
      <ul>
        <li><strong>Czy Otwarte :</strong> pour trouver des pharmacies ouvertes</li>
        <li><strong>Karta Ubezpieczeniat :</strong> pour vérifier vos droits NFZ</li>
        <li><strong>Site web de votre CMP :</strong> pour prendre rendez-vous en ligne</li>
      </ul>

      <h2>💬 Mon expérience personnelle avec le NFZ</h2>
      <p>
        Globalement, le système NFZ fonctionne bien une fois qu'on comprend le principe. Les <strong>ordonnances par code sont très pratiques</strong> et les pharmaciens sont habitués aux expatriés.
      </p>

      <h3>Ce qui m'a le plus surpris :</h3>
      <ul>
        <li>La <strong>digitalisation poussée</strong> - plus avancée qu'en France sur certains aspects</li>
        <li>L'<strong>efficacité des CMP</strong> - système bien rodé</li>
        <li>La <strong>disponibilité des pharmacies</strong> - nombreuses et bien réparties</li>
        <li>Les <strong>prix abordables</strong> même pour les médicaments non remboursés</li>
      </ul>

      <h3>Quelques défis rencontrés :</h3>
      <ul>
        <li><strong>Barrière de la langue</strong> parfois - mais les médecins parlent souvent anglais</li>
        <li><strong>Délais pour certains spécialistes</strong> - anticipez vos besoins</li>
        <li><strong>Différences culturelles</strong> dans l'approche médicale</li>
      </ul>

      <h2>Mon retour d'expérience</h2>
      <p>
        Le système NFZ m'a vraiment facilité la vie une fois maîtrisé. La transition avec le système de santé français s'est bien passée, et j'apprécie particulièrement la modernité du système d'ordonnances.
      </p>

      <p>
        Si vous déménagez bientôt en Pologne et comptez créer une activité, consultez aussi mon guide sur <Link href={`/${currentLocale}/blog/8`} className="internal-link">la création de micro-entreprise</Link> - cela peut influencer votre couverture santé via le ZUS.
      </p>

      <div className="info-box-gray">
        <h4 className="info-box-title">📝 Note finale</h4>
        <p className="info-box-content">
          Guide basé sur mon expérience personnelle avec le système NFZ. Les procédures peuvent varier selon les régions et centres médicaux. En cas de doute, n'hésitez pas à demander directement à votre CMP !
        </p>
      </div>
    </ArticleLayout>
  );
}