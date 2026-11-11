/**
 * TUFAN Web - Canlı ve Otomatik Çeviri Servisi (TR -> EN)
 * Admin panelinden herhangi bir metin güncellendiğinde otomatik olarak
 * İngilizce karşılığını çevirir, önbelleğe alır ve canlı olarak sunar.
 */

// Basit ve hızlı dize hash fonksiyonu (localStorage anahtarları için)
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h' + Math.abs(hash).toString(36);
}

// Bellek içi önbellek (Sayfa açıkken 0ms erişim)
const memoryCache = new Map();

// Statik varsayılan sözlük (İlk yükleme gecikmesini sıfırlamak için)
const DICTIONARY_TR_EN = {
  // Hero Başlıkları
  'Geleceğin Elektrikli Araç Teknolojileri': 'Electric Vehicle Technologies of the Future',
  'TUFAN Elektromobil ile Yollarda.': 'On the Road with TUFAN Electric.',
  'TUFAN Elektromobil': 'TUFAN Electric Vehicle',
  'TUFAN Otonom': 'TUFAN Autonomous',

  // Hakkımızda Varsayılan
  'TUFAN Elektromobil Takımı, Akdeniz Üniversitesi bünyesinde yerli ve milli elektrikli araç teknolojileri geliştirmek amacıyla kurulmuş disiplinler arası bir mühendislik takımıdır.':
    'TUFAN Electric Vehicle Team is an interdisciplinary engineering team established within Akdeniz University to develop local and national electric vehicle technologies.',

  // Özellik Kartları
  'Disiplinler Arası Ekip Çalışması': 'Cross-Disciplinary Teamwork',
  'Mühendislik, yazılım ve tasarım alanlarında yetkin öğrencilerle geleceğin araçlarını tasarlıyoruz.':
    'We design the vehicles of the future alongside talented students in engineering, software, and design.',
  'Yerli ve Milli Üretim': 'Domestic & National Production',
  'Batarya yönetim sisteminden motor sürücüsüne kadar kritik bileşenleri yerli imkanlarla geliştiriyoruz.':
    'From battery management systems to motor drivers, we develop critical components with local capabilities.',
  'Yarışma ve Performans': 'Competition & Performance',
  'Teknofest ve Uluslararası Efficiency Challenge Elektrikli Araç Yarışlarında derece hedefiyle çalışıyoruz.':
    'We compete with a podium goal at TEKNOFEST and the International Efficiency Challenge Electric Vehicle Races.',
  'Bütünleşik Altyapı': 'Integrated Infrastructure',
  'Farklı disiplinlerden gelen yetenekleri tek bir sistem altında birleştirerek yüksek performanslı bir ağ oluşturuyoruz.':
    'We combine talents from different disciplines under a single system to create a high-performance network.',
  'İleri Teknoloji': 'Advanced Technology',
  "Modern framework'ler ve ölçeklenebilir mimariler ile sektörel standartlarda ürünler geliştiriyoruz.":
    'We develop industry-standard products with modern frameworks and scalable architectures.',
  'Güvenilirlik': 'Reliability',
  'Sistemlerimiz, yüksek trafikli kampüs gereksinimlerini karşılamak üzere kesintisiz ve güvenli şekilde tasarlanmıştır.':
    'Our systems are designed to be continuous and secure to meet high-traffic campus requirements.',

  // Ekipler
  'Batarya Ekibi': 'Battery Team',
  'Yazılım Ekibi': 'Software Team',
  'Motor Ekibi': 'Motor Team',
  'Motor Sürücü Ekibi': 'Motor Driver Team',
  'Yerleşik Şarj Ekibi': 'On-Board Charger Team',
  'Mekanik Ekibi': 'Mechanical Team',
  'Medya Ekibi': 'Media Team',
  'İletişim Ekibi': 'Communication Team',
  'Tanıtım Ekibi': 'PR & Media Team'
};

// Sözlüğü belleğe yükle
Object.entries(DICTIONARY_TR_EN).forEach(([tr, en]) => {
  memoryCache.set(tr.trim(), en);
});

// Ay isimleri çevirici
const MONTHS_MAP = {
  'Ocak': 'January', 'Şubat': 'February', 'Mart': 'March', 'Nisan': 'April',
  'Mayıs': 'May', 'Haziran': 'June', 'Temmuz': 'July', 'Ağustos': 'August',
  'Eylül': 'September', 'Ekim': 'October', 'Kasım': 'November', 'Aralık': 'December'
};

export function translateDate(dateStr) {
  if (!dateStr) return dateStr;
  let res = dateStr;
  Object.keys(MONTHS_MAP).forEach(m => {
    res = res.replace(new RegExp(`\\b${m}\\b`, 'g'), MONTHS_MAP[m]);
  });
  return res;
}

/**
 * Senkron Önbellek Okuma:
 * Önbellekte varsa anında döndürür, yoksa fallback verir.
 */
export function getCachedTranslation(text, fallback = null) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (memoryCache.has(trimmed)) {
    return memoryCache.get(trimmed);
  }
  const cacheKey = `tufan_auto_trans_tr_en_${hashString(trimmed)}`;
  const stored = localStorage.getItem(cacheKey);
  if (stored) {
    memoryCache.set(trimmed, stored);
    return stored;
  }
  return fallback !== null ? fallback : text;
}

/**
 * Canlı Metin Çevirisi (TR -> EN):
 * 1. Önce hafıza ve localStorage önbelleğini kontrol eder (0ms).
 * 2. Yoksa Google Translate API'sine asenkron istek atar.
 * 3. Hata durumunda MyMemory API yedeğine geçer.
 * 4. Çeviriyi hem hafızaya hem localStorage'a kalıcı olarak kaydeder.
 */
export async function translateToEn(text) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Önbellek Kontrolü
  const cached = getCachedTranslation(trimmed);
  if (cached && cached !== trimmed) {
    return cached;
  }

  // 2. Birincil Sağlayıcı: Google Translate Free Endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data[0])) {
        const translated = data[0].map(chunk => chunk[0]).join('');
        if (translated && translated.trim()) {
          const finalResult = translated.trim();
          memoryCache.set(trimmed, finalResult);
          try {
            const cacheKey = `tufan_auto_trans_tr_en_${hashString(trimmed)}`;
            localStorage.setItem(cacheKey, finalResult);
          } catch (e) {
            // localStorage doluysa sorunsuz devam et
          }
          return finalResult;
        }
      }
    }
  } catch (err) {
    // Fallback'e geç
  }

  // 3. İkincil Sağlayıcı (Yedek): MyMemory API
  try {
    const backupUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=tr|en`;
    const response = await fetch(backupUrl);
    if (response.ok) {
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        const finalResult = data.responseData.translatedText.trim();
        memoryCache.set(trimmed, finalResult);
        try {
          const cacheKey = `tufan_auto_trans_tr_en_${hashString(trimmed)}`;
          localStorage.setItem(cacheKey, finalResult);
        } catch (e) {}
        return finalResult;
      }
    }
  } catch (err) {
    // API'ler ulaşılamazsa orijinali koru
  }

  return text;
}

/**
 * Toplu Çeviri (Paralel / Çoklu Metinler İçin):
 */
export async function translateBatch(texts) {
  if (!Array.isArray(texts)) return [];
  return Promise.all(texts.map(t => translateToEn(t)));
}
