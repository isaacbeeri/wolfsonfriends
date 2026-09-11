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
            const percent = Math.min(100, Math.round((item.raised / item.goal) * 100));
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

                    {/* Funding Progress Bar Over Image */}
                    <div className="absolute bottom-3 inset-x-4 text-white">
                      <div className="flex justify-between items-end text-xs font-semibold mb-1">
                        <span>{percent}% {pText.raisedLabel}</span>
                        <span className="text-amber-300 font-bold">{formatCurrency(item.goal)}</span>
                      </div>
                      <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        ></div>
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
                    <span>{pText.raisedLabel}: <strong className="text-slate-800">{formatCurrency(item.raised)}</strong></span>
                    {item.annualOp && (
                      <span className="text-slate-400">+{formatCurrency(item.annualOp)}/yr</span>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenDonate(item)}
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
