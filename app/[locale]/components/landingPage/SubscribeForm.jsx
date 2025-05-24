'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

// --- Configuration Supabase & Stripe ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// --- Constants ---
const PRICE_IDS = {
  '1': 'price_147xxx', // Remplace avec l’ID réel
  '5': 'price_500xxx', // Remplace avec l’ID réel
};

// --- Component ---
export default function SubscribeForm() {
  const searchParams = useSearchParams();
  const offerParam = searchParams.get('offre');

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [priceId, setPriceId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Appliquer l'offre par défaut depuis l'URL
  useEffect(() => {
    if (offerParam && PRICE_IDS[offerParam]) {
      setPriceId(PRICE_IDS[offerParam]);
    }
  }, [offerParam]);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !company || !priceId) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(),
        options: {
          data: { company_name: company },
        },
      });

      if (error) throw error;

      const userId = data.user.id;

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email, userId }),
      });

      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error('Erreur:', err);
      alert('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-4 max-w-md mx-auto p-4">
      <input
        type="email"
        placeholder="Email du promoteur"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Nom de la société"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <div className="flex gap-4">
        <OfferButton
          label="1 Projet – 147 PLN/mois"
          selected={priceId === PRICE_IDS['1']}
          onClick={() => setPriceId(PRICE_IDS['1'])}
          color="blue"
        />
        <OfferButton
          label="5 Projets – 500 PLN/mois"
          selected={priceId === PRICE_IDS['5']}
          onClick={() => setPriceId(PRICE_IDS['5'])}
          color="green"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-black text-white rounded"
      >
        {loading ? 'Traitement...' : 'Valider et payer'}
      </button>
    </form>
  );
}

// --- Sub-component for offer selection ---
function OfferButton({ label, selected, onClick, color }) {
  const selectedClass = selected
    ? `bg-${color}-600 text-white`
    : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded border ${selectedClass}`}
    >
      {label}
    </button>
  );
}
