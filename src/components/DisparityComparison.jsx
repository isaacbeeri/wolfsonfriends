import React from "react";
import { AlertCircle, Scale, Building, Sparkles, TrendingUp } from "lucide-react";

export function DisparityComparison({ t, dir }) {
  const d = t.disparity;
  const isRtl = dir === "rtl";

  const rows = [
    {
      ...d.row1,
      wPct: 23,
      sPct: 100,
      highlight: "critical"
    },
    {
      ...d.row2,
      wPct: 13,
      sPct: 100,
      highlight: "critical"
    },
    {
      ...d.row3,
      wPct: 0,
      sPct: 100,
      highlight: "urgent"
    },
    {
      ...d.row4,
      wPct: 58,
      sPct: 100,
      highlight: "volume"
    }
  ];

  return (
    <section id="disparity" className="py-24 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Soft background ambient glows */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
            <Scale className="w-4 h-4" />
            <span>{d.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
            {d.title}
          </h2>
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            {d.subtitle}
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/90 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700/80 backdrop-blur-xl">
            
            {/* Table Header Bar */}
            <div className="grid grid-cols-12 bg-slate-800/95 px-6 sm:px-8 py-5 border-b-2 border-slate-700 items-center text-xs sm:text-sm font-black tracking-wider uppercase">
              <div className="col-span-12 sm:col-span-4 text-slate-300 flex items-center gap-2 mb-2 sm:mb-0">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>{d.metric}</span>
              </div>
              <div className="col-span-6 sm:col-span-4 text-sky-300 bg-sky-950/60 px-3 py-2 rounded-xl border border-sky-500/30 flex items-center justify-between">
                <span className="font-extrabold text-white text-xs sm:text-sm">{d.wolfson}</span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              </div>
              <div className="col-span-6 sm:col-span-4 text-slate-200 px-3 py-2 rounded-xl bg-slate-800/60 flex items-center justify-between border border-slate-700">
                <span className="font-bold text-slate-200 text-xs sm:text-sm">{d.sheba}</span>
                <Building className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-800">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 px-6 sm:px-8 py-6 items-center hover:bg-white/[0.03] transition-colors gap-3 sm:gap-0"
                >
                  {/* Metric Name & Disparity Badge */}
                  <div className="col-span-12 sm:col-span-4 pe-2 sm:pe-6">
                    <h3 className="font-bold text-white text-base sm:text-lg tracking-tight mb-1.5">
                      {row.label}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{row.r}</span>
                    </div>
                  </div>

                  {/* Edith Wolfson Medical Center Column */}
                  <div className="col-span-6 sm:col-span-4 px-3 sm:px-5 py-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 sm:mx-1">
                    <span className="block text-[11px] font-bold text-sky-400 sm:hidden uppercase mb-1">
                      {d.wolfson}
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-sky-200 tracking-tight font-mono">
                      {row.w}
                    </div>
                  </div>

                  {/* Central Centers Column */}
                  <div className="col-span-6 sm:col-span-4 px-3 sm:px-5 py-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 sm:mx-1">
                    <span className="block text-[11px] font-bold text-slate-400 sm:hidden uppercase mb-1">
                      {d.sheba}
                    </span>
                    <div className="text-lg sm:text-2xl font-extrabold text-slate-100 tracking-tight font-mono">
                      {row.s}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Philanthropic Impact Callout */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-t-2 border-slate-700 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-lg">
                <AlertCircle className="w-7 h-7 text-amber-300" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                  {d.badge}
                </span>
                <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-semibold">
                  {d.callout}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
