import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, ExternalLink, ArrowRight, ArrowLeft, Radio, Sparkles, Pause, Play } from "lucide-react";
import { getStoredNews } from "../data/newsData";


  const liveTextMap = {
    he: "עדכונים שוטפים",
    ar: "تحديثات حية",
    ru: "Новости и события",
    es: "Actualizaciones en vivo",
    ja: "最新ニュース",
    pt: "Atualizações ao vivo",
    fr: "Actualités en direct",
    de: "Aktuelle Meldungen",
    en: "Live Updates"
  };

export function NewsRoller({ lang = "he", dir = "rtl", onOpenAdmin }) {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const isRtl = dir === "rtl";

  // Load news from storage & listen for live admin updates
  useEffect(() => {
    const loadItems = () => {
      const all = getStoredNews();
      const activeOnly = all.filter(item => item.active !== false);
      setItems(activeOnly.length > 0 ? activeOnly : all);
    };

    loadItems();

    const handleUpdate = () => loadItems();
    window.addEventListener("fwmc_news_updated", handleUpdate);
    return () => window.removeEventListener("fwmc_news_updated", handleUpdate);
  }, []);

  // Auto-play timer with progress bar
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const intervalTime = 6000; // 6 seconds per news item
    const stepTime = 60; // 60ms step
    const stepIncrement = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(idx => (idx + 1) % items.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [items.length, isPaused, currentIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex(idx => (idx + 1) % items.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex(idx => (idx - 1 + items.length) % items.length);
  };

  const handleJump = (index) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) return null;

  const current = items[currentIndex] || items[0];

  // Helper for localized fields
  const getField = (obj, fallback = "") => {
    if (!obj) return fallback;
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.he || obj.en || fallback;
  };

  const categoryText = getField(current.category, "חדשות");
  const dateText = getField(current.date, "2026");
  const titleText = getField(current.title, "עדכון חדשות");
  const snippetText = getField(current.snippet, "");
  const linkText = getField(current.linkText, isRtl ? "לפרטים המלאים" : "Read More");
  const linkUrl = current.link || "#";
  const isExternal = linkUrl.startsWith("http");

  return (
    <div 
      className="relative w-full max-w-[460px] sm:max-w-[500px] md:max-w-[540px] lg:max-w-[570px] xl:max-w-[600px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-950/80 backdrop-blur-xl group transition-all duration-300 hover:shadow-cyan-500/20 hover:border-white/40 flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Wolfson News & Updates Roller"
    >
      {/* Background Image with Ken-Burns animation & Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          key={current.id || currentIndex}
          src={current.image || "/images/hero-aerial.jpg"}
          alt={titleText}
          className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="eager"
        />
        {/* Multilayered high-contrast readability gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-transparent"></div>
      </div>

      {/* Top Header Bar: Live Badge, Timer Progress, Counter */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/85 text-white text-xs sm:text-sm font-bold border border-white/25 backdrop-blur-md shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="tracking-wide font-extrabold">
            {liveTextMap[lang] || liveTextMap.en}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 text-xs sm:text-sm font-mono text-slate-200">
          <span className="font-bold">{currentIndex + 1}</span>
          <span className="opacity-40">/</span>
          <span>{items.length}</span>
          {isPaused ? (
            <Pause className="w-4 h-4 text-amber-400 ms-1" />
          ) : (
            <Play className="w-4 h-4 text-emerald-400 ms-1" />
          )}
        </div>
      </div>

      {/* Top Countdown Progress Bar */}
      <div className="absolute top-0 inset-x-0 h-2 bg-white/10 z-20 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 via-rose-400 to-amber-400 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 p-6 sm:p-7 lg:p-8 space-y-4 flex-1 flex flex-col justify-end">
        
        {/* Category & Date Pill */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3.5 py-1 rounded-full bg-rose-600 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
            {categoryText}
          </span>
          {dateText && (
            <span className="text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/70 px-3 py-1 rounded-lg border border-white/15">
              {dateText}
            </span>
          )}
        </div>

        {/* Headline */}
        <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug tracking-tight drop-shadow-md line-clamp-2">
          {titleText}
        </h4>

        {/* Snippet */}
        {snippetText && (
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed line-clamp-2 lg:line-clamp-3 font-normal drop-shadow-xs">
            {snippetText}
          </p>
        )}

        {/* Bottom Bar: Action Link & Navigation Controls */}
        <div className="pt-2 flex items-center justify-between gap-4">
          
          <a
            href={linkUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md"
          >
            <span>{linkText}</span>
            {isExternal ? (
              <ExternalLink className="w-4 h-4" />
            ) : isRtl ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </a>

          {/* Controls: Prev, Next & Dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Previous update"
            >
              {isRtl ? <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Next update"
            >
              {isRtl ? <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>

        {/* Slide Indicators (Dots) */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleJump(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx 
                  ? "w-7 bg-rose-500 shadow-md" 
                  : "w-2.5 bg-white/35 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
}
