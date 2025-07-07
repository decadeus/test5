import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 mt-48 mb-12">
      <h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1>
      <p>
        Cette politique de confidentialité décrit comment DECADEUS collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation polonaise.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Responsable du traitement</h2>
      <p>
        DECADEUS<br />
        ul. Emilii Plater 1a/60, 05-500 Piaseczno, Pologne<br />
        NIP : 1231580469<br />
        E-mail : debeaumont@decadeus.com
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Données collectées</h2>
      <ul className="list-disc ml-6">
        <li>Adresse e-mail (inscription, abonnement, contact, feedback chatbot)</li>
        <li>Nom et prénom (promoteurs, collaborateurs)</li>
        <li>Nom de la société (promoteurs)</li>
        <li>Données de navigation (cookies techniques, adresse IP, logs de connexion)</li>
        <li>Informations fournies via les formulaires (projets, contact, abonnement, feedback)</li>
        <li>Identifiants de connexion générés automatiquement (pour l'accès sécurisé)</li>
        <li>Cookies de favoris (sauvegarde des projets favoris, 12 mois)</li>
        <li>Aucune donnée bancaire n'est stockée sur nos serveurs (paiement géré par Stripe)</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">Finalités du traitement</h2>
      <ul className="list-disc ml-6">
        <li>Gérer votre compte et vos demandes</li>
        <li>Améliorer nos services et votre expérience utilisateur</li>
        <li>Vous contacter si nécessaire</li>
        <li>Respecter nos obligations légales</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6 mb-2">Base légale</h2>
      <p>
        Le traitement de vos données repose sur votre consentement, l'exécution d'un contrat ou le respect d'une obligation légale.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Durée de conservation</h2>
      <p>
        Vos données sont conservées uniquement le temps nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, sauf obligation légale contraire.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Partage des données</h2>
      <p>
        Vos données ne sont pas partagées avec des tiers, sauf si cela est nécessaire à la fourniture du service ou exigé par la loi.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Droits des utilisateurs</h2>
      <ul className="list-disc ml-6">
        <li>Droit d'accès, de rectification et d'effacement de vos données</li>
        <li>Droit de limitation ou d'opposition au traitement</li>
        <li>Droit à la portabilité de vos données</li>
        <li>Droit de retirer votre consentement à tout moment</li>
      </ul>
      <p>
        Pour exercer vos droits, contactez-nous à l'adresse : <b>debeaumont@decadeus.com</b>
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Sécurité</h2>
      <p>
        Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Cookies</h2>
      <p>
        Ce site utilise des cookies pour améliorer l'expérience utilisateur. Pour plus d'informations, consultez notre <a href="/fr/pdc" className="underline">politique de cookies</a>.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Contact</h2>
      <p>
        Pour toute question relative à la protection de vos données, contactez-nous à l'adresse : <b>debeaumont@decadeus.com</b>
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Chatbot et conservation des conversations</h2>
      <p>
        Les conversations avec le chatbot peuvent être enregistrées de façon anonyme afin d'améliorer le service et de mieux prendre en compte les suggestions des utilisateurs. Aucune adresse e-mail n'est conservée. Les conversations sont stockées pendant une durée maximale d'un mois avant suppression automatique. Elles ne sont jamais utilisées à des fins commerciales.
      </p>
    </div>
  );
} 