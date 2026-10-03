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
  AlertCircle,
  Globe,
  Sparkles,
  Loader2,
  Languages
} from "lucide-react";
import { getStoredNews, saveStoredNews, resetStoredNews, compressImageFile } from "../data/newsData";
import { 
  SUPPORTED_LANGUAGES, 
  LANGUAGE_CONFIG, 
  translateText, 
  translateNewsBundle, 
  detectLanguage 
} from "../utils/translationService";

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

const createEmptyMultilingualField = (defaultVal = "") => {
  const obj = {};
  SUPPORTED_LANGUAGES.forEach(l => {
    obj[l] = defaultVal;
  });
  return obj;
};

const DEFAULT_CATEGORIES = {
  he: "חדשות",
  en: "News",
  fr: "Actualités",
  de: "Nachrichten",
  ar: "أخبار",
  ru: "Новости",
  es: "Noticias",
  ja: "最新ニュース",
  pt: "Notícias"
};

const DEFAULT_LINK_TEXT = {
  he: "לפרטים נוספים",
  en: "Learn More",
  fr: "En savoir plus",
  de: "Mehr erfahren",
  ar: "للمزيد من التفاصيل",
  ru: "Подробнее",
  es: "Más información",
  ja: "詳細を見る",
  pt: "Saiba mais"
};

