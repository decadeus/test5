"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SubscribeButton({ subtitle, paragraphe }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      console.error("❌ Erreur Stripe :", err);
      alert("Erreur pendant la redirection vers Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center max-w-7xl mx-auto text-black py-24">
      <h2 className={subtitle}>
        Souscription à un abonnement
      </h2>
      <p className={paragraphe}>
        Pour publier vos projets immobiliers sur notre plateforme, commencez par
        creer un compte promoteur et choissisez la formule adaptée à vos besoins...
      </p>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 max-w-7xl w-full">
        {[
          {
            main: "Hoomge mini",
            title: "1 projet",
            users: "Vous + 1 collaborateur",
            price: "S'abonner - 147 PLN / mois",
           
            priceId: "price_1ROPn5RQdIKmYv9arYhFrW3S",
          },
          {
            main: "Hoomge medium",
            title: "5 projets",
            users: "Vous + 5 collaborateurs",
            price: "S'abonner - 500 PLN / mois",
            priceId: "price_1ROOd1RQdIKmYv9a4xzLVZAi",
          },
          {
            main: "Hoomge large",
            title: "10 projets",
            users: "Vous + 10 collaborateurs",
            price: "S'abonner - 750 PLN / mois",
            priceId: "price_1ROizERQdIKmYv9aTyeA27hh",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-sm p-6 shadow-sm bg-gray-100 text-center"
          >
            <h3 className="text-3xl font-light mb-2 text-gray-800">
              {item.main}
            </h3>
            <p className="text-base font-semibold mb-2 text-gray-800">
              {item.title}
            </p>
           
            <p className="text-lg font-bold text-gray-900 mb-6">
              {item.price}
            </p>
          <p className="text-sm">{item.users}</p>
            <button
              onClick={() => handleSubscribe(item.priceId)}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-gray-800 transition text-xl"
            >
              {loading ? "Redirection..." : "Choisir cette formule"}
            </button>
          </div>
        ))}

        <div className="sm:col-span-1 lg:col-span-3 text-center mt-6 text-xl">
          Besoin de plus de 10 projets ou d'utilisateurs supplémentaires ?<br />
          <a
            href="mailto:hoomge@decadeus.com"
            className="inline-block mt-2 underline hover:text-black font-medium"
          >
            Contactez-nous pour une offre sur mesure
          </a>
        </div>
      </div>
    </div>
  );
}
