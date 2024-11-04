'use client'
import { useState } from 'react'
import { createClient } from "@/utils/supabase/client";

export default function NewPassword() {
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState(null)

  // Extract the token from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  async function handleNewPassword(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient();

    const { error } = await supabase.auth.update({ password: newPassword }, { token })

    if (error) {
      console.error("Error updating password:", error) // Log the error for debugging
      setError(error.message)
    } else {
      alert('Password updated successfully!')
    }
    setLoading(false) // Ensure loading state is reset
  }

  return (
    <form onSubmit={handleNewPassword} className="form-widget">
      <div>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Reset Password'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  )
}