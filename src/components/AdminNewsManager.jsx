import React, { useState, useEffect } from "react";
import { 
  X, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Check, 
  Download, 
  RotateCcw, 
  Image as ImageIcon, 
  ExternalLink,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getStoredNews, saveStoredNews, resetStoredNews } from "../data/newsData";

const DEFAULT_PIN = "wolfson2026";

const PRESET_IMAGES = [
  { label: "חץ צמיחה פיננסי", url: "/images/growth-arrow.jpg" },
  { label: "צוות רפואי וולפסון", url: "/images/medical-team.jpg" },
  { label: "חדר ניתוח מודרני", url: "/images/operating-theatre.jpg" },
  { label: "לובי ומבואת בית החולים", url: "/images/modern-lobby.jpg" },
  { label: "רופאה ומטופלת ילדים", url: "/images/doctor-pediatric.jpg" },
  { label: "צילום אווירי של הקמפוס", url: "/images/hero-aerial.jpg" },
  { label: "מפת מרכזי המצוינות", url: "/images/campus-labeled.jpg" }
];

export function AdminNewsManager({ isOpen, onClose, lang = "he" }) {
  if (!isOpen) return null;

  const isHe = lang === "he";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form State
  const [formCategory, setFormCategory] = useState("חדשות");
  const [formDate, setFormDate] = useState("2026");
  const [formTitle, setFormTitle] = useState("");
  const [formSnippet, setFormSnippet] = useState("");
  const [formImage, setFormImage] = useState("/images/growth-arrow.jpg");
  const [formLink, setFormLink] = useState("#projects");
  const [formLinkText, setFormLinkText] = useState("לפרטים נוספים");
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    setItems(getStoredNews());
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormCategory(isHe ? "חדשות" : "News");
    setFormDate("2026");
    setFormTitle("");
    setFormSnippet("");
    setFormImage("/images/growth-arrow.jpg");
    setFormLink("#projects");
    setFormLinkText(isHe ? "לפרטים נוספים" : "Read More");
    setFormActive(true);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    const getVal = (v) => typeof v === "object" ? (v[lang] || v.he || v.en || "") : (v || "");
    setFormCategory(getVal(item.category));
    setFormDate(getVal(item.date));
    setFormTitle(getVal(item.title));
    setFormSnippet(getVal(item.snippet));
    setFormImage(item.image || "/images/growth-arrow.jpg");
    setFormLink(item.link || "#");
    setFormLinkText(getVal(item.linkText));
    setFormActive(item.active !== false);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    let updatedList;
    if (editingId) {
      updatedList = items.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            active: formActive,
            category: { ...item.category, [lang]: formCategory, he: formCategory, en: formCategory },
            date: { ...item.date, [lang]: formDate, he: formDate, en: formDate },
            title: { ...item.title, [lang]: formTitle, he: formTitle, en: formTitle },
            snippet: { ...item.snippet, [lang]: formSnippet, he: formSnippet, en: formSnippet },
            image: formImage,
            link: formLink,
            linkText: { ...item.linkText, [lang]: formLinkText, he: formLinkText, en: formLinkText }
          };
        }
        return item;
      });
    } else {
      const newItem = {
        id: "news-" + Date.now(),
        active: formActive,
        category: { he: formCategory, en: formCategory, fr: formCategory, de: formCategory },
        date: { he: formDate, en: formDate, fr: formDate, de: formDate },
        title: { he: formTitle, en: formTitle, fr: formTitle, de: formTitle },
        snippet: { he: formSnippet, en: formSnippet, fr: formSnippet, de: formSnippet },
        image: formImage,
        link: formLink,
        linkText: { he: formLinkText, en: formLinkText, fr: formLinkText, de: formLinkText }
      };
      updatedList = [newItem, ...items];
    }

    setItems(updatedList);
    saveStoredNews(updatedList);
    resetForm();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDelete = (id) => {
    if (confirm(isHe ? "האם למחוק ידיעה זו?" : "Delete this news item?")) {
      const updated = items.filter(it => it.id !== id);
      setItems(updated);
      saveStoredNews(updated);
      if (editingId === id) resetForm();
    }
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
    saveStoredNews(newItems);
  };

  const handleResetDefaults = () => {
    if (confirm(isHe ? "לאפס את כל הידיעות לברירת המחדל המקורית?" : "Reset all news items to defaults?")) {
      const defaults = resetStoredNews();
      setItems(defaults);
      resetForm();
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "wolfson_news_backup.json";
    a.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">
                {isHe ? "ממשק ניהול עדכוני חדשות (Admin CMS)" : "News & Updates CMS"}
              </h3>
              <p className="text-xs text-slate-300">
                {isHe ? "שליטה בזמן אמת בתכנים המוצגים במסגרת החדשות בעמוד הבית" : "Live management of stories displayed on the homepage roller"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {!isAuthenticated ? (
            /* PIN Code Screen */
            <div className="max-w-md mx-auto py-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-wolfson-blue flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {isHe ? "אזור ניהול מורשה" : "Authorized Management Area"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isHe 
                  ? "הזן את קוד הגישה של עמותת הידידים כדי לערוך, להוסיף או להסיר עדכונים מהמסגרת החיה."
                  : "Enter the Friends Association PIN code to manage news updates."}
              </p>

              <form onSubmit={handleLogin} className="space-y-3 max-w-xs mx-auto">
                <input
                  type="password"
                  placeholder={isHe ? "הקש קוד גישה (wolfson2026)" : "Enter PIN (wolfson2026)"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-wolfson-blue"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{isHe ? "קוד גישה שגוי, נסה שנית" : "Incorrect PIN code"}</span>
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-wolfson-blue hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-all"
                >
                  {isHe ? "כניסה למערכת" : "Unlock Admin"}
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated CMS Dashboard */
            <div className="space-y-8">
              
              {/* Success Notification */}
              {showSuccessToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isHe ? "העדכון נשמר בהצלחה ופורסם מיד במסגרת החיה!" : "Update saved and live on homepage!"}</span>
                </div>
              )}

              {/* Form Section */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    {editingId ? <Edit3 className="w-4 h-4 text-sky-600" /> : <Plus className="w-4 h-4 text-emerald-600" />}
                    <span>{editingId ? (isHe ? "עריכת עדכון קיים" : "Edit Story") : (isHe ? "הוספת עדכון חדש למסגרת" : "Add New Update")}</span>
                  </h4>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs text-slate-500 hover:text-slate-900 underline"
                    >
                      {isHe ? "ביטול עריכה" : "Cancel Edit"}
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveForm} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "כותרת העדכון" : "Headline Title"} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder={isHe ? "לדוגמה: הישג פילנתרופי חסר תקדים..." : "e.g. Landmark Donation..."}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "קטגוריה / תגית" : "Category Tag"}
                      </label>
                      <input
                        type="text"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder={isHe ? "חדשות / הישג פילנתרופי / ציוד חדש" : "News / Milestone / Innovation"}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHe ? "תמצית התוכן (2-3 שורות קריאות)" : "Summary Snippet"}
                    </label>
                    <textarea
                      rows={2}
                      value={formSnippet}
                      onChange={(e) => setFormSnippet(e.target.value)}
                      placeholder={isHe ? "תיאור קצר וקולע של הידיעה או האירוע..." : "Short punchy summary..."}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "תאריך מוצג" : "Date Tag"}
                      </label>
                      <input
                        type="text"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        placeholder="ספטמבר 2026"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "קישור יעד" : "Destination Link"}
                      </label>
                      <input
                        type="text"
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        placeholder="#projects או https://..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white text-left font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "טקסט כפתור" : "Button Label"}
                      </label>
                      <input
                        type="text"
                        value={formLinkText}
                        onChange={(e) => setFormLinkText(e.target.value)}
                        placeholder={isHe ? "לפרטים נוספים" : "Read More"}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Image Selection & Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                      <span>{isHe ? "תמונת הרקע של העדכון" : "Background Image"}</span>
                    </label>

                    <div className="flex flex-wrap gap-2 items-center mb-2.5">
                      {PRESET_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormImage(img.url)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                            formImage === img.url
                              ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span>{img.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                      />
                      {formImage && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={formImage} 
                            alt="Preview" 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-300 shadow-xs" 
                          />
                          <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                            {formImage.startsWith("data:") ? "תמונה שהועלתה (Base64)" : formImage}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formActive}
                        onChange={(e) => setFormActive(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span>{isHe ? "ידיעה פעילה ומוצגת בעמוד הבית" : "Active & Live on Home Page"}</span>
                    </label>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingId ? (isHe ? "עדכן ידיעה" : "Update Story") : (isHe ? "פרסם למסגרת" : "Publish to Roller")}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Items Management List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">
                    {isHe ? `כל הידיעות במסגרת (${items.length})` : `All News Items (${items.length})`}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportJson}
                      title={isHe ? "הורד קובץ גיבוי של העדכונים" : "Export JSON"}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isHe ? "ייצוא JSON" : "Export"}</span>
                    </button>
                    <button
                      onClick={handleResetDefaults}
                      title={isHe ? "שחזר את הידיעות המקוריות של העמותה" : "Reset Defaults"}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isHe ? "איפוס לברירת מחדל" : "Reset"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, idx) => {
                    const getVal = (v) => typeof v === "object" ? (v[lang] || v.he || v.en || "") : (v || "");
                    const itTitle = getVal(item.title);
                    const itCat = getVal(item.category);
                    const itDate = getVal(item.date);

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl bg-white border flex items-center justify-between gap-4 transition-shadow ${
                          editingId === item.id 
                            ? "border-sky-500 ring-2 ring-sky-200 shadow-md" 
                            : "border-slate-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image || "/images/hero-aerial.jpg"}
                            alt={itTitle}
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {itCat}
                              </span>
                              {itDate && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {itDate}
                                </span>
                              )}
                              {item.active === false && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  {isHe ? "מוסתר" : "Draft"}
                                </span>
                              )}
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm truncate">
                              {itTitle}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleMove(idx, -1)}
                            disabled={idx === 0}
                            title={isHe ? "העבר למעלה" : "Move Up"}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 1)}
                            disabled={idx === items.length - 1}
                            title={isHe ? "העבר למטה" : "Move Down"}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(item)}
                            title={isHe ? "ערוך ידיעה" : "Edit"}
                            className="p-1.5 rounded-lg text-sky-600 hover:text-sky-800 hover:bg-sky-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title={isHe ? "מחק ידיעה" : "Delete"}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
