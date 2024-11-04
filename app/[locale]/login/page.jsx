'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Listen for authentication changes and refresh the page on sign-in
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setMessage('Logged in successfully! Redirecting...');
        // Redirect to home or dashboard
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    });

    // Cleanup the listener on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Log in with Magic Link</h2>
        {message && <p className="text-sm text-green-500">{message}</p>}
        <p className="text-center text-sm text-gray-600">
          Check your email for the magic link to log in.
        </p>
      </div>
    </div>
  );
}
