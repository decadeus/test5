"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@supabase/supabase-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Subscribe");

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

  const plans = [
    {
      title: t("plan1.title"),
      users: t("plan1.users"),
      price: t("plan1.price"),
      priceId: "price_1ROPn5RQdIKmYv9arYhFrW3S",
    },
    {
      title: t("plan2.title"),
      users: t("plan2.users"),
      price: t("plan2.price"),
      priceId: "price_1ROOd1RQdIKmYv9a4xzLVZAi",
    },
    {
      title: t("plan3.title"),
      users: t("plan3.users"),
      price: t("plan3.price"),
      priceId: "price_1ROizERQdIKmYv9aTyeA27hh",
    },
  ];

  return (
    <div className="flex justify-center px-4 py-12 flex-col items-center bg-slate-700 w-full">
      <h2 className="text-4xl font-bold text-white pb-10">
        {t("title")}
      </h2>
      <p className="text-lg text-white pb-10">
        {t("description")}
      </p>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 max-w-6xl w-full">
        {plans.map(({ title, users, price, priceId }, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-sm p-6 shadow-sm bg-gray-100 text-center"
          >
            <h3 className="text-base font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-lg font-bold text-gray-900 mb-6">{price}</p>
            <p className="text-sm mb-4">{users}</p>
            <button
              onClick={() => handleSubscribe(priceId)}
              disabled={loading}
              type="button"
              aria-label={`Choisir la formule ${title}`}
              className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              {loading ? t("loading") : t("choosePlan")}
            </button>
          </div>
        ))}

        <div className="sm:col-span-1 lg:col-span-3 text-center mt-6 text-white">
          {t("needMore")}<br />
          <a
            href="mailto:contact@hoomge.com"
            className="inline-block mt-2 text-white underline hover:text-black font-medium"
          >
            {t("contactUs")}
          </a>
        </div>
      </div>
    </div>
  );
}
