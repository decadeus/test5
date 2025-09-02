#!/usr/bin/env node

// Script pour forcer l'indexation des pages projets
// Utilise IndexNow pour notifier les moteurs de recherche

const https = require('https');

const SITE_URL = 'https://www.hoomge.com';
const INDEXNOW_KEY = 'f1ba1dd485977d4c0f6b8679bb751304dd370d1f3f3bf84aef066d6c760c9822';

// Pages projets prioritaires (les plus récentes)
const PRIORITY_PROJECTS = [
  '/fr/Projet/Detail/194',
  '/fr/Projet/Detail/193',
  '/fr/Projet/Detail/192',
  '/fr/Projet/Detail/191',
  '/fr/Projet/Detail/190',
  '/en/Projet/Detail/194',
  '/en/Projet/Detail/193',
  '/en/Projet/Detail/192',
  '/en/Projet/Detail/191',
  '/en/Projet/Detail/190',
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
      console.log(`✅ IndexNow Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });

    req.on('error', (error) => {
      console.log(`❌ IndexNow Error: ${error.message}`);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

async function checkSitemapUpdate() {
  console.log('🔍 Vérification des sitemaps mis à jour...');
  
  try {
    const response = await fetch(`${SITE_URL}/sitemap_fr.xml`);
    const xml = await response.text();
    
    // Vérifier si les projets ont maintenant des priorités
    const hasProjectPriorities = xml.includes('<priority>0.8</priority>') && xml.includes('Projet/Detail');
    
    if (hasProjectPriorities) {
      console.log('✅ Sitemaps mis à jour avec les priorités des projets');
      return true;
    } else {
      console.log('⚠️  Sitemaps pas encore mis à jour - redéployez votre app');
      return false;
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Forçage de l\'indexation des projets...\n');
  
  // Vérifier que les sitemaps sont à jour
  const sitemapsUpdated = await checkSitemapUpdate();
  
  if (!sitemapsUpdated) {
    console.log('\n⚠️  Action requise: Déployez d\'abord vos modifications de sitemaps');
    console.log('   Puis relancez ce script');
    return;
  }
  
  console.log('\n📤 Soumission des projets prioritaires à IndexNow...');
  
  try {
    const success = await submitToIndexNow(PRIORITY_PROJECTS);
    
    if (success) {
      console.log('✅ Projets soumis avec succès à IndexNow');
      console.log(`📊 ${PRIORITY_PROJECTS.length} URLs soumises`);
    } else {
      console.log('⚠️  Soumission partielle - certains moteurs peuvent avoir reçu les URLs');
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de la soumission:', error.message);
  }
  
  console.log('\n🎯 Prochaines étapes:');
  console.log('1. Attendez 24-48h pour voir les effets');
  console.log('2. Vérifiez votre dashboard SEO');
  console.log('3. Testez site:hoomge.com dans Google');
  console.log('4. Utilisez Google Search Console pour forcer l\'indexation des pages importantes');
  
  console.log('\n💡 Conseil: Utilisez l\'outil "Inspection d\'URL" dans Google Search Console');
  console.log('   pour forcer l\'indexation des projets les plus importants');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitToIndexNow, checkSitemapUpdate };
