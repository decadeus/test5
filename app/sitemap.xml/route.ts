export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_fr.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_en.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
