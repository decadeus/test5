import './[locale]/globals.css';
import Head from 'next/head';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" as="image" href="/appart.png" />
        {/* Optimisation Google Fonts supprimée car polices locales utilisées */}
        {/* Toutes les balises Google Fonts supprimées */}
      </head>
      <body>
        {/* ... reste du layout ... */}
        {children}
      </body>
    </html>
  );
} 