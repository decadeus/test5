import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // List of all supported languages
  locales: ['en', 'fr', 'pl', 'de'],

  // Default language
  defaultLocale: 'en'
});

export const config = {
  // Only match internationalised pathnames
  matcher: ['/', '/(en|fr|pl|de)/:path*']
};