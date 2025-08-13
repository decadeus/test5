export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const today = new Date().toISOString().slice(0, 10);

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_fr.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_en.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_de.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_pl.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_ru.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `  <sitemap><loc>https://www.hoomge.com/sitemap_uk.xml</loc><lastmod>${today}</lastmod></sitemap>\n` +
    `</sitemapindex>`;

  const etag = '"' + Buffer.from(xml).toString('base64').slice(0, 27) + '"';
  const ifNoneMatch = request.headers.get('if-none-match');

  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        "ETag": etag,
        "Cache-Control": "public, max-age=0, s-maxage=3600",
        "Last-Modified": new Date().toUTCString(),
      },
    });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
      "ETag": etag,
      "Last-Modified": new Date().toUTCString(),
    },
  });
}
