export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: '#f5f5f5', minHeight: '100vh' }}>{children}</body>
    </html>
  );
} 