'use client';

export default function Maintenance() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <img
        src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
        alt="Maintenance"
        style={{ width: 180, marginBottom: 32 }}
      />
      <h1 style={{ fontSize: 32, marginBottom: 16, color: '#222' }}>
        Oops! We're Under Maintenance
      </h1>
      <p style={{
        fontSize: 18,
        color: '#555',
        maxWidth: 400,
        textAlign: 'center'
      }}>
        Our team of highly trained hamsters is working hard to get things back online.<br />
        Please grab a coffee and check back soon!<br />
        <span style={{ fontSize: 24 }}>🐹🔧🚧</span>
      </p>
    </div>
  );
} 