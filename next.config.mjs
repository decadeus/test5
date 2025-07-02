import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: "default-src 'self'; img-src * data:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;",
  },
];

const nextConfig = {
  images: {
    domains: [
      'igoqwthxpqjrnflhpkil.supabase.co',
      // ajoute d'autres domaines ici si besoin
    ],
  },
  experimental: {
    legacyBrowsers: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig) ;