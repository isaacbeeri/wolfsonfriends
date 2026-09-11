import React, { useState, useEffect } from "react";
import { Eye, X, ZoomIn, ZoomOut, Contrast, Type, Link, Pause, RotateCcw } from "lucide-react";

export function AccessibilityToolbar({ isOpen, onClose, t }) {
  const [textSize, setTextSize] = useState("normal"); // "normal" | "large" | "xlarge"
  const [contrast, setContrast] = useState("normal"); // "normal" | "high-contrast"
  const [monochrome, setMonochrome] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);

  const a = t.accessibility;

  useEffect(() => {
    const body = document.body;

    // Font size
    body.classList.remove("accessibility-large-text", "accessibility-xl-text");
    if (textSize === "large") body.classList.add("accessibility-large-text");
    if (textSize === "xlarge") body.classList.add("accessibility-xl-text");

    // Contrast
    if (contrast === "high-contrast") {
      body.classList.add("accessibility-high-contrast");
    } else {
      body.classList.remove("accessibility-high-contrast");
    }

    // Monochrome
    if (monochrome) {
      body.classList.add("accessibility-monochrome");
    } else {
      body.classList.remove("accessibility-monochrome");
    }

    // Readable font
    if (readableFont) {
      body.classList.add("accessibility-readable-font");
    } else {
      body.classList.remove("accessibility-readable-font");
    }

    // Highlight links
    if (highlightLinks) {
      body.classList.add("accessibility-highlight-links");
    } else {
      body.classList.remove("accessibility-highlight-links");
    }

    // Stop animations
    if (stopAnimations) {
      body.classList.add("accessibility-stop-animations");
    } else {
      body.classList.remove("accessibility-stop-animations");
    }
  }, [textSize, contrast, monochrome, readableFont, highlightLinks, stopAnimations]);

  const handleReset = () => {
    setTextSize("normal");
    setContrast("normal");
    setMonochrome(false);
    setReadableFont(false);
    setHighlightLinks(false);
    setStopAnimations(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 start-4 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-slate-300 p-5 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Eye className="w-4 h-4 text-wolfson-blue" />
          <span>{a.menuTitle}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Close accessibility menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs font-semibold text-slate-700">
        
        {/* Text Size */}
        <div>
          <span className="block mb-2 text-slate-500">{a.textSize}</span>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTextSize("normal")}
              className={`py-1.5 rounded-lg text-center ${textSize === "normal" ? "bg-white shadow text-slate-900 font-bold" : "text-slate-600"}`}
            >
              {a.normal}
            </button>
            <button
              onClick={() => setTextSize("large")}
              className={`py-1.5 rounded-lg text-center ${textSize === "large" ? "bg-white shadow text-slate-900 font-bold" : "text-slate-600"}`}
            >
              {a.large}
            </button>
            <button
              onClick={() => setTextSize("xlarge")}
              className={`py-1.5 rounded-lg text-center ${textSize === "xlarge" ? "bg-white shadow text-slate-900 font-bold" : "text-slate-600"}`}
            >
              {a.xlarge}
            </button>
          </div>
        </div>

        {/* Contrast & Colors */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setContrast(contrast === "normal" ? "high-contrast" : "normal")}
            className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
              contrast === "high-contrast" ? "bg-slate-900 text-yellow-300 border-slate-900" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <Contrast className="w-4 h-4" />
            <span className="text-[11px]">{a.highContrast}</span>
          </button>

          <button
            onClick={() => setMonochrome(!monochrome)}
            className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
              monochrome ? "bg-slate-700 text-white border-slate-700" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="text-[11px]">{a.monochrome}</span>
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-1.5">
          <button
            onClick={() => setReadableFont(!readableFont)}
            className={`w-full p-2 rounded-xl border text-start flex items-center justify-between transition-all ${
              readableFont ? "bg-sky-50 border-sky-300 text-sky-900" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span>{a.readableFont}</span>
            </div>
            <span className="text-[10px] uppercase font-bold">{readableFont ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => setHighlightLinks(!highlightLinks)}
            className={`w-full p-2 rounded-xl border text-start flex items-center justify-between transition-all ${
              highlightLinks ? "bg-amber-50 border-amber-300 text-amber-900" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              <span>{a.highlightLinks}</span>
            </div>
            <span className="text-[10px] uppercase font-bold">{highlightLinks ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={() => setStopAnimations(!stopAnimations)}
            className={`w-full p-2 rounded-xl border text-start flex items-center justify-between transition-all ${
              stopAnimations ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-slate-50 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              <span>{a.stopAnimations}</span>
            </div>
            <span className="text-[10px] uppercase font-bold">{stopAnimations ? "ON" : "OFF"}</span>
          </button>
        </div>

        {/* Reset Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="w-full py-2 rounded-xl text-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{a.reset}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
