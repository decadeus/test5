import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr', 'pl', 'de', 'ru'],
  defaultLocale: 'fr'
});

export const config = {
  matcher: ['/', '/(fr|en|pl|de|ru)/:path*']
}; 