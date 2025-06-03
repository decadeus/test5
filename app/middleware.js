import { NextResponse } from 'next/server';

const PASSWORD = '1010';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  // Autorise l'accès à la page de login et aux assets
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Vérifie le cookie
  const cookie = request.cookies.get('site_auth');
  if (cookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  // Redirige vers la page de login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  return NextResponse.redirect(loginUrl);
} 