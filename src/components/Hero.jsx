import React from "react";
import { Heart, ArrowRight, ArrowLeft, Play, ShieldCheck, Users, Activity, Building, Award } from "lucide-react";
import { NewsRoller } from "./NewsRoller.jsx";

export function Hero({ t, onOpenDonate, dir, lang }) {
  const isRtl = dir === "rtl";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-wolfson-navy text-white">
      {/* Background Aerial Photo with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-aerial.jpg"
          alt="Wolfson Medical Center Campus"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transform motion-safe:animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wolfson-navy via-wolfson-navy/90 to-wolfson-blue/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-wolfson-navy via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>{t.hero.badge}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.hero.taxBadge}</span>
          </div>
        </div>

        {/* Two-Column Hero Grid: Headline/CTAs + Square News Roller Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-12">
          
          {/* Main Pitch & CTAs Column */}
          <div className="lg:col-span-7 xl:col-span-7">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-6">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-xl text-slate-200 leading-relaxed mb-8 font-normal">
              {t.hero.subtitle}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onOpenDonate()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-900/30 hover:shadow-red-700/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>{t.hero.ctaDonate}</span>
              </button>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base backdrop-blur-md transition-all"
              >
                <span>{t.hero.ctaProjects}</span>
                <ArrowIcon className="w-4 h-4" />
              </a>

              <a
                href="#video"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white text-white ms-0.5" />
                </div>
                <span>{t.hero.ctaVideo}</span>
              </a>
            </div>
          </div>

          {/* Square News & Events Roller Frame in Top Corner */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <NewsRoller lang={lang} dir={dir} />
          </div>

        </div>

        {/* Dynamic Metric Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-sky-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.population}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.populationLabel}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Building className="w-5 h-5 text-amber-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.beds}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.bedsLabel}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.departments}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.departmentsLabel}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-1">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30" />
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.hero.stats.vulnerable}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {t.hero.stats.vulnerableLabel}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
