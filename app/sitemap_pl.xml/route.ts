import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOST = "https://www.hoomge.com";

type Row = { id: number; updated_at?: string | null; updatedAt?: string | null; created_at?: string | null };

function isoDate(input?: string | null) {
  const d = input ? new Date(input) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0,10) : d.toISOString().slice(0,10);
}

// Adapte si besoin: "Projet" vs "Projekt"
const SEG_PL = "Projet";
const SEG_FR = "Projet";
const SEG_EN = "Project";

function urlBlockPL(id: number, lastmod: string) {
  const pl = `${HOST}/pl/${SEG_PL}/Detail/${id}`;
  const fr = `${HOST}/fr/${SEG_FR}/Detail/${id}`;
  const en = `${HOST}/en/${SEG_EN}/Detail/${id}`;
  return `
  <url>
    <loc>${pl}</loc>
    <lastmod>${lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="pl" href="${pl}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${fr}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${fr}"/>
  </url>`;
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .select("id, updated_at, updatedAt, created_at")
    .eq("online", true)
    .order("updated_at", { ascending: false });

  const today = isoDate();
  const rows = (!error && data?.length ? (data as Row[]) : [{ id: 180, created_at: new Date().toISOString() } as Row]);

  const urls = rows.map(r => urlBlockPL(r.id, isoDate(r.updated_at || r.updatedAt || r.created_at))).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${HOST}/pl/projects</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="pl" href="${HOST}/pl/projects"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr/projects"/>
    <xhtml:link rel="alternate" hreflang="en" href="${HOST}/en/projects"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr/projects"/>
  </url>
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "x-content-type-options": "nosniff",
    }
  });
}