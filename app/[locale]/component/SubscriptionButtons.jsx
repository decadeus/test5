'use client'; // si tu es en app directory avec Next.js 13+

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Initialise Supabase client côté client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubscriptionButtons() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'utilisateur connecté via Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Erreur récupération utilisateur Supabase:', error);
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const startSubscription = async (priceId) => {
    if (!user) return alert('Connexion requise pour souscrire un abonnement');

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        email: user.email,
        userId: user.id,
      }),
    });

    const data = await res.json();
    if (res.status !== 200) {
      console.error(data.message);
      return alert('Erreur lors de la création de la session de paiement');
    }

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.sessionId });
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-4">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
        onClick={() => startSubscription('prod_SIpRbNvkPezP4u')} // Remplace par ton vrai price ID
      >
        S’abonner – 1 projet / 147 PLN/mois
      </button>

      <button
        className="px-6 py-3 bg-green-600 text-white rounded-xl"
        onClick={() => startSubscription('price_500XXX')} // Remplace par ton vrai price ID
      >
        S’abonner – 5 projets / 500 PLN/mois
      </button>
    </div>
  );
}
