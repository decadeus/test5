import React from 'react';

export default function Spinner({ size = 48 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: size }}>
      <div
        style={{
          width: size,
          height: size,
          border: `${size/8}px solid #e5e7eb`,
          borderTop: `${size/8}px solid #2563eb`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 