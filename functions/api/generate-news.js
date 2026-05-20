export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    const data = await request.json();
    const { base64Image } = data;

    if (!base64Image) {
      return new Response(JSON.stringify({ error: 'base64Image parameter is required' }), { status: 400, headers });
    }

    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Sistemde Gemini API anahtarı tanımlanmamış. Lütfen Cloudflare panelinden GEMINI_API_KEY değişkenini ekleyin."
      }), { status: 400, headers });
    }

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = "Sen Mersin bölgesinde yayın yapan deneyimli ve tarafsız bir gazetecisin. Sana gönderilen bu görseli analiz et ve görselle doğrudan ilişkili, profesyonel bir haber oluştur. Başlık mutlaka ilgi çekici ve Mersin odaklı olsun. Yanıtı sadece ve sadece aşağıdaki şablona uygun bir JSON dosyası olarak döndür. Başka hiçbir şey yazma, markdown bloğu (```json) kullanma, doğrudan JSON formatında başla ve bitir:\n{\n  \"title\": \"Haber Başlığı\",\n  \"category\": \"Kategori (Güncel, Yerel, Siyaset, Ekonomi, Spor, Eğitim, Sağlık değerlerinden biri olmak zorunda)\",\n  \"excerpt\": \"Haberin 1-2 cümlelik kısa özeti\",\n  \"content\": \"Haberin detaylı metni (en az 2-3 paragraf olmalı ve haber yazım kurallarına uygun olmalıdır)\"\n}";

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const result = await response.json();

    if (result.error) {
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 400, headers });
    }

    if (!result.candidates || result.candidates.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Yapay zeka geçerli bir içerik üretemedi." }), { status: 500, headers });
    }

    const textOutput = result.candidates[0].content.parts[0].text;
    const generatedData = JSON.parse(textOutput);

    return new Response(JSON.stringify({
      success: true,
      data: generatedData
    }), { status: 200, headers });

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
