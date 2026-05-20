exports.handler = async function(event, context) {
  // CORS ayarları
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Preflight request handle
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { title, excerpt, url } = data;

    // Netlify Panelinde tanımlanacak parametreler
    const pageId = process.env.FACEBOOK_PAGE_ID || 'halkompleksi33';
    const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    // Eğer token girilmediyse, kullanıcıya uyarı döneriz ama hata fırlatmayız (simülasyon)
    if (!pageToken) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Haber başarıyla kaydedildi! Ancak Netlify panelinde FACEBOOK_PAGE_ACCESS_TOKEN tanımlanmadığı için gerçek Facebook sayfasına gönderilemedi. (Lokal test modu aktif)'
        })
      };
    }

    // Gönderilecek mesaj formatı
    const postMessage = `${title}\n\n${excerpt}\n\nDetaylar: ${url || 'https://mersinmanset.netlify.app'}`;

    // Facebook Graph API V19.0 Entegrasyonu
    const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;

    const response = await fetch(fbUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: postMessage,
        access_token: pageToken
      })
    });

    const result = await response.json();

    if (result.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: result.error })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, postId: result.id })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
