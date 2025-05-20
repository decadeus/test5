import React from "react";

export default function Projectc({ user }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenue, {user ? user.email : 'Invité'}</h1>
      <p className="text-gray-700">
        Ceci est un exemple de projet utilisant Next.js et Tailwind CSS.
      </p>
    </div>
  );
}
