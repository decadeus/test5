import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const ACCESS_CODE = '1010'; // Le code d'accès à donner
const COOKIE_NAME = 'maintenance_bypass';

const intlMiddleware = createMiddleware({
  locales: ['fr', 'en', 'pl', 'de', 'ru'],
  defaultLocale: 'fr'
});

export function middleware(request) {
  // 1. Appliquer la logique de locale
  const intlResponse = intlMiddleware(request);
  if (intlResponse instanceof NextResponse) {
    // Si la locale doit être redirigée, on la laisse faire
    return intlResponse;
  }

  // 2. Appliquer la logique de maintenance
  const { pathname, locale } = request.nextUrl;

  // Autorise uniquement les routes locales /[locale]/maintenance et /[locale]/code, et les assets
  const allowed = [
    /^\/[a-z]{2}(?:-[A-Z]{2})?\/maintenance/,
    /^\/[a-z]{2}(?:-[A-Z]{2})?\/code/,
    /^\/_next/,
    /^\/api/,
    /^\/favicon/,
    /^\/public/
  ];

  if (allowed.some((regex) => regex.test(pathname))) {
    return NextResponse.next();
  }

  // Vérifie le cookie de bypass
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === ACCESS_CODE) {
    return NextResponse.next();
  }

  // Redirige vers la page de maintenance de la locale courante
  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = `/${locale || 'fr'}/maintenance`;
  return NextResponse.redirect(maintenanceUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon|public).*)'],
}; 