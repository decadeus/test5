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
      setError('Failed to send magic link. Please try again.');
    } else {
      setMessage('Check your email for the magic link to log in.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Log in with Magic Link</h2>
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
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <button 
            type="submit" 
            className="w-full px-4 py-2 font-medium text-white bg-[#755808] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  );
}
