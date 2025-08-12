import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const HOST = "https://www.hoomge.com";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const PATHS = {
  en: { root: "", projects: "/projects", subscription: "/subscription", detail: (id:number)=>`/Project/Detail/${id}` },
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

// coupe TOUT ce qui précéderait l'entête XML (ceinture + bretelles)
function sanitize(out:string){ const m = out.match(/<\?xml[\s\S]*$/); return m?m[0]:out; }

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project").select("id,updated_at,created_at").eq("online", true)
    .order("updated_at", { ascending:false });

  const today = isoDate();
  const rows = !error && Array.isArray(data) && data.length ? data : [{ id:180, created_at:new Date().toISOString() }];

  const staticUrls = [
    `<url><loc>${HOST}/en</loc><lastmod>${today}</lastmod>${altStatic("root")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.projects}</loc><lastmod>${today}</lastmod>${altStatic("projects")}</url>`,
    `<url><loc>${HOST}/en${PATHS.en.subscription}</loc><lastmod>${today}</lastmod>${altStatic("subscription")}</url>`,
  ].join("\n");

  const projectUrls = rows.map((p:any)=>{
    const lastmod = isoDate(p.updated_at || p.created_at);
    return `<url><loc>${HOST}/en${PATHS.en.detail(p.id)}</loc><lastmod>${lastmod}</lastmod>${altDetail(p.id)}</url>`;
  }).join("\n");

  let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${projectUrls}
</urlset>`;

  xml = sanitize(xml);                 // <-- enlève tout préfixe parasite
  return new NextResponse(xml, {       // <-- on ne renvoie QUE ce string
    headers: { "Content-Type":"application/xml; charset=utf-8", "Cache-Control":"no-store" }
  });
}
