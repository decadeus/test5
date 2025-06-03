'use client';

export default function Maintenance() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>🚧 Site en maintenance</h1>
      <p style={{ fontSize: 18 }}>Le site est temporairement indisponible.</p>
    </div>
  );
} 