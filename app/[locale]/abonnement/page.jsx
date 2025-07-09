'use client';
import { useState } from "react";
import SubscribeForm from '@/app/[locale]/component/SubscribeForm';

export default function AbonnementPage() {
  const [currency, setCurrency] = useState("PLN");

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Souscrire à un abonnement</h1>

      <p className="text-gray-700 mb-6">
        Pour publier vos projets immobiliers sur notre plateforme, commencez par créer un compte promoteur
        et choisissez la formule adaptée à vos besoins..
      </p>

      {/* Sélecteur de devise */}
      <div className="mb-6 flex justify-end">
        <label className="mr-2">Devise :</label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="PLN">PLN</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <SubscribeForm currency={currency} />
    </main>
  );
}
