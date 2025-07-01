import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/appart.png" />
      </Head>
      {/* ... reste du layout ... */}
      {children}
    </>
  );
} 