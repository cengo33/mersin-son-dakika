export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    const data = await request.json();
    const { title, excerpt, url } = data;

    const pageId = env.FACEBOOK_PAGE_ID || 'halkompleksi33';
    const pageToken = env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageToken) {
      return new Response(JSON.stringify({
        success: false,
        error: "Sistemde Facebook Jetonu tanımlanmamış. Lütfen Cloudflare panelinden FACEBOOK_PAGE_ACCESS_TOKEN değişkenini ekleyin."
      }), { status: 400, headers });
    }

    const postMessage = `${title}\n\n${excerpt}\n\nDetaylar: ${url || 'https://mersinmanset.tr'}`;
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
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ success: true, postId: result.id }), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers });
  }
}

export async function onRequestOptions(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  return new Response('', { status: 200, headers });
}
