'use client'
import { useState } from 'react'
import { createClient } from "@/utils/supabase/client";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleChangePassword(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.update({ password })

    if (error) {
      console.error("Error updating password:", error) // Log the error for debugging
      setError(error.message)
    } else {
      alert('Password updated successfully!')
    }
    setLoading(false) // Ensure loading state is reset
  }

  return (
    <form onSubmit={handleChangePassword} className="form-widget">
      <div>
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Change Password'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  )
}