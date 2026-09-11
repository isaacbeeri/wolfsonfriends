import React, { useState, useEffect } from "react";
import { translations } from "./data/translations/index.js";
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

export function App() {
  const [lang, setLang] = useState("he");
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const t = translations[lang] || translations.he;
  const dir = t.dir || "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenDonate={handleOpenDonate}
        onToggleAccessibility={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero t={t} onOpenDonate={handleOpenDonate} dir={dir} lang={lang} />
        <BrandPillars t={t} />
        <ProjectsSection t={t} lang={lang} onOpenDonate={handleOpenDonate} />
        <DisparityComparison t={t} dir={dir} />
        <VideoShowcase t={t} onOpenDonate={handleOpenDonate} />
        <AboutAndLeadership t={t} onOpenDonate={handleOpenDonate} lang={lang} />
        <CampusMapSection t={t} />
        <ContactSection t={t} />
      </main>

      {/* Footer */}
      <Footer t={t} onOpenDonate={handleOpenDonate} setLang={setLang} lang={lang} onOpenAdmin={() => setIsAdminOpen(true)} />

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
    </div>
  );
}

export default App;
