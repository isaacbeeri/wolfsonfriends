import React, { useState } from "react";
import { X, Heart, CreditCard, Building2, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink } from "lucide-react";
import { projects } from "../data/projects";

export function DonationModal({ isOpen, onClose, defaultProject, lang, t }) {
  if (!isOpen) return null;

  const d = t.donateModal;
  const isHe = lang === "he";
  const [activeTab, setActiveTab] = useState("jgive");
  const [projectId, setProjectId] = useState(defaultProject ? defaultProject.id : "general");
  const [currency, setCurrency] = useState("USD");
  const [copiedField, setCopiedField] = useState(null);
  const [projectCopied, setProjectCopied] = useState(false);

  const getSelectedProjectText = (selectedId) => {
    if (!selectedId || selectedId === "general") {
      if (lang === "he") return "תרומה כללית לצרכים הרפואיים הדחופים - עמותת ידידי המרכז הרפואי וולפסון (ע״ר 580022507)";
      if (lang === "fr") return "Fonds général des besoins urgents - Société des Amis du Centre Médical Wolfson";
      if (lang === "de") return "Allgemeiner Notfallfonds - Fördergesellschaft des Edith Wolfson Medical Center";
      if (lang === "ar") return "صندوق الاحتياجات العاجلة العامة - جمعية أصدقاء مركز إديث فولفسون الطبي";
      if (lang === "ru") return "Общий фонд неотложных нужд — Общество друзей Медицинского центра им. Эдит Вольфсон";
      if (lang === "es") return "Fondo general de necesidades urgentes - Sociedad de Amigos del Centro Médico Edith Wolfson";
      if (lang === "ja") return "一般緊急医療ニーズ基金 - エディス・ウォルフソン医療センター友の会";
      if (lang === "pt") return "Fundo geral de necessidades urgentes - Sociedade de Amigos do Centro Médico Edith Wolfson";
      return "General Urgent Needs Fund - Friends of Edith Wolfson Medical Center";
    }
    const proj = projects.find(p => p.id === selectedId);
    const title = proj ? (proj.title[lang] || proj.title.en) : selectedId;
    if (lang === "he") {
      return `ייעוד תרומה: ${title} (עמותת ידידי המרכז הרפואי וולפסון, ע״ר 580022507)`;
    }
    if (lang === "ar") {
      return `تخصيص التبرع: ${title} (جمعية أصدقاء مركز إديث فولفسون الطبي)`;
    }
    if (lang === "ru") {
      return `Назначение пожертвования: ${title} (Общество друзей Медицинского центра им. Эдит Вольфсон)`;
    }
    if (lang === "es") {
      return `Destino de la donación: ${title} (Sociedad de Amigos del Centro Médico Edith Wolfson)`;
    }
    if (lang === "ja") {
      return `寄付の使途: ${title}（エディス・ウォルフソン医療センター友の会）`;
    }
    if (lang === "pt") {
      return `Destinação da doação: ${title} (Sociedade de Amigos do Centro Médico Edith Wolfson)`;
    }
    return `Donation Designation: ${title} (Friends of Edith Wolfson Medical Center)`;
  };

  const copyProjectToClipboard = (selectedId) => {
    const text = getSelectedProjectText(selectedId || projectId);
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setProjectCopied(true);
        setTimeout(() => setProjectCopied(false), 4000);
      }).catch(() => {});
    }
  };

  const handleProjectChange = (newId) => {
    setProjectId(newId);
    copyProjectToClipboard(newId);
  };

  const handleCopy = (text, fieldName) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };


  
  const modalTextMap = {
    impactTitle: {
      he: "השפעת התרומה שלך על המרכז הרפואי וולפסון:",
      ar: "أثر تبرعكم على مركز إديث فولفسون الطبي:",
      ru: "Влияние вашего пожертвования на Медицинский центр Вольфсон:",
      es: "El impacto de su donación en el Centro Médico Wolfson:",
      ja: "ウォルフソン医療センターへのご寄付の直接的効果:",
      pt: "O impacto da sua doação no Centro Médico Wolfson:",
      fr: "L'impact direct de votre don sur le Centre Médical Wolfson :",
      de: "Die direkte Wirkung Ihrer Spende auf das Wolfson Medical Center:",
      en: "Your Direct Impact on Wolfson Medical Center:"
    },
    impactPoint1: {
      he: "120,000+ מטופלים בשנה נהנים מרכש ציוד רפואי חדיש ומציל חיים.",
      ar: "أكثر من 120,000 مريض سنوياً يستفيدون من شراء معدات طبية متطورة ومنقذة للحياة.",
      ru: "120 000+ пациентов ежегодно получают помощь благодаря современному медоборудованию.",
      es: "120.000+ pacientes al año se benefician de equipamiento médico moderno y vital.",
      ja: "年間12万人以上の患者様が最新鋭の救命医療機器による恩恵を受けています。",
      pt: "Mais de 120.000 pacientes por ano são beneficiados por equipamentos médicos modernos.",
      fr: "120 000+ patients par an bénéficient d'équipements médicaux modernes et vitaux.",
      de: "120.000+ Patienten jährlich profitieren von lebensrettenden modernen Medizingeräten.",
      en: "120,000+ patients annually benefit from life-saving medical technology."
    },
    impactPoint2: {
      he: "100% מהתרומות מועברות בהתאם לבקשת התורם, בין השאר לרכישת מכשור רפואי, פעילויות לצוותים, לשדרוג מחלקות ומחקר קליני.",
      ar: "100% من التبرعات تخصص وفقاً لرغبة المتبرع، بما يشمل شراء الأجهزة الطبية ودعم الطواقم وتحديث الأقسام والأبحاث السريرية.",
      ru: "100% пожертвований распределяются по желанию дарителя: на медоборудование, поддержку персонала, обновление отделений и исследования.",
      es: "100% de las donaciones se destinan según la voluntad del donante: equipos médicos, apoyo al personal, mejoras de salas e investigación.",
      ja: "寄付金の100％が寄付者様の意向に沿って医療機器、スタッフ支援、病棟改修、臨床研究等へ配分されます。",
      pt: "100% das doações são destinadas conforme a vontade do doador: equipamentos, apoio aos profissionais, melhorias e pesquisa.",
      fr: "100% des dons sont alloués selon la volonté du donateur, notamment pour les équipements, le soutien aux équipes et la recherche.",
      de: "100% der Spenden werden zweckgebunden nach Wunsch des Spenders verwendet: Medizingeräte, Mitarbeiterförderung und Forschung.",
      en: "100% of donations are allocated according to donor intent, including medical equipment, staff support, ward modernization, and clinical research."
    },
    impactPoint3: {
      he: "אישור סעיף 46 (בתוקף עד 31.12.2029) וזיכוי מס 501(c)(3) בארה״ב דרך JGive.",
      ar: "إعفاء ضريبي بموجب المادة 46 (ساري حتى 31.12.2029) و501(c)(3) في أمريكا عبر JGive.",
      ru: "Налоговый вычет по Ст. 46 (до 31.12.2029) и 501(c)(3) в США через JGive.",
      es: "Deducción fiscal por Art. 46 (hasta 31.12.2029) y 501(c)(3) en EE. UU. vía JGive.",
      ja: "第46条税金控除（2029年12月31日まで有効）およびJGive経由での米国501(c)(3)免税認可。",
      pt: "Dedução fiscal pelo Art. 46 (até 31.12.2029) e 501(c)(3) nos EUA via JGive.",
      fr: "Déduction fiscale article 46 (valable jusqu'au 31.12.2029) et US 501(c)(3) via JGive.",
      de: "Steuerabzug nach Art. 46 (gültig bis 31.12.2029) & US 501(c)(3) über JGive.",
      en: "Section 46 tax deduction (valid through 31.12.2029) & US 501(c)(3) via JGive."
    },
    autoCopiedTip: {
      he: "(מועתק אוטומטית ללוח)",
      ar: "(يتم نسخه تلقائياً إلى الحافظة)",
      ru: "(Автоматически копируется в буфер)",
      es: "(Copiado automáticamente al portapapeles)",
      ja: "(クリップボードへ自動コピーされます)",
      pt: "(Copiado automaticamente para a área de transferência)",
      fr: "(Copié automatiquement dans le presse-papiers)",
      de: "(Wird automatisch in die Zwischenablage kopiert)",
      en: "(Auto-copied to clipboard)"
    },
    jgiveAria: {
      he: "תרומה באמצעות JGive (ייפתח בחלון מאובטח חדש)",
      ar: "التبرع عبر JGive (يفتح في نافذة آمنة جديدة)",
      ru: "Пожертвовать через JGive (откроется в новом защищенном окне)",
      es: "Donar a través de JGive (se abre en nueva ventana segura)",
      ja: "JGive経由で寄付する（安全な新しいウィンドウが開きます）",
      pt: "Doar via JGive (abre em nova janela segura)",
      fr: "Faire un don via JGive (ouvre une nouvelle fenêtre sécurisée)",
      de: "Spenden über JGive (öffnet in neuem sicherem Fenster)",
      en: "Donate via JGive (opens in a secure new window)"
    }
  };

  const getModalText = (key) => (modalTextMap[key] && (modalTextMap[key][lang] || modalTextMap[key].en)) || '';

  const getBeneficiaryLabel = (l) => {
    const map = {
      he: "שם המוטב:",
      ar: "اسم المستفيد:",
      ru: "Получатель:",
      es: "Beneficiario:",
      ja: "受取人名義:",
      pt: "Beneficiário:",
      fr: "Bénéficiaire :",
      de: "Empfänger:"
    };
    return map[l] || "Beneficiary:";
  };

  const getBankBranchLabel = (l) => {
    const map = {
      he: "בנק וסניף:",
      ar: "البنك والفرع:",
      ru: "Банк и отделение:",
      es: "Banco y sucursal:",
      ja: "銀行・支店:",
      pt: "Banco e agência:",
      fr: "Banque & Agence :",
      de: "Bank & Filiale:"
    };
    return map[l] || "Bank & Branch:";
  };

  const getAccountNumLabel = (l) => {
    const map = {
      he: "מספר חשבון:",
      ar: "رقم الحساب:",
      ru: "Номер счета:",
      es: "Número de cuenta:",
      ja: "口座番号:",
      pt: "Número da conta:",
      fr: "Numéro de compte :",
      de: "Kontonummer:"
    };
    return map[l] || "Account Number:";
  };

  const getJGiveUrl = () => {
    const cur = currency ? currency.toLowerCase() : "usd";
    const jgiveLang = lang === "he" ? "he" : "en";
    return `https://www.jgive.com/new/${jgiveLang}/${cur}/charity-organizations/4565/donate/amount`;
  };

  const handleProceedToJGive = () => {
    copyProjectToClipboard(projectId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-modal-title"
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Header */}
        <div className="relative bg-gradient-to-r from-wolfson-navy via-slate-900 to-blue-950 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isHe ? "סגירת חלון תרומה" : "Close donation modal"}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold mb-3 border border-rose-400/30">
            <Heart className="w-3.5 h-3.5 fill-rose-300" />
            <span>{d.badgeSec46} | US 501(c)(3) | UK & Europe</span>
          </div>

          <h3 id="donation-modal-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {d.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {d.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div role="tablist" aria-label={isHe ? "שיטות תרומה" : "Donation methods"} className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            role="tab"
            id="tab-jgive"
            aria-controls="panel-jgive"
            aria-selected={activeTab === "jgive"}
            onClick={() => setActiveTab("jgive")}
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "jgive"
                ? "bg-white text-wolfson-blue shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4 text-rose-600" />
            <span>{d.tabJGive}</span>
          </button>

          <button
            role="tab"
            id="tab-bank"
            aria-controls="panel-bank"
            aria-selected={activeTab === "bank"}
            onClick={() => setActiveTab("bank")}
            className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "bank"
                ? "bg-white text-wolfson-blue shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4 text-wolfson-blue" />
            <span>{d.tabBank}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {activeTab === "jgive" ? (
            <div role="tabpanel" id="panel-jgive" aria-labelledby="tab-jgive" className="space-y-6 text-center">
              
              <div className="p-6 rounded-3xl bg-gradient-to-b from-sky-50/70 to-white border border-sky-200/80 shadow-xs">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{d.jgiveBadge}</span>
                </div>

                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                  {d.jgiveTitle}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-5">
                  {d.jgiveDesc}
                </p>

                {/* Structured Impact Highlights (GEO & Conversion) */}
                <div className="max-w-md mx-auto mb-5 p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/90 text-start shadow-xs">
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                    <span>{getModalText('impactTitle')}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{getModalText('impactPoint1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{getModalText('impactPoint2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{getModalText('impactPoint3')}</span>
                    </li>
                  </ul>
                </div>

                {/* Pre-donation Project Selection with Auto-Copy to Clipboard */}
                <form 
                  role="form" 
                  aria-label={isHe ? "טופס בחירת ייעוד תרומה למרכז הרפואי וולפסון" : "Donation designation form"} 
                  onSubmit={(e) => e.preventDefault()} 
                  className="max-w-md mx-auto mb-5 text-start"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="donation-project-select" className="block text-xs font-bold text-slate-700">
                      {d.selectProject}
                    </label>
                    <span className="text-[11px] text-slate-500">
                      {getModalText('autoCopiedTip')}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <select
                      id="donation-project-select"
                      aria-label={d.selectProject}
                      value={projectId}
                      onChange={(e) => handleProjectChange(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white shadow-xs"
                    >
                      <option value="general">{d.generalFund}</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.title[lang] || proj.title.en}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => copyProjectToClipboard(projectId)}
                      title={d.copyProjectBtn || "העתק ייעוד"}
                      aria-label={d.copyProjectBtn || "העתק ייעוד"}
                      className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                    >
                      {projectCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                      <span className="hidden sm:inline">{projectCopied ? (d.copied || "הועתק!") : (d.copyProjectBtn || "העתק ייעוד")}</span>
                    </button>
                  </div>

                  {/* Dynamic Alert: Copied or Instruction Tip */}
                  {projectCopied ? (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{d.copiedProjectSuccess}</span>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] sm:text-xs leading-relaxed flex items-start gap-2">
                      <Copy className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{d.projectCopyTip}</span>
                    </div>
                  )}
                </form>

                {/* Currency Selection */}
                <div className="flex justify-center items-center gap-2 mb-6">
                  <span className="text-xs text-slate-500 font-bold">{d.currencyLabel}:</span>
                  {['USD', 'ILS', 'CAD', 'EUR', 'GBP'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      aria-label={`${d.currencyLabel}: ${c}`}
                      className={'px-3 py-1 rounded-lg text-xs font-extrabold transition-colors ' + (
                        currency === c ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Main JGive CTA Button with Clipboard Copy on Click */}
                <a
                  href={getJGiveUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                  aria-label={getModalText('jgiveAria')}
                  onClick={handleProceedToJGive}
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-base sm:text-lg shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Heart className="w-5 h-5 fill-white animate-pulse" />
                  <span>{d.jgiveBtn}</span>
                  <ExternalLink className="w-4 h-4 text-rose-200" />
                </a>

                {/* Clipboard Paste Reminder */}
                <p className="text-[11px] text-slate-500 mt-2.5 font-medium max-w-md mx-auto">
                  {d.jgivePasteReminder}
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-500 pt-6 mt-6 border-t border-slate-200/80">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {d.badgeSec46}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {d.badge501c3}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {d.badgeProperManagement}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {d.badgeDigitalWallets}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* Direct Bank Wire Details */
            <div role="tabpanel" id="panel-bank" aria-labelledby="tab-bank" className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>{d.receiptNote}</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                
                {/* Account Name */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-200 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">{getBeneficiaryLabel(lang)}</span>
                  <strong className="text-slate-900 font-bold">{d.accountName}</strong>
                </div>

                {/* Bank and Branch */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-200 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">{getBankBranchLabel(lang)}</span>
                  <strong className="text-slate-900 font-bold">{d.bankName}, {d.branch}</strong>
                </div>

                {/* Account Number with Copy */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-200 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">{getAccountNumLabel(lang)}</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-mono text-base">{d.accountNum}</strong>
                    <button
                      onClick={() => handleCopy(d.accountNum, 'acc')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-wolfson-blue hover:bg-slate-200 transition-colors"
                      title={d.copyBtn}
                    >
                      {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* IBAN with Copy */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-200 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">IBAN:</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-mono text-xs sm:text-sm">{d.iban}</strong>
                    <button
                      onClick={() => handleCopy(d.iban.replace(/\s/g, ''), 'iban')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-wolfson-blue hover:bg-slate-200 transition-colors"
                      title={d.copyBtn}
                    >
                      {copiedField === 'iban' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Swift Code */}
                <div className="flex justify-between items-center py-2.5 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Swift (BIC):</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-mono font-bold">{d.swift}</strong>
                    <button
                      onClick={() => handleCopy(d.swift, 'swift')}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-wolfson-blue hover:bg-slate-200 transition-colors"
                      title={d.copyBtn}
                    >
                      {copiedField === 'swift' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <a
                  href="mailto:friends2@wmc.gov.il?subject=Donation%20Notice"
                  className="inline-flex items-center gap-2 text-xs font-bold text-wolfson-blue hover:underline"
                >
                  <span>friends2@wmc.gov.il</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
