import React, { useState } from "react";
import { projects } from "../data/projects.js";
import { Heart, CheckCircle2, TrendingUp, Sparkles, Filter } from "lucide-react";

export function ProjectsSection({ t, lang, onOpenDonate }) {
  const [filter, setFilter] = useState("all");

  const statusPillMap = {
    he: 'פרויקט בתכנון וגיוס שותפים',
    ar: 'مشروع قيد التخطيط والشراكة',
    ru: 'Проект в стадии планирования',
    es: 'Proyecto en planificación y alianzas',
    ja: '計画・パートナーシップ募集中',
    pt: 'Projeto em planejamento e captação',
    fr: 'Projet en planification',
    de: 'Projekt in Planung',
    en: 'Proposed Strategic Initiative'
  };

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
    const localeMap = {
      he: 'he-IL',
      ar: 'ar-IL',
      ru: 'ru-RU',
      es: 'es-ES',
      ja: 'ja-JP',
      pt: 'pt-BR',
      fr: 'fr-FR',
      de: 'de-DE'
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US', {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section id="projects" className="py-28 md:py-36 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-wolfson-blue text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>{pText.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {pText.title}
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {pText.subtitle}
          </p>

          {/* Aspirations & Objectives Disclaimer Banner */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-sm sm:text-base leading-relaxed text-start flex items-start gap-3.5 shadow-sm">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-1 animate-pulse"></span>
            <div>
              <strong className="block font-bold mb-1 text-amber-950 text-base sm:text-lg">
                {lang === 'he' ? 'יעדי פיתוח ושאיפות אסטרטגיות בתכנון וגיוס' : 
                 (lang === 'ar' ? 'أهداف التطوير والتطلعات الاستراتيجية قيد التخطيط وجمع التبرعات' :
                 (lang === 'ru' ? 'Стратегические цели и направления развития в стадии планирования и сбора средств' :
                 (lang === 'es' ? 'Objetivos estratégicos y proyectos en fase de planificación y recaudación' :
                 (lang === 'ja' ? '計画および募金活動中の戦略的開発目標・重点ビジョン' :
                 (lang === 'pt' ? 'Objetivos estratégicos e projetos em fase de planejamento e captação' :
                 (lang === 'fr' ? 'Objectifs stratégiques & projets en phase de levée de fonds' : 
                 (lang === 'de' ? 'Strategische Entwicklungsziele in Planung & Mittelbeschaffung' : 
                 'Strategic Development Objectives & Proposed Campaigns')))))))}
              </strong>
              <span>
                {lang === 'he' 
                  ? 'הפרויקטים המוצגים להלן מהווים את חזון הדגל ויעדי הפיתוח הקריטיים של המרכז הרפואי וולפסון. העמותה מגייסת שותפויות פילנתרופיות מייסדות על מנת להביאם לכדי מימוש מלא.'
                  : (lang === 'ar'
                    ? 'تمثل المشاريع المعروضة أدناه الرؤية الريادية والأهداف الاستراتيجية الحيوية لمركز إديث فولفسون الطبي. تعمل الجمعية على تجنيد شراكات خيرية مؤسسة لتحقيقها على أرض الواقع بالكامل.'
                    : (lang === 'ru'
                      ? 'Представленные ниже проекты олицетворяют ключевое видение будущего и стратегические цели Медицинского центра Вольфсон. Общество друзей активно привлекает партнеров-основателей для их полного воплощения в жизнь.'
                      : (lang === 'es'
                        ? 'Los proyectos presentados a continuación representan la visión emblemática y las metas estratégicas de desarrollo del Centro Médico Wolfson. La Asociación busca socios filantrópicos fundadores para hacerlos realidad.'
                        : (lang === 'ja'
                          ? '以下に紹介するプロジェクトは、ウォルフソン医療センターの将来を拓く中核的な重点開発目標です。友の会はこれらを完全に実現するための共同設立パートナーを求めています。'
                          : (lang === 'pt'
                            ? 'Os projetos apresentados a seguir representam a visão prioritária e as metas estratégicas de desenvolvimento do Centro Médico Wolfson. A Associação busca parceiros filantrópicos fundadores para concretizá-los plenamente.'
                            : (lang === 'fr'
                              ? 'Les projets ci-dessous représentent la vision d\'avenir et les ambitions majeures du Centre Médical Wolfson. L\'Association recherche activement des partenaires fondateurs pour leur concrétisation.'
                              : (lang === 'de'
                                ? 'Die nachfolgenden Projekte verkörpern die strategischen Zukunftsziele des Wolfson Medical Centers. Die Fördergesellschaft wirbt um philanthropische Partnerschaften zu deren Verwirklichung.'
                                : 'The initiatives below represent the flagship vision and priority strategic objectives of Edith Wolfson Medical Center. The Friends Association is actively seeking founding philanthropic partners to bring them into full reality.'
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                }
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                  filter === btn.key
                    ? "bg-wolfson-blue text-white shadow-md shadow-blue-900/25"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredProjects.map((item) => {
            const itemTitle = item.title[lang] || item.title.en;
            const itemCategory = item.category[lang] || item.category.en;
            const itemSummary = item.summary[lang] || item.summary.en;
            const impactList = item.impactPoints[lang] || item.impactPoints.en;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image Banner - Enlarged */}
                  <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={itemTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                      <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 text-xs sm:text-sm font-bold shadow-md">
                        {itemCategory}
                      </span>
                      {item.urgent && (
                        <span className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-bold shadow-md animate-pulse">
                          {pText.urgentBadge}
                        </span>
                      )}
                    </div>

                    {/* Status & Funding Goal Badge Over Image */}
                    <div className="absolute bottom-4 inset-x-4 text-white">
                      <div className="flex justify-between items-center bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
                        <span className="text-xs sm:text-sm font-bold text-sky-300">
                          {pText.goalLabel}
                        </span>
                        <span className="text-amber-300 font-black text-base sm:text-lg">{formatCurrency(item.goal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-7 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-wolfson-blue transition-colors">
                      {itemTitle}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed mb-6 font-normal">
                      {itemSummary}
                    </p>

                    {/* Impact Points */}
                    <div className="space-y-3 mb-6">
                      {impactList.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="p-7 pt-0 border-t border-slate-100 mt-3">
                  <div className="flex items-center justify-between py-3.5 text-xs sm:text-sm text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      {statusPillMap[lang] || statusPillMap.en}
                    </span>
                    {item.annualOp && (
                      <span className="text-slate-400 font-mono text-xs sm:text-sm">+{formatCurrency(item.annualOp)}/yr</span>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenDonate(item)}
                    aria-label={`${pText.supportBtn}: ${itemTitle}`}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Heart className="w-5 h-5 fill-white" />
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
