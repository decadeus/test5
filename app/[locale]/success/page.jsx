'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const checkSession = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/checkout-session-status?session_id=${sessionId}`);
        const data = await res.json();

        if (data.status === 'complete') {
          setStatus('success');
        } else {
          setStatus('pending');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    checkSession();
  }, [sessionId]);

  if (status === 'loading') {
    return <p className="text-center mt-10">Vérification du paiement en cours…</p>;
  }

  if (status === 'success') {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold mb-4">Merci pour votre abonnement !</h1>
        <p>Votre paiement a été confirmé. Vous pouvez maintenant publier vos projets.</p>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="text-center mt-10">
        <h1 className="text-xl font-bold mb-4">Paiement en attente…</h1>
        <p>Nous n’avons pas encore reçu la confirmation de votre abonnement.</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-xl font-bold mb-4">Une erreur est survenue</h1>
      <p>Impossible de vérifier votre session de paiement.</p>
    </div>
  );
}
