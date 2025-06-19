'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// IDs des prix Stripe (à remplacer par les vrais IDs)
const PRICE_IDS = {
  mini: 'price_147xxx', // 1 projet - 147 PLN/mois
  medium: 'price_500xxx', // 5 projets - 500 PLN/mois
};

const PLAN_NAMES = {
  [PRICE_IDS.mini]: 'Mini - 1 Projet',
  [PRICE_IDS.medium]: 'Medium - 5 Projets',
};

export default function SubscriptionManager({ user }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`/api/get-subscription?userId=${user.id}`);
      const { subscription, error } = await response.json();

      if (error) {
        console.error('Erreur lors de la récupération de l\'abonnement:', error);
      } else if (subscription) {
        setSubscription(subscription);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSubscription = async (newPriceId) => {
    if (!user || !subscription) return;

    setUpdating(true);
    try {
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPriceId, userId: user.id }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        alert('Erreur lors de la mise à jour: ' + error);
        return;
      }

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      console.error('Erreur lors du changement d\'abonnement:', error);
      alert('Erreur lors du changement d\'abonnement');
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentPlanName = () => {
    if (!subscription?.plan_id) return 'Aucun abonnement actif';
    return PLAN_NAMES[subscription.plan_id] || 'Plan inconnu';
  };

  const getCurrentPlanPrice = () => {
    if (!subscription?.plan_id) return null;
    return subscription.plan_id === PRICE_IDS.mini ? '147 PLN/mois' : '500 PLN/mois';
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Aucun abonnement actif</h3>
        <p className="text-yellow-700 text-sm mb-3">
          Vous n'avez pas d'abonnement actif. Souscrivez à un plan pour commencer.
        </p>
        <a 
          href="/fr/abonnement" 
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
        >
          Souscrire un abonnement
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Votre abonnement</h3>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Plan actuel:</span>
          <span className="font-medium text-gray-800">{getCurrentPlanName()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Prix:</span>
          <span className="font-medium text-gray-800">{getCurrentPlanPrice()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Statut:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            subscription.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {subscription.is_active ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-800 mb-3">Changer d'abonnement</h4>
        
        <div className="space-y-2">
          {Object.entries(PLAN_NAMES).map(([priceId, planName]) => {
            const isCurrentPlan = subscription.plan_id === priceId;
            const isUpgrade = priceId === PRICE_IDS.medium && subscription.plan_id === PRICE_IDS.mini;
            const isDowngrade = priceId === PRICE_IDS.mini && subscription.plan_id === PRICE_IDS.medium;
            
            return (
              <button
                key={priceId}
                onClick={() => !isCurrentPlan && handleChangeSubscription(priceId)}
                disabled={isCurrentPlan || updating}
                className={`w-full p-3 rounded-lg border text-left transition ${
                  isCurrentPlan
                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                    : isUpgrade
                    ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                    : isDowngrade
                    ? 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
                    : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{planName}</span>
                  {isCurrentPlan && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Actuel</span>
                  )}
                  {isUpgrade && (
                    <span className="text-xs bg-green-200 px-2 py-1 rounded">Upgrade</span>
                  )}
                  {isDowngrade && (
                    <span className="text-xs bg-orange-200 px-2 py-1 rounded">Downgrade</span>
                  )}
                </div>
                <div className="text-sm mt-1">
                  {priceId === PRICE_IDS.mini ? '147 PLN/mois' : '500 PLN/mois'}
                </div>
              </button>
            );
          })}
        </div>

        {updating && (
          <div className="mt-3 text-center">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="ml-2 text-sm text-gray-600">Redirection vers le paiement...</span>
          </div>
        )}
      </div>
    </div>
  );
} 