// components/EmailSender.jsx
'use client'; // Ensure this component is a client component
import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react'; // Import the session hook

const EmailSender = () => {
  const { session } = useSession(); // Get the current session
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setResponseMessage('You must be logged in to send an email.');
      return;
    }

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`, // Include the token
      },
      body: JSON.stringify({ email, message }),
    });

    const data = await res.json();
    setResponseMessage(data.message || data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Recipient Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient's email"
          required
        />
      </div>
      <div>
        <label htmlFor="message">Your Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          required
        />
      </div>
      <button type="submit">Send Email</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
};

export default EmailSender;