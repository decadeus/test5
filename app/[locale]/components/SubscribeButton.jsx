"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function SubscribeButton({ subtitle, paragraphe }) {
  const pathname = usePathname();
  const initialCurrency = pathname && pathname.startsWith('/pl') ? 'PLN' : 'EUR';
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(initialCurrency);
  const t = useTranslations('SubscribeButton');

  const prices = {
    mini: { PLN: 147, EUR: 35, priceId: { PLN: "price_1RODn5RQdIKmYv9arYhFrW3S", EUR: "price_1Ri937RQdIKmYv9aUHKQIYmH" } },
    medium: { PLN: 500, EUR: 120, priceId: { PLN: "price_1ROOd1RQdIKmYv9a4xzLVZAi", EUR: "price_1Ri974RQdIKmYv9aX3BhTtZt" } },
    large: { PLN: 750, EUR: 180, priceId: { PLN: "price_1ROizERQdIKmYv9aTyeA27hh", EUR: "price_1Ri993RQdIKmYv9aA5ho0t2E" } }
  };

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

      const { loadStripe } = await import("@stripe/stripe-js");
      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert("Erreur pendant la redirection vers Stripe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center max-w-7xl mx-auto text-black py-24">
      <h2 className={subtitle}>
        {t('title')}
      </h2>
      <p className={paragraphe}>
        {t('description')}
      </p>
      <div className="flex justify-center mb-8 w-full">
        <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-sm gap-2">
          <button
            type="button"
            onClick={() => setCurrency("PLN")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${currency === "PLN" ? "bg-green-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            aria-pressed={currency === "PLN"}
          >
            PLN
          </button>
          <button
            type="button"
            onClick={() => setCurrency("EUR")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${currency === "EUR" ? "bg-green-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            aria-pressed={currency === "EUR"}
          >
            EUR
          </button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 max-w-7xl w-full">
        {[
          {
            key: "mini",
            main: t('mini.title'),
            title: t('mini.projects'),
            users: t('mini.users'),
            button: t('mini.button')
          },
          {
            key: "medium",
            main: t('medium.title'),
            title: t('medium.projects'),
            users: t('medium.users'),
            button: t('medium.button')
          },
          {
            key: "large",
            main: t('large.title'),
            title: t('large.projects'),
            users: t('large.users'),
            button: t('large.button')
          }
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
              S'abonner - {prices[item.key][currency]} {currency} / mois
            </p>
            <p className="text-sm">{item.users}</p>
            <button
              onClick={() => handleSubscribe(prices[item.key].priceId[currency])}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-gray-700 transition text-xl"
            >
              {loading ? t('loading') : item.button}
            </button>
          </div>
        ))}

        <div className="sm:col-span-1 lg:col-span-3 text-center mt-6 text-xl">
          {t('contact.title')}
          <br />
          <a
            href="mailto:hoomge@decadeus.com"
            className="inline-block mt-2 underline hover:text-black font-medium"
          >
            {t('contact.link')}
          </a>
        </div>
      </div>
    </div>
  );
}
