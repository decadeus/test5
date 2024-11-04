'use client'
import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/router';

const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for access token and type in the URL to ensure reset link was used
    const { access_token, type } = router.query;
    if (type !== 'recovery' || !access_token) {
      setError('Invalid or expired password reset link.');
    } else {
      // Update the auth session with the token from URL
      supabase.auth.setSession({ access_token });
    }
  }, [router.query]);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Your password has been reset successfully!');
      // Optionally, redirect to login page after a few seconds
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="new-password">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Set New Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
