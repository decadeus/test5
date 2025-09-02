#!/usr/bin/env node

// Script pour booster l'indexation et la visibilité SEO
// À exécuter après chaque déploiement important

const https = require('https');
const fs = require('fs');

const SITE_URL = 'https://www.hoomge.com';
const INDEXNOW_KEY = 'f1ba1dd485977d4c0f6b8679bb751304dd370d1f3f3bf84aef066d6c760c9822';

// Pages prioritaires à soumettre pour indexation rapide
const PRIORITY_PAGES = [
  '/fr',
  '/en',
  '/fr/Projet/List',
  '/en/Projet/List',
  '/fr/blog',
  '/en/blog',
  '/fr/blog/7', // Article le plus populaire
  '/fr/prix-m2',
  '/fr/prix-m2/france',
  '/fr/prix-m2/pologne',
];

async function submitToIndexNow(urls) {
  const payload = {
    host: 'www.hoomge.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls.map(url => `${SITE_URL}${url}`)
  };

  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      console.log(`IndexNow Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function checkSitemapHealth() {
  console.log('🔍 Vérification des sitemaps...');
  
  const sitemaps = [
    '/sitemap.xml',
    '/sitemap_fr.xml',
    '/sitemap_en.xml',
    '/sitemap_de.xml',
    '/sitemap_pl.xml',
    '/sitemap_ru.xml',
    '/sitemap_uk.xml'
  ];

  for (const sitemap of sitemaps) {
    try {
      const response = await fetch(`${SITE_URL}${sitemap}`);
      const content = await response.text();
      const urlCount = (content.match(/<url>/g) || []).length;
      console.log(`✅ ${sitemap}: ${urlCount} URLs`);
    } catch (error) {
      console.log(`❌ ${sitemap}: Erreur - ${error.message}`);
    }
  }
}

async function generateSEOReport() {
  console.log('📊 Génération du rapport SEO...');
  
  const report = {
    timestamp: new Date().toISOString(),
    priority_pages_submitted: PRIORITY_PAGES.length,
    indexnow_submitted: false,
    recommendations: [
      "Soumettre les pages prioritaires à Google Search Console",
      "Vérifier les Core Web Vitals",
      "Optimiser les meta descriptions manquantes",
      "Améliorer le maillage interne",
      "Surveiller l'évolution dans le dashboard SEO"
    ]
  };

  // Soumettre à IndexNow
  try {
    report.indexnow_submitted = await submitToIndexNow(PRIORITY_PAGES);
    console.log('✅ Pages soumises à IndexNow');
  } catch (error) {
    console.log('❌ Erreur IndexNow:', error.message);
  }

  // Sauvegarder le rapport
  fs.writeFileSync('seo-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Rapport sauvegardé dans seo-report.json');

  return report;
}

async function main() {
  console.log('🚀 Lancement du boost SEO...\n');
  
  await checkSitemapHealth();
  console.log('');
  
  const report = await generateSEOReport();
  
  console.log('\n📈 Résumé:');
  console.log(`- ${report.priority_pages_submitted} pages prioritaires identifiées`);
  console.log(`- IndexNow: ${report.indexnow_submitted ? '✅ Succès' : '❌ Échec'}`);
  console.log('\n💡 Prochaines étapes:');
  report.recommendations.forEach(rec => console.log(`  • ${rec}`));
  
  console.log('\n🎯 Surveillez les résultats dans votre dashboard SEO !');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitToIndexNow, checkSitemapHealth, generateSEOReport };
