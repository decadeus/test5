import Link from "next/link";

export default function WelcomePromoter() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '1rem' }}>
      <div style={{ maxWidth: '36rem', width: '100%', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '2px solid #16a34a', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
          <div style={{ color: '#16a34a', width: '2.5rem', height: '2.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Bienvenue sur la plateforme !</h1>

          <p style={{ color: '#374151', fontSize: '1rem' }}>
            Votre abonnement est confirmé.
          </p>
          <p style={{ color: '#374151', fontSize: '1rem' }}>
            Vous êtes maintenant prêt à <span style={{ fontWeight: '600' }}>promouvoir vos projets immobiliers</span>.
          </p>
          <p style={{ color: '#374151', fontSize: '1rem' }}>
            Connectez-vous pour commencer à publier vos projets et suivre leur performance.
          </p>

          <Link href="/login">
            <a style={{ marginTop: '0.5rem', backgroundColor: '#16a34a', color: 'white', fontWeight: '600', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontSize: '1.125rem', textDecoration: 'none', display: 'inline-block' }}>
              Se connecter
            </a>
          </Link>

          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Merci pour votre confiance.
          </p>
        </div>
      </div>
    </div>
  );
}
