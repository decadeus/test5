'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId) => {
    setLoading(true);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await res.json();

      if (!sessionId) {
        alert("Erreur lors de la création de la session.");
        return;
      }

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error('❌ Erreur Stripe :', err);
      alert('Erreur pendant la redirection vers Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <button
        onClick={() => handleSubscribe('price_1ROPn5RQdIKmYv9arYhFrW3S')}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        {loading ? 'Redirection...' : 'S’abonner – 1 projet (147 PLN/mois)'}
      </button>

      <button
        onClick={() => handleSubscribe('price_1ROOd1RQdIKmYv9a4xzLVZAi')}
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-xl"
      >
        {loading ? 'Redirection...' : 'S’abonner – 5 projets (500 PLN/mois)'}
      </button>

      <button
        onClick={() => handleSubscribe('price_1ROizERQdIKmYv9aTyeA27hh')}
        disabled={loading}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl"
      >
        {loading ? 'Redirection...' : 'S’abonner – 10 projets (750 PLN/mois)'}
      </button>
    </div>
  );
}
