import { NextResponse } from 'next/server';

const ACCESS_CODE = '1010'; // Le code d'accès à donner
const COOKIE_NAME = 'maintenance_bypass';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Autorise l'accès à la page de code, à la page maintenance, et aux assets
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/code') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Vérifie le cookie de bypass
  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === ACCESS_CODE) {
    return NextResponse.next();
  }

  // Redirige vers la page de maintenance
  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = '/maintenance';
  return NextResponse.redirect(maintenanceUrl);
} 