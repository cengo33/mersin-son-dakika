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

    const apiKey = env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Sistemde OpenAI (ChatGPT) API anahtarı tanımlanmamış. Lütfen Cloudflare panelinden OPENAI_API_KEY değişkenini ekleyin."
      }), { status: 400, headers });
    }

    // OpenAI API çağrısı
    const openAiUrl = 'https://api.openai.com/v1/chat/completions';

    const prompt = "Sen Mersin bölgesinde yayın yapan deneyimli ve tarafsız bir gazetecisin. Sana gönderilen bu görseli analiz et ve görselle doğrudan ilişkili, profesyonel bir haber oluştur. Başlık mutlaka ilgi çekici ve Mersin odaklı olsun. Yanıtı sadece ve sadece aşağıdaki şablona uygun bir JSON dosyası olarak döndür. Başka hiçbir şey yazma, markdown bloğu (```json) kullanma:\n{\n  \"title\": \"Haber Başlığı\",\n  \"category\": \"Kategori (Güncel, Yerel, Siyaset, Ekonomi, Spor, Eğitim, Sağlık değerlerinden biri olmak zorunda)\",\n  \"excerpt\": \"Haberin 1-2 cümlelik kısa özeti\",\n  \"content\": \"Haberin detaylı metni (en az 2-3 paragraf olmalı ve haber yazım kurallarına uygun olmalıdır)\"\n}";

    // Frontend zaten "data:image/jpeg;base64,..." şeklinde gönderiyor.
    const response = await fetch(openAiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ]
      })
    });

    const result = await response.json();

    if (result.error) {
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 400, headers });
    }

    if (!result.choices || result.choices.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Yapay zeka geçerli bir içerik üretemedi." }), { status: 500, headers });
    }

    const textOutput = result.choices[0].message.content;
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
