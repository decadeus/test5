'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// IDs des prix Stripe (vrais IDs)
const PRICE_IDS = {
  mini: 'price_1RODn5RQdIKmYv9arYhFrW3S', // 1 projet - 147 PLN/mois
  medium: 'price_1ROOd1RQdIKmYv9a4xzLVZAi', // 5 projets - 500 PLN/mois
  large: 'price_1ROizERQdIKmYv9aTyeA27hh', // 10 projets - 750 PLN/mois
};

const PLAN_NAMES = {
  [PRICE_IDS.mini]: 'Mini - 1 Projet',
  [PRICE_IDS.medium]: 'Medium - 5 Projets',
  [PRICE_IDS.large]: 'Large - 10 Projets',
};

export default function SubscriptionManager({ user }) {
  const [subscription, setSubscription] = useState(null);
  const [directSubscription, setDirectSubscription] = useState(null);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      console.log('🔍 Récupération abonnement pour user:', user.id);
      console.log('📧 Email utilisateur connecté:', user.email);
      const response = await fetch(`/api/get-subscription?userId=${user.id}`);
      const data = await response.json();
      
      console.log('📦 Réponse API:', data);

      if (data.error) {
        console.error('Erreur lors de la récupération de l\'abonnement:', data.error);
      } else {
        if (data.subscription) {
          console.log('✅ Abonnement actif trouvé:', data.subscription);
          setSubscription(data.subscription);
        } else {
          console.log('⚠️ Aucun abonnement actif trouvé');
        }
        
        if (data.directSubscription) {
          console.log('🔍 Abonnement direct trouvé:', data.directSubscription);
          setDirectSubscription(data.directSubscription);
        }
        
        if (data.allSubscriptions) {
          console.log('📋 Historique des abonnements:', data.allSubscriptions);
          setAllSubscriptions(data.allSubscriptions);
        }

        // Vérifier si l'email correspond
        if (data.profile && data.profile.email !== user.email) {
          console.warn('⚠️ ATTENTION: Email mismatch!');
          console.warn('   Utilisateur connecté:', user.email);
          console.warn('   Email dans le profil:', data.profile.email);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSubscription = async (newPriceId) => {
    if (!user || !activeSubscription) return;

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

  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    console.log('Tentative d\'annulation. Objet activeSubscription:', activeSubscription);

    if (window.confirm("Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible et prendra effet à la fin de votre période de facturation en cours.")) {
      setCanceling(true);
      try {
        const response = await fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscriptionId: activeSubscription.id }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.details ? JSON.stringify(data.details, null, 2) : (data.error || 'Une erreur est survenue.');
          throw new Error(errorMessage);
        }

        alert('Votre demande d\'annulation a été prise en compte.');
        fetchSubscription(); // Refresh the view
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
        alert(`Erreur: ${error.message}`);
      } finally {
        setCanceling(false);
      }
    }
  };

  const handleFixStatus = async () => {
    try {
      const response = await fetch('/api/fix-subscription-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Statut corrigé: ${data.message}`);
        // Recharger les données
        fetchSubscription();
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la correction:', error);
      alert('Erreur lors de la correction du statut');
    }
  };

  const getCurrentPlanName = () => {
    if (!subscription?.plan_id) return 'Aucun abonnement actif';
    return PLAN_NAMES[subscription.plan_id] || 'Plan inconnu';
  };

  const getCurrentPlanPrice = () => {
    if (!subscription?.plan_id) return null;
    return subscription.plan_id === PRICE_IDS.mini ? '147 PLN/mois' : subscription.plan_id === PRICE_IDS.medium ? '500 PLN/mois' : '750 PLN/mois';
  };

  // Fallback : chercher un abonnement actif dans l'historique si aucun trouvé via le profil
  const fallbackActive = allSubscriptions.find(
    sub => sub.is_active && sub.status === 'active'
  );

  const activeSubscription = subscription
    || (directSubscription && directSubscription.is_active ? directSubscription : null)
    || fallbackActive;

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

  if (!activeSubscription) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Aucun abonnement actif</h3>
          <p className="text-yellow-700 text-sm mb-3">
            Vous n'avez pas d'abonnement actif. Souscrivez à un plan pour commencer.
          </p>
          <div className="flex gap-2">
            <a 
              href="/fr/abonnement" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
            >
              Souscrire un abonnement
            </a>
            {allSubscriptions.length > 0 && (
              <button
                onClick={handleFixStatus}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Corriger le statut
              </button>
            )}
          </div>
        </div>

        {directSubscription && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Informations de débogage</h4>
            <div className="text-sm text-orange-700">
              <p><strong>Abonnement trouvé:</strong> {directSubscription.id}</p>
              <p><strong>Statut:</strong> {directSubscription.status}</p>
              <p><strong>is_active:</strong> {directSubscription.is_active ? 'true' : 'false'}</p>
              <p><strong>Plan:</strong> {PLAN_NAMES[directSubscription.plan_id] || 'Inconnu'}</p>
            </div>
          </div>
        )}

        {allSubscriptions.length > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Historique des abonnements</h4>
            <div className="space-y-2">
              {allSubscriptions.map((sub) => (
                <div key={sub.id} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <div className="font-medium text-gray-800">
                      {PLAN_NAMES[sub.plan_id] || 'Plan inconnu'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Créé le {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : sub.status === 'canceled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {sub.status === 'active' ? 'Actif' : sub.status === 'canceled' ? 'Annulé' : sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">Gérer votre abonnement</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Plan actuel:</span>
            <span className="font-medium text-gray-800">{PLAN_NAMES[activeSubscription.plan_id] || 'Plan inconnu'}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Statut:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activeSubscription.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {activeSubscription.status === 'active' ? 'Actif' : 'Annulation en attente'}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>
              {activeSubscription.cancel_at_period_end 
                ? `Expire le:` 
                : `Prochain renouvellement:`
              }
            </span>
            <span className="font-medium text-gray-800">
              {new Date(activeSubscription.current_period_end).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {activeSubscription.status === 'active' && !activeSubscription.cancel_at_period_end && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Changer de plan</h4>
            <div className="flex gap-2">
              {/* Upgrade/Downgrade buttons */}
              {activeSubscription.plan_id !== PRICE_IDS.large && (
                  <button 
                      onClick={() => handleChangeSubscription(PRICE_IDS.large)} 
                      disabled={updating}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300 transition"
                  >
                      {updating ? 'Mise à jour...' : 'Passer à Large (10 Projets)'}
                  </button>
              )}
              {activeSubscription.plan_id !== PRICE_IDS.medium && activeSubscription.plan_id === PRICE_IDS.mini && (
                  <button 
                      onClick={() => handleChangeSubscription(PRICE_IDS.medium)} 
                      disabled={updating}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300 transition"
                  >
                      {updating ? 'Mise à jour...' : 'Passer à Medium (5 Projets)'}
                  </button>
              )}
              {activeSubscription.plan_id !== PRICE_IDS.mini && (
                  <button 
                      onClick={() => handleChangeSubscription(PRICE_IDS.mini)} 
                      disabled={updating}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:bg-gray-300 transition"
                  >
                      {updating ? 'Mise à jour...' : 'Passer à Mini (1 Projet)'}
                  </button>
              )}
            </div>
          </div>
        )}
        
        {/* Danger Zone */}
        {activeSubscription.status === 'active' && !activeSubscription.cancel_at_period_end && (
          <div className="mt-6 pt-4 border-t border-red-200">
            <h4 className="font-semibold text-red-700 mb-2">Zone de danger</h4>
            <p className="text-sm text-red-600 mb-3">
              L'annulation prendra effet à la fin de votre période de facturation. Vous ne serez plus facturé.
            </p>
            <button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:bg-red-300 transition"
            >
              {canceling ? "Annulation en cours..." : "Annuler l'abonnement"}
            </button>
          </div>
        )}
        
        {activeSubscription.cancel_at_period_end && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-sm text-yellow-800">
              Votre abonnement est configuré pour être annulé le {new Date(activeSubscription.current_period_end).toLocaleDateString('fr-FR')}. Vous pouvez continuer à utiliser le service jusqu'à cette date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 