import './[locale]/globals.css';
import Head from 'next/head';
import type { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/appart.png" />
        {/* Optimisation Google Fonts supprimée car polices locales utilisées */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        /> */}
      </Head>
      {/* ... reste du layout ... */}
      {children}
    </>
  );
} 