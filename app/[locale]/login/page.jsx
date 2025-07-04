'use client'
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client"; // assuming Supabase is used for auth

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMagicLinkLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const supabase = createClient(); // Initialize your Supabase client here

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError('Failed to send magic link. Only register can login. Please try again.');
    } else {
      setMessage('Check your email for the magic link to log in.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          {/* Logo ou header si besoin ici */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Connexion</h2>
          <p className="text-md text-gray-600 mb-4">Entrez votre email. Si vous êtes déjà inscrit, vous recevrez un lien de connexion sécurisé par email.<br/>Aucun mot de passe n'est requis.</p>
        </div>
        <form className="space-y-6" onSubmit={handleMagicLinkLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755808] focus:border-[#755808] border-gray-300 bg-gray-50"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}

          <button 
            type="submit" 
            className="w-full px-4 py-2 font-semibold text-white bg-green-700 rounded-lg shadow-md hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            Envoyer le lien magique
          </button>
        </form>
      </div>
    </div>
  );
}