export function AdminNewsManager({ isOpen, onClose, lang = "he" }) {
  if (!isOpen) return null;

  const isHe = lang === "he";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Translation states
  const [selectedFormLang, setSelectedFormLang] = useState("he");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [translationStatus, setTranslationStatus] = useState("");

  // Multilingual Form State
  const [formCategory, setFormCategory] = useState(() => ({ ...DEFAULT_CATEGORIES }));
  const [formDate, setFormDate] = useState(() => createEmptyMultilingualField("2026"));
  const [formTitle, setFormTitle] = useState(() => createEmptyMultilingualField(""));
  const [formSnippet, setFormSnippet] = useState(() => createEmptyMultilingualField(""));
  const [formLinkText, setFormLinkText] = useState(() => ({ ...DEFAULT_LINK_TEXT }));
  const [formImage, setFormImage] = useState("/images/growth-arrow.jpg");
  const [formLink, setFormLink] = useState("#projects");
  const [formActive, setFormActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState("");

  useEffect(() => {
    setItems(getStoredNews());
  }, []);

  // Strict anti-crawling meta tags while Admin News Manager is active
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow, noarchive, nosnippet';
    document.head.appendChild(metaRobots);

    const metaGoogle = document.createElement('meta');
    metaGoogle.name = 'googlebot';
    metaGoogle.content = 'noindex, nofollow';
    document.head.appendChild(metaGoogle);

    return () => {
      try {
        document.head.removeChild(metaRobots);
        document.head.removeChild(metaGoogle);
      } catch (e) {}
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (Date.now() < lockedUntil) {
      const remainingSec = Math.ceil((lockedUntil - Date.now()) / 1000);
      alert("הגישה נחסמה זמנית עקב ריבוי ניסיונות שגויים. נסה שוב בעוד " + remainingSec + " שניות.");
      return;
    }
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
      setFailCount(0);
    } else {
      setPinError(true);
      const newFails = failCount + 1;
      setFailCount(newFails);
      if (newFails >= 5) {
        setLockedUntil(Date.now() + 5 * 60 * 1000);
        alert("הגישה נחסמה ל-5 דקות עקב 5 ניסיונות שגויים רצופים.");
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFormLang("he");
    setFormCategory({ ...DEFAULT_CATEGORIES });
    setFormDate(createEmptyMultilingualField("2026"));
    setFormTitle(createEmptyMultilingualField(""));
    setFormSnippet(createEmptyMultilingualField(""));
    setFormLinkText({ ...DEFAULT_LINK_TEXT });
    setFormImage("/images/growth-arrow.jpg");
    setFormLink("#projects");
    setFormActive(true);
    setTranslationStatus("");
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setSelectedFormLang("he");
    setTranslationStatus("");

    const extractMultilingual = (val, defaults = {}) => {
      const res = {};
      SUPPORTED_LANGUAGES.forEach(l => {
        if (typeof val === "object" && val !== null) {
          res[l] = val[l] || val.he || val.en || defaults[l] || "";
        } else if (typeof val === "string") {
          res[l] = val;
        } else {
          res[l] = defaults[l] || "";
        }
      });
      return res;
    };

    setFormCategory(extractMultilingual(item.category, DEFAULT_CATEGORIES));
    setFormDate(extractMultilingual(item.date, createEmptyMultilingualField("2026")));
    setFormTitle(extractMultilingual(item.title));
    setFormSnippet(extractMultilingual(item.snippet));
    setFormLinkText(extractMultilingual(item.linkText, DEFAULT_LINK_TEXT));
    setFormImage(item.image || "/images/growth-arrow.jpg");
    setFormLink(item.link || "#projects");
    setFormActive(item.active !== false);
  };

  // Auto-translate current form into all 9 languages
  const handleAutoTranslateCurrent = async () => {
    const currentTitleVal = formTitle[selectedFormLang] || formTitle.he || formTitle.en || "";
    if (!currentTitleVal.trim()) {
      alert(isHe ? "נא להזין תחילה כותרת בשפה הנוכחית לפני תרגום." : "Please enter a title before translating.");
      return;
    }

    try {
      setIsTranslating(true);
      setTranslationStatus(isHe ? "מתרגם לכל 9 השפות הנתמכות..." : "Translating to all 9 supported languages...");

      const bundle = await translateNewsBundle({
        title: currentTitleVal,
        snippet: formSnippet[selectedFormLang] || formSnippet.he || formSnippet.en || "",
        category: formCategory[selectedFormLang] || formCategory.he || formCategory.en || DEFAULT_CATEGORIES[selectedFormLang],
        date: formDate[selectedFormLang] || formDate.he || formDate.en || "2026",
        linkText: formLinkText[selectedFormLang] || formLinkText.he || formLinkText.en || DEFAULT_LINK_TEXT[selectedFormLang]
      }, selectedFormLang);

      setFormTitle(prev => ({ ...prev, ...bundle.title }));
      setFormSnippet(prev => ({ ...prev, ...bundle.snippet }));
      setFormCategory(prev => ({ ...prev, ...bundle.category }));
      setFormDate(prev => ({ ...prev, ...bundle.date }));
      setFormLinkText(prev => ({ ...prev, ...bundle.linkText }));

      setTranslationStatus(isHe ? "✓ תורגם בהצלחה לכל 9 השפות!" : "✓ Successfully translated to all 9 languages!");
      setTimeout(() => setTranslationStatus(""), 4000);
    } catch (err) {
      console.error("Auto translation failed:", err);
      setTranslationStatus(isHe ? "שגיאה בביצוע התרגום האוטומטי" : "Translation error");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    const primaryTitle = formTitle[selectedFormLang] || formTitle.he || formTitle.en;
    if (!primaryTitle || !primaryTitle.trim()) {
      alert(isHe ? "יש להזין כותרת לידיעה" : "Title is required");
      return;
    }

    // Auto-fill any empty languages via automatic translation before save
    let finalTitle = { ...formTitle };
    let finalSnippet = { ...formSnippet };
    let finalCategory = { ...formCategory };
    let finalDate = { ...formDate };
    let finalLinkText = { ...formLinkText };

    const missingLangs = SUPPORTED_LANGUAGES.filter(l => !finalTitle[l] || !finalTitle[l].trim());

    if (missingLangs.length > 0) {
      try {
        setIsTranslating(true);
        const bundle = await translateNewsBundle({
          title: primaryTitle,
          snippet: formSnippet[selectedFormLang] || formSnippet.he || formSnippet.en || "",
          category: formCategory[selectedFormLang] || formCategory.he || formCategory.en || DEFAULT_CATEGORIES[selectedFormLang],
          date: formDate[selectedFormLang] || formDate.he || formDate.en || "2026",
          linkText: formLinkText[selectedFormLang] || formLinkText.he || formLinkText.en || DEFAULT_LINK_TEXT[selectedFormLang]
        }, selectedFormLang);

        finalTitle = { ...finalTitle, ...bundle.title };
        finalSnippet = { ...finalSnippet, ...bundle.snippet };
        finalCategory = { ...finalCategory, ...bundle.category };
        finalDate = { ...finalDate, ...bundle.date };
        finalLinkText = { ...finalLinkText, ...bundle.linkText };
      } catch (e) {
        // Fallback fill with primary
        missingLangs.forEach(l => {
          finalTitle[l] = finalTitle[l] || primaryTitle;
          finalSnippet[l] = finalSnippet[l] || formSnippet[selectedFormLang] || "";
          finalCategory[l] = finalCategory[l] || DEFAULT_CATEGORIES[l] || "News";
          finalDate[l] = finalDate[l] || "2026";
          finalLinkText[l] = finalLinkText[l] || DEFAULT_LINK_TEXT[l] || "Learn More";
        });
      } finally {
        setIsTranslating(false);
      }
    }

    let updatedList;
    if (editingId) {
      updatedList = items.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            active: formActive,
            category: finalCategory,
            date: finalDate,
            title: finalTitle,
            snippet: finalSnippet,
            image: formImage,
            link: formLink,
            linkText: finalLinkText
          };
        }
        return item;
      });
    } else {
      const newItem = {
        id: "news-" + Date.now(),
        active: formActive,
        category: finalCategory,
        date: finalDate,
        title: finalTitle,
        snippet: finalSnippet,
        image: formImage,
        link: formLink,
        linkText: finalLinkText
      };
      updatedList = [newItem, ...items];
    }

    setItems(updatedList);
    saveStoredNews(updatedList);
    resetForm();
    setToastMessage(isHe ? "העדכון נשמר ותורגם בהצלחה לכל השפות המוצגות באתר!" : "Update saved and translated to all site languages!");
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
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
    if (confirm(isHe ? "לאפס את כל הידיעות לברירת המחדל המקורית (כולל תרגומים לכל 9 השפות)?" : "Reset all news items to defaults (with all 9 languages)?")) {
      const defaults = resetStoredNews();
      setItems(defaults);
      resetForm();
    }
  };

  // Quick single-item auto-translate from list
  const handleTranslateSingleItem = async (itemId) => {
    const it = items.find(x => x.id === itemId);
    if (!it) return;

    try {
      setIsTranslating(true);
      const srcTitle = typeof it.title === "object" ? (it.title.he || it.title.en) : it.title;
      const srcSnippet = typeof it.snippet === "object" ? (it.snippet.he || it.snippet.en) : it.snippet;
      const srcCat = typeof it.category === "object" ? (it.category.he || it.category.en) : it.category;
      const srcDate = typeof it.date === "object" ? (it.date.he || it.date.en) : it.date;
      const srcLinkText = typeof it.linkText === "object" ? (it.linkText.he || it.linkText.en) : it.linkText;

      const srcLang = detectLanguage(srcTitle || srcSnippet || "");

      const bundle = await translateNewsBundle({
        title: srcTitle || "",
        snippet: srcSnippet || "",
        category: srcCat || "חדשות",
        date: srcDate || "2026",
        linkText: srcLinkText || "לפרטים נוספים"
      }, srcLang);

      const updated = items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            title: { ...(typeof item.title === "object" ? item.title : {}), ...bundle.title },
            snippet: { ...(typeof item.snippet === "object" ? item.snippet : {}), ...bundle.snippet },
            category: { ...(typeof item.category === "object" ? item.category : {}), ...bundle.category },
            date: { ...(typeof item.date === "object" ? item.date : {}), ...bundle.date },
            linkText: { ...(typeof item.linkText === "object" ? item.linkText : {}), ...bundle.linkText }
          };
        }
        return item;
      });

      setItems(updated);
      saveStoredNews(updated);
      setToastMessage(isHe ? "הידיעה תורגמה בהצלחה לכל 9 השפות!" : "Story translated to all 9 languages!");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (e) {
      alert(isHe ? "שגיאה בתרגום הידיעה" : "Failed to translate item");
    } finally {
      setIsTranslating(false);
    }
  };

  // Translate all items in storage
  const handleTranslateAllItems = async () => {
    if (!confirm(isHe ? "לתרגם את כל הידיעות הקיימות לכל 9 השפות הנתמכות באתר?" : "Translate all news items into all 9 supported languages?")) {
      return;
    }

    try {
      setIsTranslatingAll(true);
      const updatedList = [...items];

      for (let i = 0; i < updatedList.length; i++) {
        const it = updatedList[i];
        const srcTitle = typeof it.title === "object" ? (it.title.he || it.title.en) : it.title;
        const srcSnippet = typeof it.snippet === "object" ? (it.snippet.he || it.snippet.en) : it.snippet;
        const srcCat = typeof it.category === "object" ? (it.category.he || it.category.en) : it.category;
        const srcDate = typeof it.date === "object" ? (it.date.he || it.date.en) : it.date;
        const srcLinkText = typeof it.linkText === "object" ? (it.linkText.he || it.linkText.en) : it.linkText;

        const srcLang = detectLanguage(srcTitle || srcSnippet || "");

        const bundle = await translateNewsBundle({
          title: srcTitle || "",
          snippet: srcSnippet || "",
          category: srcCat || "חדשות",
          date: srcDate || "2026",
          linkText: srcLinkText || "לפרטים נוספים"
        }, srcLang);

        updatedList[i] = {
          ...it,
          title: { ...(typeof it.title === "object" ? it.title : {}), ...bundle.title },
          snippet: { ...(typeof it.snippet === "object" ? it.snippet : {}), ...bundle.snippet },
          category: { ...(typeof it.category === "object" ? itemCategorySafe(it) : {}), ...bundle.category },
          date: { ...(typeof it.date === "object" ? it.date : {}), ...bundle.date },
          linkText: { ...(typeof it.linkText === "object" ? it.linkText : {}), ...bundle.linkText }
        };
      }

      setItems(updatedList);
      saveStoredNews(updatedList);
      setToastMessage(isHe ? "כל הידיעות תורגמו בהצלחה לכל 9 השפות!" : "All items translated to all 9 languages!");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (err) {
      alert(isHe ? "שגיאה בתרגום הידיעות" : "Translation error");
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const itemCategorySafe = (it) => {
    return typeof it.category === "object" ? it.category : DEFAULT_CATEGORIES;
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "wolfson_news_multilingual_backup.json";
    a.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadNote(isHe ? "מעבד וממטב תמונה לגודל אופטימלי..." : "Optimizing image...");
      const compressed = await compressImageFile(file, 800, 800, 0.78);
      setFormImage(compressed);
      const kbSize = Math.round((compressed.length * 0.75) / 1024);
      setUploadNote(isHe ? `תמונה ממוטבת בהצלחה (${kbSize} KB)` : `Image optimized (${kbSize} KB)`);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert(isHe ? "שגיאה בטעינת התמונה." : "Failed to load image.");
      setUploadNote("");
    } finally {
      setIsUploading(false);
    }
  };

  // Helper to check language coverage of a news item
  const getLanguageCoverage = (item) => {
    if (!item.title || typeof item.title !== "object") return [];
    return SUPPORTED_LANGUAGES.filter(l => Boolean(item.title[l] && item.title[l].trim()));
  };

  const isFormLangRtl = LANGUAGE_CONFIG[selectedFormLang]?.dir === "rtl";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={isHe ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>{isHe ? "ניהול עדכוני חדשות במסגרת" : "Homepage News CMS"}</span>
                <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-300/30 flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  <span>9 שפות / 9 Languages</span>
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {isHe 
                  ? "הוספה, עריכה ותרגום אוטומטי של עדכונים חיים לכל השפות הנתמכות באתר" 
                  : "Add, edit, and auto-translate live updates across all 9 site languages"}
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {!isAuthenticated ? (
            /* PIN Code Screen */
            <div className="max-w-md mx-auto py-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-blue-900 flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
                <Lock className="w-8 h-8 text-sky-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {isHe ? "אזור ניהול מורשה" : "Authorized Management Area"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isHe 
                  ? "הזן את קוד הגישה של עמותת הידידים כדי לערוך, להוסיף או לתרגם עדכונים במסגרת החיה."
                  : "Enter the Friends Association PIN code to manage and translate news updates."}
              </p>

              <form onSubmit={handleLogin} className="space-y-3 max-w-xs mx-auto">
                <input
                  type="password"
                  placeholder={isHe ? "הקש קוד גישה (wolfson2026)" : "Enter PIN (wolfson2026)"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
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
                  className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
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
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Form Section */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
                
                {/* Form Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    {editingId ? <Edit3 className="w-5 h-5 text-sky-600" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                    <h4 className="font-bold text-slate-900 text-base">
                      {editingId ? (isHe ? "עריכת ידיעה קיימת" : "Edit Story") : (isHe ? "הוספת ידיעה חדשה למסגרת" : "Add New Update")}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* One-click Auto Translate Button */}
                    <button
                      type="button"
                      onClick={handleAutoTranslateCurrent}
                      disabled={isTranslating}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      title={isHe ? "תרגם אוטומטית לכל 9 השפות בלחיצה אחת" : "Auto-translate into all 9 languages"}
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{isHe ? "מתרגם..." : "Translating..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isHe ? "✨ תרגם לכל 9 השפות" : "✨ Auto-Translate All"}</span>
                        </>
                      )}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-slate-500 hover:text-slate-900 underline px-2 py-1"
                      >
                        {isHe ? "ביטול עריכה" : "Cancel Edit"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Translation Status Badge */}
                {translationStatus && (
                  <div className="mb-4 px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-600 animate-spin" />
                    <span>{translationStatus}</span>
                  </div>
                )}

                {/* LANGUAGE TABS */}
                <div className="mb-5">
                  <label className="block text-xs font-extrabold text-slate-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-sky-600" />
                      <span>{isHe ? "בחר שפה לעריכה ותצוגה מקדימה:" : "Select language to edit & preview:"}</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {isHe ? "ניתן להקליד בכל שפה וללחוץ 'תרגם לכל 9 השפות'" : "Edit any language or use auto-translate"}
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-inner">
                    {SUPPORTED_LANGUAGES.map((lCode) => {
                      const cfg = LANGUAGE_CONFIG[lCode];
                      const isSelected = selectedFormLang === lCode;
                      const hasText = Boolean(formTitle[lCode] && formTitle[lCode].trim());

                      return (
                        <button
                          key={lCode}
                          type="button"
                          onClick={() => setSelectedFormLang(lCode)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-sky-600 text-white shadow-md"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <span>{cfg.flag}</span>
                          <span>{cfg.name}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            hasText 
                              ? (isSelected ? "bg-emerald-300" : "bg-emerald-500") 
                              : (isSelected ? "bg-white/40" : "bg-slate-300")
                          }`} title={hasText ? "מתורגם" : "חסר"} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Fields for Selected Language */}
                <form onSubmit={handleSaveForm} className="space-y-4">
                  
                  {/* Language Context Banner */}
                  <div className="px-3 py-1.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
                    <span className="font-bold flex items-center gap-1.5">
                      <span>{LANGUAGE_CONFIG[selectedFormLang]?.flag}</span>
                      <span>{isHe ? `עורך כעת עבור: ${LANGUAGE_CONFIG[selectedFormLang]?.name}` : `Editing: ${LANGUAGE_CONFIG[selectedFormLang]?.name}`}</span>
                    </span>
                    <span className="text-[11px] text-sky-700 font-mono">
                      {isFormLangRtl ? "RTL Direction" : "LTR Direction"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "כותרת העדכון" : "Headline Title"} ({LANGUAGE_CONFIG[selectedFormLang]?.name}) *
                      </label>
                      <input
                        type="text"
                        required={selectedFormLang === "he"}
                        dir={isFormLangRtl ? "rtl" : "ltr"}
                        value={formTitle[selectedFormLang] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormTitle(prev => ({ ...prev, [selectedFormLang]: val }));
                        }}
                        placeholder={isHe ? "לדוגמה: מחזקים את החיבור בין רפואה, מחקר ואקדמיה..." : "e.g. Advancing Medical Innovation..."}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isHe ? "קטגוריה / תגית" : "Category Tag"} ({LANGUAGE_CONFIG[selectedFormLang]?.name})
                      </label>
                      <input
                        type="text"
                        dir={isFormLangRtl ? "rtl" : "ltr"}
                        value={formCategory[selectedFormLang] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormCategory(prev => ({ ...prev, [selectedFormLang]: val }));
                        }}
                        placeholder={DEFAULT_CATEGORIES[selectedFormLang] || "News"}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHe ? "תמצית התוכן (2-3 שורות קריאות)" : "Summary Snippet"} ({LANGUAGE_CONFIG[selectedFormLang]?.name})
                    </label>
                    <textarea
                      rows={2}
                      dir={isFormLangRtl ? "rtl" : "ltr"}
                      value={formSnippet[selectedFormLang] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormSnippet(prev => ({ ...prev, [selectedFormLang]: val }));
                      }}
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
                        value={formDate[selectedFormLang] || formDate.he || "2026"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormDate(prev => ({ ...prev, [selectedFormLang]: val }));
                        }}
                        placeholder="2026"
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
                        {isHe ? "טקסט כפתור" : "Button Label"} ({LANGUAGE_CONFIG[selectedFormLang]?.name})
                      </label>
                      <input
                        type="text"
                        dir={isFormLangRtl ? "rtl" : "ltr"}
                        value={formLinkText[selectedFormLang] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormLinkText(prev => ({ ...prev, [selectedFormLang]: val }));
                        }}
                        placeholder={DEFAULT_LINK_TEXT[selectedFormLang] || "Learn More"}
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
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 cursor-pointer ${
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
                            className="w-12 h-12 object-cover rounded-lg border border-slate-300 shadow-xs shrink-0" 
                          />
                          <div className="min-w-0">
                            <span className="block text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                              {formImage.startsWith("data:") ? "תמונה שהועלתה" : formImage}
                            </span>
                            {isUploading && (
                              <span className="block text-[11px] text-sky-600 font-bold animate-pulse">
                                {isHe ? "מעבד וממטב..." : "Optimizing..."}
                              </span>
                            )}
                            {uploadNote && !isUploading && (
                              <span className="block text-[11px] text-emerald-600 font-bold">
                                {uploadNote}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-200 gap-3">
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
                      disabled={isTranslating}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isHe ? "מתרגם ושומר..." : "Translating & Saving..."}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>{editingId ? (isHe ? "עדכן ושמור לכל השפות" : "Update Story") : (isHe ? "פרסם לכל 9 השפות" : "Publish to All Languages")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Items Management List */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>{isHe ? `כל הידיעות במסגרת (${items.length})` : `All News Items (${items.length})`}</span>
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Translate All Items Button */}
                    <button
                      onClick={handleTranslateAllItems}
                      disabled={isTranslatingAll}
                      title={isHe ? "תרגם את כל הידיעות הקיימות לכל 9 השפות" : "Translate all stories to 9 languages"}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isTranslatingAll ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      <span>{isHe ? "תרגם את כל הידיעות" : "Translate All"}</span>
                    </button>

                    <button
                      onClick={handleExportJson}
                      title={isHe ? "הורד קובץ גיבוי של העדכונים" : "Export JSON"}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isHe ? "ייצוא JSON" : "Export"}</span>
                    </button>
                    
                    <button
                      onClick={handleResetDefaults}
                      title={isHe ? "שחזר את הידיעות המקוריות של העמותה" : "Reset Defaults"}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isHe ? "איפוס לברירת מחדל" : "Reset"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pe-1">
                  {items.map((item, idx) => {
                    const getVal = (v) => typeof v === "object" ? (v[lang] || v.he || v.en || "") : (v || "");
                    const itTitle = getVal(item.title);
                    const itCat = getVal(item.category);
                    const itDate = getVal(item.date);
                    const coverage = getLanguageCoverage(item);
                    const isFullyCovered = coverage.length >= 9;

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
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                              {/* Language Coverage Pill */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isFullyCovered
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}>
                                <Languages className="w-2.5 h-2.5" />
                                <span>{coverage.length}/9 שפות</span>
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm truncate">
                              {itTitle}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Quick Translate Button if not 9 languages */}
                          <button
                            onClick={() => handleTranslateSingleItem(item.id)}
                            title={isHe ? "תרגם ידיעה זו לכל 9 השפות" : "Translate this item into 9 languages"}
                            className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleMove(idx, -1)}
                            disabled={idx === 0}
                            title={isHe ? "העבר למעלה" : "Move Up"}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 cursor-pointer"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 1)}
                            disabled={idx === items.length - 1}
                            title={isHe ? "העבר למטה" : "Move Down"}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 cursor-pointer"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(item)}
                            title={isHe ? "ערוך ידיעה" : "Edit"}
                            className="p-1.5 rounded-lg text-sky-600 hover:text-sky-800 hover:bg-sky-50 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title={isHe ? "מחק ידיעה" : "Delete"}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
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
