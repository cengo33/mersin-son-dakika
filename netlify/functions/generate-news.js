const https = require('https');

function postRequest(url, bodyData) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: responseBody
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify(bodyData));
    req.end();
  });
}

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
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
    const { base64Image } = data;

    if (!base64Image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'base64Image parameter is required' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Eğer Gemini API anahtarı girilmediyse, simüle edilmiş yapay zeka yanıtı döndür
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          simulated: true,
          data: {
            title: "Mersin Limanı'nda Dev Yatırım: Kapasite Yüzde 30 Artırılıyor",
            category: "Ekonomi",
            excerpt: "Mersin Uluslararası Limanı (MIP), kentin ekonomisine büyük katkı sağlayacak yeni genişleme projesini başlattı. Yatırım ile liman kapasitesi önemli oranda artacak.",
            content: "Mersin ekonomisinin can damarı olan Mersin Uluslararası Limanı (MIP), kapasite artırımı ve rıhtım genişletme çalışmalarına resmen başladı. Kent protokolünün katılımıyla gerçekleştirilen törende, projenin detayları paylaşıldı.\n\nYaklaşık 450 milyon dolarlık bütçeyle hayata geçirilecek yatırım sayesinde liman, dünyanın en büyük konteyner gemilerine aynı anda hizmet verebilecek hale gelecek. Genişletme çalışmaları kapsamında yüzlerce Mersinli gence de yeni istihdam imkanı sağlanması hedefleniyor.\n\nİl protokol üyeleri yaptıkları konuşmada, bu yatırımın sadece Mersin için değil, Doğu Akdeniz havzası ve tüm Türkiye dış ticareti için kritik bir kilometre taşı olduğunu vurguladı. Projenin önümüzdeki yılın son çeyreğinde tamamlanarak hizmete girmesi planlanıyor."
          }
        })
      };
    }

    // Base64 verisini temizle
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Gemini API 1.5 Flash çağrısı
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = "Sen Mersin bölgesinde yayın yapan deneyimli ve tarafsız bir gazetecisin. Sana gönderilen bu görseli analiz et ve görselle doğrudan ilişkili, profesyonel bir haber oluştur. Başlık mutlaka ilgi çekici ve Mersin odaklı olsun. Yanıtı sadece ve sadece aşağıdaki şablona uygun bir JSON dosyası olarak döndür. Başka hiçbir şey yazma, markdown bloğu (```json) kullanma, doğrudan JSON formatında başla ve bitir:\n{\n  \"title\": \"Haber Başlığı\",\n  \"category\": \"Kategori (Güncel, Yerel, Siyaset, Ekonomi, Spor, Eğitim, Sağlık değerlerinden biri olmak zorunda)\",\n  \"excerpt\": \"Haberin 1-2 cümlelik kısa özeti\",\n  \"content\": \"Haberin detaylı metni (en az 2-3 paragraf olmalı ve haber yazım kurallarına uygun olmalıdır)\"\n}";

    const apiResponse = await postRequest(geminiUrl, {
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
    });

    const result = JSON.parse(apiResponse.body);

    if (result.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: result.error })
      };
    }

    if (!result.candidates || result.candidates.length === 0) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: "Yapay zeka geçerli bir içerik üretemedi. (Candidates is empty)" })
      };
    }

    // Gemini çıktısını parse et
    const textOutput = result.candidates[0].content.parts[0].text;
    const generatedData = JSON.parse(textOutput);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: generatedData
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
