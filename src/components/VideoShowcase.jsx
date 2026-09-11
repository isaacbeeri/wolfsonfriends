import React from "react";
import { Play, CheckCircle2, Film, Heart } from "lucide-react";

export function VideoShowcase({ t, onOpenDonate }) {
  const v = t.videoSection;

  return (
    <section id="video" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>{v.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {v.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {v.subtitle}
          </p>
        </div>

        {/* Video Player & Insights Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Video Player Column */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-black aspect-video group">
              <video
                controls
                className="w-full h-full object-cover"
                poster="/images/hero-aerial.jpg"
                preload="metadata"
              >
                <source src="/video/pet-ct-showcase.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="text-center mt-3 text-xs text-slate-400">
              {v.duration} • Edith Wolfson Medical Center
            </div>
          </div>

          {/* Strategic Insights Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200 leading-snug">
                  {v.keyInsight1}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200 leading-snug">
                  {v.keyInsight2}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-200 leading-snug">
                  {v.keyInsight3}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenDonate({ id: "mobile-pet-ct", title: { he: "מערך PET-CT נייד", en: "Mobile PET-CT" } })}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{v.supportProject}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
