import React from "react";
import { CheckCircle2, Film, Heart, ExternalLink } from "lucide-react";

export function VideoShowcase({ t, onOpenDonate }) {
  const v = t.videoSection;

  return (
    <section id="video" className="py-28 md:py-36 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Film className="w-4 h-4" />
            <span>{v.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            {v.title}
          </h2>
          <p className="text-slate-300 text-base sm:text-xl leading-relaxed font-normal">
            {v.subtitle}
          </p>
        </div>

        {/* Video Player & Insights Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
          
          {/* Video Player Column (Responsive Embedded YouTube Player) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-black aspect-video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/Z1Z1xyqyyxw?rel=0&autoplay=0"
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 rounded-3xl"
              ></iframe>
            </div>

            <div className="flex items-center justify-between mt-4 text-xs sm:text-sm text-slate-300 px-2 font-medium">
              <span>{v.duration} • Edith Wolfson Medical Center</span>
              <a
                href="https://youtu.be/Z1Z1xyqyyxw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                <span>YouTube Link</span>
              </a>
            </div>
          </div>

          {/* Strategic Insights Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal">
                  {v.keyInsight1}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal">
                  {v.keyInsight2}
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal">
                  {v.keyInsight3}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenDonate({ id: "mobile-pet-ct", title: { he: "מערך PET-CT נייד", en: "Mobile PET-CT" } })}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-red-950/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
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

export default VideoShowcase;
