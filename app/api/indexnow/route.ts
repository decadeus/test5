import { NextRequest, NextResponse } from 'next/server';

// Clé IndexNow - générée de manière unique pour votre site
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'f1ba1dd485977d4c0f6b8679bb751304dd370d1f3f3bf84aef066d6c760c9822';

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
    }

    // Soumettre à IndexNow (Bing, Yandex)
    const indexNowPayload = {
      host: 'www.hoomge.com',
      key: INDEXNOW_KEY,
      keyLocation: `https://www.hoomge.com/f1ba1dd485977d4c0f6b8679bb751304dd370d1f3f3bf84aef066d6c760c9822.txt`,
      urlList: urls
    };

    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(indexNowPayload),
    });

    // Soumettre à Google (nécessite Google Search Console API)
    // Pour l'instant, on log juste les URLs
    console.log('URLs to index:', urls);

    return NextResponse.json({ 
      success: true, 
      indexnow: indexNowResponse.ok,
      message: `Submitted ${urls.length} URLs for indexing`
    });

  } catch (error) {
    console.error('IndexNow error:', error);
    return NextResponse.json({ error: 'Failed to submit URLs' }, { status: 500 });
  }
}

// Endpoint pour vérifier la clé IndexNow
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
