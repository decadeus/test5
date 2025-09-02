// Script pour exporter les pages indexées via l'API Google Search Console
// Nécessite une configuration OAuth2

const { google } = require('googleapis');
const fs = require('fs');

async function exportIndexedPages() {
  try {
    // Configuration OAuth2 (à configurer avec vos credentials)
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/your/service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });
    
    const siteUrl = 'https://www.hoomge.com/';
    
    // Récupérer les sitemaps
    const sitemapsResponse = await searchconsole.sitemaps.list({
      siteUrl: siteUrl,
    });
    
    console.log('Sitemaps trouvés:', sitemapsResponse.data.sitemap?.length || 0);
    
    // Récupérer les données de performance (pages avec impressions)
    const performanceResponse = await searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        dimensions: ['page'],
        rowLimit: 25000,
      },
    });
    
    const indexedPages = performanceResponse.data.rows || [];
    
    // Exporter en CSV
    const csvContent = [
      'URL,Clicks,Impressions,CTR,Position',
      ...indexedPages.map(row => 
        `${row.keys[0]},${row.clicks},${row.impressions},${row.ctr},${row.position}`
      )
    ].join('\n');
    
    fs.writeFileSync('indexed-pages.csv', csvContent);
    console.log(`Exporté ${indexedPages.length} pages indexées vers indexed-pages.csv`);
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Uncomment to run
// exportIndexedPages();

module.exports = { exportIndexedPages };
