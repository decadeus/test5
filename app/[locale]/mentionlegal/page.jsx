import React from 'react';

const LegalPage = () => {
  return (
    <div className='pt-20'>
      <h1>Mentions Légales</h1>
      <p>Bienvenue sur notre page des mentions légales. Vous trouverez ici les informations légales concernant notre entreprise.</p>

      <section>
        <h2>Informations sur l'entreprise</h2>
        <p><strong>Nom de l'entreprise : </strong>Johann Debeaumont DECADEUS</p>
        <p><strong>Adresse : </strong>ul. Emilii Plater 1a/60, 05-500 Piaseczno, Pologne</p>
        <p><strong>Numéro NIP : </strong>1231580469</p>
        <p><strong>Numéro REGON : </strong>54168875</p>
        <p><strong>Forme juridique : </strong>Entreprise individuelle</p>
        <p><strong>Email : </strong>hoomge@decadeus.com</p>
      </section>

      <section>
        <h2>Responsable du site</h2>
        <p>Le responsable de la publication du site web est : Johann Debeaumont.</p>
      </section>

      <section>
        <h2>Conditions d'utilisation</h2>
        <p>Veuillez consulter notre <a href="/privacy-policy">Politique de confidentialité</a> et nos <a href="/terms-of-service">Conditions d'utilisation</a> pour plus d'informations sur la gestion des données personnelles et des droits d'utilisation du site.</p>
      </section>

    </div>
  );
}

export default LegalPage;
