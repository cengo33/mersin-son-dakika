export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const method = request.method;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  // Bind KV namespace
  const kv = env.NEWS_KV;

  // 6 adet detaylı, 200+ kelimelik özgün Mersin haber içeriği (AdSense için)
  const defaultNews = [
    {
      id: "1",
      title: "Mersin Açıklarında 4.2 Büyüklüğünde Deprem: AFAD İlk Açıklamayı Yaptı",
      category: "Güncel",
      excerpt: "Mersin körfezi açıklarında sabaha karşı meydana gelen hafif şiddetli deprem kısa süreli paniğe neden oldu. AFAD ekipleri anında saha taramasına başladı.",
      content: "Afet ve Acil Durum Yönetimi Başkanlığından (AFAD) alınan bilgilere göre, Mersin körfezi açıklarında sabaha karşı saat 04.12 sularında yerin 7.8 kilometre derinliğinde 4.2 büyüklüğünde bir deprem meydana geldi. Çevre illerden de hissedilen bu sarsıntı, özellikle Mersin'in sahil şeridindeki ilçelerinde vatandaşlar arasında kısa süreli paniğe neden oldu. Birçok kişi tedbir amaçlı olarak sokaklara çıkarken, Mersin Valiliği ve ilgili arama kurtarma birimleri anında saha tarama faaliyetlerine başladı.\n\nMersin Valisi yaptığı yazılı açıklamada, kent genelinde AFAD, itfaiye ve emniyet birimlerine ulaşan herhangi bir olumsuz ihbarın bulunmadığını duyurdu. Hasar tespit çalışmalarının tedbiren yapıldığını aktaran Vali, 'Vatandaşlarımızın paniğe kapılmamasını ve sadece resmi makamlardan yapılan açıklamaları dikkate almasını rica ediyoruz. Tüm Mersin halkına geçmiş olsun dileklerimizi iletiyoruz.' şeklinde konuştu.\n\nDeprem uzmanları ise bölgenin tektonik yapısı göz önüne alındığında, bu büyüklükteki depremlerin olağan olduğunu ve daha büyük bir kırılmayı tetiklemesinin beklenmediğini ifade ettiler. Uzmanlar, yapı stokunun kalitesinin önemini bir kez daha hatırlatarak, Mersin genelinde yürütülen kentsel dönüşüm çalışmalarının ne kadar kritik olduğunu vurguladılar.",
      image: "images/news1.png",
      date: "05.06.2026 04:30"
    },
    {
      id: "2",
      title: "Mersin'de Yeni Kentsel Dönüşüm Projesi Başlatıldı: 12 Bin Konut Yenilenecek",
      category: "Yerel",
      excerpt: "Mersin genelinde depreme dayanıksız yapıların yenilenmesi amacıyla büyük bir kentsel dönüşüm hamlesi başladı. İlk etapta 12 bin konut yenilenecek.",
      content: "Mersin Büyükşehir Belediyesi ve Çevre, Şehircilik ve İklim Değişikliği Bakanlığı ortaklığı ile yürütülen büyük kentsel dönüşüm projesinin ilk adımları atıldı. Proje, özellikle deprem riski taşıyan eski yerleşim bölgelerindeki riskli binaları kapsıyor. Akdeniz ve Toroslar ilçelerindeki en riskli mahallelerden başlanacak çalışmalarda, ilk etapta 12 bin konutun yıkılarak yerine modern ve güvenli deprem konutlarının yapılması kararlaştırıldı. Hak sahipleri ile yürütülen uzlaşma görüşmelerinin yüzde 95 oranında tamamlandığı açıklandı.\n\nBelediye Başkanı yaptığı açıklamada, Mersin'in geleceğini inşa ettiklerini belirtti. Dönüşümün sadece bina bazında kalmayacağını, geniş yeşil alanlar, modern otopark çözümleri ve çocuk oyun parkları ile yepyeni sosyal donatı alanları yaratılacağını söyledi. Proje kapsamında kiraya çıkacak hak sahiplerine ise inşaat süresi boyunca kira yardımı yapılacağı müjdesi verildi.\n\nMühendisler Odası temsilcileri kentsel dönüşümün şehir planlaması açısından önemine değinerek, projenin Mersin'in trafik ve altyapı sorunlarına da kalıcı çözümler getireceğini ifade ettiler. İnşaat çalışmalarının önümüzdeki ay temel atma töreniyle resmen başlaması ve ilk konutların 24 ay içinde teslim edilmesi planlanıyor.",
      image: "images/hero.png",
      date: "05.06.2026 10:30"
    },
    {
      id: "3",
      title: "Mersin Pazarında Bu Hafta Sebze Fiyatları Düşüşe Geçti",
      category: "Ekonomi",
      excerpt: "Havaların ısınmasıyla birlikte Mersin'deki semt pazarlarında sebze meyve fiyatlarında yüzde 30'a varan düşüşler yaşandı.",
      content: "Yaz mevsiminin gelmesi ve havaların ısınmasıyla birlikte Mersin ve çevresindeki tarım arazilerinde hasat bolluğu yaşanıyor. Bu durum, Mersin genelindeki semt pazarlarında meyve ve sebze fiyatlarına olumlu yansıdi. Geçtiğimiz aylarda yüksek seyreden domates, biber, patlıcan ve kabak gibi temel gıda ürünlerinde yüzde 30 ile 40 arasında fiyat düşüşleri gerçekleşti. Fiyatların düşmesi hem pazarcı esnafının satışlarını artırdı hem de vatandaşın bütçesini rahatlattı.\n\nMersin Pazarcılar Odası yetkilileri, tarladan doğrudan semt pazarlarına gelen ürünlerin tazeliğine ve bolluğuna dikkat çekti. Mersin'in meşhur malta eriği ve taze kayısısının da tezgahlarda uygun fiyatlarla yerini aldığını belirten yetkililer, 'Mersin, Türkiye'nin önemli yaş sebze ve meyve üretim merkezlerinden biridir. Havaların ısınmasıyla birlikte arz fazlası oluştu, bu da fiyatların doğal olarak düşmesini sağladı.' dediler.\n\nVatandaşlar ise pazar sepetlerini daha ucuza doldurabilmenin mutluluğunu yaşadıklarını ifade ettiler. Pazarcı esnafı ise fiyatlar düştükçe sürümden kazandıklarını ve tezgah önlerinde uzun süredir görülmeyen kalabalıkların oluştuğunu dile getirdi. Önümüzdeki günlerde diğer yazlık meyvelerin de hasat edilmesiyle fiyatların daha da düşeceği tahmin ediliyor.",
      image: "images/news1.png",
      date: "05.06.2026 09:15"
    },
    {
      id: "4",
      title: "Mersin Büyükşehir Belediye Meclisi Haziran Ayı Toplantısını Gerçekleştirdi",
      category: "Siyaset",
      excerpt: "Haziran ayı meclis toplantısında Mersin'in ulaşım projeleri ve bütçe planlamaları masaya yatırıldı.",
      content: "Mersin Büyükşehir Belediye Meclisi, Haziran ayı olağan toplantısının birinci birleşimini kongre merkezinde gerçekleştirdi. Belediye Başkanı yönetiminde toplanan mecliste, Mersin'in vizyon projeleri arasında yer alan metro hattı yapımı ve ilçe yollarının asfaltlanması çalışmaları için ek bütçe talebi görüşüldü. Ayrıca, sosyal belediyecilik kapsamında dar gelirli ailelere yönelik yapılacak yardımların kapsamının genişletilmesi önergesi meclis gündemine taşındı.\n\nToplantı esnasında imar planları ve kentsel dönüşüm alanlarının sınırları konusunda partiler arasında görüş alışverişleri yapıldı. Belediye Başkanı, Mersin'in kaybedecek vakti olmadığını belirterek tüm meclis üyelerine kararlara verdikleri destekten ötürü teşekkür etti. Alınan kararla, metro projesinin ikinci etap finansman planı oy birliği ile meclisten geçti.\n\nMecliste ayrıca tarımsal sulama kooperatiflerine yapılacak güneş enerjisi paneli (GES) destekleri de onaylandı. Bu kararla birlikte Mersinli çiftçilerin enerji maliyetlerinin büyük ölçüde düşürülmesi hedefleniyor. Toplantının ikinci birleşiminin önümüzdeki hafta pazartesi günü yapılacağı açıklandı.",
      image: "images/news2.png",
      date: "05.06.2026 08:45"
    },
    {
      id: "5",
      title: "Mersin İdman Yurdu Ligde Galibiyetle Başladı: Taraftarlar Çılgına Döndü",
      category: "Spor",
      excerpt: "Yeni sezonun açılış maçında kendi evinde galibiyete uzanan Mersin İdman Yurdu lige 3 puanla merhaba dedi.",
      content: "Mersin İdman Yurdu, yeni sezonun açılış maçında kendi evinde ağırladığı güçlü rakibini 2-0 gibi net bir skorla yenerek lige 3 puanla harika bir başlangıç yaptı. Mersin Stadyumu'nu tıklım tıklım dolduran kırmızı-lacivertli taraftarlar, 90 dakika boyunca takımlarına muazzam bir destek verdiler. Karşılaşmanın ilk yarısı golsüz eşitlikle tamamlanırken, temsilcimiz ikinci yarıda kurduğu baskıyla sonuca gitmeyi başardı.\n\nMaçın 62. dakikasında köşe vuruşundan gelen topu şık bir kafa vuruşuyla ağlara gönderen forvet oyuncusu, takımını 1-0 öne geçirdi. Golün ardından ataklarını sıklaştıran Mersin İdman Yurdu, 78. dakikada gelişen hızlı hücumda ikinci golü bularak maçı kopardı. Son düdüğün çalmasıyla stadyum adeta bayram yerine döndü ve binlerce taraftar sokaklarda şampiyonluk şarkıları söyleyerek galibiyeti kutladı.\n\nTeknik direktör basın toplantısında yaptığı açıklamada, oyuncularının azminden ve taraftarın coşkusundan çok etkilendiğini ifade etti. 'Bu galibiyet sadece başlangıç. Mersin halkı şampiyonluğu hak ediyor ve biz bu kupayı Mersin'e getirmek için sonuna kadar savaşacağız.' diyerek camiaya inanç aşıladı.",
      image: "images/news3.png",
      date: "05.06.2026 08:00"
    },
    {
      id: "6",
      title: "Mersin Sahilleri Yaz Sezonu İçin Hazır: Tatilciler Akın Ediyor",
      category: "Yaşam",
      excerpt: "Mersin'in mavi bayraklı sahilleri ve turizm bölgeleri yerli ve yabancı turistleri ağırlamaya başladı.",
      content: "Akdeniz'in incisi Mersin'de, 321 kilometrelik sahil şeridinde yaz sezonu resmen açıldı. Erdemli, Silifke, Anamur ve Kızkalesi başta olmak üzere Mersin'in mavi bayraklı plajları yerli ve yabancı turistlerin akınına uğruyor. Mersin Büyükşehir Belediyesi Çevre Koruma Daire Başkanlığı ekipleri tarafından yürütülen hummalı hazırlıkların ardından tüm plajlarda şezlonglar kuruldu, duş ve soyunma kabinleri yenilendi ve deniz temizliği en üst düzeye çıkarıldı.\n\nBölgedeki otellerin ve pansiyonların doluluk oranlarının şimdiden yüzde 85 seviyelerine ulaştığı açıklandı. Turizm sektörü temsilcileri, Mersin'in hem tarihi zenginliği hem de temiz deniziyle Akdeniz'in en gözde turizm alternatiflerinden biri haline geldiğini belirttiler. Kızkalesi Turizm Derneği Başkanı, 'Bu yıl özellikle Doğu Avrupa ve Orta Doğu'dan gelen turist sayısında ciddi bir artış bekliyoruz. Tesislerimiz sezona tam kapasite ve eksiksiz hazır.' dedi.\n\nHafta sonları çevre iller olan Adana, Gaziantep ve Hatay'dan gelen günübirlikçi ziyaretçilerle birlikte plajlarda adeta iğne atsan yere düşmeyecek görüntüler oluşuyor. Sahil güvenlik ve cankurtaran ekipleri de yaşanabilecek olumsuzluklara karşı deniz şeridinde 24 saat nöbet tutuyor.",
      image: "images/news5.png",
      date: "05.06.2026 07:15"
    }
  ];

  if (method === 'GET') {
    let newsList = [];

    if (kv) {
      const stored = await kv.get('news_data');
      if (stored) {
        newsList = JSON.parse(stored);
      } else {
        newsList = defaultNews;
        await kv.put('news_data', JSON.stringify(defaultNews));
      }
    } else {
      newsList = defaultNews;
    }

    if (id) {
      const article = newsList.find(n => n.id === id);
      if (!article) {
        return new Response(JSON.stringify({ error: 'Haber bulunamadı' }), { status: 404, headers });
      }
      return new Response(JSON.stringify({ success: true, data: article }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ success: true, data: newsList }), { status: 200, headers });
  }

  if (method === 'POST') {
    try {
      const body = await request.json();
      const { title, category, image, excerpt, content, date } = body;

      if (!title || !category || !content) {
        return new Response(JSON.stringify({ error: 'Başlık, kategori ve içerik alanları zorunludur.' }), { status: 400, headers });
      }

      let newsList = [];
      if (kv) {
        const stored = await kv.get('news_data');
        if (stored) newsList = JSON.parse(stored);
        else newsList = [...defaultNews];
      } else {
        return new Response(JSON.stringify({ error: 'Veritabanı (Cloudflare KV) sunucuda tanımlanmamış. Lütfen NEWS_KV binding\'ini ekleyin.' }), { status: 400, headers });
      }

      const newArticle = {
        id: Date.now().toString(),
        title,
        category,
        image: image || 'images/hero.png',
        excerpt: excerpt || (content.substring(0, 150) + '...'),
        content,
        date: date || new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      newsList.push(newArticle);
      await kv.put('news_data', JSON.stringify(newsList));

      return new Response(JSON.stringify({ success: true, data: newArticle }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }

  if (method === 'DELETE') {
    if (!id) {
      return new Response(JSON.stringify({ error: 'Silinecek haberin ID bilgisi zorunludur.' }), { status: 400, headers });
    }

    try {
      let newsList = [];
      if (kv) {
        const stored = await kv.get('news_data');
        if (stored) newsList = JSON.parse(stored);
        else newsList = [...defaultNews];
      } else {
        return new Response(JSON.stringify({ error: 'Veritabanı bağlantısı yok.' }), { status: 400, headers });
      }

      const index = newsList.findIndex(n => n.id === id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: 'Haber bulunamadı.' }), { status: 404, headers });
      }

      newsList.splice(index, 1);
      await kv.put('news_data', JSON.stringify(newsList));

      return new Response(JSON.stringify({ success: true, message: 'Haber başarıyla silindi.' }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}

export async function onRequestOptions(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };
  return new Response('', { status: 200, headers });
}
