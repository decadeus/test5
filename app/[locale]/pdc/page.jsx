import React from "react";

export default function pdc() {
  const para = "flex flex-col gap-2";
  return (
    <div className="mt-24 h-full w-[800px] flex flex-col gap-8">
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
      <div className={para}>
        <h2 className="text-black text-xl">
          1. Rôle de la Plateforme dans les CGU
        </h2>
        <p>
          Responsabilité de la Plateforme en tant qu’Hébergeur d’Informations
          Hoomge.com agit exclusivement comme un hébergeur d’informations pour
          les projets immobiliers. Les informations publiées sur les projets,
          incluant le lieu, le nom, la société associée, et la liste des
          appartements disponibles, sont fournies et mises à jour directement
          par les utilisateurs autorisés (les promoteurs ou responsables de
          projet immobilier). En conséquence, Hoomge.com ne garantit ni la
          précision ni l’exhaustivité de ces informations et décline toute
          responsabilité en cas d’erreurs, d’omissions ou d’informations
          obsolètes. Les utilisateurs sont encouragés à vérifier les
          informations directement auprès des promoteurs ou entreprises
          responsables des projets immobiliers avant de prendre toute décision.
        </p>
      </div>
      <div className={para}>
        <h2 className="text-black text-xl">
          2. Obligations des Utilisateurs Autonomes
        </h2>
        <p>
          En accédant et en utilisant ce site, vous acceptez les présentes
          conditions générales d'utilisation.Obligations des Utilisateurs
          Autorisés Les utilisateurs autorisés à ajouter ou modifier les
          informations de projets immobiliers s’engagent à fournir des
          informations exactes, actuelles et complètes, en lien avec les projets
          dont ils assurent la promotion. Ils assument l’entière responsabilité
          des informations qu’ils publient sur la plateforme. En soumettant des
          informations, les utilisateurs garantissent qu’ils disposent des
          droits nécessaires pour publier ces informations et qu’ils respectent
          toutes les lois et réglementations applicables. En cas de fausse
          information ou d'erreur, Hoomge.com se réserve le droit de suspendre
          l’accès des utilisateurs en infraction et de supprimer les
          informations non conformes.
        </p>
      </div>
    </div>
  );
}