import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
const LANG = "ru";
const INDEXABLE = [LANG, "fr", "en"] as const;

type Row = { id: number; updated_at?: string | null; created_at?: string | null };

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEG_RU = "Projet";   // ⬅️ change si tu as un segment localisé
const SEG_FR = "Projet";
const SEG_EN = "Project";

const PATHS = {
  [LANG]: { root: "", projects: "/projects", detail: (id: number) => `/${SEG_RU}/Detail/${id}` },
  fr:     { root: "", projects: "/projects", detail: (id: number) => `/${SEG_FR}/Detail/${id}` },
  en:     { root: "", projects: "/projects", detail: (id: number) => `/${SEG_EN}/Detail/${id}` },
} as const;

function isoDate(s?: string | null) {
  const d = s ? new Date(s) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0,10) : d.toISOString().slice(0,10);
}
function altLinksStatic(key: "root" | "projects") {
  const links = (INDEXABLE as readonly ("ru"|"fr"|"en")[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc][key]}"/>`).join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr[key]}"/>`;
  return links + xdef;
}
function altLinksDetail(id: number) {
  const links = (INDEXABLE as readonly ("ru"|"fr"|"en")[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc].detail(id)}"/>`).join("");
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr.detail(id)}"/>`;
  return links + xdef;
}

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project")
    .select("id, updated_at, created_at")
    .eq("online", true)
    .order("updated_at", { ascending: false });

  const today = isoDate();
  const rows: Row[] = !error && data?.length ? (data as Row[]) : [{ id: 180, created_at: new Date().toISOString() }];

  const staticUrls = [
    `<url><loc>${HOST}/${LANG}${PATHS[LANG].root}</loc><lastmod>${today}</lastmod>${altLinksStatic("root")}</url>`,
    `<url><loc>${HOST}/${LANG}${PATHS[LANG].projects}</loc><lastmod>${today}</lastmod>${altLinksStatic("projects")}</url>`,
  ].join("\n");

  const projectUrls = rows.map(p => {
    const lastmod = isoDate(p.updated_at || p.created_at);
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
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
