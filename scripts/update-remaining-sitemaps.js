// Script pour mettre à jour les sitemaps restants (DE, RU, UK) avec les slugs
const fs = require('fs');
const path = require('path');

const sitemapsToUpdate = ['de', 'ru', 'uk'];

function updateSitemap(lang) {
  const filePath = path.join(__dirname, '..', 'app', `sitemap_${lang}.xml`, 'route.ts');
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Sitemap ${lang} non trouvé: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Mettre à jour le type Row
  content = content.replace(
    /type Row = \{ id: number; updated_at\?: string \| null; created_at\?: string \| null \};/,
    'type Row = { id: number; slug?: string | null; updated_at?: string | null; created_at?: string | null };'
  );
  
  // 2. Mettre à jour les PATHS pour utiliser slug au lieu d'id
  content = content.replace(
    /detail: \(id: number\) => /g,
    'detail: (slug: string) => '
  );
  content = content.replace(
    /\/Detail\/\$\{id\}/g,
    '/Detail/${slug}'
  );
  
  // 3. Mettre à jour altLinksDetail
  content = content.replace(
    /function altLinksDetail\(id: number\)/,
    'function altLinksDetail(slug: string)'
  );
  content = content.replace(
    /PATHS\[loc\]\.detail\(id\)/g,
    'PATHS[loc].detail(slug)'
  );
  
  // 4. Mettre à jour la requête Supabase
  content = content.replace(
    /\.select\("id, created_at"\)/,
    '.select("id, slug, created_at")'
  );
  content = content.replace(
    /\.eq\("online", true\)/,
    '.eq("online", true)\n        .not("slug", "is", null)'
  );
  
  // 5. Mettre à jour la génération des URLs de projets
  content = content.replace(
    /const projectUrls = list\.map\(p => \{[\s\S]*?\}\)\.join\("\\n"\);/,
    `const projectUrls = list
    .filter(p => p.slug) // Seulement les projets avec slug
    .map(p => {
      const lastmod = isoDate(p.updated_at || p.created_at);
      const loc = \`\${HOST}/\${LANG}\${PATHS[LANG].detail(p.slug!)}\`;
      return \`<url><loc>\${loc}</loc><lastmod>\${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>\${altLinksDetail(p.slug!)}</url>\`;
    }).join("\\n");`
  );
  
  // Écrire le fichier mis à jour
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Sitemap ${lang.toUpperCase()} mis à jour`);
}

console.log('🚀 Mise à jour des sitemaps restants...');

sitemapsToUpdate.forEach(lang => {
  try {
    updateSitemap(lang);
  } catch (error) {
    console.error(`❌ Erreur pour ${lang}:`, error.message);
  }
});

console.log('🎉 Mise à jour terminée !');
