// Multi-language translation service for Friends of Wolfson Medical Center
// Supports all 9 official languages: he, en, fr, de, ar, ru, es, ja, pt

export const SUPPORTED_LANGUAGES = ['he', 'en', 'fr', 'de', 'ar', 'ru', 'es', 'ja', 'pt'];

export const LANGUAGE_CONFIG = {
  he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  ja: { name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  pt: { name: 'Português', flag: '🇵🇹', dir: 'ltr' }
};

// Common UI phrases / category dictionary for instant flawless translations
const COMMON_DICTIONARY = {
  "חדשות": {
    he: "חדשות",
    en: "News",
    fr: "Actualités",
    de: "Nachrichten",
    ar: "أخبار",
    ru: "Новости",
    es: "Noticias",
    ja: "最新ニュース",
    pt: "Notícias"
  },
  "עדכונים שוטפים": {
    he: "עדכונים שוטפים",
    en: "Live Updates",
    fr: "Actualités en direct",
    de: "Aktuelle Meldungen",
    ar: "تحديثات حية",
    ru: "Новости и события",
    es: "Actualizaciones en vivo",
    ja: "最新ニュース",
    pt: "Atualizações ao vivo"
  },
  "הישג פילנתרופי": {
    he: "הישג פילנתרופי",
    en: "Milestone",
    fr: "Succès Majeur",
    de: "Rekordjahr",
    ar: "إنجاز خيري",
    ru: "Достижение года",
    es: "Hito Filantrópico",
    ja: "主要実績",
    pt: "Marco Histórico"
  },
  "קמפיין דגל": {
    he: "קמפיין דגל",
    en: "Flagship Initiative",
    fr: "Projet Phare",
    de: "Leuchtturmprojekt",
    ar: "משروع ريادي",
    ru: "Флагманский проект",
    es: "Iniciativa Emblema",
    ja: "最重要プロジェクト",
    pt: "Iniciativa Principal"
  },
  "ביטחון והיערכות": {
    he: "ביטחון והיערכות",
    en: "Emergency Fortification",
    fr: "Sécurité & Urgence",
    de: "Notfallvorsorge",
    ar: "الأمن والاستعداد للطوارئ",
    ru: "Безопасность и готовность",
    es: "Seguridad y Emergencias",
    ja: "防災・有事対策",
    pt: "Segurança e Emergência"
  },
  "טכנולוגיית קצה": {
    he: "טכנולוגיית קצה",
    en: "Surgical Innovation",
    fr: "Chirurgie Robotique",
    de: "Roboterchirurgie",
    ar: "ابتكار جراحي",
    ru: "Хирургические инновации",
    es: "Innovación Quirúrgica",
    ja: "最先端外科技術",
    pt: "Inovação Cirúrgica"
  },
  "מחקר ואקדמיה": {
    he: "מחקר ואקדמיה",
    en: "Research & Academia",
    fr: "Recherche & Académie",
    de: "Forschung & Wissenschaft",
    ar: "البحث والأوساط الأكاديمية",
    ru: "Исследования и наука",
    es: "Investigación y Academia",
    ja: "研究・学術提携",
    pt: "Pesquisa e Academia"
  },
  "לפרטים נוספים": {
    he: "לפרטים נוספים",
    en: "Learn More",
    fr: "En savoir plus",
    de: "Mehr erfahren",
    ar: "للمزيد من التفاصيل",
    ru: "Подробнее",
    es: "Más información",
    ja: "詳細を見る",
    pt: "Saiba mais"
  },
  "לפרטים המלאים": {
    he: "לפרטים המלאים",
    en: "Full Details",
    fr: "Détails complets",
    de: "Vollständige Details",
    ar: "التفاصيل الكاملة",
    ru: "Все подробности",
    es: "Detalles completos",
    ja: "詳細を見る",
    pt: "Detalhes completos"
  },
  "קרא עוד": {
    he: "קרא עוד",
    en: "Read More",
    fr: "Lire la suite",
    de: "Weiterlesen",
    ar: "اقרأ المزيد",
    ru: "Читать далее",
    es: "Leer más",
    ja: "続きを読む",
    pt: "Leia mais"
  }
};

const CACHE_STORAGE_KEY = 'fwmc_news_trans_cache_v1';
let memoryCache = {};

if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(CACHE_STORAGE_KEY);
    if (saved) {
      memoryCache = JSON.parse(saved);
    }
  } catch (e) {}
}

