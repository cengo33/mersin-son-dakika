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
      // Mock response if API key is missing
      await new Promise(resolve => setTimeout(resolve, 2000));
      return new Response(JSON.stringify({
        success: true,
        simulated: true,
        data: {
          title: "Mersin Limanı'nda Dev Yatırım: Kapasite Yüzde 30 Artırılıyor",
          category: "Ekonomi",
          excerpt: "Mersin Uluslararası Limanı (MIP), kentin ekonomisine büyük katkı sağlayacak yeni genişleme projesini başlattı. Yatırım ile liman kapasitesi önemli oranda artacak.",
          content: "Mersin ekonomisinin can damarı olan Mersin Uluslararası Limanı (MIP), kapasite artırımı ve rıhtım genişletme çalışmalarına resmen başladı. Kent protokolünün katılımıyla gerçekleştirilen törende, projenin detayları paylaşıldı.\n\nYaklaşık 450 milyon dolarlık bütçeyle hayata geçirilecek yatırım sayesinde liman, dünyanın en büyük konteyner gemilerine aynı anda hizmet verebilecek hale gelecek. Genişletme çalışmaları kapsamında yüzlerce Mersinli gence de yeni istihdam imkanı sağlanması hedefleniyor.\n\nİl protokol üyeleri yaptıkları konuşmada, bu yatırımın sadece Mersin için değil, Doğu Akdeniz havzası ve tüm Türkiye dış ticareti için kritik bir kilometre taşı olduğunu vurguladı. Projenin önümüzdeki yılın son çeyreğinde tamamlanarak hizmete girmesi planlanıyor."
        }
      }), { status: 200, headers });
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
