import React from "react";
import { Heart, Cpu, Shield, Users, Sparkles, Scale, Building2 } from "lucide-react";

export function BrandPillars({ t }) {
  const p = t.pillars;

  const pillarsList = [
    {
      key: "care",
      title: p.care.title,
      desc: p.care.desc,
      color: "border-sky-400 text-sky-900 bg-sky-50/70 hover:border-sky-500",
      iconBg: "bg-gradient-to-b from-sky-400 to-sky-600",
      shape: "rounded-t-2xl",
      icon: (
        <svg className="w-6 h-6 fill-none stroke-white stroke-[2.5]" viewBox="0 0 24 24">
          <path d="M3 18C3 10.5 7.5 5 12 5C16.5 5 21 10.5 21 18" strokeLinecap="round" />
        </svg>
      ),
      tag: "Overarching Vision"
    },
    {
      key: "innovation",
      title: p.innovation.title,
      desc: p.innovation.desc,
      color: "border-blue-700 text-blue-950 bg-blue-50/70 hover:border-blue-800",
      iconBg: "bg-gradient-to-br from-blue-700 to-blue-900",
      shape: "rounded-xl",
      icon: <Cpu className="w-5 h-5 text-white" />,
      tag: "Blue Square"
    },
    {
      key: "infrastructure",
      title: p.infrastructure.title,
      desc: p.infrastructure.desc,
      color: "border-amber-400 text-amber-950 bg-amber-50/70 hover:border-amber-500",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
      shape: "rounded-xl",
      icon: <Building2 className="w-5 h-5 text-white" />,
      tag: "Yellow Triangle"
    },
    {
      key: "workforce",
      title: p.workforce.title,
      desc: p.workforce.desc,
      color: "border-red-400 text-red-950 bg-red-50/70 hover:border-red-500",
      iconBg: "bg-gradient-to-br from-red-600 to-rose-700",
      shape: "rounded-full",
      icon: <Heart className="w-5 h-5 fill-white text-white" />,
      tag: "Red Heart & Circle"
    },
    {
      key: "community",
      title: p.community.title,
      desc: p.community.desc,
      color: "border-emerald-500 text-emerald-950 bg-emerald-50/70 hover:border-emerald-600",
      iconBg: "bg-gradient-to-br from-emerald-600 to-teal-700",
      shape: "rounded-xl",
      icon: <Users className="w-5 h-5 text-white" />,
      tag: "Green Stripes"
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-wolfson-blue" />
            <span>{p.title}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {p.subtitle}
          </h2>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {pillarsList.map((item) => (
            <div
              key={item.key}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between ${item.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className={`w-12 h-12 ${item.shape} ${item.iconBg} text-white flex items-center justify-center shadow-md`}>
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 text-slate-700 shadow-xs border border-slate-200/50">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Banner with Authentic Team */}
        <div className="mt-14 rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl grid grid-cols-1 md:grid-cols-12 items-center border border-slate-800">
          <div className="md:col-span-5 relative h-72 md:h-full min-h-[280px]">
            <img
              src="/images/doctor-pediatric.jpg"
              alt="Wolfson Doctor with Child Patient"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/80 via-transparent to-transparent"></div>
          </div>
          <div className="md:col-span-7 p-7 sm:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold mb-4">
              <Heart className="w-3.5 h-3.5 fill-rose-300" />
              <span>{p.bannerBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 tracking-tight text-white leading-snug">
              {p.bannerTitle}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              {p.bannerDesc}
            </p>
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300/90">
              <span>✦</span>
              <span>{p.bannerQuote}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
