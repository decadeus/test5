'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SubscriptionButtons() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error('Erreur récupération utilisateur Supabase:', error);
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-4">
      <Link href="/abonnement">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl">
          S’abonner – 1 projet
        </button>
      </Link>

      <Link href="/abonnement">
        <button className="px-6 py-3 bg-green-600 text-white rounded-xl">
          S’abonner – 5 projets
        </button>
      </Link>
    </div>
  );
}
