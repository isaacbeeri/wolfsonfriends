export const SUPPORTED_LANGUAGES = ['he', 'en', 'fr', 'de', 'ar', 'ru', 'es', 'ja', 'pt'];

const COUNTRY_LANGUAGE_MAP = {
  // Hebrew
  IL: 'he',

  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', LB: 'ar', QA: 'ar', KW: 'ar',
  BH: 'ar', OM: 'ar', IQ: 'ar', DZ: 'ar', MA: 'ar', TN: 'ar', LY: 'ar',
  SD: 'ar', YE: 'ar', SY: 'ar', PS: 'ar',

  // French
  FR: 'fr', BE: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr', MG: 'fr',
  CD: 'fr', CG: 'fr', GA: 'fr', BF: 'fr', ML: 'fr', NE: 'fr', TG: 'fr', BJ: 'fr',

  // German
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',

  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', UZ: 'ru', TJ: 'ru', UA: 'ru',

  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es', PR: 'es',

  // Portuguese
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt',

  // Japanese
  JP: 'ja',

  // English
  US: 'en', GB: 'en', UK: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  ZA: 'en', IN: 'en', SG: 'en', PH: 'en', NG: 'en', KE: 'en', GH: 'en'
};

export function normalizeLanguage(code) {
  if (!code) return null;
  const primary = code.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(primary) ? primary : null;
}

export async function detectSessionLanguage() {
  // 1. Check localStorage for existing user preference
  try {
    const saved = localStorage.getItem('fwmc_lang');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return { lang: saved, source: 'localStorage' };
    }
  } catch (e) {}

  // 2. Check URL search parameter (?lang=xx)
  try {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlLang = normalizeLanguage(params.get('lang'));
      if (urlLang) {
        return { lang: urlLang, source: 'url' };
      }
    }
  } catch (e) {}

  // 3. Check incoming session IP & Country Geolocation
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipwho.is/', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false) {
        const countryCode = (data.country_code || '').toUpperCase();
        const matchedLang = COUNTRY_LANGUAGE_MAP[countryCode];

        if (matchedLang && SUPPORTED_LANGUAGES.includes(matchedLang)) {
          return {
            lang: matchedLang,
            source: 'ip_geolocation',
            ip: data.ip,
            country: data.country,
            countryCode,
            city: data.city
          };
        }
      }
    }
  } catch (e) {
    console.debug('IP Geolocation fallback:', e && e.message ? e.message : e);
  }

  // 4. Check Browser locale (navigator.languages / navigator.language)
  try {
    if (typeof navigator !== 'undefined') {
      const navLangs = navigator.languages || [navigator.language];
      for (const raw of navLangs) {
        const parsed = normalizeLanguage(raw);
        if (parsed) {
          return { lang: parsed, source: 'browser_locale' };
        }
      }
    }
  } catch (e) {}

  // 5. Default fallback to Hebrew
  return { lang: 'he', source: 'default' };
}
