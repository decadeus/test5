export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.hoomge.com';
  const locales = ['fr', 'en', 'pl', 'de', 'ru', 'uk'];
  const lastmod = new Date().toISOString().slice(0, 10);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    locales.map((loc) => (
      `<sitemap><loc>${baseUrl}/sitemap_${loc}.xml</loc><lastmod>${lastmod}</lastmod></sitemap>`
    )).join('') +
    `</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
} 