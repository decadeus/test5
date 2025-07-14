// app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 space-y-8 mt-24">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">Politique de confidentialité</h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : [DATE DE MISE À JOUR]</p>
      </header>

      <section className="space-y-4">
        <p>
          Cette politique de confidentialité explique comment <strong>HOOMGE</strong> (l’« Application »), exploitée par <strong>DEBEAUMONT Johann</strong> (« nous »), collecte, utilise et protège vos données personnelles conformément au Règlement (UE) 2016/679 (le « RGPD »).<br />
          <br />
          <strong>Cette politique inclut également notre politique de gestion des cookies et traceurs.</strong>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Définitions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Donnée personnelle :</strong> toute information se rapportant à une personne physique identifiée ou identifiable.</li>
          <li><strong>Traitement :</strong> toute opération appliquée à des données personnelles (collecte, stockage, etc.).</li>
          <li><strong>Personne concernée :</strong> la personne dont les données sont traitées.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Responsable du traitement</h2>
        <p>
          <strong>DEBEAUMONT Johann</strong><br />
          Piaseczno, Pologne<br />
          <a href="mailto:hoomge@decadeus.com" className="underline hover:text-blue-600">
            hoomge@decadeus.com
          </a>
        </p>
      </section>

      <section className="space-y-4 overflow-x-auto">
        <h2 className="text-2xl font-semibold">4. Données collectées</h2>
        <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Catégorie</th>
              <th className="p-2 text-left">Exemples</th>
              <th className="p-2 text-left">Base légale</th>
              <th className="p-2 text-left">Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Identification</td>
              <td className="p-2">Adresse e-mail, nom, identifiant utilisateur</td>
              <td className="p-2">Exécution du contrat</td>
              <td className="p-2">3 ans après la dernière activité</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Connexion & sécurité</td>
              <td className="p-2">Adresse IP, logs, jetons d’authentification</td>
              <td className="p-2">Intérêt légitime (sécurité)</td>
              <td className="p-2">13 mois</td>
            </tr>
            <tr>
              <td className="p-2">Projets & favoris</td>
              <td className="p-2">Titres, descriptions, images, favoris</td>
              <td className="p-2">Exécution du contrat</td>
              <td className="p-2">Durée de vie du compte + 3 ans</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Collaborateurs</td>
              <td className="p-2">Adresse e-mail des collaborateurs</td>
              <td className="p-2">Exécution du contrat</td>
              <td className="p-2">Durée de vie du compte + 3 ans</td>
            </tr>
            <tr>
              <td className="p-2">Paiement</td>
              <td className="p-2">ID Stripe, historique des transactions</td>
              <td className="p-2">Obligation légale / contrat</td>
              <td className="p-2">10 ans (obligation comptable)</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Cookies</td>
              <td className="p-2">ID de session, ID cookie favoris</td>
              <td className="p-2">Intérêt légitime</td>
              <td className="p-2">12 mois</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Finalités du traitement</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Fournir et gérer l’accès à la plateforme (création de compte, connexion, gestion du profil, gestion des projets)</li>
          <li>Permettre la création, la gestion et le partage de projets immobiliers</li>
          <li>Gérer les relations clients et le support utilisateur</li>
          <li>Gérer les abonnements et les paiements (facturation, gestion des statuts d’abonnement, historique des transactions)</li>
          <li>Assurer la sécurité de la plateforme et prévenir la fraude (logs, adresses IP, contrôle des accès)</li>
          <li>Améliorer les services et l’expérience utilisateur (analyse des retours, amélioration continue)</li>
          <li>Permettre la gestion des favoris et des fonctionnalités personnalisées</li>
          <li>Respecter les obligations légales et réglementaires (conservation des données, facturation, réponse aux demandes légales)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Bases légales</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Exécution du contrat</strong> (gestion du compte, accès à la plateforme, gestion des projets, abonnements, paiements)</li>
          <li><strong>Intérêt légitime</strong> (sécurité de la plateforme, prévention de la fraude, amélioration continue, gestion des favoris)</li>
          <li><strong>Obligation légale</strong> (conservation des données de facturation, réponse aux demandes des autorités)</li>
          <li><strong>Consentement</strong> (uniquement pour les traitements nécessitant un accord explicite, comme l’envoi de newsletters ou l’utilisation de cookies analytiques)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Destinataires des données</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Équipes internes</strong> (accès limité aux membres de l’équipe ayant besoin d’intervenir pour la gestion de la plateforme ou le support)</li>
          <li><strong>Prestataires techniques et hébergeurs</strong> (hébergement, maintenance, services cloud, sous-traitants liés par des engagements de confidentialité)</li>
          <li><strong>Prestataires de paiement</strong> (ex : Stripe, pour la gestion des abonnements et paiements)</li>
          <li><strong>Autorités administratives ou judiciaires</strong> (uniquement en cas d’obligation légale ou de demande officielle)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Transferts hors UE</h2>
        <p>Les transferts sont protégés par des clauses contractuelles types ou des décisions d’adéquation.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Mesures de sécurité</h2>
        <p>Nous mettons en œuvre le chiffrement, des contrôles d’accès, des sauvegardes et la pseudonymisation.</p>
      </section>

      <section className="space-y-4 overflow-x-auto">
        <h2 className="text-2xl font-semibold">10. Cookies &amp; traceurs</h2>
        <table className="w-full text-sm border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Finalité</th>
              <th className="p-2 text-left">Durée</th>
              <th className="p-2 text-left">Consentement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Cookies de session</td>
              <td className="p-2">Authentification, maintien de la connexion</td>
              <td className="p-2">Session</td>
              <td className="p-2">Non requis</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Cookie favoris</td>
              <td className="p-2">Sauvegarde des projets favoris</td>
              <td className="p-2">12 mois</td>
              <td className="p-2">Non requis</td>
            </tr>
            <tr>
              <td className="p-2">Cookie de consentement</td>
              <td className="p-2">Mémorise le choix de l’utilisateur sur les cookies</td>
              <td className="p-2">12 mois</td>
              <td className="p-2">Non requis</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-2">Cookies analytiques</td>
              <td className="p-2">Non utilisés actuellement</td>
              <td className="p-2">–</td>
              <td className="p-2">–</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">Aucun cookie publicitaire ou de suivi tiers n’est utilisé par défaut. Si des outils d’analyse sont ajoutés, cette section sera mise à jour et le consentement sera recueilli.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">11. Vos droits</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Droit d’accès</strong> : obtenir la confirmation que vos données sont traitées et accéder à l’ensemble des informations vous concernant.</li>
          <li><strong>Droit de rectification</strong> : demander la correction de données inexactes ou incomplètes.</li>
          <li><strong>Droit d’effacement (« droit à l’oubli »)</strong> : demander la suppression de vos données, dans les limites prévues par la loi.</li>
          <li><strong>Droit à la limitation du traitement</strong> : demander la suspension temporaire du traitement de vos données.</li>
          <li><strong>Droit d’opposition</strong> : vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière, ou à des fins de prospection.</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et les transmettre à un autre responsable de traitement.</li>
          <li><strong>Droit de retirer votre consentement</strong> : lorsque le traitement est fondé sur le consentement, vous pouvez le retirer à tout moment.</li>
          <li><strong>Droit de ne pas faire l’objet d’une décision automatisée</strong> : demander à ne pas faire l’objet d’une décision fondée exclusivement sur un traitement automatisé.</li>
        </ul>
        <p className="mt-2">Pour exercer vos droits, contactez&nbsp;
          <a href="mailto:hoomge@decadeus.com" className="underline hover:text-blue-600">hoomge@decadeus.com</a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">12. Modifications de la politique</h2>
        <p>Nous pouvons mettre à jour cette politique pour des raisons légales ou techniques et vous en informerons en conséquence.</p>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="text-2xl font-semibold">13. Contact</h2>
        <p>
          Pour toute question concernant cette politique, contactez&nbsp;
          <a href="mailto:hoomge@decadeus.com" className="underline hover:text-blue-600">
            hoomge@decadeus.com
          </a>.
        </p>
      </section>
    </main>
  );
}

