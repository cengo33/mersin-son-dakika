var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../.wrangler/tmp/pages-tHoy6n/functionsWorker-0.7695374063300525.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
async function onRequestPost(context) {
  const { request, env } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  try {
    const data = await request.json();
    const { base64Image } = data;
    if (!base64Image) {
      return new Response(JSON.stringify({ error: "base64Image parameter is required" }), { status: 400, headers });
    }
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Sistemde OpenAI (ChatGPT) API anahtar\u0131 tan\u0131mlanmam\u0131\u015F. L\xFCtfen Cloudflare panelinden OPENAI_API_KEY de\u011Fi\u015Fkenini ekleyin."
      }), { status: 400, headers });
    }
    const openAiUrl = "https://api.openai.com/v1/chat/completions";
    const prompt = 'Sen Mersin b\xF6lgesinde yay\u0131n yapan deneyimli ve tarafs\u0131z bir gazetecisin. Sana g\xF6nderilen bu g\xF6rseli analiz et ve g\xF6rselle do\u011Frudan ili\u015Fkili, profesyonel bir haber olu\u015Ftur. Ba\u015Fl\u0131k mutlaka ilgi \xE7ekici ve Mersin odakl\u0131 olsun. Yan\u0131t\u0131 sadece ve sadece a\u015Fa\u011F\u0131daki \u015Fablona uygun bir JSON dosyas\u0131 olarak d\xF6nd\xFCr. Ba\u015Fka hi\xE7bir \u015Fey yazma, markdown blo\u011Fu (```json) kullanma:\n{\n  "title": "Haber Ba\u015Fl\u0131\u011F\u0131",\n  "category": "Kategori (G\xFCncel, Yerel, Siyaset, Ekonomi, Spor, E\u011Fitim, Sa\u011Fl\u0131k de\u011Ferlerinden biri olmak zorunda)",\n  "excerpt": "Haberin 1-2 c\xFCmlelik k\u0131sa \xF6zeti",\n  "content": "Haberin detayl\u0131 metni (en az 2-3 paragraf olmal\u0131 ve haber yaz\u0131m kurallar\u0131na uygun olmal\u0131d\u0131r)"\n}';
    const response = await fetch(openAiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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
      return new Response(JSON.stringify({ success: false, error: "Yapay zeka ge\xE7erli bir i\xE7erik \xFCretemedi." }), { status: 500, headers });
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
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function onRequestOptions(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  return new Response("", { status: 200, headers });
}
__name(onRequestOptions, "onRequestOptions");
__name2(onRequestOptions, "onRequestOptions");
async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const method = request.method;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Content-Type": "application/json"
  };
  if (method === "OPTIONS") {
    return new Response("", { status: 200, headers });
  }
  const kv = env.NEWS_KV;
  const defaultNews = [
    {
      id: "1",
      title: "Mersin A\xE7\u0131klar\u0131nda 4.2 B\xFCy\xFCkl\xFC\u011F\xFCnde Deprem: AFAD \u0130lk A\xE7\u0131klamay\u0131 Yapt\u0131",
      category: "G\xFCncel",
      excerpt: "Mersin k\xF6rfezi a\xE7\u0131klar\u0131nda sabaha kar\u015F\u0131 meydana gelen hafif \u015Fiddetli deprem k\u0131sa s\xFCreli pani\u011Fe neden oldu. AFAD ekipleri an\u0131nda saha taramas\u0131na ba\u015Flad\u0131.",
      content: "Afet ve Acil Durum Y\xF6netimi Ba\u015Fkanl\u0131\u011F\u0131ndan (AFAD) al\u0131nan bilgilere g\xF6re, Mersin k\xF6rfezi a\xE7\u0131klar\u0131nda sabaha kar\u015F\u0131 saat 04.12 sular\u0131nda yerin 7.8 kilometre derinli\u011Finde 4.2 b\xFCy\xFCkl\xFC\u011F\xFCnde bir deprem meydana geldi. \xC7evre illerden de hissedilen bu sars\u0131nt\u0131, \xF6zellikle Mersin'in sahil \u015Feridindeki il\xE7elerinde vatanda\u015Flar aras\u0131nda k\u0131sa s\xFCreli pani\u011Fe neden oldu. Bir\xE7ok ki\u015Fi tedbir ama\xE7l\u0131 olarak sokaklara \xE7\u0131karken, Mersin Valili\u011Fi ve ilgili arama kurtarma birimleri an\u0131nda saha tarama faaliyetlerine ba\u015Flad\u0131.\n\nMersin Valisi yapt\u0131\u011F\u0131 yaz\u0131l\u0131 a\xE7\u0131klamada, kent genelinde AFAD, itfaiye ve emniyet birimlerine ula\u015Fan herhangi bir olumsuz ihbar\u0131n bulunmad\u0131\u011F\u0131n\u0131 duyurdu. Hasar tespit \xE7al\u0131\u015Fmalar\u0131n\u0131n tedbiren yap\u0131ld\u0131\u011F\u0131n\u0131 aktaran Vali, 'Vatanda\u015Flar\u0131m\u0131z\u0131n pani\u011Fe kap\u0131lmamas\u0131n\u0131 ve sadece resmi makamlardan yap\u0131lan a\xE7\u0131klamalar\u0131 dikkate almas\u0131n\u0131 rica ediyoruz. T\xFCm Mersin halk\u0131na ge\xE7mi\u015F olsun dileklerimizi iletiyoruz.' \u015Feklinde konu\u015Ftu.\n\nDeprem uzmanlar\u0131 ise b\xF6lgenin tektonik yap\u0131s\u0131 g\xF6z \xF6n\xFCne al\u0131nd\u0131\u011F\u0131nda, bu b\xFCy\xFCkl\xFCkteki depremlerin ola\u011Fan oldu\u011Funu ve daha b\xFCy\xFCk bir k\u0131r\u0131lmay\u0131 tetiklemesinin beklenmedi\u011Fini ifade ettiler. Uzmanlar, yap\u0131 stokunun kalitesinin \xF6nemini bir kez daha hat\u0131rlatarak, Mersin genelinde y\xFCr\xFCt\xFClen kentsel d\xF6n\xFC\u015F\xFCm \xE7al\u0131\u015Fmalar\u0131n\u0131n ne kadar kritik oldu\u011Funu vurgulad\u0131lar.",
      image: "images/news1.png",
      date: "05.06.2026 04:30"
    },
    {
      id: "2",
      title: "Mersin'de Yeni Kentsel D\xF6n\xFC\u015F\xFCm Projesi Ba\u015Flat\u0131ld\u0131: 12 Bin Konut Yenilenecek",
      category: "Yerel",
      excerpt: "Mersin genelinde depreme dayan\u0131ks\u0131z yap\u0131lar\u0131n yenilenmesi amac\u0131yla b\xFCy\xFCk bir kentsel d\xF6n\xFC\u015F\xFCm hamlesi ba\u015Flad\u0131. \u0130lk etapta 12 bin konut yenilenecek.",
      content: "Mersin B\xFCy\xFCk\u015Fehir Belediyesi ve \xC7evre, \u015Eehircilik ve \u0130klim De\u011Fi\u015Fikli\u011Fi Bakanl\u0131\u011F\u0131 ortakl\u0131\u011F\u0131 ile y\xFCr\xFCt\xFClen b\xFCy\xFCk kentsel d\xF6n\xFC\u015F\xFCm projesinin ilk ad\u0131mlar\u0131 at\u0131ld\u0131. Proje, \xF6zellikle deprem riski ta\u015F\u0131yan eski yerle\u015Fim b\xF6lgelerindeki riskli binalar\u0131 kaps\u0131yor. Akdeniz ve Toroslar il\xE7elerindeki en riskli mahallelerden ba\u015Flanacak \xE7al\u0131\u015Fmalarda, ilk etapta 12 bin konutun y\u0131k\u0131larak yerine modern ve g\xFCvenli deprem konutlar\u0131n\u0131n yap\u0131lmas\u0131 kararla\u015Ft\u0131r\u0131ld\u0131. Hak sahipleri ile y\xFCr\xFCt\xFClen uzla\u015Fma g\xF6r\xFC\u015Fmelerinin y\xFCzde 95 oran\u0131nda tamamland\u0131\u011F\u0131 a\xE7\u0131kland\u0131.\n\nBelediye Ba\u015Fkan\u0131 yapt\u0131\u011F\u0131 a\xE7\u0131klamada, Mersin'in gelece\u011Fini in\u015Fa ettiklerini belirtti. D\xF6n\xFC\u015F\xFCm\xFCn sadece bina baz\u0131nda kalmayaca\u011F\u0131n\u0131, geni\u015F ye\u015Fil alanlar, modern otopark \xE7\xF6z\xFCmleri ve \xE7ocuk oyun parklar\u0131 ile yepyeni sosyal donat\u0131 alanlar\u0131 yarat\u0131laca\u011F\u0131n\u0131 s\xF6yledi. Proje kapsam\u0131nda kiraya \xE7\u0131kacak hak sahiplerine ise in\u015Faat s\xFCresi boyunca kira yard\u0131m\u0131 yap\u0131laca\u011F\u0131 m\xFCjdesi verildi.\n\nM\xFChendisler Odas\u0131 temsilcileri kentsel d\xF6n\xFC\u015F\xFCm\xFCn \u015Fehir planlamas\u0131 a\xE7\u0131s\u0131ndan \xF6nemine de\u011Finerek, projenin Mersin'in trafik ve altyap\u0131 sorunlar\u0131na da kal\u0131c\u0131 \xE7\xF6z\xFCmler getirece\u011Fini ifade ettiler. \u0130n\u015Faat \xE7al\u0131\u015Fmalar\u0131n\u0131n \xF6n\xFCm\xFCzdeki ay temel atma t\xF6reniyle resmen ba\u015Flamas\u0131 ve ilk konutlar\u0131n 24 ay i\xE7inde teslim edilmesi planlan\u0131yor.",
      image: "images/hero.png",
      date: "05.06.2026 10:30"
    },
    {
      id: "3",
      title: "Mersin Pazar\u0131nda Bu Hafta Sebze Fiyatlar\u0131 D\xFC\u015F\xFC\u015Fe Ge\xE7ti",
      category: "Ekonomi",
      excerpt: "Havalar\u0131n \u0131s\u0131nmas\u0131yla birlikte Mersin'deki semt pazarlar\u0131nda sebze meyve fiyatlar\u0131nda y\xFCzde 30'a varan d\xFC\u015F\xFC\u015Fler ya\u015Fand\u0131.",
      content: "Yaz mevsiminin gelmesi ve havalar\u0131n \u0131s\u0131nmas\u0131yla birlikte Mersin ve \xE7evresindeki tar\u0131m arazilerinde hasat bollu\u011Fu ya\u015Fan\u0131yor. Bu durum, Mersin genelindeki semt pazarlar\u0131nda meyve ve sebze fiyatlar\u0131na olumlu yans\u0131di. Ge\xE7ti\u011Fimiz aylarda y\xFCksek seyreden domates, biber, patl\u0131can ve kabak gibi temel g\u0131da \xFCr\xFCnlerinde y\xFCzde 30 ile 40 aras\u0131nda fiyat d\xFC\u015F\xFC\u015Fleri ger\xE7ekle\u015Fti. Fiyatlar\u0131n d\xFC\u015Fmesi hem pazarc\u0131 esnaf\u0131n\u0131n sat\u0131\u015Flar\u0131n\u0131 art\u0131rd\u0131 hem de vatanda\u015F\u0131n b\xFCt\xE7esini rahatlatt\u0131.\n\nMersin Pazarc\u0131lar Odas\u0131 yetkilileri, tarladan do\u011Frudan semt pazarlar\u0131na gelen \xFCr\xFCnlerin tazeli\u011Fine ve bollu\u011Funa dikkat \xE7ekti. Mersin'in me\u015Fhur malta eri\u011Fi ve taze kay\u0131s\u0131s\u0131n\u0131n da tezgahlarda uygun fiyatlarla yerini ald\u0131\u011F\u0131n\u0131 belirten yetkililer, 'Mersin, T\xFCrkiye'nin \xF6nemli ya\u015F sebze ve meyve \xFCretim merkezlerinden biridir. Havalar\u0131n \u0131s\u0131nmas\u0131yla birlikte arz fazlas\u0131 olu\u015Ftu, bu da fiyatlar\u0131n do\u011Fal olarak d\xFC\u015Fmesini sa\u011Flad\u0131.' dediler.\n\nVatanda\u015Flar ise pazar sepetlerini daha ucuza doldurabilmenin mutlulu\u011Funu ya\u015Fad\u0131klar\u0131n\u0131 ifade ettiler. Pazarc\u0131 esnaf\u0131 ise fiyatlar d\xFC\u015Ft\xFCk\xE7e s\xFCr\xFCmden kazand\u0131klar\u0131n\u0131 ve tezgah \xF6nlerinde uzun s\xFCredir g\xF6r\xFClmeyen kalabal\u0131klar\u0131n olu\u015Ftu\u011Funu dile getirdi. \xD6n\xFCm\xFCzdeki g\xFCnlerde di\u011Fer yazl\u0131k meyvelerin de hasat edilmesiyle fiyatlar\u0131n daha da d\xFC\u015Fece\u011Fi tahmin ediliyor.",
      image: "images/news1.png",
      date: "05.06.2026 09:15"
    },
    {
      id: "4",
      title: "Mersin B\xFCy\xFCk\u015Fehir Belediye Meclisi Haziran Ay\u0131 Toplant\u0131s\u0131n\u0131 Ger\xE7ekle\u015Ftirdi",
      category: "Siyaset",
      excerpt: "Haziran ay\u0131 meclis toplant\u0131s\u0131nda Mersin'in ula\u015F\u0131m projeleri ve b\xFCt\xE7e planlamalar\u0131 masaya yat\u0131r\u0131ld\u0131.",
      content: "Mersin B\xFCy\xFCk\u015Fehir Belediye Meclisi, Haziran ay\u0131 ola\u011Fan toplant\u0131s\u0131n\u0131n birinci birle\u015Fimini kongre merkezinde ger\xE7ekle\u015Ftirdi. Belediye Ba\u015Fkan\u0131 y\xF6netiminde toplanan mecliste, Mersin'in vizyon projeleri aras\u0131nda yer alan metro hatt\u0131 yap\u0131m\u0131 ve il\xE7e yollar\u0131n\u0131n asfaltlanmas\u0131 \xE7al\u0131\u015Fmalar\u0131 i\xE7in ek b\xFCt\xE7e talebi g\xF6r\xFC\u015F\xFCld\xFC. Ayr\u0131ca, sosyal belediyecilik kapsam\u0131nda dar gelirli ailelere y\xF6nelik yap\u0131lacak yard\u0131mlar\u0131n kapsam\u0131n\u0131n geni\u015Fletilmesi \xF6nergesi meclis g\xFCndemine ta\u015F\u0131nd\u0131.\n\nToplant\u0131 esnas\u0131nda imar planlar\u0131 ve kentsel d\xF6n\xFC\u015F\xFCm alanlar\u0131n\u0131n s\u0131n\u0131rlar\u0131 konusunda partiler aras\u0131nda g\xF6r\xFC\u015F al\u0131\u015Fveri\u015Fleri yap\u0131ld\u0131. Belediye Ba\u015Fkan\u0131, Mersin'in kaybedecek vakti olmad\u0131\u011F\u0131n\u0131 belirterek t\xFCm meclis \xFCyelerine kararlara verdikleri destekten \xF6t\xFCr\xFC te\u015Fekk\xFCr etti. Al\u0131nan kararla, metro projesinin ikinci etap finansman plan\u0131 oy birli\u011Fi ile meclisten ge\xE7ti.\n\nMecliste ayr\u0131ca tar\u0131msal sulama kooperatiflerine yap\u0131lacak g\xFCne\u015F enerjisi paneli (GES) destekleri de onayland\u0131. Bu kararla birlikte Mersinli \xE7ift\xE7ilerin enerji maliyetlerinin b\xFCy\xFCk \xF6l\xE7\xFCde d\xFC\u015F\xFCr\xFClmesi hedefleniyor. Toplant\u0131n\u0131n ikinci birle\u015Fiminin \xF6n\xFCm\xFCzdeki hafta pazartesi g\xFCn\xFC yap\u0131laca\u011F\u0131 a\xE7\u0131kland\u0131.",
      image: "images/news2.png",
      date: "05.06.2026 08:45"
    },
    {
      id: "5",
      title: "Mersin \u0130dman Yurdu Ligde Galibiyetle Ba\u015Flad\u0131: Taraftarlar \xC7\u0131lg\u0131na D\xF6nd\xFC",
      category: "Spor",
      excerpt: "Yeni sezonun a\xE7\u0131l\u0131\u015F ma\xE7\u0131nda kendi evinde galibiyete uzanan Mersin \u0130dman Yurdu lige 3 puanla merhaba dedi.",
      content: "Mersin \u0130dman Yurdu, yeni sezonun a\xE7\u0131l\u0131\u015F ma\xE7\u0131nda kendi evinde a\u011F\u0131rlad\u0131\u011F\u0131 g\xFC\xE7l\xFC rakibini 2-0 gibi net bir skorla yenerek lige 3 puanla harika bir ba\u015Flang\u0131\xE7 yapt\u0131. Mersin Stadyumu'nu t\u0131kl\u0131m t\u0131kl\u0131m dolduran k\u0131rm\u0131z\u0131-lacivertli taraftarlar, 90 dakika boyunca tak\u0131mlar\u0131na muazzam bir destek verdiler. Kar\u015F\u0131la\u015Fman\u0131n ilk yar\u0131s\u0131 gols\xFCz e\u015Fitlikle tamamlan\u0131rken, temsilcimiz ikinci yar\u0131da kurdu\u011Fu bask\u0131yla sonuca gitmeyi ba\u015Fard\u0131.\n\nMa\xE7\u0131n 62. dakikas\u0131nda k\xF6\u015Fe vuru\u015Fundan gelen topu \u015F\u0131k bir kafa vuru\u015Fuyla a\u011Flara g\xF6nderen forvet oyuncusu, tak\u0131m\u0131n\u0131 1-0 \xF6ne ge\xE7irdi. Gol\xFCn ard\u0131ndan ataklar\u0131n\u0131 s\u0131kla\u015Ft\u0131ran Mersin \u0130dman Yurdu, 78. dakikada geli\u015Fen h\u0131zl\u0131 h\xFCcumda ikinci gol\xFC bularak ma\xE7\u0131 kopard\u0131. Son d\xFCd\xFC\u011F\xFCn \xE7almas\u0131yla stadyum adeta bayram yerine d\xF6nd\xFC ve binlerce taraftar sokaklarda \u015Fampiyonluk \u015Fark\u0131lar\u0131 s\xF6yleyerek galibiyeti kutlad\u0131.\n\nTeknik direkt\xF6r bas\u0131n toplant\u0131s\u0131nda yapt\u0131\u011F\u0131 a\xE7\u0131klamada, oyuncular\u0131n\u0131n azminden ve taraftar\u0131n co\u015Fkusundan \xE7ok etkilendi\u011Fini ifade etti. 'Bu galibiyet sadece ba\u015Flang\u0131\xE7. Mersin halk\u0131 \u015Fampiyonlu\u011Fu hak ediyor ve biz bu kupay\u0131 Mersin'e getirmek i\xE7in sonuna kadar sava\u015Faca\u011F\u0131z.' diyerek camiaya inan\xE7 a\u015F\u0131lad\u0131.",
      image: "images/news3.png",
      date: "05.06.2026 08:00"
    },
    {
      id: "6",
      title: "Mersin Sahilleri Yaz Sezonu \u0130\xE7in Haz\u0131r: Tatilciler Ak\u0131n Ediyor",
      category: "Ya\u015Fam",
      excerpt: "Mersin'in mavi bayrakl\u0131 sahilleri ve turizm b\xF6lgeleri yerli ve yabanc\u0131 turistleri a\u011F\u0131rlamaya ba\u015Flad\u0131.",
      content: "Akdeniz'in incisi Mersin'de, 321 kilometrelik sahil \u015Feridinde yaz sezonu resmen a\xE7\u0131ld\u0131. Erdemli, Silifke, Anamur ve K\u0131zkalesi ba\u015Fta olmak \xFCzere Mersin'in mavi bayrakl\u0131 plajlar\u0131 yerli ve yabanc\u0131 turistlerin ak\u0131n\u0131na u\u011Fruyor. Mersin B\xFCy\xFCk\u015Fehir Belediyesi \xC7evre Koruma Daire Ba\u015Fkanl\u0131\u011F\u0131 ekipleri taraf\u0131ndan y\xFCr\xFCt\xFClen hummal\u0131 haz\u0131rl\u0131klar\u0131n ard\u0131ndan t\xFCm plajlarda \u015Fezlonglar kuruldu, du\u015F ve soyunma kabinleri yenilendi ve deniz temizli\u011Fi en \xFCst d\xFCzeye \xE7\u0131kar\u0131ld\u0131.\n\nB\xF6lgedeki otellerin ve pansiyonlar\u0131n doluluk oranlar\u0131n\u0131n \u015Fimdiden y\xFCzde 85 seviyelerine ula\u015Ft\u0131\u011F\u0131 a\xE7\u0131kland\u0131. Turizm sekt\xF6r\xFC temsilcileri, Mersin'in hem tarihi zenginli\u011Fi hem de temiz deniziyle Akdeniz'in en g\xF6zde turizm alternatiflerinden biri haline geldi\u011Fini belirttiler. K\u0131zkalesi Turizm Derne\u011Fi Ba\u015Fkan\u0131, 'Bu y\u0131l \xF6zellikle Do\u011Fu Avrupa ve Orta Do\u011Fu'dan gelen turist say\u0131s\u0131nda ciddi bir art\u0131\u015F bekliyoruz. Tesislerimiz sezona tam kapasite ve eksiksiz haz\u0131r.' dedi.\n\nHafta sonlar\u0131 \xE7evre iller olan Adana, Gaziantep ve Hatay'dan gelen g\xFCn\xFCbirlik\xE7i ziyaret\xE7ilerle birlikte plajlarda adeta i\u011Fne atsan yere d\xFC\u015Fmeyecek g\xF6r\xFCnt\xFCler olu\u015Fuyor. Sahil g\xFCvenlik ve cankurtaran ekipleri de ya\u015Fanabilecek olumsuzluklara kar\u015F\u0131 deniz \u015Feridinde 24 saat n\xF6bet tutuyor.",
      image: "images/news5.png",
      date: "05.06.2026 07:15"
    }
  ];
  if (method === "GET") {
    let newsList = [];
    if (kv) {
      const stored = await kv.get("news_data");
      if (stored) {
        newsList = JSON.parse(stored);
      } else {
        newsList = defaultNews;
        await kv.put("news_data", JSON.stringify(defaultNews));
      }
    } else {
      newsList = defaultNews;
    }
    if (id) {
      const article = newsList.find((n) => n.id === id);
      if (!article) {
        return new Response(JSON.stringify({ error: "Haber bulunamad\u0131" }), { status: 404, headers });
      }
      return new Response(JSON.stringify({ success: true, data: article }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ success: true, data: newsList }), { status: 200, headers });
  }
  if (method === "POST") {
    try {
      const body = await request.json();
      const { title, category, image, excerpt, content, date } = body;
      if (!title || !category || !content) {
        return new Response(JSON.stringify({ error: "Ba\u015Fl\u0131k, kategori ve i\xE7erik alanlar\u0131 zorunludur." }), { status: 400, headers });
      }
      let newsList = [];
      if (kv) {
        const stored = await kv.get("news_data");
        if (stored) newsList = JSON.parse(stored);
        else newsList = [...defaultNews];
      } else {
        return new Response(JSON.stringify({ error: "Veritaban\u0131 (Cloudflare KV) sunucuda tan\u0131mlanmam\u0131\u015F. L\xFCtfen NEWS_KV binding'ini ekleyin." }), { status: 400, headers });
      }
      const newArticle = {
        id: Date.now().toString(),
        title,
        category,
        image: image || "images/hero.png",
        excerpt: excerpt || content.substring(0, 150) + "...",
        content,
        date: date || (/* @__PURE__ */ new Date()).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      };
      newsList.push(newArticle);
      await kv.put("news_data", JSON.stringify(newsList));
      return new Response(JSON.stringify({ success: true, data: newArticle }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }
  if (method === "DELETE") {
    if (!id) {
      return new Response(JSON.stringify({ error: "Silinecek haberin ID bilgisi zorunludur." }), { status: 400, headers });
    }
    try {
      let newsList = [];
      if (kv) {
        const stored = await kv.get("news_data");
        if (stored) newsList = JSON.parse(stored);
        else newsList = [...defaultNews];
      } else {
        return new Response(JSON.stringify({ error: "Veritaban\u0131 ba\u011Flant\u0131s\u0131 yok." }), { status: 400, headers });
      }
      const index = newsList.findIndex((n) => n.id === id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Haber bulunamad\u0131." }), { status: 404, headers });
      }
      newsList.splice(index, 1);
      await kv.put("news_data", JSON.stringify(newsList));
      return new Response(JSON.stringify({ success: true, message: "Haber ba\u015Far\u0131yla silindi." }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }
  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
}
__name(onRequest, "onRequest");
__name2(onRequest, "onRequest");
async function onRequestOptions2(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
  };
  return new Response("", { status: 200, headers });
}
__name(onRequestOptions2, "onRequestOptions2");
__name2(onRequestOptions2, "onRequestOptions");
async function onRequestPost2(context) {
  const { request, env } = context;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
  try {
    const data = await request.json();
    const { title, excerpt, url } = data;
    const pageId = env.FACEBOOK_PAGE_ID || "halkompleksi33";
    const pageToken = env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!pageToken) {
      return new Response(JSON.stringify({
        success: false,
        error: "Sistemde Facebook Jetonu tan\u0131mlanmam\u0131\u015F. L\xFCtfen Cloudflare panelinden FACEBOOK_PAGE_ACCESS_TOKEN de\u011Fi\u015Fkenini ekleyin."
      }), { status: 400, headers });
    }
    const postMessage = `${title}

${excerpt}

Detaylar: ${url || "https://mersinmanset.tr"}`;
    const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const response = await fetch(fbUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestOptions3(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  return new Response("", { status: 200, headers });
}
__name(onRequestOptions3, "onRequestOptions3");
__name2(onRequestOptions3, "onRequestOptions");
var routes = [
  {
    routePath: "/api/generate-news",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/generate-news",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/news",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/post-to-facebook",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions3]
  },
  {
    routePath: "/api/post-to-facebook",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/news",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-xWqPxj/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-xWqPxj/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.7695374063300525.js.map
