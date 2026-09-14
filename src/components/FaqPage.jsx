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

export function FaqPage({ lang = 'he', t, onBackHome, onOpenDonate }) {
  const ui = faqUI[lang] || faqUI.he;
  const isRtl = lang === 'he';
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState(() => new Set(['he-1', 'en-1', 'fr-1', 'de-1']));
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
    const textToCopy = `${item.question}\n\n${item.answer}\n\n- עמותת ידידי המרכז הרפואי וולפסון (wolfsonfriends.com)`;
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
            <span>{isRtl ? 'עמותה רשומה מס׳ 580022507' : 'Authorized Non-Profit #580022507'}</span>
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
          aria-label={isRtl ? "השפעת התרומה שלך על המרכז הרפואי וולפסון" : "Your Donation Impact"}
          className="mb-10 p-6 sm:p-7 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl"
        >
          <div className="flex items-center gap-2.5 mb-3 text-sky-400 font-extrabold text-base sm:text-lg">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2>
              {lang === "he" ? "השפעת התרומה שלך על המרכז הרפואי וולפסון" : 
               (lang === "fr" ? "L'impact de votre don sur le Centre Médical Wolfson" : 
               (lang === "de" ? "Die Wirkung Ihrer Spende auf das Wolfson Medical Center" : 
               "Your Donation Impact on Edith Wolfson Medical Center"))}
            </h2>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            {lang === "he" 
              ? "התרומה שלך לעמותת ידידי המרכז הרפואי ע״ש אדית וולפסון מצילה חיים ומאפשרת לנו להמשיך להעניק טיפול רפואי מתקדם, שוויוני ואיכותי לכלל המטופלים. להלן נתוני ההשפעה המרכזיים שלנו:"
              : (lang === "fr"
                ? "Votre contribution à l'Association des Amis du Centre Médical Edith Wolfson sauve des vies et permet de prodiguer des soins d'excellence à tous les patients. Voici nos principaux indicateurs d'impact :"
                : (lang === "de"
                  ? "Ihre Zuwendung an den Freundeskreis rettet Leben und ermöglicht Spitzenmedizin für alle Patienten. Hier sind unsere zentralen Wirkungskennzahlen:"
                  : "Your donation to the Friends of Edith Wolfson Medical Center saves lives and enables us to provide advanced, equitable, and compassionate care to all patients. Here are our key impact metrics:"
                )
              )
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="block font-bold text-white mb-0.5">
                  {lang === "he" ? "120,000+ מטופלים בשנה" : 
                   (lang === "fr" ? "120 000+ patients par an" : 
                   (lang === "de" ? "120.000+ Patienten jährlich" : 
                   "120,000+ Patients Annually"))}
                </strong>
                <span className="text-slate-400 text-xs">
                  {lang === "he" ? "נהנים מציוד רפואי חדיש ומציל חיים שנרכש הודות לתרומות." : 
                   "Benefiting directly from life-saving medical equipment and modernized clinical care."}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="block font-bold text-white mb-0.5">
                  {lang === "he" ? "100% מהתרומות" : 
                   (lang === "fr" ? "100% des dons" : 
                   (lang === "de" ? "100% der Spenden" : 
                   "100% of Donations"))}
                </strong>
                <span className="text-slate-400 text-xs">
                  {lang === "he" ? "מועברות ישירות לרכישת מכשור רפואי, שדרוג מחלקות ומחקר קליני." : 
                   "Directly channeled to critical equipment purchases, patient ward upgrades, and clinical research."}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="block font-bold text-white mb-0.5">
                  {lang === "he" ? "אישור סעיף 46 (עד 2029)" : 
                   (lang === "fr" ? "Avantages fiscaux (Article 46)" : 
                   (lang === "de" ? "Steuerabzugsfähig (Abschnitt 46)" : 
                   "Tax-Deductible (Sec 46 & 501c3)"))}
                </strong>
                <span className="text-slate-400 text-xs">
                  {lang === "he" ? "מוכר לזיכוי מס בישראל לפי סעיף 46 ובארה״ב לפי 501(c)(3) דרך JGive." : 
                   "Valid through 31.12.2029 in Israel, and US 501(c)(3) deduction through JGive."}
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
                          <span>{isRtl ? 'תשובה רשמית מאומתת' : 'Verified Official Statement'}</span>
                        </div>

                        <button
                          onClick={() => handleCopy(item)}
                          className="flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors py-1 px-2 rounded-md hover:bg-slate-700/50"
                          title={isRtl ? 'העתק שאלה ותשובה' : 'Copy Q&A'}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{isRtl ? 'הועתק!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'העתק' : 'Copy'}</span>
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
