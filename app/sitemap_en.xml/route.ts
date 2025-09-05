import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PATHS = {
  en: { root: "", projects: "/Projet/List", subscription: "/subscription", detail: (slug:string)=>`/Projet/Detail/${slug}` },
  fr: { root: "", projects: "/Projet/List", subscription: "/abonnement",   detail: (slug:string)=>`/Projet/Detail/${slug}` },
} as const;

function isoDate(s?: string|null){ const d=s?new Date(s):new Date(); return isNaN(d.getTime())?new Date().toISOString().slice(0,10):d.toISOString().slice(0,10); }
function altStatic(k:"root"|"projects"|"subscription"){
  return [
    `<xhtml:link rel="alternate" hreflang="en" href="${HOST}/en${PATHS.en[k]}"/>`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr${PATHS.fr[k]}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr[k]}"/>`,
  ].join("");
}
function altDetail(slug:string){
  return [
    `<xhtml:link rel="alternate" hreflang="en" href="${HOST}/en${PATHS.en.detail(slug)}"/>`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr${PATHS.fr.detail(slug)}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr.detail(slug)}"/>`,
  ].join("");
}

// no-op guard removed; we'll return the exact string we build below

export async function GET(request: Request) {
  // Debug: Logger les requêtes pour diagnostiquer Googlebot
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  console.log(`[SITEMAP-EN] User-Agent: ${userAgent}, IP: ${ip}, Time: ${new Date().toISOString()}`);
  
  // Détecter Googlebot spécifiquement
  if (userAgent.toLowerCase().includes('googlebot')) {
    console.log(`[GOOGLEBOT-DETECTED] Crawling sitemap_en.xml at ${new Date().toISOString()}`);
  }
  // Helper to fetch all projects with a client (anon or admin)
  async function fetchAll(client: ReturnType<typeof createClient>) {
    try {
      const { data, error } = await client
        .from("project")
        .select("id, slug, created_at")
        .eq("online", true)
        .not("slug", "is", null)
        .order("created_at", { ascending: false })
        .range(0, 49999);
      return { rows: (data as any[]) || [], error };
    } catch (e: any) {
      return { rows: [], error: e };
    }
  }

  // Try anon first
  const anon = createClient();
  let { rows, error } = await fetchAll(anon);

  // If empty or error and we have a service key, try admin
  let used = "anon";
  if ((!rows.length || error) && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    const r = await fetchAll(admin);
    if (r.rows.length || !error) {
      rows = r.rows; error = r.error; used = "admin";
    }
  }

  const today = isoDate();
  const list = Array.isArray(rows) ? rows : [];

  // Articles de blog (même contenu qu'en français mais URLs anglaises)
  const blogArticles = [
    { id: 5, title: "Installation Poland", lastmod: "2024-01-20" },
    { id: 6, title: "NFZ Health", lastmod: "2024-01-25" },
    { id: 7, title: "Car Registration", lastmod: "2024-01-30" },
    { id: 8, title: "Micro-business", lastmod: "2024-02-05" }
  ];

  const blogUrls = [
    `<url><loc>${HOST}/en/blog</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...blogArticles.map(article => 
      `<url><loc>${HOST}/en/blog/${article.id}</loc><lastmod>${article.lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    )
  ].join("\n");

  const staticUrls = [
    `<url><loc>${HOST}/en</loc><lastmod>${today}</lastmod>${altStatic("root")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.projects}</loc><lastmod>${today}</lastmod>${altStatic("projects")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.subscription}</loc><lastmod>${today}</lastmod>${altStatic("subscription")}</url>`,
  ].join("\n");

  const projectUrls = list
    .filter((p:any) => p.slug) // Seulement les projets avec slug
    .map((p:any)=>{
      const lastmod = isoDate(p.updated_at || p.created_at);
      return `<url><loc>${HOST}/en${PATHS.en.detail(p.slug)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>${altDetail(p.slug)}</url>`;
    }).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${blogUrls}
${projectUrls}
</urlset>`;

  const lastModified = new Date().toUTCString();
  const etag = '"' + Buffer.from(xml).toString('base64').slice(0, 27) + '"';
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        "Cache-Control":"public, max-age=0, s-maxage=3600",
        "Last-Modified": lastModified,
        "ETag": etag,
      }
    });
  }
  return new Response(xml, {
    headers: {
      "Content-Type":"application/xml; charset=utf-8",
      "X-Content-Type-Options":"nosniff",
      "Cache-Control":"public, max-age=0, s-maxage=3600",
      "Last-Modified": lastModified,
      "ETag": etag,
      "X-Sitemap-Count": String(list.length),
      "X-Fetch-Client": used,
      ...(error ? { "X-Supabase-Error-Msg": `${(error as any)?.code || ''}:${(error as any)?.message || error}` } : {}),
    }
  });
}
