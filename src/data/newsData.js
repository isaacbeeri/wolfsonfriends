// Initial authentic news items for Friends of Wolfson Medical Center
export const defaultNewsItems = [
  {
    id: "news-1",
    active: true,
    category: {
      he: "הישג פילנתרופי",
      en: "Milestone",
      fr: "Succès Majeur",
      de: "Rekordjahr"
    },
    date: {
      he: "ספטמבר 2026",
      en: "Sept 2026",
      fr: "Sept 2026",
      de: "Sept 2026"
    },
    title: {
      he: "שנת שיא של צמיחה ועשייה בעמותת הידידים",
      en: "Record-Breaking Year of Philanthropic Growth",
      fr: "Année Record de Croissance et d'Engagement",
      de: "Rekordjahr für Philanthropie und Engagement"
    },
    snippet: {
      he: "גיוס של מעל 10 מיליון ש״ח וגידול של 42% בעודף השנתי לטובת רכש ציוד רפואי מציל חיים.",
      en: "Over 10M NIS raised and 42% surplus growth directly funding life-saving medical gear.",
      fr: "Plus de 10 millions de NIS collectés pour financer des équipements médicaux de pointe.",
      de: "Über 10 Mio. NIS an Spenden für lebensrettende medizinische Geräte gesichert."
    },
    image: "/images/growth-arrow.jpg",
    link: "#about",
    linkText: {
      he: "לצפייה בנתונים המלאים",
      en: "View Financial Highlights",
      fr: "Voir les Résultats",
      de: "Ergebnisse ansehen"
    }
  },
  {
    id: "news-2",
    active: true,
    category: {
      he: "קמפיין דגל",
      en: "Flagship Initiative",
      fr: "Projet Phare",
      de: "Leuchtturmprojekt"
    },
    date: {
      he: "2025–2026",
      en: "2025–2026",
      fr: "2025–2026",
      de: "2025–2026"
    },
    title: {
      he: "עמדת PET-CT ניידת ראשונה: מהפכת הדמיה בחולון ובת-ים",
      en: "Mobile PET-CT Campaign: Imaging Equity for 700K Residents",
      fr: "Campagne PET-CT Mobile : Révolution de l'Imagerie Médicale",
      de: "Mobiles PET-CT: Bildgebungs-Revolution für 700.000 Menschen"
    },
    snippet: {
      he: "מגשרים על הפער האונקולוגי: מאפשרים אבחון מוקדם ומדויק לחולי סרטן ללא זמני המתנה ממושכים.",
      en: "Bridging the oncology gap: enabling early and precise cancer scans without severe waiting times.",
      fr: "Combler la fracture oncologique : diagnostic précoce du cancer sans délais excessifs.",
      de: "Schließen der onkologischen Lücke: präzise Frühdiagnostik ohne monatelange Wartezeiten."
    },
    image: "/images/medical-team.jpg",
    link: "#projects",
    linkText: {
      he: "לתמיכה בפרויקט PET-CT",
      en: "Support the PET-CT Unit",
      fr: "Soutenir le Projet PET-CT",
      de: "PET-CT-Projekt unterstützen"
    }
  },
  {
    id: "news-3",
    active: true,
    category: {
      he: "ביטחון והיערכות",
      en: "Emergency Fortification",
      fr: "Sécurité & Urgence",
      de: "Notfallvorsorge"
    },
    date: {
      he: "היערכות שוטפת",
      en: "Ongoing",
      fr: "En Cours",
      de: "Laufend"
    },
    title: {
      he: "מיגון מתחמי חדרי ניתוח, נשים ויולדות לשעת חירום",
      en: "Fortifying Operating Rooms, Maternity & Pediatric Wards",
      fr: "Protection des Blocs Opératoires et Pavillons Maternité",
      de: "Bunkerschutz für Operationssäle, Geburts- & Kinderstationen"
    },
    snippet: {
      he: "שדרוג מרחבים תת-קרקעיים מוגני טילים להמשך פעילות רפואית רציפה תחת איומי חירום ולוחמה.",
      en: "Creating fortified, bomb-sheltered facilities for uninterrupted surgical and neonatal care during wartime.",
      fr: "Aménagement d'installations souterraines blindées pour des soins ininterrompus en temps de crise.",
      de: "Bau geschützter unterirdischer Stationen für eine unterbrechungsfreie Versorgung im Krisenfall."
    },
    image: "/images/operating-theatre.jpg",
    link: "#projects",
    linkText: {
      he: "לפרטי מתחמי המיגון",
      en: "Explore Fortification Plans",
      fr: "Détails des Abris",
      de: "Pläne einsehen"
    }
  },
  {
    id: "news-4",
    active: true,
    category: {
      he: "טכנולוגיית קצה",
      en: "Surgical Innovation",
      fr: "Chirurgie Robotique",
      de: "Roboterchirurgie"
    },
    date: {
      he: "יעד פיתוח",
      en: "Development Target",
      fr: "Objectif Clé",
      de: "Entwicklungsziel"
    },
    title: {
      he: "הצטיידות במערכות רובוטיות דה-וינצ'י לכירורגיה זעיר-פולשנית",
      en: "Acquiring Da Vinci Robotic Surgical Systems",
      fr: "Acquisition du Système Chirurgical Robotisé Da Vinci",
      de: "Beschaffung des Da-Vinci-Roboterchirurgiesystems"
    },
    snippet: {
      he: "הבאת דיוק כירורגי עולמי למטופלי וולפסון והפחתה דרמטית בזמני ההחלמה והאשפוז.",
      en: "Bringing world-class robotic precision to Wolfson patients with faster healing and reduced hospital stays.",
      fr: "Apporter la précision robotique aux patients de Wolfson pour un rétablissement accéléré.",
      de: "Präzisionschirurgie der Spitzenklasse für schnellere Heilung und kürzere Liegezeiten."
    },
    image: "/images/modern-lobby.jpg",
    link: "#disparity",
    linkText: {
      he: "לצפייה בפערי הציוד הרפואי",
      en: "View the Healthcare Gap",
      fr: "Voir les Disparités",
      de: "Versorgungslücke ansehen"
    }
  }
];

const STORAGE_KEY = "fwmc_news_items_v1";

export function getStoredNews() {
  if (typeof window === "undefined") return defaultNewsItems;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load news from localStorage:", err);
  }
  return defaultNewsItems;
}

export function saveStoredNews(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("fwmc_news_updated", { detail: items }));
  } catch (err) {
    console.error("Failed to save news to localStorage:", err);
  }
}

export function resetStoredNews() {
  if (typeof window === "undefined") return defaultNewsItems;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("fwmc_news_updated", { detail: defaultNewsItems }));
  } catch (err) {
    console.error("Failed to reset news in localStorage:", err);
  }
  return defaultNewsItems;
}
