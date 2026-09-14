import React, { useState, useEffect } from "react";
import { Globe, Heart, Menu, X, Eye, ChevronDown } from "lucide-react";

export function Navbar({ lang, setLang, t, onOpenDonate, onToggleAccessibility, onNavigate, currentView }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "he", label: "עברית", flag: "🇮🇱", dir: "rtl" },
    { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
    { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
    { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" }
  ];

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  const navLinks = [
    { href: "#projects", label: t.nav.projects },
    { href: "#disparity", label: t.nav.disparity },
    { href: "#video", label: t.nav.video },
    { href: "#about", label: t.nav.about },
    { href: "#campus", label: t.nav.map },
    { href: "#transparency", label: t.nav.transparency },
    { href: "#contact", label: t.nav.contact }
  ];

  const handleLinkClick = (e, href) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg py-2 border-b border-slate-200" 
        : "bg-white/95 backdrop-blur-md py-3 sm:py-3.5 border-b border-slate-100"
    }`}>
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
        
        {/* Single Large & Clear Logo in Top Corner */}
        <a 
          href="#" 
          onClick={(e) => handleLinkClick(e, "#")}
          className="flex items-center shrink-0 me-6 md:me-10 lg:me-14 xl:me-16 py-0.5 group" 
          aria-label="Home"
        >
          <img 
            src="/logos/logo-transparent.png" 
            alt="Friends of Edith Wolfson Medical Center" 
            className="h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-xs"
            loading="eager"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-6 text-xs xl:text-sm font-semibold text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="px-2.5 xl:px-3 py-1.5 rounded-xl text-slate-700 hover:text-wolfson-blue hover:bg-sky-50/80 transition-all duration-150 relative group whitespace-nowrap"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 inset-x-2 h-0.5 bg-wolfson-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full"></span>
            </a>
          ))}
        </nav>

        {/* Right Actions: Lang Switcher, Accessibility, Donate Button */}
        <div className="flex items-center gap-2 sm:gap-3 ms-4 lg:ms-8 xl:ms-12 shrink-0">
          
          {/* Accessibility Quick Toggle */}
          <button
            onClick={onToggleAccessibility}
            title={t.accessibility.menuTitle}
            className="p-2.5 rounded-xl text-slate-700 hover:text-wolfson-blue hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center shadow-xs"
            aria-label="Accessibility settings"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
              aria-expanded={langMenuOpen}
            >
              <Globe className="w-4 h-4 text-wolfson-blue" />
              <span>{currentLangObj.flag} {currentLangObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute top-full mt-2 end-0 w-44 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-start px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                      lang === l.code ? "bg-sky-50 text-wolfson-blue font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {lang === l.code && <span className="w-2 h-2 rounded-full bg-wolfson-blue"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* High-Converting Donate CTA Button */}
          <button
            onClick={() => onOpenDonate()}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
            <span>{t.nav.donate}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in">
          <nav className="flex flex-col space-y-1 font-semibold text-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, link.href);
                }}
                className="px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-base shadow-md"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{t.nav.donate}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
