'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 32 }}>
      <h2>Une erreur est survenue</h2>
      <pre>{error?.message}</pre>
      <button onClick={() => reset()}>Réessayer</button>
    </div>
  );
} 