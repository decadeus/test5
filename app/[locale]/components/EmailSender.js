// components/EmailSender.jsx
'use client'; // Ensure this component is a client component
import { useState } from 'react';

const EmailSender = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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