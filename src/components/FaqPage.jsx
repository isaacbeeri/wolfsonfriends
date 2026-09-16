import React, { useState, useMemo, useEffect } from 'react';
import { faqData, faqUI } from '../data/faqData.js';
import { 
  Search, 
  X, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  HelpCircle, 
  Heart, 
  Copy, 
  Check, 
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const impactTexts = {
  sectionTitle: {
    he: "השפעת התרומה שלך על המרכז הרפואי וולפסון",
    ar: "أثر تبرعك على مركز إديث فولفسون الطبي",
    ru: "Влияние вашего пожертвования на Медицинский центр Вольфсон",
    es: "El impacto de su donación en el Centro Médico Wolfson",
    ja: "ウォルフソン医療センターへのご寄付のインパクト",
    pt: "O impacto da sua doação no Centro Médico Wolfson",
    fr: "L'impact de votre don sur le Centre Médical Wolfson",
    de: "Die Wirkung Ihrer Spende auf das Wolfson Medical Center",
    en: "Your Donation Impact on Edith Wolfson Medical Center"
  },
  sectionDesc: {
    he: "התרומה שלך לעמותת ידידי המרכז הרפואי ע״ש אדית וולפסון מצילה חיים ומאפשרת לנו להמשיך להעניק טיפול רפואי מתקדם, שוויוני ואיכותי לכלל המטופלים. להלן נתוני ההשפעה המרכזיים שלנו:",
    ar: "تبرعكم لجمعية أصدقاء مركز إديث فولفسون الطبي يسهم في إنقاذ الأرواح وتمكيننا من تقديم رعاية طبية متقدمة وعادلة لجميع المرضى. إليكم أهم مؤشرات الأثر:",
    ru: "Ваше пожертвование спасает жизни и позволяет обеспечивать передовую, равноправную и качественную помощь всем пациентам. Вот ключевые показатели:",
    es: "Su donación a la Sociedad de Amigos salva vidas y nos permite seguir brindando atención médica de excelencia y equitativa para todos los pacientes. Principales indicadores:",
    ja: "皆様からのご寄付は尊い命を救い、すべての人へ公平で質の高い先進医療を提供し続ける力となります。主な実績指標をご案内します。",
    pt: "Sua doação salva vidas e nos permite continuar prestando assistência médica avançada e de excelência a todos os pacientes. Principais indicadores:",
    fr: "Votre contribution à l'Association des Amis du Centre Médical Edith Wolfson sauve des vies et permet de prodiguer des soins d'excellence à tous les patients. Voici nos principaux indicateurs d'impact :",
    de: "Ihre Zuwendung an den Freundeskreis rettet Leben und ermöglicht Spitzenmedizin für alle Patienten. Hier sind unsere zentralen Wirkungskennzahlen:",
    en: "Your donation to the Friends of Edith Wolfson Medical Center saves lives and enables us to provide advanced, equitable, and compassionate care to all patients. Here are our key impact metrics:"
  },
  card1Title: {
    he: "120,000+ מטופלים בשנה",
    ar: "+120,000 مريض سنوياً",
    ru: "120 000+ пациентов ежегодно",
    es: "120.000+ pacientes al año",
    ja: "年間12万人以上の患者様",
    pt: "Mais de 120.000 pacientes por ano",
    fr: "120 000+ patients par an",
    de: "120.000+ Patienten jährlich",
    en: "120,000+ Patients Annually"
  },
  card1Desc: {
    he: "נהנים מציוד רפואי חדיש ומציל חיים שנרכש הודות לתרומות.",
    ar: "يستفيدون مباشرة من أحدث الأجهزة والمعدات المنقذة للحياة المقتناة بفضل التبرعات.",
    ru: "Получают помощь благодаря современному оборудованию, приобретенному на пожертвования.",
    es: "Se benefician directamente de equipamiento médico vital adquirido gracias a las donaciones.",
    ja: "皆様のご寄付により導入された最新鋭の救命医療機器による恩恵を受けています。",
    pt: "Beneficiados diretamente por equipamentos médicos avançados adquiridos graças às doações.",
    fr: "Bénéficient directement d'équipements médicaux vitaux acquis grâce aux dons.",
    de: "Profitieren direkt von lebensrettenden medizinischen Geräten, die durch Spenden finanziert wurden.",
    en: "Benefiting directly from life-saving medical equipment and modernized clinical care."
  },
  card2Title: {
    he: "100% מהתרומות",
    ar: "100% من التبرعات",
    ru: "100% пожертвований",
    es: "100% de las donaciones",
    ja: "寄付金の100％",
    pt: "100% das doações",
    fr: "100% des dons",
    de: "100% der Spenden",
    en: "100% of Donations"
  },
  card2Desc: {
    he: "מועברות בהתאם לבקשת התורם, בין השאר לרכישת מכשור רפואי, פעילויות לצוותים, לשדרוג מחלקות ומחקר קליני.",
    ar: "تخصص بالكامل وفقاً لرغبة المتبرع، بما يشمل شراء الأجهزة الطبية ودعم الطواقم وتحديث الأقسام والأبحاث السريرية.",
    ru: "Направляются строго по желанию жертвователя: на медоборудование, поддержку персонала, обновление отделений и исследования.",
    es: "Se destinan según la voluntad del donante: equipamiento médico, apoyo al personal, modernización de salas e investigación.",
    ja: "医療機器購入、医療従事者支援、病棟改修、臨床研究など、寄付者様のご意向に沿って確実に配分されます。",
    pt: "São alocadas de acordo com a vontade do doador: equipamentos médicos, apoio às equipes, modernização de alas e pesquisa.",
    fr: "Alloués selon la volonté du donateur, notamment pour l'équipement médical, le soutien aux équipes, la modernisation des services et la recherche.",
    de: "Zweckgebunden nach Wunsch des Spenders verwendet, u. a. für medizinische Geräte, Teamförderung, Stationsausbau und Forschung.",
    en: "Allocated according to donor intent, including medical equipment, staff support initiatives, ward modernization, and clinical research."
  },
  card3Title: {
    he: "אישור סעיף 46 (עד 2029)",
    ar: "إعفاء المادة 46 (حتى 2029)",
    ru: "Налоговый вычет (Ст. 46 и 501c3)",
    es: "Deducción Fiscal (Art. 46 y 501c3)",
    ja: "寄付金控除対象（第46条・501c3）",
    pt: "Dedutível (Art. 46 e 501c3)",
    fr: "Avantages fiscaux (Article 46)",
    de: "Steuerabzugsfähig (Abschnitt 46)",
    en: "Tax-Deductible (Sec 46 & 501c3)"
  },
  card3Desc: {
    he: "מוכר לזיכוי מס בישראל לפי סעיף 46 ובארה״ב לפי 501(c)(3) דרך JGive.",
    ar: "معترف به للإعفاء الضريبي في إسرائيل بموجب المادة 46 وفي أمريكا بموجب 501(c)(3) عبر JGive.",
    ru: "Признано для вычета в Израиле по Ст. 46 (до 2029 г.) и в США по 501(c)(3) через JGive.",
    es: "Reconocido para deducción fiscal en Israel según el Art. 46 y en EE. UU. según 501(c)(3) a través de JGive.",
    ja: "イスラエル所得税法第46条（2029年まで有効）およびJGive経由での米国501(c)(3)免税認可。",
    pt: "Reconhecido para dedução fiscal em Israel pelo Art. 46 e nos EUA pelo código 501(c)(3) via JGive.",
    fr: "Reconnu pour déduction fiscale en Israël selon l'article 46 et aux États-Unis via 501(c)(3) sur JGive.",
    de: "Anerkannt für Steuerabzug in Israel nach Art. 46 und in den USA nach 501(c)(3) über JGive.",
    en: "Valid through 31.12.2029 in Israel, and US 501(c)(3) deduction through JGive."
  },
  nonProfitReg: {
    he: "עמותה רשומה מס׳ 580022507",
    ar: "جمعية خيرية مسجلة رقم 580022507",
    ru: "Рег. некоммерческая организация № 580022507",
    es: "ONG Registrada Nº 580022507",
    ja: "公認非営利法人 第580022507号",
    pt: "ONG Registrada Nº 580022507",
    fr: "Organisme à but non lucratif agréé n° 580022507",
    de: "Eingetragene Organisation Nr. 580022507",
    en: "Authorized Non-Profit #580022507"
  },
  verifiedOfficial: {
    he: "תשובה רשמית מאומתת",
    ar: "إجابة رسمية موثقة",
    ru: "Официальный проверенный ответ",
    es: "Respuesta oficial verificada",
    ja: "公式認証回答",
    pt: "Resposta oficial verificada",
    fr: "Réponse officielle vérifiée",
    de: "Offiziell geprüfte Antwort",
    en: "Verified Official Statement"
  },
  copyQa: {
    he: "העתק שאלה ותשובה",
    ar: "نسخ السؤال والإجابة",
    ru: "Копировать вопрос и ответ",
    es: "Copiar pregunta y respuesta",
    ja: "質問と回答をコピー",
    pt: "Copiar pergunta e resposta",
    fr: "Copier question et réponse",
    de: "Frage und Antwort kopieren",
    en: "Copy Q&A"
  },
  copied: {
    he: "הועתק!",
    ar: "تم النسخ!",
    ru: "Скопировано!",
    es: "¡Copiado!",
    ja: "コピー完了！",
    pt: "Copiado!",
    fr: "Copié !",
    de: "Kopiert!",
    en: "Copied!"
  },
  copy: {
    he: "העתק",
    ar: "نسخ",
    ru: "Копировать",
    es: "Copiar",
    ja: "コピー",
    pt: "Copiar",
    fr: "Copier",
    de: "Kopieren",
    en: "Copy"
  },
  orgName: {
    he: "עמותת ידידי המרכז הרפואי וולפסון",
    ar: "جمعية أصدقاء مركز إديث فولفسון الطبي",
    ru: "Общество друзей Медицинского центра Вольфсон",
    es: "Sociedad de Amigos del Centro Médico Edith Wolfson",
    ja: "エディス・ウォルフソン医療センター友の会",
    pt: "Sociedade de Amigos do Centro Médico Edith Wolfson",
    fr: "Association des Amis du Centre Médical Edith Wolfson",
    de: "Verein der Freunde des Edith Wolfson Medical Center",
    en: "Friends of Edith Wolfson Medical Center"
  }
};

export function FaqPage({ lang = 'he', t, onBackHome, onOpenDonate }) {
  const ui = faqUI[lang] || faqUI.he;
  const isRtl = lang === 'he' || lang === 'ar';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(() => new Set(['he-1', 'en-1', 'fr-1', 'de-1', 'ar-1', 'ru-1', 'es-1', 'ja-1', 'pt-1']));
  const [copiedId, setCopiedId] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const items = useMemo(() => {
    const list = faqData[lang] || faqData.he || [];
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(item => 
      item.question.toLowerCase().includes(q) || 
      item.answer.toLowerCase().includes(q)
    );
  }, [lang, searchQuery]);

  const totalCount = (faqData[lang] || faqData.he || []).length;

  const toggleItem = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const list = faqData[lang] || faqData.he || [];
    setOpenIds(new Set(list.map(i => i.id)));
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
  };

  const handleCopy = (item) => {
    const org = impactTexts.orgName[lang] || impactTexts.orgName.en;
    const textToCopy = `${item.question}\n\n${item.answer}\n\n- ${org} (wolfsonfriends.com)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Structured Data (Schema.org FAQPage) for SEO
  const structuredData = useMemo(() => {
    const list = faqData[lang] || [];
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": list.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }, [lang]);

  const tVal = (key) => (impactTexts[key] && (impactTexts[key][lang] || impactTexts[key].en)) || '';

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pt-24 sm:pt-28 pb-12 selection:bg-sky-500 selection:text-white">
      
      {/* Dynamic Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-sky-400 hover:text-white border border-slate-700 font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowIcon className="w-4 h-4" />
            <span>{ui.backToHome}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{tVal('nonProfitReg')}</span>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{ui.badge}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {ui.title}
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {ui.subtitle}
          </p>
        </div>

        {/* Donation Impact Highlights (WCAG & GEO Enhanced) */}
        <section 
          aria-label={tVal('sectionTitle')}
          className="mb-10 p-6 sm:p-7 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl"
        >
          <div className="flex items-center gap-2.5 mb-3 text-sky-400 font-extrabold text-base sm:text-lg">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2>{tVal('sectionTitle')}</h2>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            {tVal('sectionDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="block font-bold text-white mb-0.5">
                  {tVal('card1Title')}
                </strong>
                <span className="text-slate-400 text-xs">
                  {tVal('card1Desc')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="block font-bold text-white mb-0.5">
                  {tVal('card2Title')}
                </strong>
                <span className="text-slate-400 text-xs">
                  {tVal('card2Desc')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="block font-bold text-white mb-0.5">
                  {tVal('card3Title')}
                </strong>
                <span className="text-slate-400 text-xs">
                  {tVal('card3Desc')}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar Box */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full ps-12 pe-12 py-4 bg-slate-800/90 border border-slate-700 hover:border-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 rounded-2xl text-white placeholder-slate-400 text-base shadow-xl transition-all outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 pe-4 flex items-center text-slate-400 hover:text-white transition-colors"
                title={ui.clearSearch}
              >
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                  <X className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </div>

          {/* Results Summary Bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
            <span>{ui.resultsCount(items.length, totalCount)}</span>
            
            {items.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExpandAll}
                  className="hover:text-sky-400 transition-colors"
                >
                  {ui.expandAll}
                </button>
                <span>•</span>
                <button
                  onClick={handleCollapseAll}
                  className="hover:text-sky-400 transition-colors"
                >
                  {ui.collapseAll}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Accordion List */}
        {items.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 rounded-3xl border border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{ui.noResults}</h3>
            <p className="text-sm text-slate-400 mb-6">{ui.tryDifferentSearch}</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all"
            >
              {ui.clearSearch}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const isOpen = openIds.has(item.id);
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-800/90 border-sky-500/50 shadow-lg shadow-sky-950/20 ring-1 ring-sky-500/20' 
                      : 'bg-slate-800/50 hover:bg-slate-800/70 border-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-5 sm:p-6 text-start flex items-start justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3.5">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isOpen ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-sky-500/20 text-sky-400 rotate-180' : 'bg-slate-700/60 text-slate-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-slate-200 border-t border-slate-700/50">
                      <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                        {item.answer}
                      </p>

                      <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-700/30 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{tVal('verifiedOfficial')}</span>
                        </div>

                        <button
                          onClick={() => handleCopy(item)}
                          className="flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors py-1 px-2 rounded-md hover:bg-slate-700/50"
                          title={tVal('copyQa')}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{tVal('copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{tVal('copy')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Action Card & Back Home */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            {ui.needMoreHelpTitle}
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
            {ui.needMoreHelpDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onBackHome}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm shadow-md transition-all"
            >
              <Home className="w-4 h-4" />
              <span>{ui.backToHome}</span>
            </button>

            {onOpenDonate && (
              <button
                onClick={() => onOpenDonate()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{ui.donateCta}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FaqPage;
