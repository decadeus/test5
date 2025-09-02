import { NextRequest, NextResponse } from 'next/server';

// Cron job pour le monitoring automatique SEO
// À configurer avec Vercel Cron ou un service externe

export async function GET(request: NextRequest) {
  // Vérifier l'authentification du cron (optionnel)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Déclencher la mise à jour du monitoring
    const monitoringResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/seo-monitoring`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const monitoringData = await monitoringResponse.json();

    if (!monitoringData.success) {
      throw new Error('Failed to update monitoring data');
    }

    // Optionnel : Envoyer une notification si problème détecté
    const stats = monitoringData.data;
    if (stats.errors && stats.errors.length > 0) {
      console.warn('SEO Monitoring - Erreurs détectées:', stats.errors);
      // Ici, vous pourriez envoyer un email ou une notification Slack
    }

    return NextResponse.json({
      success: true,
      message: 'SEO monitoring updated successfully',
      timestamp: new Date().toISOString(),
      stats: {
        sitemap_urls: stats.sitemap_urls,
        google_indexed: stats.google_indexed,
        google_visible: stats.google_visible,
        errors_count: stats.errors?.length || 0,
      },
    });

  } catch (error) {
    console.error('Cron SEO monitoring error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run SEO monitoring',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }, 
      { status: 500 }
    );
  }
}

// Configuration pour Vercel Cron
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
