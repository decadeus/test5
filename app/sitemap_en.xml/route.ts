import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PATHS = {
  en: { root: "", projects: "/projects", subscription: "/subscription", detail: (id:number)=>`/Projet/Detail/${id}` },
  fr: { root: "", projects: "/projects", subscription: "/abonnement",   detail: (id:number)=>`/Projet/Detail/${id}` },
} as const;

function isoDate(s?: string|null){ const d=s?new Date(s):new Date(); return isNaN(d.getTime())?new Date().toISOString().slice(0,10):d.toISOString().slice(0,10); }
function altStatic(k:"root"|"projects"|"subscription"){
  return [
    `<xhtml:link rel="alternate" hreflang="en" href="${HOST}/en${PATHS.en[k]}"/>`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr${PATHS.fr[k]}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr[k]}"/>`,
  ].join("");
}
function altDetail(id:number){
  return [
    `<xhtml:link rel="alternate" hreflang="en" href="${HOST}/en${PATHS.en.detail(id)}"/>`,
    `<xhtml:link rel="alternate" hreflang="fr" href="${HOST}/fr${PATHS.fr.detail(id)}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${HOST}/fr${PATHS.fr.detail(id)}"/>`,
  ].join("");
}

// no-op guard removed; we'll return the exact string we build below

export async function GET() {
  const supabase = createClient();
  // Paginate to include all projects (up to 50k URLs per sitemap)
  const pageSize = 1000;
  let from = 0;
  let all: any[] = [];
  let hadError = false
  let lastError: any = null;
  for (let i = 0; i < 50; i++) {
    const to = from + pageSize - 1;
    const { data: page, error } = await supabase
      .from("project")
      .select("id,updatedAt,created_at")
      .eq("online", true)
      .order("updatedAt", { ascending: false })
      .range(from, to);
    if (error) { hadError = true; lastError = error; break; }
    const batch = Array.isArray(page) ? page : [];
    all = all.concat(batch);
    if (batch.length < pageSize) break; // last page
    from += pageSize;
  }

  const today = isoDate();
  const rows = !hadError && Array.isArray(all) ? all : [];

  const staticUrls = [
    `<url><loc>${HOST}/en</loc><lastmod>${today}</lastmod>${altStatic("root")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.projects}</loc><lastmod>${today}</lastmod>${altStatic("projects")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.subscription}</loc><lastmod>${today}</lastmod>${altStatic("subscription")}</url>`,
  ].join("\n");

  const projectUrls = rows.map((p:any)=>{
    const lastmod = isoDate(p.updatedAt || p.created_at);
    return `<url><loc>${HOST}/en${PATHS.en.detail(p.id)}</loc><lastmod>${lastmod}</lastmod>${altDetail(p.id)}</url>`;
  }).join("\n");

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${projectUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type":"application/xml; charset=utf-8",
      "X-Content-Type-Options":"nosniff",
      "Cache-Control":"no-store",
      "X-Sitemap-Count": String(rows.length),
      "X-Supabase-Error": String(hadError),
      ...(lastError ? { "X-Supabase-Error-Msg": `${lastError.code || ''}:${lastError.message || lastError}` } : {}),
    }
  });
}
