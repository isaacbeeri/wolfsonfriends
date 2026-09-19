import React, { useState, useEffect } from "react";
import { translations } from "./data/translations/index.js";
import { detectSessionLanguage } from "./data/geoLang.js";
import { Navbar } from "./components/Navbar.jsx";
import { Hero } from "./components/Hero.jsx";
import { BrandPillars } from "./components/BrandPillars.jsx";
import { ProjectsSection } from "./components/ProjectsSection.jsx";
import { DisparityComparison } from "./components/DisparityComparison.jsx";
import { VideoShowcase } from "./components/VideoShowcase.jsx";
import { AboutAndLeadership } from "./components/AboutAndLeadership.jsx";
import { CampusMapSection } from "./components/CampusMapSection.jsx";
import { ContactSection } from "./components/ContactSection.jsx";
import { Footer } from "./components/Footer.jsx";
import { DonationModal } from "./components/DonationModal.jsx";
import { AdminNewsManager } from "./components/AdminNewsManager.jsx";
import { AccessibilityToolbar } from "./components/AccessibilityToolbar.jsx";
import { FaqPage } from "./components/FaqPage.jsx";

// Dynamic Code Segregation: Lazy-load AdminPortal so sensitive code and schemas
// are never shipped in the public client bundle or downloadable by search/AI crawlers.
const AdminPortal = React.lazy(() => 
  import("./components/admin/AdminPortal.jsx").then(m => ({ default: m.AdminPortal }))
);

export function App() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("fwmc_lang");
      if (saved && translations[saved]) return saved;
      if (typeof window !== "undefined" && window.location && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get("lang");
        if (urlLang && translations[urlLang]) return urlLang;
      }
    } catch (e) {}
    return "he";
  });

  useEffect(() => {
    let isMounted = true;
    detectSessionLanguage().then(detected => {
      if (isMounted && detected && detected.lang && translations[detected.lang]) {
        try {
          const saved = localStorage.getItem("fwmc_lang");
          if (saved && translations[saved]) return;
        } catch (e) {}
        setLang(detected.lang);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleSetLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("fwmc_lang", newLang);
    } catch (e) {}
  };
  const [currentView, setCurrentView] = useState("home"); // 'home' | 'faq'
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSecurePortalOpen, setIsSecurePortalOpen] = useState(false);

  const t = translations[lang] || translations.he;
  const dir = t.dir || "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret Admin Portal: Ctrl+Shift+L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "L" || e.key === "l" || e.key === "ך")) {
        e.preventDefault();
        setIsSecurePortalOpen(prev => !prev);
      }
      // News Manager: Ctrl+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a" || e.key === "ש")) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenFaq = () => {
    setCurrentView("faq");
    window.location.hash = "faq";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackHome = () => {
    setCurrentView("home");
    if (window.location.hash === "#faq") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (targetHash) => {
    if (targetHash === "#faq") {
      handleOpenFaq();
      return;
    }
    
    // Transition to home view
    setCurrentView("home");
    
    if (!targetHash || targetHash === "#") {
      if (window.location.hash) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }

    // Scroll to target element with brief delay to allow home DOM to mount if coming from FAQ
    setTimeout(() => {
      const targetId = targetHash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, currentView === "faq" ? 100 : 20);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#secure-portal" || hash === "#admin") {
        setIsSecurePortalOpen(true);
      } else if (hash === "#faq") {
        setCurrentView("faq");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setCurrentView("home");
        if (hash && hash !== "#" && hash !== "") {
          setTimeout(() => {
            const targetId = hash.replace("#", "");
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleCloseSecurePortal = () => {
    setIsSecurePortalOpen(false);
    if (window.location.hash === "#secure-portal" || window.location.hash === "#admin") {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  const handleOpenDonate = (project = null) => {
    setSelectedProject(project);
    setIsDonationOpen(true);
  };

  const handleCloseDonate = () => {
    setIsDonationOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${dir === "rtl" ? "font-hebrew" : ""}`} dir={dir}>
      {/* Skip to Main Content (WCAG 2.1 SC 2.4.1) */}
      <a 
        href="#main-content" 
        className="skip-link"
      >
        {lang === "he" ? "דלג לתוכן המרכזי" : (lang === "ar" ? "الانتقال إلى المحتوى الرئيسي" : (lang === "ru" ? "Перейти к основному контенту" : (lang === "es" ? "Saltar al contenido principal" : (lang === "ja" ? "メインコンテンツへスキップ" : (lang === "pt" ? "Pular para o conteúdo principal" : (lang === "fr" ? "Passer au contenu principal" : (lang === "de" ? "Zum Hauptinhalt springen" : "Skip to main content")))))))}
      </a>

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={handleSetLang}
        t={t}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenDonate={handleOpenDonate}
        onToggleAccessibility={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1} role="main" className="flex-1 focus:outline-none">
        {currentView === "faq" ? (
          <FaqPage
            lang={lang}
            t={t}
            onBackHome={handleBackHome}
            onOpenDonate={handleOpenDonate}
          />
        ) : (
          <>
            <Hero t={t} onOpenDonate={handleOpenDonate} dir={dir} lang={lang} />
            <BrandPillars t={t} lang={lang} />
            <ProjectsSection t={t} lang={lang} onOpenDonate={handleOpenDonate} />
            <DisparityComparison t={t} dir={dir} />
            <VideoShowcase t={t} onOpenDonate={handleOpenDonate} />
            <AboutAndLeadership t={t} onOpenDonate={handleOpenDonate} lang={lang} />
            <CampusMapSection t={t} />
            <ContactSection t={t} lang={lang} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        t={t}
        onOpenDonate={handleOpenDonate}
        setLang={handleSetLang}
        lang={lang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFaq={handleOpenFaq}
        onNavigate={handleNavigate}
      />

      {/* Interactive Modals */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={handleCloseDonate}
        defaultProject={selectedProject}
        t={t}
        lang={lang}
      />

      <AccessibilityToolbar
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        t={t}
      />

      <AdminNewsManager
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
      />

      {isSecurePortalOpen && (
        <React.Suspense fallback={null}>
          <AdminPortal
            isOpen={isSecurePortalOpen}
            onClose={handleCloseSecurePortal}
          />
        </React.Suspense>
      )}
    </div>
  );
}

export default App;
