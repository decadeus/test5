'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function SubscribeForm() {
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
    <div className="flex justify-center px-4 py-12">
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 max-w-6xl w-full">
        {/* Formule 1 projet */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-gray-50 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">1 projet</h2>
          <p className="text-gray-600 mb-4">2 utilisateurs inclus</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">147 PLN / mois</p>
          <button
            onClick={() => handleSubscribe('price_1ROPn5RQdIKmYv9arYhFrW3S')}
            disabled={loading}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? 'Redirection...' : 'Choisir cette formule'}
          </button>
        </div>

        {/* Formule 5 projets */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-gray-50 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">5 projets</h2>
          <p className="text-gray-600 mb-4">6 utilisateurs inclus</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">500 PLN / mois</p>
          <button
            onClick={() => handleSubscribe('price_1ROOd1RQdIKmYv9a4xzLVZAi')}
            disabled={loading}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? 'Redirection...' : 'Choisir cette formule'}
          </button>
        </div>

        {/* Formule 10 projets */}
        <div className="border border-gray-300 rounded-xl p-6 shadow-sm bg-gray-50 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">10 projets</h2>
          <p className="text-gray-600 mb-4">12 utilisateurs inclus</p>
          <p className="text-2xl font-bold text-gray-900 mb-6">750 PLN / mois</p>
          <button
            onClick={() => handleSubscribe('price_1ROizERQdIKmYv9aTyeA27hh')}
            disabled={loading}
            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? 'Redirection...' : 'Choisir cette formule'}
          </button>
        </div>

        {/* Contact personnalisé */}
        <div className="sm:col-span-1 lg:col-span-3 text-center mt-6 text-gray-700">
          Besoin de plus de 10 projets ou d'utilisateurs supplémentaires ?<br />
          <a
            href="mailto:contact@hoomge.com"
            className="inline-block mt-2 text-gray-800 underline hover:text-black font-medium"
          >
            Contactez-nous pour une offre sur mesure
          </a>
        </div>
      </div>
    </div>
  );
}
