import React from "react";
import { MapPin, Building2, Heart, ShieldAlert, FlaskConical, Stethoscope } from "lucide-react";

export function CampusMapSection({ t }) {
  const c = t.campus;

  const facilities = [
    { name: c.tower, icon: Building2, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { name: c.children, icon: Heart, color: "text-rose-600 bg-rose-50 border-rose-200" },
    { name: c.emergency, icon: ShieldAlert, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { name: c.labs, icon: FlaskConical, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { name: c.clinics, icon: Stethoscope, color: "text-sky-600 bg-sky-50 border-sky-200" }
  ];

  return (
    <section id="campus" className="py-28 md:py-36 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-xs">
            <MapPin className="w-4 h-4 text-wolfson-blue" />
            <span>{c.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {c.title}
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {c.subtitle}
          </p>
        </div>

        {/* Labeled Campus Photo Container - Enlarged */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200 mb-14 group">
          <div className="relative">
            <img
              src="/images/campus-labeled.jpg"
              alt="Wolfson Medical Center Campus Overview"
              className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-500"
            />
          </div>
        </div>

        {/* Key Facilities Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center gap-3 transition-all shadow-sm hover:shadow-md ${fac.color}`}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                  {fac.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
