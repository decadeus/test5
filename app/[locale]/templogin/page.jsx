'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function TempLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize email and password from URL params if present
  useState(() => {
    const emailFromUrl = searchParams.get('email');
    const passwordFromUrl = searchParams.get('password');
    if (emailFromUrl) setEmail(emailFromUrl);
    if (passwordFromUrl) setPassword(passwordFromUrl);
  });

  const handleLogin = async () => {
    const supabase = createClient();

    if (!email || !password) {
      setErrorMsg('Veuillez saisir un email et un mot de passe.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Connexion de test</h1>
      <input
        className="w-full border px-3 py-2 mb-3"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border px-3 py-2 mb-3"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded"
      >
        Se connecter
      </button>
    </div>
  );
}
