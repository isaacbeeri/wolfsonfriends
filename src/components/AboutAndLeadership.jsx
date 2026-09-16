import React from "react";
import { 
  HeartHandshake, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Download, 
  Users, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Scale 
} from "lucide-react";

export function AboutAndLeadership({ t, onOpenDonate, lang }) {
  const a = t.about;
  const isHe = lang === "he";

  const labels = {
    fiduciaryBadge: {
      he: "שקיפות ומופת ציבורי",
      en: "Fiduciary Integrity",
      fr: "Intégrité & Transparence",
      de: "Vorbildliche Transparenz",
      ar: "النزاهة والشفافية العامة",
      ru: "Прозрачность и ответственность",
      es: "Integridad Fiduciaria",
      ja: "財務の健全性と透明性",
      pt: "Integridade Fiduciária"
    },
    validUntil: {
      he: "בתוקף עד 31.12.2029",
      en: "Valid to 31.12.2029",
      fr: "Valide jusqu'au 31.12.2029",
      de: "Gültig bis 31.12.2029",
      ar: "ساري حتى 31.12.2029",
      ru: "Действительно до 31.12.2029",
      es: "Válido hasta 31.12.2029",
      ja: "有効期限：2029年12月31日",
      pt: "Válido até 31.12.2029"
    },
    leadershipBadge: {
      he: "מנהיגות ציבורית",
      en: "Civic Leadership",
      fr: "Leadership Civique",
      de: "Vorstand & Leitung",
      ar: "القيادة العامة",
      ru: "Руководство ассоциации",
      es: "Liderazgo Cívico",
      ja: "役員・リーダーシップ",
      pt: "Liderança Institucional"
    },
    chiefSignatory: {
      he: "בעל זכות חתימה ראשי",
      en: "Chief Authorized Signatory",
      fr: "Signataire Officiel Principal",
      de: "Hauptzeichnungsberechtigter",
      ar: "صاحب حق التوقيع الرئيسي",
      ru: "Главный уполномоченный с правом подписи",
      es: "Firmante Autorizado Principal",
      ja: "筆頭公認署名権者",
      pt: "Signatário Autorizado Principal"
    },
    executiveBadge: {
      he: "הנהלה ראשית",
      en: "Executive Leadership",
      fr: "Direction Générale",
      de: "Geschäftsführung",
      ar: "الإدارة التنفيذية",
      ru: "Исполнительное руководство",
      es: "Dirección Ejecutiva",
      ja: "事務局長・執行部",
      pt: "Direção Executiva"
    },
    ceoSubtext: {
      he: "ניהול אסטרטגי ופיתוח משאבים",
      en: "Strategic Operations & Philanthropy",
      fr: "Gestion Stratégique & Partenariats",
      de: "Strategische Leitung & Mittelbeschaffung",
      ar: "الإدارة الاستراتيجية وتنمية الموارد",
      ru: "Стратегическое управление и развитие фондов",
      es: "Gestión Estratégica y Recaudación de Fondos",
      ja: "戦略的運営およびフィランソロピー統括",
      pt: "Gestão Estratégica e Captação de Recursos"
    },
    financeBadge: {
      he: "כספים ומינהל",
      en: "Finance & Administration",
      fr: "Finances & Administration",
      de: "Finanzen & Verwaltung",
      ar: "المالية والإدارة",
      ru: "Финансы и управление",
      es: "Finanzas y Administración",
      ja: "財務・経理統括",
      pt: "Finanças e Administração"
    },
    bookkeeperSubtext: {
      he: "ניהול חשבונות וכספי העמותה",
      en: "Financial Controller & Reporting",
      fr: "Contrôle de Gestion & Comptabilité",
      de: "Rechnungswesen & Finanzberichterstattung",
      ar: "المحاسبة وإدارة أموال الجمعية",
      ru: "Бухгалтерский учет и финотчетность",
      es: "Control Financiero y Contabilidad",
      ja: "経理管理・財務報告",
      pt: "Controladoria e Gestão Contábil"
    },
    auditorFirmLink: {
      he: "אתר קדמי - אלחנתי",
      en: "Kedmi - Elhanati Firm",
      fr: "Cabinet Kedmi - Elhanati",
      de: "Kanzlei Kedmi - Elhanati",
      ar: "مكتب كيدمي - إلحناتي",
      ru: "Фирма Кедми — Эльханати",
      es: "Firma Kedmi - Elhanati",
      ja: "ケドミ・エルハナティ公認会計士事務所",
      pt: "Firma Kedmi - Elhanati"
    },
    cpaSubtext: {
      he: "רואי חשבון רשמיים של העמותה",
      en: "Official CPAs of the Friends Association",
      fr: "Experts-Comptables Officiels de l'Association",
      de: "Offizielle Wirtschaftsprüfer des Fördervereins",
      ar: "مدققو الحسابات القانونيون الرسميون للجمعية",
      ru: "Официальные аудиторы Общества друзей",
      es: "Auditores Contables Oficiales de la Asociación",
      ja: "友の会公認外部会計監査法人",
      pt: "Auditores Contábeis Oficiais da Associação"
    },
    legalFirmLink: {
      he: "אתר המשרד הרשמי",
      en: "Official Firm Website",
      fr: "Site Officiel du Cabinet",
      de: "Offizielle Kanzlei-Website",
      ar: "الموقع الرسمي للمكتب",
      ru: "Официальный сайт коллегии",
      es: "Sitio Web Oficial del Bufete",
      ja: "法律事務所公式サイト",
      pt: "Site Oficial do Escritório"
    }
  };

  const getL = (key) => (labels[key] && (labels[key][lang] || labels[key].en)) || '';

  // Board of directors with multilingual roles and tags
  const boardRoleDict = {
    treasurer: {
      role: {
        he: "חבר וועד מנהל, גזבר וחבר וועדת כספים",
        en: "Board Member, Treasurer & Finance Committee",
        fr: "Membre du Conseil, Trésorier & Comité des Finances",
        de: "Vorstandsmitglied, Schatzmeister & Finanzausschuss",
        ar: "عضو مجلس الإدارة وأمين الصندوق ولجنة المالية",
        ru: "Член правления, казначей и финкомитет",
        es: "Miembro de la Junta, Tesorero y Comité de Finanzas",
        ja: "理事・財務担当・財務委員会委員",
        pt: "Membro da Diretoria, Tesoureiro e Comitê Financeiro"
      },
      tag: {
        he: "גזבר", en: "Treasurer", fr: "Trésorier", de: "Schatzmeister", ar: "أمين الصندوق", ru: "Казначей", es: "Tesorero", ja: "財務担当", pt: "Tesoureiro"
      }
    },
    financeChair: {
      role: {
        he: "חבר וועד מנהל, יו״ר וועדת כספים (יו״ר בדימוס)",
        en: "Board Member, Chair of Finance Committee (Past Board Chair)",
        fr: "Membre du Conseil, Président du Comité des Finances (Ancien Président)",
        de: "Vorstandsmitglied, Vorsitzender des Finanzausschusses (Ehem. Vorsitzender)",
        ar: "عضو مجلس الإدارة، رئيس لجنة المالية (رئيس سابق)",
        ru: "Член правления, глава финкомитета (экс-председатель)",
        es: "Miembro de la Junta, Presidente de Finanzas (Expresidente)",
        ja: "理事・財務委員長（元理事長）",
        pt: "Membro da Diretoria, Presidente do Comitê Financeiro (Ex-presidente)"
      },
      tag: {
        he: "יו״ר כספים", en: "Finance Chair", fr: "Président Finances", de: "Finanzvorsitz", ar: "رئيس المالية", ru: "Финкомитет", es: "Presidente Finanzas", ja: "財務委員長", pt: "Presidente Finanças"
      }
    },
    legal: {
      role: {
        he: "חבר וועד מנהל ובעל זכות חתימה",
        en: "Board Member & Signatory",
        fr: "Membre du Conseil & Signataire",
        de: "Vorstandsmitglied & Zeichnungsberechtigter",
        ar: "عضو مجلس الإدارة وصاحب حق التوقيع",
        ru: "Член правления с правом подписи",
        es: "Miembro de la Junta y Firmante",
        ja: "理事・署名権者",
        pt: "Membro da Diretoria e Signatário"
      },
      tag: {
        he: "משפט", en: "Legal", fr: "Juridique", de: "Recht", ar: "قانوني", ru: "Юрист", es: "Jurídico", ja: "法務担当", pt: "Jurídico"
      }
    },
    finance: {
      role: {
        he: "חבר וועד מנהל וחבר וועדת כספים",
        en: "Board Member & Finance Committee",
        fr: "Membre du Conseil & Comité des Finances",
        de: "Vorstandsmitglied & Finanzausschuss",
        ar: "عضو مجلس الإدارة ولجنة المالية",
        ru: "Член правления и финкомитет",
        es: "Miembro de la Junta y Comité de Finanzas",
        ja: "理事・財務委員会委員",
        pt: "Membro da Diretoria e Comitê Financeiro"
      },
      tag: {
        he: "כספים", en: "Finance", fr: "Finances", de: "Finanzen", ar: "مالية", ru: "Финансы", es: "Finanzas", ja: "財務", pt: "Finanças"
      }
    },
    board: {
      role: {
        he: "חבר וועד מנהל",
        en: "Board Member",
        fr: "Membre du Conseil d'Administration",
        de: "Vorstandsmitglied",
        ar: "عضو مجلس الإدارة",
        ru: "Член исполнительного совета",
        es: "Miembro de la Junta Directiva",
        ja: "理事",
        pt: "Membro da Diretoria Executiva"
      },
      tag: {
        he: "הנהלה", en: "Board", fr: "Conseil", de: "Vorstand", ar: "عضو إدارة", ru: "Совет", es: "Junta", ja: "理事", pt: "Conselho"
      }
    }
  };

  const getBR = (type, field) => {
    const item = boardRoleDict[type];
    if (!item) return "";
    return item[field][lang] || item[field].en || "";
  };

  const boardMembersList = [
    {
      name: isHe ? "עמוס שלפמן (רו״ח)" : "Amos Shlafman, CPA",
      role: getBR("treasurer", "role"),
      tag: getBR("treasurer", "tag")
    },
    {
      name: isHe ? "שלמה רכט" : "Shlomo Recht",
      role: getBR("financeChair", "role"),
      tag: getBR("financeChair", "tag")
    },
    {
      name: isHe ? "עו״ד מאיר הולנדר" : "Adv. Meir Hollander",
      role: getBR("legal", "role"),
      tag: getBR("legal", "tag")
    },
    {
      name: isHe ? "נתן שרפמן" : "Nathan Sharfman",
      role: getBR("finance", "role"),
      tag: getBR("finance", "tag")
    },
    {
      name: isHe ? "יעקב הרן" : "Yaacov Haran",
      role: getBR("board", "role"),
      tag: getBR("board", "tag")
    },
    {
      name: isHe ? "אלי טרטנר" : "Eli Tratner",
      role: getBR("board", "role"),
      tag: getBR("board", "tag")
    },
    {
      name: isHe ? "גיטה גופר" : "Gita Goffer",
      role: getBR("board", "role"),
      tag: getBR("board", "tag")
    },
    {
      name: isHe ? "מוני אברהם" : "Moni Avraham",
      role: getBR("board", "role"),
      tag: getBR("board", "tag")
    }
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <HeartHandshake className="w-4 h-4 text-wolfson-blue" />
            <span>{a.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
            {a.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {a.lead}
          </p>
        </div>

        {/* Story & History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6 text-slate-700 leading-relaxed text-base">
            <p className="text-lg leading-relaxed text-slate-800 font-normal">
              {a.p1}
            </p>
            
            {/* Maimonides Inscribed Quote Box */}
            <div className="p-7 rounded-3xl bg-amber-50/80 border-s-4 border-amber-500 shadow-sm">
              <blockquote className="italic text-slate-900 font-serif text-xl sm:text-2xl leading-snug mb-3">
                {a.quote}
              </blockquote>
              <cite className="text-xs font-black text-amber-900 uppercase tracking-wider not-italic block">
                ✦ {a.quoteAuthor}
              </cite>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              {a.historyNote}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 relative group">
              <img
                src="/images/nurses-history-1957.jpg"
                alt="Wolfson Nursing History"
                className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-6 sm:p-8">
                <p className="text-xs sm:text-sm text-white font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{a.historyPhotoCaption}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Governance, Transparency & Official Tax Certificates */}
        <div id="transparency" className="mb-24">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 shadow-md">
            
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{getL('fiduciaryBadge')}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                {a.transparencyTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {a.transparencyLead}
              </p>
            </div>

            {/* Official Documents Cards Grid - Section 46 & Proper Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              
              {/* Card 1: Section 46 Certificate */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {getL('validUntil')}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-2">
                    {a.docSection46Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {a.docSection46Desc}
                  </p>
                </div>
                <a
                  href="/documents/section-46-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{a.docSection46Btn}</span>
                </a>
              </div>

              {/* Card 2: Proper Management Certificate */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      2025–2026
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-2">
                    {a.docNihulTakinTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {a.docNihulTakinDesc}
                  </p>
                </div>
                <a
                  href="https://www.guidestar.org.il/organization/580022507"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{a.docNihulTakinBtn}</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Leadership & Governance Section */}
        <div>
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5 text-wolfson-blue" />
              <span>{getL('leadershipBadge')}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {a.leadershipTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              {a.leadershipSub}
            </p>
          </div>

          {/* Top Row: Chairman & Executive Management */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            {/* Chairman Card */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between border-2 border-sky-500/30">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-extrabold uppercase tracking-wider">
                    {a.chairmanBadge}
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-2xl font-black mb-1.5 text-white tracking-tight">
                  {a.chairmanName}
                </h4>
                <p className="text-xs sm:text-sm text-sky-200 font-medium leading-relaxed">
                  {a.chairmanRole}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/10 text-[11px] text-slate-300 font-medium flex items-center justify-between">
                <span>{getL('chiefSignatory')}</span>
                <a
                  href="https://www.linkedin.com/in/thegib/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 hover:text-white transition-colors text-[11px] font-bold border border-sky-400/30"
                  title="Isaac Beeri | LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>

            {/* CEO / Executive Director Card */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    {getL('executiveBadge')}
                  </span>
                  <Briefcase className="w-5 h-5 text-wolfson-blue" />
                </div>
                <h4 className="text-2xl font-bold mb-1.5 text-slate-900 tracking-tight">
                  {a.ceoName}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {a.ceoRole}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                {getL('ceoSubtext')}
              </div>
            </div>

            {/* Finance & Administration Card */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    {getL('financeBadge')}
                  </span>
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-2xl font-bold mb-1.5 text-slate-900 tracking-tight">
                  {a.bookkeeperName}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {a.bookkeeperRole}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                {getL('bookkeeperSubtext')}
              </div>
            </div>

          </div>

          {/* Executive Board of Directors Grid */}
          <div className="mb-10">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-wolfson-blue" />
              <span>{a.boardTitle}</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boardMembersList.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between gap-3"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                      {m.name}
                    </h5>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">
                      {m.role}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 shrink-0">
                    {m.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Committee & CPA Office Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Association Auditor */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  {a.auditorTitle}
                </span>
                <h5 className="font-bold text-slate-900 text-base">
                  {a.auditorName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 mb-2.5">
                  {a.auditorRole}
                </p>
                <a
                  href={a.auditorLink || "https://kacpa.co.il/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span>{getL('auditorFirmLink')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CPA Accounting Firm */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                  {a.cpaTitle}
                </span>
                <h5 className="font-bold text-slate-900 text-base">
                  {a.cpaOfficeName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5">
                  {getL('cpaSubtext')}
                </p>
              </div>
            </div>

            {/* Legal Counsel - Goldfarb Gross Seligman */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                  {a.legalCounselTitle}
                </span>
                <h5 className="font-bold text-slate-900 text-base">
                  {a.legalCounselName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 mb-2.5">
                  {a.legalCounselRole}
                </p>
                <a
                  href={a.legalCounselLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  <span>{getL('legalFirmLink')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Honored Past Leadership & Association Members Bar */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              ✦ {a.honoredMembersTitle}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {a.honoredMembersDesc}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default AboutAndLeadership;
