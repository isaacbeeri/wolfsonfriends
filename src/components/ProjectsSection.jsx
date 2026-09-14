import React, { useState } from "react";
import { projects } from "../data/projects.js";
import { Heart, CheckCircle2, TrendingUp, Sparkles, Filter } from "lucide-react";

export function ProjectsSection({ t, lang, onOpenDonate }) {
  const [filter, setFilter] = useState("all");
  const pText = t.projectsSection;

  const filteredProjects = projects.filter((item) => {
    if (filter === "all") return true;
    return item.pillar === filter;
  });

  const filterButtons = [
    { key: "all", label: pText.filterAll },
    { key: "innovation", label: pText.filterInnovation },
    { key: "infrastructure", label: pText.filterInfrastructure },
    { key: "care", label: pText.filterCare },
    { key: "workforce", label: pText.filterWorkforce }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(lang === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section id="projects" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-wolfson-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{pText.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {pText.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {pText.subtitle}
          </p>

          {/* Aspirations & Objectives Disclaimer Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed text-start flex items-start gap-3 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5 animate-pulse"></span>
            <div>
              <strong className="block font-bold mb-0.5 text-amber-950">
                {lang === 'he' ? 'יעדי פיתוח ושאיפות אסטרטגיות בתכנון וגיוס' : (lang === 'fr' ? 'Objectifs stratégiques & projets en phase de levée de fonds' : (lang === 'de' ? 'Strategische Entwicklungsziele in Planung & Mittelbeschaffung' : 'Strategic Development Objectives & Proposed Campaigns'))}
              </strong>
              <span>
                {lang === 'he' 
                  ? 'הפרויקטים המוצגים להלן מהווים את חזון הדגל ויעדי הפיתוח הקריטיים של המרכז הרפואי וולפסון. העמותה מגייסת שותפויות פילנתרופיות מייסדות על מנת להביאם לכדי מימוש מלא.'
                  : (lang === 'fr'
                    ? 'Les projets ci-dessous représentent la vision d\'avenir et les ambitions majeures du Centre Médical Wolfson. L\'Association recherche activement des partenaires fondateurs pour leur concrétisation.'
                    : (lang === 'de'
                      ? 'Die nachfolgenden Projekte verkörpern die strategischen Zukunftsziele des Wolfson Medical Centers. Die Fördergesellschaft wirbt um philanthropische Partnerschaften zu deren Verwirklichung.'
                      : 'The initiatives below represent the flagship vision and priority strategic objectives of Edith Wolfson Medical Center. The Friends Association is actively seeking founding philanthropic partners to bring them into full reality.'
                    )
                  )
                }
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  filter === btn.key
                    ? "bg-wolfson-blue text-white shadow-md shadow-blue-900/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((item) => {
            const itemTitle = item.title[lang] || item.title.en;
            const itemCategory = item.category[lang] || item.category.en;
            const itemSummary = item.summary[lang] || item.summary.en;
            const impactList = item.impactPoints[lang] || item.impactPoints.en;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={itemTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow">
                        {itemCategory}
                      </span>
                      {item.urgent && (
                        <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold shadow animate-pulse">
                          {pText.urgentBadge}
                        </span>
                      )}
                    </div>

                    {/* Status & Funding Goal Badge Over Image */}
                    <div className="absolute bottom-3 inset-x-4 text-white">
                      <div className="flex justify-between items-center bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                        <span className="text-[11px] font-bold text-sky-300">
                          {lang === 'he' ? 'יעד תקציבי נדרש' : (lang === 'fr' ? 'Objectif de Financement' : (lang === 'de' ? 'Finanzierungsziel' : 'Funding Target'))}
                        </span>
                        <span className="text-amber-300 font-black text-sm">{formatCurrency(item.goal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-wolfson-blue transition-colors">
                      {itemTitle}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {itemSummary}
                    </p>

                    {/* Impact Points */}
                    <div className="space-y-2 mb-6">
                      {impactList.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-2">
                  <div className="flex items-center justify-between py-3 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      {lang === 'he' ? 'פרויקט בתכנון וגיוס שותפים' : (lang === 'fr' ? 'Projet en planification' : (lang === 'de' ? 'Projekt in Planung' : 'Proposed Strategic Initiative'))}
                    </span>
                    {item.annualOp && (
                      <span className="text-slate-400 font-mono text-[11px]">+{formatCurrency(item.annualOp)}/yr</span>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenDonate(item)}
                    aria-label={`${pText.supportBtn}: ${itemTitle}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{pText.supportBtn}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
