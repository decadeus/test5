import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.hoomge.com';
  const currentLocale = 'ru';
  const locales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];

  const supabase = createClient();
  const { data: projects } = await supabase
    .from('project')
    .select('id')
    .eq('online', true);

  const lastmod = new Date().toISOString().slice(0, 10);

  const staticPages = ['', '/projects', '/abonnement'];

  const buildAlternateLinks = (pathNoLocale: string) => {
    const links = locales.map((loc) =>
      `<xhtml:link rel=\"alternate\" hreflang=\"${loc}\" href=\"${baseUrl}/${loc}${pathNoLocale}\"/>`
    ).join('');
    const xDefault = `<xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"${baseUrl}/fr${pathNoLocale}\"/>`;
    return links + xDefault;
  };

  const urls = [
    ...staticPages.map((p) => (
      `<url>` +
        `<loc>${baseUrl}/${currentLocale}${p}</loc>` +
        `<lastmod>${lastmod}</lastmod>` +
        `<changefreq>weekly</changefreq>` +
        `<priority>${p === '' ? '1' : '0.8'}</priority>` +
        buildAlternateLinks(p || '') +
      `</url>`
    )),
    ...((projects || []).map((proj) => {
      const path = `/Projet/Detail/${proj.id}`;
      return (
        `<url>` +
          `<loc>${baseUrl}/${currentLocale}${path}</loc>` +
          `<lastmod>${lastmod}</lastmod>` +
          `<changefreq>monthly</changefreq>` +
          `<priority>0.9</priority>` +
          buildAlternateLinks(path) +
        `</url>`
      );
    }))
  ].join('');

  const xml = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n` +
    `<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">` +
    urls + `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
} 