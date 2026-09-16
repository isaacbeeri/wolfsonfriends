import React from 'react';
import { Heart, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Zap, Download, HelpCircle } from 'lucide-react';

export function Footer({ t, onOpenDonate, setLang, lang, onOpenAdmin, onOpenFaq, onNavigate }) {
  const f = t.footer;
  const isHe = lang === 'he';

  const footerDict = {
    faqTitles: {
      he: 'שאלות נפוצות (FAQ)',
      en: 'Frequently Asked Questions (FAQ)',
      fr: 'Foire Aux Questions (FAQ)',
      de: 'Häufig gestellte Fragen (FAQ)',
      ar: 'الأسئلة الشائعة (FAQ)',
      ru: 'Часто задаваемые вопросы (FAQ)',
      es: 'Preguntas Frecuentes (FAQ)',
      ja: 'よくある質問 (FAQ)',
      pt: 'Perguntas Frequentes (FAQ)'
    },
    quickNav: {
      he: 'קישורים מהירים',
      en: 'Quick Navigation',
      fr: 'Navigation Rapide',
      de: 'Schnellnavigation',
      ar: 'روابط سريعة',
      ru: 'Быстрая навигация',
      es: 'Navegación Rápida',
      ja: 'クイックナビゲーション',
      pt: 'Navegação Rápida'
    },
    languages: {
      he: 'שפות',
      en: 'Languages',
      fr: 'Langues',
      de: 'Sprachen',
      ar: 'اللغات',
      ru: 'Языки',
      es: 'Idiomas',
      ja: '言語',
      pt: 'Idiomas'
    },
    documents: {
      he: 'מסמכים רשמיים',
      en: 'Official Documents',
      fr: 'Documents Officiels',
      de: 'Offizielle Dokumente',
      ar: 'وثائق رسمية',
      ru: 'Официальные документы',
      es: 'Documentos Oficiales',
      ja: '公式文書',
      pt: 'Documentos Oficiais'
    },
    section46Pdf: {
      he: 'סעיף 46 (PDF)',
      en: 'Section 46 (PDF)',
      fr: 'Article 46 (PDF)',
      de: 'Abschnitt 46 (PDF)',
      ar: 'المادة 46 (PDF)',
      ru: 'Ст. 46 Налоговый вычет (PDF)',
      es: 'Artículo 46 (PDF)',
      ja: '第46条免税証明書 (PDF)',
      pt: 'Artigo 46 (PDF)'
    },
    bylawsRegistry: {
      he: 'תקנון ורשם העמותות',
      en: 'Bylaws & Registry',
      fr: 'Statuts & Registre',
      de: 'Satzung & Register',
      ar: 'اللائحة وسجل الجمعيات',
      ru: 'Устав и реестр НКО',
      es: 'Estatutos y Registro',
      ja: '定款・公認登録情報',
      pt: 'Estatuto e Registro'
    },
    bankWireTitle: {
      he: 'פרטי חשבון בנק לתרומות',
      en: 'Official Bank Wire Transfer',
      fr: 'Virement Bancaire Officiel',
      de: 'Offizielle Bankverbindung',
      ar: 'بيانات التحويل البنكي الرسمي',
      ru: 'Банковские реквизиты для переводов',
      es: 'Datos Bancarios para Transferencias',
      ja: '公式銀行振込先口座情報',
      pt: 'Dados Bancários Oficiais para Doações'
    },
    bankBranch: {
      he: 'בנק הפועלים (12), סניף 638 (חולון)',
      en: 'Bank Hapoalim (12), Branch 638 (Holon)',
      fr: 'Banque Hapoalim (12), Agence 638 (Holon)',
      de: 'Bank Hapoalim (12), Filiale 638 (Holon)',
      ar: 'بنك هبوعليم (12)، فرع 638 (حولون)',
      ru: 'Банк Хапоалим (12), отделение 638 (Холон)',
      es: 'Bank Hapoalim (12), Sucursal 638 (Holón)',
      ja: 'ハポアリム銀行 (12), 638支店 (ホロン)',
      pt: 'Banco Hapoalim (12), Agência 638 (Holon)'
    },
    accountLabel: {
      he: 'מספר חשבון:',
      en: 'Account:',
      fr: 'Numéro de compte :',
      de: 'Konto:',
      ar: 'رقم الحساب:',
      ru: 'Номер счета:',
      es: 'Cuenta:',
      ja: '口座番号:',
      pt: 'Conta:'
    },
    taxReceiptNote: {
      he: 'קבלה מוכרת לפי סעיף 46 ואישור ניהול תקין.',
      en: 'Section 46 tax receipt & Certificate of Proper Management.',
      fr: 'Reçu fiscal art. 46 et certificat de bonne gouvernance.',
      de: 'Spendenbescheinigung nach Art. 46 & Bestätigung ordnungsgemäßer Führung.',
      ar: 'إيصال ضريبي معترف به بموجب المادة 46 وشهادة إدارة سليمة.',
      ru: 'Квитанция с налоговым вычетом по Ст. 46 и сертификат надлежащего управления.',
      es: 'Recibo deducible según Art. 46 y certificado de gestión adecuada.',
      ja: '第46条税制優遇領収書および適正管理証明書発行。',
      pt: 'Recibo fiscal Art. 46 e certificado de gestão idônea.'
    },
    legalBadges: {
      he: 'סעיף 46 בתוקף עד 31.12.2029 | ניהול תקין | US 501(c)(3) דרך JGive',
      en: 'Section 46 Valid to 31.12.2029 | Proper Management | US 501(c)(3) via JGive',
      fr: 'Article 46 valable jusqu\'au 31.12.2029 | Bonne Gouvernance | US 501(c)(3) via JGive',
      de: 'Abschnitt 46 gültig bis 31.12.2029 | Ordnungsgemäße Führung | US 501(c)(3) über JGive',
      ar: 'المادة 46 سارية حتى 31.12.2029 | إدارة سليمة | US 501(c)(3) عبر JGive',
      ru: 'Ст. 46 до 31.12.2029 | Надлежащее управление | 501(c)(3) через JGive',
      es: 'Art. 46 vigente hasta 31.12.2029 | Gestión Correcta | 501(c)(3) vía JGive',
      ja: '第46条免税認可（2029年12月31日まで有効）| 適正管理認可 | 米国501(c)(3)対応（JGive経由）',
      pt: 'Art. 46 válido até 31.12.2029 | Gestão Idônea | US 501(c)(3) via JGive'
    }
  };

  const getF = (key) => (footerDict[key] && (footerDict[key][lang] || footerDict[key].en)) || '';

  const handleNavClick = (e, href) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <footer role="contentinfo" className='bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Top Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12'>
          
          {/* Col 1: Brand & Mission */}
          <div className='lg:col-span-4 space-y-4'>
            <div className='flex items-center gap-3'>
              <img
                src='/logos/logo-transparent.png'
                alt='Friends of Edith Wolfson'
                className='h-14 sm:h-16 w-auto bg-white/95 rounded-xl p-2 shadow-md object-contain'
              />
              <div>
                <span className='block font-extrabold text-sm sm:text-base text-white'>{t.brand.shortName}</span>
                <span className='block text-xs text-slate-400 font-medium'>
                  {isHe ? 'ע״ר 580022507' : 'Non-Profit #580022507'}
                </span>
              </div>
            </div>
            <p className='text-xs sm:text-sm text-slate-400 leading-relaxed font-normal'>
              {t.brand.tagline}
            </p>
            <div className='pt-2 flex flex-wrap gap-2'>
              <button
                onClick={() => onOpenDonate()}
                aria-label={t.nav.donate}
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md transition-all'
              >
                <Heart className='w-3.5 h-3.5 fill-white' />
                <span>{t.nav.donate}</span>
              </button>

              <a
                href='https://www.jgive.com/new/en/usd/charity-organizations/4565/donate/amount'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Donate via JGive campaign'
                className='inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold transition-colors'
              >
                <Zap className='w-3.5 h-3.5 text-rose-400' />
                <span>JGive Campaign</span>
                <ExternalLink className='w-3 h-3 ms-0.5' />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <nav 
            role="navigation" 
            aria-label={getF('quickNav')}
            className='lg:col-span-3 space-y-3'
          >
            <h4 className='text-xs font-bold text-white uppercase tracking-wider'>
              {getF('quickNav')}
            </h4>
            <ul className='space-y-2 text-xs text-slate-400 font-medium'>
              <li><a href='#projects' onClick={(e) => handleNavClick(e, '#projects')} className='hover:text-white transition-colors'>{t.nav.projects}</a></li>
              <li><a href='#disparity' onClick={(e) => handleNavClick(e, '#disparity')} className='hover:text-white transition-colors'>{t.nav.disparity}</a></li>
              <li><a href='#video' onClick={(e) => handleNavClick(e, '#video')} className='hover:text-white transition-colors'>{t.nav.video}</a></li>
              <li><a href='#about' onClick={(e) => handleNavClick(e, '#about')} className='hover:text-white transition-colors'>{t.nav.about}</a></li>
              <li><a href='#transparency' onClick={(e) => handleNavClick(e, '#transparency')} className='hover:text-white transition-colors'>{t.nav.transparency}</a></li>
              <li><a href='#campus' onClick={(e) => handleNavClick(e, '#campus')} className='hover:text-white transition-colors'>{t.nav.map}</a></li>
              <li><a href='#contact' onClick={(e) => handleNavClick(e, '#contact')} className='hover:text-white transition-colors'>{t.nav.contact}</a></li>
              <li>
                <a
                  href='#faq'
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenFaq) onOpenFaq();
                  }}
                  className='hover:text-sky-400 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors pt-0.5'
                >
                  <HelpCircle className='w-3.5 h-3.5 text-sky-400' />
                  <span>{getF('faqTitles')}</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Col 3: Languages & Official Documents */}
          <div className='lg:col-span-2 space-y-3'>
            <h4 className='text-xs font-bold text-white uppercase tracking-wider'>
              {getF('languages')}
            </h4>
            <nav role="navigation" aria-label={getF('languages')}>
              <ul className='space-y-1.5 text-xs text-slate-400 font-medium'>
                <li><button onClick={() => setLang('he')} className='hover:text-sky-400 transition-colors'>🇮🇱 עברית</button></li>
                <li><button onClick={() => setLang('en')} className='hover:text-sky-400 transition-colors'>🇺🇸 English</button></li>
                <li><button onClick={() => setLang('fr')} className='hover:text-sky-400 transition-colors'>🇫🇷 Français</button></li>
                <li><button onClick={() => setLang('de')} className='hover:text-sky-400 transition-colors'>🇩🇪 Deutsch</button></li>
                <li><button onClick={() => setLang('ar')} className='hover:text-sky-400 transition-colors'>🇸🇦 العربية</button></li>
                <li><button onClick={() => setLang('ru')} className='hover:text-sky-400 transition-colors'>🇷🇺 Русский</button></li>
                <li><button onClick={() => setLang('es')} className='hover:text-sky-400 transition-colors'>🇪🇸 Español</button></li>
                <li><button onClick={() => setLang('ja')} className='hover:text-sky-400 transition-colors'>🇯🇵 日本語</button></li>
                <li><button onClick={() => setLang('pt')} className='hover:text-sky-400 transition-colors'>🇧🇷 Português</button></li>
              </ul>
            </nav>

            <h4 className='text-xs font-bold text-white uppercase tracking-wider pt-3'>
              {getF('documents')}
            </h4>
            <ul className='space-y-1 text-xs text-slate-400'>
              <li>
                <a href='/documents/section-46-certificate.pdf' target='_blank' rel='noopener noreferrer' className='hover:text-emerald-400 flex items-center gap-1'>
                  <Download className='w-3 h-3' />
                  <span>{getF('section46Pdf')}</span>
                </a>
              </li>
              <li>
                <a href='https://www.guidestar.org.il/organization/580022507' target='_blank' rel='noopener noreferrer' className='hover:text-sky-400 flex items-center gap-1'>
                  <ExternalLink className='w-3 h-3' />
                  <span>{getF('bylawsRegistry')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Bank Wire Quick Info */}
          <div className='lg:col-span-3 space-y-3'>
            <h4 className='text-xs font-bold text-white uppercase tracking-wider'>
              {getF('bankWireTitle')}
            </h4>
            <div className='p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono'>
              <div>{getF('bankBranch')}</div>
              <div>{getF('accountLabel')} <strong>413968</strong></div>
              <div>IBAN: IL56 0126 3800 0000 0413 968</div>
              <div>SWIFT: POALILIT</div>
            </div>
            <div className='text-[11px] text-slate-400 leading-snug'>
              {getF('taxReceiptNote')}
            </div>
          </div>

        </div>

        {/* Bottom Legal & Tax Badges */}
        <div className='pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-2'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-center sm:text-start'>{f.rights}</p>
            <div className='flex items-center gap-2 text-emerald-400 text-[11px] font-medium'>
              <ShieldCheck className='w-4 h-4' />
              <span>{getF('legalBadges')}</span>
            </div>
          </div>
          <p className='text-slate-600 text-[11px] leading-relaxed'>
            {f.taxNotice} {f.usNotice}
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
