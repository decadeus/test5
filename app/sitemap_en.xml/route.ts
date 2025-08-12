import { createClient } from '@/utils/supabase/server';

const HOST = 'https://www.hoomge.com';

type Row = { id: number; updated_at?: string | null; updatedAt?: string | null; created_at?: string | null };

function isoDate(input?: string | null) {
  const d = input ? new Date(input) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

function urlBlockEN(id: number, lastmod: string) {
  const en = `${HOST}/en/Projet/Detail/${id}`; // route réelle actuelle
  const fr = `${HOST}/fr/Projet/Detail/${id}`;
  return `
  <url>
    <loc>${en}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${fr}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${fr}"/>
  </url>`;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('project')
    .select('id, updated_at, updatedAt, created_at')
    .eq('online', true)
    .order('updated_at', { ascending: false });

  const today = isoDate();

  if (error) {
    const minimal = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${HOST}/en/projects</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${HOST}/en/projects"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr/projects"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr/projects"/>
  </url>
</urlset>`;
    return new Response(minimal, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' }});
  }

  const rows = (data as Row[]) || [];
  const withFallback = rows.length ? rows : [{ id: 180, created_at: new Date().toISOString() } as Row, { id: 179, created_at: new Date().toISOString() } as Row];

  const urls = withFallback.map(r => urlBlockEN(r.id, isoDate(r.updated_at || r.updatedAt || r.created_at))).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${HOST}/en/projects</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${HOST}/en/projects"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr/projects"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr/projects"/>
  </url>
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' }});
} 