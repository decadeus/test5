import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function MentionLegal() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 mt-48 mb-12">
      <h1 className="text-2xl font-bold mb-4">Mentions légales</h1>
      <h2 className="text-lg font-semibold mt-6 mb-2">Éditeur du site</h2>
      <p>
        Nom de l'entreprise : <b>DECADEUS</b> (auto-entrepreneur enregistré en Pologne)<br />
        Adresse du siège social : <b>ul. Emilii Plater 1a/60, 05-500 Piaseczno, Pologne</b><br />
        NIP : <b>1231580469</b><br />
        REGON : <b>54168875</b><br />
        E-mail : <b>hoomge@decadeus.com</b>
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Directeur de la publication</h2>
      <p>
        <b>Johann Debeaumont</b>
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Hébergement</h2>
      <p>
        Nom de l'hébergeur : <b>Vercel Inc.</b><br />
        Adresse de l'hébergeur : <b>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</b><br />
        Site web de l'hébergeur : <b>https://vercel.com</b>
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Propriété intellectuelle</h2>
      <p>
        Le contenu de ce site (textes, images, graphismes, logo, etc.) est protégé par le droit d'auteur. Toute reproduction ou utilisation sans autorisation est interdite.
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Responsabilité</h2>
      <p>
        L'éditeur du site s'efforce de fournir des informations exactes, mais ne saurait être tenu responsable des erreurs ou omissions, ni de l'utilisation qui pourrait être faite de ces informations.
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Contact</h2>
      <p>
        Pour toute question, vous pouvez nous contacter à l'adresse suivante : <b>hoomge@decadeus.com</b>
      </p>
      <h2 className="text-lg font-semibold mt-6 mb-2">Avertissement</h2>
      <p>
        Les informations présentées sur les projets immobiliers proviennent directement des promoteurs. DECADEUS ne saurait garantir l'exactitude, l'exhaustivité ou l'actualité de ces informations et décline toute responsabilité en cas d'erreur ou d'omission. Nous invitons les utilisateurs à vérifier les données auprès des promoteurs concernés avant toute décision.
      </p>
      <p className="mt-6 text-sm text-gray-600">
        Pour en savoir plus sur la gestion de vos données personnelles, consultez notre{' '}
        <a href="/fr/GDPR" className="underline hover:text-blue-600">politique de confidentialité</a>.
      </p>
    </div>
  );
}
