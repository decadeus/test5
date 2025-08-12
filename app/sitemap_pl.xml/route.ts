import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
const LANG = "pl";                            // langue principale du fichier
const INDEXABLE = [LANG, "fr", "en"] as const;

type Row = { id: number; updated_at?: string | null; created_at?: string | null };

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEG_PL = "Projet";   // ⬅️ change en "Projekt" si ta route PL est localisée
const SEG_FR = "Projet";
const SEG_EN = "Project";

const PATHS = {
  [LANG]: { root: "", projects: "/projects", detail: (id: number) => `/${SEG_PL}/Detail/${id}` },
  fr:     { root: "", projects: "/projects", detail: (id: number) => `/${SEG_FR}/Detail/${id}` },
  en:     { root: "", projects: "/projects", detail: (id: number) => `/${SEG_EN}/Detail/${id}` },
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

function altLinksDetail(id: number) {
  const links = (INDEXABLE as readonly ("pl"|"fr"|"en")[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc].detail(id)}"/>`).join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr.detail(id)}"/>`;
  return links + xdef;
}

export async function GET() {
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
  const list: Row[] = Array.isArray(rows) ? rows : [];

  const staticUrls = [
    `<url><loc>${HOST}/${LANG}${PATHS[LANG].root}</loc><lastmod>${today}</lastmod>${altLinksStatic("root")}</url>`,
    `<url><loc>${HOST}/${LANG}${PATHS[LANG].projects}</loc><lastmod>${today}</lastmod>${altLinksStatic("projects")}</url>`,
  ].join("\n");

  const projectUrls = list.map(p => {
    const lastmod = isoDate(p.created_at);
    const loc = `${HOST}/${LANG}${PATHS[LANG].detail(p.id)}`;
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>${altLinksDetail(p.id)}</url>`;
  }).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${projectUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
      "x-sitemap-count": String(list.length),
      ...(error ? { "x-supabase-error-msg": `${(error as any)?.code || ''}:${(error as any)?.message || error}` } : {}),
      "x-fetch-client": used,
    },
  });
}
