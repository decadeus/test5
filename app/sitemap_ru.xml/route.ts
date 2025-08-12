export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.hoomge.com';
  const currentLocale = 'ru';
  const locales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];

  const supabase = createClient();
  const { data: projects } = await supabase
    .from('project')
    .select('*')
    .eq('online', true);

  const today = new Date();
  const lastmod = today.toISOString().slice(0, 10);

  const staticPages = ['', '/projects', '/abonnement'];

  const buildAlternateLinks = (pathNoLocale: string) => {
    const links = locales.map((loc) =>
      `<xhtml:link rel=\"alternate\" hreflang=\"${loc}\" href=\"${baseUrl}/${loc}${pathNoLocale}\"/>`
    ).join('');
    const xDefault = `<xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"${baseUrl}/fr${pathNoLocale}\"/>`;
    return links + xDefault;
  };

  const pickProjectLastmod = (p: any): string => {
    const raw = p?.updated_at || p?.updatedAt || p?.modified_at || p?.created_at;
    if (!raw) return lastmod;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? lastmod : d.toISOString().slice(0, 10);
  };

  const urls = [
    ...staticPages.map((p) => (
      `<url>` +
        `<loc>${baseUrl}/${currentLocale}${p}</loc>` +
        `<lastmod>${lastmod}</lastmod>` +
        buildAlternateLinks(p || '') +
      `</url>`
    )),
    ...((projects || []).map((proj: any) => {
      const path = `/Projet/Detail/${proj.id}`;
      const projLastmod = pickProjectLastmod(proj);
      return (
        `<url>` +
          `<loc>${baseUrl}/${currentLocale}${path}</loc>` +
          `<lastmod>${projLastmod}</lastmod>` +
          buildAlternateLinks(path) +
        `</url>`
      );
    }))
  ].join('\n');

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n` +
    `<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n` +
    urls + `\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'x-content-type-options': 'nosniff',
      'cache-control': 'no-store',
    },
  });
} 