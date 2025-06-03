import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Autorise uniquement la page de maintenance et les assets
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Redirige tout le reste vers /maintenance
  const maintenanceUrl = request.nextUrl.clone();
  maintenanceUrl.pathname = '/maintenance';
  return NextResponse.redirect(maintenanceUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon|public).*)'],
};