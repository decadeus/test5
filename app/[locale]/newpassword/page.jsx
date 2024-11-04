'use client';
import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Retrieve token and type from query parameters
    const token = searchParams.get('access_token') || searchParams.get('token');
    const type = searchParams.get('type');

    // Check if the token and type are valid for password reset
    if (type === 'recovery' && token) {
      const supabase = createClient();
      
      // Use the token to set a session in Supabase
      supabase.auth.setSession({ access_token: token }).then(({ error }) => {
        if (error) {
          setError('Failed to authenticate with the reset token. It may be expired or invalid.');
        } else {
          setIsReady(true);
        }
      });
    } else {
      setError('Invalid or expired password reset link.');
    }
  }, [searchParams]);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    // Confirm new password and confirmation match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    const supabase = createClient();

    // Update the user password
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(`Failed to reset password: ${error.message}`);
    } else {
      setMessage('Your password has been reset successfully! Redirecting to login...');
      // Redirect to login page after a delay
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        {isReady ? (
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
