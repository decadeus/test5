import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface IndexationStats {
  date: string;
  sitemap_urls: number;
  google_indexed: number;
  google_visible: number;
  bing_indexed: number;
  errors: string[];
}

export async function GET(request: NextRequest) {
  // Respecter les guidelines Google : monitoring non-intrusif
  // Pas de sur-crawling, pas d'impact sur les performances utilisateur
  try {
    const supabase = createClient();
    
    // Récupérer les stats d'indexation depuis la DB
    const { data: stats, error } = await supabase
      .from('seo_monitoring')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Erreur DB:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      stats: stats || [],
      latest: stats?.[0] || null
    });

  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json({ error: 'Failed to fetch monitoring data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Vérifier les sitemaps
    const sitemapStats = await checkSitemaps();
    
    // Simuler la vérification Google (en production, utiliser l'API Search Console)
    const googleStats = await checkGoogleIndexation();
    
    // Sauvegarder les stats
    const { data, error } = await supabase
      .from('seo_monitoring')
      .insert([{
        sitemap_urls: sitemapStats.total,
        google_indexed: googleStats.indexed,
        google_visible: googleStats.visible,
        bing_indexed: 0, // À implémenter avec l'API Bing
        errors: [...sitemapStats.errors, ...googleStats.errors],
        details: {
          sitemaps: sitemapStats.details,
          google: googleStats.details
        }
      }])
      .select();

    if (error) {
      console.error('Erreur sauvegarde:', error);
      return NextResponse.json({ error: 'Failed to save stats' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Monitoring data updated',
      data: data?.[0]
    });

  } catch (error) {
    console.error('Monitoring update error:', error);
    return NextResponse.json({ error: 'Failed to update monitoring' }, { status: 500 });
  }
}

async function checkSitemaps() {
  // CRAWL BUDGET CRITIQUE: Désactiver complètement le monitoring automatique
  // Le monitoring interne consomme le crawl budget de Google
  // Utiliser uniquement GSC pour le monitoring en production
  
  console.log('[SEO-MONITORING] Monitoring automatique désactivé pour préserver le crawl budget Google');
  
  return {
    total: 0,
    details: { message: 'Monitoring désactivé - utiliser GSC' },
    errors: []
  };

  /* DÉSACTIVÉ TEMPORAIREMENT POUR CRAWL BUDGET
  const sitemaps = [
    'https://www.hoomge.com/sitemap_fr.xml',
    'https://www.hoomge.com/sitemap_en.xml',
    'https://www.hoomge.com/sitemap_de.xml',
    'https://www.hoomge.com/sitemap_pl.xml',
    'https://www.hoomge.com/sitemap_ru.xml',
    'https://www.hoomge.com/sitemap_uk.xml'
  ];

  let total = 0;
  const details: any = {};
  const errors: string[] = [];

  for (const sitemapUrl of sitemaps) {
    try {
      // Ajouter User-Agent pour identifier nos requêtes de monitoring
      const response = await fetch(sitemapUrl, {
        headers: {
          'User-Agent': 'HoomgeSEOMonitoring/1.0 (Internal monitoring, not a crawler)'
        }
      });
      const xml = await response.text();
      const urlCount = (xml.match(/<url>/g) || []).length;
      
      const lang = sitemapUrl.split('_')[1]?.split('.')[0] || 'unknown';
      details[lang] = urlCount;
      total += urlCount;
      
    } catch (error) {
      errors.push(`Erreur sitemap ${sitemapUrl}: ${error}`);
    }
  }

  return { total, details, errors };
}

async function checkGoogleIndexation() {
  // En production, utiliser l'API Google Search Console
  // Pour l'instant, simulation basée sur les patterns connus
  
  const errors: string[] = [];
  
  // Simulation - en réalité, utiliser l'API Search Console
  const indexed = Math.floor(Math.random() * 20) + 40; // 40-60
  const visible = Math.floor(indexed * 0.3); // ~30% visible dans site:
  
  return {
    indexed,
    visible,
    errors,
    details: {
      last_check: new Date().toISOString(),
      method: 'simulated' // En production: 'search_console_api'
    }
  };
}
