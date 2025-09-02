import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
const INDEXABLE_LOCALES = ["fr", "en"] as const;
type Locale = typeof INDEXABLE_LOCALES[number];

type Row = { id: number; updated_at?: string | null; created_at?: string | null };

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isoDate(input?: string | null) {
  const d = input ? new Date(input) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}
function sanitizeXml(s: string) {
  const m = s.match(/<\?xml[\s\S]*$/);
  return m ? m[0] : s;
}

const PATHS = {
  fr: { root: "", projects: "/Projet/List", subscription: "/abonnement",    detail: (id: number) => `/Projet/Detail/${id}` },
  en: { root: "", projects: "/Projet/List", subscription: "/subscription",  detail: (id: number) => `/Projet/Detail/${id}` },
} as const;

function altLinksForStatic(pageKey: "root" | "projects" | "subscription") {
  const links = (INDEXABLE_LOCALES as readonly Locale[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc][pageKey]}"/>`)
    .join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr[pageKey]}"/>`;
  return links + xdef;
}

function altLinksForDetail(id: number) {
  const links = (INDEXABLE_LOCALES as readonly Locale[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc].detail(id)}"/>`)
    .join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr.detail(id)}"/>`;
  return links + xdef;
}

export async function GET(request: Request) {
  async function fetchAll(client: ReturnType<typeof createClient>) {
    try {
      const { data, error } = await client
        .from("project")
        .select("id, created_at")
        .eq("online", true)
        .order("created_at", { ascending: false })
        .range(0, 49999);
      return { rows: (data as Row[]) || [], error };
    } catch (e: any) {
      return { rows: [], error: e };
    }
  }

  const anon = createClient();
  let { rows, error } = await fetchAll(anon);
  let used = "anon";
  if ((!rows.length || error) && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient();
    const r = await fetchAll(admin);
    if (r.rows.length || !error) { rows = r.rows; error = r.error; used = "admin"; }
  }

  const today = isoDate();
  const list: Row[] = Array.isArray(rows) ? (rows as Row[]) : [];

  // Articles de blog avec leurs dates de publication réelles
  const blogArticles = [
    { id: 5, title: "Installation Pologne", lastmod: "2024-01-20" },
    { id: 6, title: "NFZ Santé", lastmod: "2024-01-25" },
    { id: 7, title: "Immatriculation voiture", lastmod: "2024-01-30" },
    { id: 8, title: "Micro-entreprise", lastmod: "2024-02-05" }
  ];

  const blogUrls = [
    `<url><loc>${HOST}/fr/blog</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    ...blogArticles.map(article => 
      `<url><loc>${HOST}/fr/blog/${article.id}</loc><lastmod>${article.lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
    )
  ].join("\n");

  // Pages statiques principales
  const staticUrls = [
    `<url><loc>${HOST}/fr${PATHS.fr.root}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority>${altLinksForStatic("root")}</url>`,
    `<url><loc>${HOST}/fr${PATHS.fr.projects}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority>${altLinksForStatic("projects")}</url>`,
    `<url><loc>${HOST}/fr${PATHS.fr.subscription}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>${altLinksForStatic("subscription")}</url>`,
  ].join("\n");

  // Pages additionnelles pour améliorer l'indexation
  const additionalUrls = [
    `<url><loc>${HOST}/fr/prix-m2</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${HOST}/fr/prix-m2/france</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${HOST}/fr/prix-m2/monaco</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${HOST}/fr/prix-m2/pologne</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${HOST}/fr/prix-m2/ukraine</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${HOST}/fr/prix-m2/allemagne</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${HOST}/fr/prix-m2/royaume-uni</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
  ].join("\n");

  const projectUrls = list.map(p => {
    const lastmod = isoDate(p.updated_at || p.created_at);
    const loc = `${HOST}/fr${PATHS.fr.detail(p.id)}`;
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>${altLinksForDetail(p.id)}</url>`;
  }).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${additionalUrls}
${blogUrls}
${projectUrls}
</urlset>`;

  const lastModified = new Date().toUTCString();
  const etag = '"' + Buffer.from(xml).toString('base64').slice(0, 27) + '"';
  const ifNoneMatch = (request.headers.get('if-none-match'));
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        "cache-control": "public, max-age=0, s-maxage=3600",
        "last-modified": lastModified,
        "etag": etag,
      },
    });
  }
  return new NextResponse(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
      "last-modified": lastModified,
      "etag": etag,
      "x-content-type-options": "nosniff",
      "x-sitemap-count": String(list.length),
      "x-fetch-client": used,
      ...(error ? { "x-supabase-error-msg": `${(error as any)?.code || ''}:${(error as any)?.message || error}` } : {}),
    },
  });
}
