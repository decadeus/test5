import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const intlMiddleware = createIntlMiddleware({
  locales: ['fr', 'en', 'pl', 'de', 'ru', 'uk'],
  defaultLocale: 'fr'
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une ancienne URL avec ID
  const oldProjectUrlMatch = pathname.match(/^\/([a-z]{2})\/Projet\/Detail\/(\d+)$/);
  
  if (oldProjectUrlMatch) {
    const [, locale, id] = oldProjectUrlMatch;
    const numericId = parseInt(id);
    
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: project } = await supabase
        .from('project')
        .select('slug')
        .eq('id', numericId)
        .single();
      
      if (project?.slug) {
        const newUrl = new URL(`/${locale}/Projet/Detail/${project.slug}`, request.url);
        return NextResponse.redirect(newUrl, 301);
      }
    } catch (error) {
      console.error('Erreur middleware redirection:', error);
    }
    
    // Si pas de slug trouvé, rediriger vers 404
    const notFoundUrl = new URL('/404', request.url);
    return NextResponse.redirect(notFoundUrl, 301);
  }
  
  // Sinon, utiliser le middleware d'internationalisation
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap (sitemap files)
     * - robots (robots.txt)
     * - Files with extensions (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap|robots|.*\\.).*)',
  ],
};