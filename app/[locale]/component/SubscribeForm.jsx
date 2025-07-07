'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PRICES = {
  PLN: {
    "1": { id: "price_147xxx", amount: 147 },
    "5": { id: "price_500xxx", amount: 500 }
  },
  EUR: {
    "1": { id: "price_eur_1", amount: 35 },
    "5": { id: "price_eur_5", amount: 120 }
  }
};

export default function SubscribeForm({ currency = "PLN" }) {
  const searchParams = useSearchParams();
  const defaultOffer = searchParams.get('offre'); // "1" ou "5"

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [priceId, setPriceId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Appliquer l'offre passée en URL (offre=1 ou offre=5) et la devise
  useEffect(() => {
    if (defaultOffer === '1') setPriceId(PRICES[currency]["1"].id);
    if (defaultOffer === '5') setPriceId(PRICES[currency]["5"].id);
  }, [defaultOffer, currency]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !company || !priceId) {
      alert('Merci de remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(),
        options: {
          data: {
            company_name: company,
          },
        },
      });

      if (error) throw error;

      const userId = data.user.id;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, email, userId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert('Une erreur est survenue.');
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
        <button
          type="button"
          onClick={() => setPriceId(PRICES[currency]["1"].id)}
          className={`px-4 py-2 rounded border ${
            priceId === PRICES[currency]["1"].id ? 'bg-blue-600 text-white' : ''
          }`}
        >
          1 Projet – {PRICES[currency]["1"].amount} {currency}/mois
        </button>
        <button
          type="button"
          onClick={() => setPriceId(PRICES[currency]["5"].id)}
          className={`px-4 py-2 rounded border ${
            priceId === PRICES[currency]["5"].id ? 'bg-green-600 text-white' : ''
          }`}
        >
          5 Projets – {PRICES[currency]["5"].amount} {currency}/mois
        </button>
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
