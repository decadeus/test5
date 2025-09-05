import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
const LANG = "pl";                            // langue principale du fichier
const INDEXABLE = [LANG, "fr", "en"] as const;

type Row = { id: number; slug?: string | null; updated_at?: string | null; created_at?: string | null };

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEG_PL = "Projet";   // ⬅️ change en "Projekt" si ta route PL est localisée
const SEG_FR = "Projet";
const SEG_EN = "Project";

const PATHS = {
  [LANG]: { root: "", projects: "/Projet/List", detail: (slug: string) => `/${SEG_PL}/Detail/${slug}` },
  fr:     { root: "", projects: "/Projet/List", detail: (slug: string) => `/${SEG_FR}/Detail/${slug}` },
  en:     { root: "", projects: "/Projet/List", detail: (slug: string) => `/${SEG_EN}/Detail/${slug}` },
} as const;

function isoDate(s?: string | null) {
  const d = s ? new Date(s) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0,10) : d.toISOString().slice(0,10);
}

function altLinksStatic(key: "root" | "projects") {
  const links = (INDEXABLE as readonly ("pl"|"fr"|"en")[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc][key]}"/>`).join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr[key]}"/>`;
  return links + xdef;
}

function altLinksDetail(slug: string) {
  const links = (INDEXABLE as readonly ("pl"|"fr"|"en")[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc].detail(slug)}"/>`).join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr.detail(slug)}"/>`;
  return links + xdef;
}

export async function GET(request: Request) {
  async function fetchAll(client: ReturnType<typeof createClient>) {
    try {
      const { data, error } = await client
        .from("project")
        .select("id, slug, created_at")
        .eq("online", true)
        .not("slug", "is", null)
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
  const list: Row[] = Array.isArray(rows) ? rows : [];

  const staticUrls = [
    `<url><loc>${HOST}/${LANG}${PATHS[LANG].root}</loc><lastmod>${today}</lastmod>${altLinksStatic("root")}</url>`,
    `<url><loc>${HOST}/${LANG}${PATHS[LANG].projects}</loc><lastmod>${today}</lastmod>${altLinksStatic("projects")}</url>`,
  ].join("\n");

  const projectUrls = list
    .filter(p => p.slug) // Seulement les projets avec slug
    .map(p => {
      const lastmod = isoDate(p.updated_at || p.created_at);
      const loc = `${HOST}/${LANG}${PATHS[LANG].detail(p.slug!)}`;
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>${altLinksDetail(p.slug!)}</url>`;
    }).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${projectUrls}
</urlset>`;

  const lastModified = new Date().toUTCString();
  const etag = '"' + Buffer.from(xml).toString('base64').slice(0, 27) + '"';
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "x-content-type-options": "nosniff",
        "cache-control": "public, max-age=0, s-maxage=3600",
        "last-modified": lastModified,
        "etag": etag,
        "x-sitemap-count": String(list.length),
        ...(error ? { "x-supabase-error-msg": `${(error as any)?.code || ''}:${(error as any)?.message || error}` } : {}),
        "x-fetch-client": used,
      },
    });
  }
  return new NextResponse(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "x-content-type-options": "nosniff",
      "cache-control": "public, max-age=0, s-maxage=3600",
      "last-modified": lastModified,
      "etag": etag,
      "x-sitemap-count": String(list.length),
      ...(error ? { "x-supabase-error-msg": `${(error as any)?.code || ''}:${(error as any)?.message || error}` } : {}),
      "x-fetch-client": used,
    },
  });
}
