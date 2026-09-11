import React from 'react';
import { Heart, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Zap, Download } from 'lucide-react';

export function Footer({ t, onOpenDonate, setLang, lang, onOpenAdmin }) {
  const f = t.footer;
  const isHe = lang === 'he';

  return (
    <footer className='bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Top Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12'>
          
          {/* Col 1: Brand & Mission with Enlarged Crisp Logo */}
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
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md transition-all'
              >
                <Heart className='w-3.5 h-3.5 fill-white' />
                <span>{t.nav.donate}</span>
              </button>

              <a
                href='https://www.jgive.com/new/en/usd/charity-organizations/4565/donate/amount'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold transition-colors'
              >
                <Zap className='w-3.5 h-3.5 text-rose-400' />
                <span>JGive Campaign</span>
                <ExternalLink className='w-3 h-3 ms-0.5' />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className='lg:col-span-3 space-y-3'>
            <h4 className='text-xs font-bold text-white uppercase tracking-wider'>
              {isHe ? 'קישורים מהירים' : 'Quick Navigation'}
            </h4>
            <ul className='space-y-2 text-xs text-slate-400 font-medium'>
              <li><a href='#projects' className='hover:text-white transition-colors'>{t.nav.projects}</a></li>
              <li><a href='#disparity' className='hover:text-white transition-colors'>{t.nav.disparity}</a></li>
              <li><a href='#video' className='hover:text-white transition-colors'>{t.nav.video}</a></li>
              <li><a href='#about' className='hover:text-white transition-colors'>{t.nav.about}</a></li>
              <li><a href='#transparency' className='hover:text-white transition-colors'>{t.nav.transparency}</a></li>
              <li><a href='#campus' className='hover:text-white transition-colors'>{t.nav.map}</a></li>
              <li><a href='#contact' className='hover:text-white transition-colors'>{t.nav.contact}</a></li>
            </ul>
          </div>

          {/* Col 3: Languages & Official Documents */}
          <div className='lg:col-span-2 space-y-3'>
            <h4 className='text-xs font-bold text-white uppercase tracking-wider'>
              {isHe ? 'שפות / Languages' : 'Languages'}
            </h4>
            <ul className='space-y-1.5 text-xs text-slate-400 font-medium'>
              <li><button onClick={() => setLang('he')} className='hover:text-sky-400 transition-colors'>🇮🇱 עברית</button></li>
              <li><button onClick={() => setLang('en')} className='hover:text-sky-400 transition-colors'>🇺🇸 English</button></li>
              <li><button onClick={() => setLang('fr')} className='hover:text-sky-400 transition-colors'>🇫🇷 Français</button></li>
              <li><button onClick={() => setLang('de')} className='hover:text-sky-400 transition-colors'>🇩🇪 Deutsch</button></li>
            </ul>

            <h4 className='text-xs font-bold text-white uppercase tracking-wider pt-3'>
              {isHe ? 'מסמכים רשמיים' : 'Documents'}
            </h4>
            <ul className='space-y-1 text-xs text-slate-400'>
              <li>
                <a href='/documents/section-46-certificate.pdf' target='_blank' rel='noopener noreferrer' className='hover:text-emerald-400 flex items-center gap-1'>
                  <Download className='w-3 h-3' />
                  <span>{isHe ? 'סעיף 46 (PDF)' : 'Section 46 (PDF)'}</span>
                </a>
              </li>
              <li>
                <a href='https://www.guidestar.org.il/organization/580022507' target='_blank' rel='noopener noreferrer' className='hover:text-sky-400 flex items-center gap-1'>
                  <ExternalLink className='w-3 h-3' />
                  <span>{isHe ? 'תקנון ורשם העמותות' : 'Bylaws & Registry'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Bank Wire Quick Info */}
          <div className='lg:col-span-3 space-y-3'>
            <h4 className='text-xs font-bold text-white uppercase tracking-wider'>
              {isHe ? 'פרטי חשבון בנק לתרומות' : 'Official Bank Transfer'}
            </h4>
            <div className='p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono'>
              <div>{isHe ? 'בנק הפועלים (12), סניף 638 (חולון)' : 'Bank Hapoalim (12), Branch 638'}</div>
              <div>{isHe ? 'מספר חשבון:' : 'Account:'} <strong>413968</strong></div>
              <div>IBAN: IL56 0126 3800 0000 0413 968</div>
              <div>SWIFT: POALILIT</div>
            </div>
            <div className='text-[11px] text-slate-400 leading-snug'>
              {isHe ? 'קבלה מוכרת לפי סעיף 46 ואישור ניהול תקין.' : 'Section 46 and proper management recognized.'}
            </div>
          </div>

        </div>

        {/* Bottom Legal & Tax Badges */}
        <div className='pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-2'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-center sm:text-start'>{f.rights}</p>
            <div className='flex items-center gap-2 text-emerald-400 text-[11px] font-medium'>
              <ShieldCheck className='w-4 h-4' />
              <span>{isHe ? 'סעיף 46 בתוקף עד 31.12.2026 | ניהול תקין | US 501(c)(3)' : 'Section 46 Valid to 31.12.2026 | Proper Management | US 501(c)(3)'}</span>
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
