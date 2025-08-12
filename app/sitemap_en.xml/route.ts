import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";

// on démarre simple : EN + FR
const INDEXABLE_LOCALES = ["en", "fr"] as const;
type Locale = typeof INDEXABLE_LOCALES[number];

type Row = { id: number; updated_at?: string | null; created_at?: string | null };

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isoDate(input?: string | null) {
  const d = input ? new Date(input) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

// segs de routes (adapte si besoin)
const PATHS = {
  en: { root: "", projects: "/projects", subscription: "/subscription",  detail: (id: number) => `/Project/Detail/${id}` },
  fr: { root: "", projects: "/projects", subscription: "/abonnement",    detail: (id: number) => `/Projet/Detail/${id}` },
} as const;

function altLinksForStatic(pageKey: "root" | "projects" | "subscription") {
  const links = (INDEXABLE_LOCALES as readonly Locale[])
    .map(loc => `<xhtml:link rel="alternate" hreflang="${loc}" href="${HOST}/${loc}${PATHS[loc][pageKey]}"/>`)
    .join("");
  // x-default → FR par défaut
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

export async function GET() {
  const supabase = createClient();
  // ⚠️ remplace "online" par ton vrai champ de publication
  const { data, error } = await supabase
    .from("project")
    .select("id, updated_at, created_at")
    .eq("online", true)
    .order("updated_at", { ascending: false });

  const today = isoDate();
  const rows: Row[] =
    !error && Array.isArray(data) && data.length
      ? data
      : [{ id: 180, created_at: new Date().toISOString() }];

  const staticUrls = [
    `<url><loc>${HOST}/en${PATHS.en.root}</loc><lastmod>${today}</lastmod>${altLinksForStatic("root")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.projects}</loc><lastmod>${today}</lastmod>${altLinksForStatic("projects")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.subscription}</loc><lastmod>${today}</lastmod>${altLinksForStatic("subscription")}</url>`,
  ].join("\n");

  const projectUrls = rows.map(p => {
    const lastmod = isoDate(p.updated_at || p.created_at);
    const loc = `${HOST}/en${PATHS.en.detail(p.id)}`;
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>${altLinksForDetail(p.id)}</url>`;
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
