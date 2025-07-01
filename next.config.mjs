import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'igoqwthxpqjrnflhpkil.supabase.co',
      // ajoute d'autres domaines ici si besoin
    ],
  },
};

export default withNextIntl(nextConfig) ;