function persistCache() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(memoryCache));
    } catch (e) {}
  }
}

/**
 * Detect language of given text
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';
  if (/[\u0590-\u05FF]/.test(text)) return 'he';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) return 'ja';
  return 'en';
}

/**
 * Translate a single text string to target language
 */
export async function translateText(text, targetLang, sourceLang = 'auto') {
  if (!text || typeof text !== 'string') return text || '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  if (/^[\d\s–—\-/.]+$/.test(trimmed)) {
    return trimmed;
  }

  if (COMMON_DICTIONARY[trimmed] && COMMON_DICTIONARY[trimmed][targetLang]) {
    return COMMON_DICTIONARY[trimmed][targetLang];
  }

  const detected = sourceLang === 'auto' ? detectLanguage(trimmed) : sourceLang;
  if (detected === targetLang) {
    return trimmed;
  }

  const cacheKey = `${detected}_${targetLang}_${trimmed}`;
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  try {
    const sl = detected || 'auto';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map(chunk => chunk[0]).filter(Boolean).join('');
        if (translated) {
          memoryCache[cacheKey] = translated;
          persistCache();
          return translated;
        }
      }
    }
  } catch (err) {}

  try {
    const langpair = `${detected || 'he'}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${langpair}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        memoryCache[cacheKey] = translated;
        persistCache();
        return translated;
      }
    }
  } catch (err) {}

  return trimmed;
}

/**
 * Translate a news bundle (title, snippet, category, date, linkText) into all 9 supported languages
 */
export async function translateNewsBundle(sourceFields, sourceLang = 'he') {
  const result = {
    title: { [sourceLang]: sourceFields.title || '' },
    snippet: { [sourceLang]: sourceFields.snippet || '' },
    category: { [sourceLang]: sourceFields.category || '' },
    date: { [sourceLang]: sourceFields.date || '' },
    linkText: { [sourceLang]: sourceFields.linkText || '' }
  };

  const detectedSrc = sourceLang || detectLanguage(sourceFields.title || sourceFields.snippet || '');

  const translationPromises = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === detectedSrc) {
      result.title[lang] = sourceFields.title || '';
      result.snippet[lang] = sourceFields.snippet || '';
      result.category[lang] = sourceFields.category || '';
      result.date[lang] = sourceFields.date || '';
      result.linkText[lang] = sourceFields.linkText || '';
      continue;
    }

    const p = (async () => {
      const [titleTr, snippetTr, categoryTr, dateTr, linkTextTr] = await Promise.all([
        sourceFields.title ? translateText(sourceFields.title, lang, detectedSrc) : Promise.resolve(''),
        sourceFields.snippet ? translateText(sourceFields.snippet, lang, detectedSrc) : Promise.resolve(''),
        sourceFields.category ? translateText(sourceFields.category, lang, detectedSrc) : Promise.resolve(''),
        sourceFields.date ? translateText(sourceFields.date, lang, detectedSrc) : Promise.resolve(''),
        sourceFields.linkText ? translateText(sourceFields.linkText, lang, detectedSrc) : Promise.resolve('')
      ]);

      result.title[lang] = titleTr || sourceFields.title || '';
      result.snippet[lang] = snippetTr || sourceFields.snippet || '';
      result.category[lang] = categoryTr || sourceFields.category || '';
      result.date[lang] = dateTr || sourceFields.date || '';
      result.linkText[lang] = linkTextTr || sourceFields.linkText || '';
    })();

    translationPromises.push(p);
  }

  await Promise.all(translationPromises);
  return result;
}
