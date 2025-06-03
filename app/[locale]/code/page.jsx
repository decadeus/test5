'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CodePage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === '1010') {
      document.cookie = `maintenance_bypass=1010; path=/`;
      // Redirige vers la locale courante si présente, sinon vers /fr
      const locale = window.location.pathname.split('/')[1];
      const defaultLocale = 'fr';
      router.push(['fr', 'en', 'pl', 'de', 'ru'].includes(locale) ? `/${locale}` : `/${defaultLocale}`);
    } else {
      setError('Code incorrect');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
        <h2>Accès maintenance</h2>
        <input
          type="password"
          placeholder="Code d'accès"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{ margin: '16px 0', padding: 8, width: '100%' }}
        />
        <button type="submit" style={{ width: '100%', padding: 8 }}>Entrer</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
} 