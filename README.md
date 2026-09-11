# עמותת ידידי המרכז הרפואי וולפסון
## Society of Friends of The Edith Wolfson Medical Center

[![React](https://img.shields.io/badge/React-19.x-61dafb.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38b2ac.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GitHub Actions CI/CD](https://img.shields.io/badge/GitHub_Actions-Pages_CI%2FCD-2088FF.svg?style=flat-square&logo=github-actions)](https://github.com/isaacbeeri/wolfsonfriends/actions)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud-Run-4285F4.svg?style=flat-square&logo=google-cloud)](https://cloud.google.com/run)

אתר אינטרנט רשמי, מודרני, רב-לשוני ונגיש עבור **עמותת ידידי המרכז הרפואי וולפסון** (חל"צ / עמותה רשומה מס' 580010899).
האתר מציג את חזון העמותה, הנהלתה, פרויקטי הדגל לרכישת ציוד מציל חיים (כגון ניידת PET-CT), מערכת תרומות אינטראקטיבית, גלגל חדשות ואירועים חי, ומערכת ניהול תוכן (CMS) ייעודית למנהלים.

---

## 🌟 תכונות מרכזיות (Core Features)

### 🌍 תמיכה רב-לשונית מלאה (Multi-Language & RTL/LTR)
- תמיכה מובנית ב-4 שפות: **עברית** (RTL), **אנגלית**, **צרפתית** ו**גרמנית** (LTR).
- החלפת שפה דינמית מיידית ללא צורך בריענון עמוד, עם התאמת כיווניות וריווחים מלאה.

### 💖 מערכת תרומות מקושרת JGive
- מודאל תרומות אינטראקטיבי הכולל בחירת פרויקט יעד לתרומה.
- **העתקה אוטומטית ללוח (Clipboard Sync)**: העתקת שם הפרויקט הנבחר כדי שהתורם יוכל להדביקו ישירות בהערות התרומה באתר JGive.
- פירוט מלא של הטבות מס לפי סעיף 46 בישראל, בארה"ב (501c3) ובמדינות נוספות.

### 📰 גלגל חדשות ואירועים (Live News & Events Roller)
- מסגרת ריבועית יוקרתית בפינת דף הבית (Glassmorphism & Ken Burns effect).
- תנועה אוטומטית חלקה (Carousel), סרגל התקדמות חי (Progress Bar), והשהיה במעבר עכבר (Pause on Hover).
- תגית פועמת "עדכונים חיים" ותמיכה מלאה בכל השפות.

### 🔐 מערכת ניהול תוכן למנהלים (Admin CMS)
- ממשק ייעודי מוגן בקוד גישה (PIN: `wolfson2026`).
- **גישה מהירה**: לחיצה על קיצור המקשים **`Ctrl + Shift + A`** מכל מקום באתר, או דרך כפתור "ניהול עדכונים" בפוטר.
- אפשרות להעלות תמונות (העלאת קובץ מקומי או בחירה ממאגר), לערוך כותרות ותכנים, לקבוע סדר הופעה (Move Up/Down), ולשנות סטטוס פעיל/טיוטה.
- סנכרון חי ועדכון מיידי של דף הבית.

### ♿ נגישות ברמה הגבוהה ביותר (Accessibility Toolbar)
- עמידה בתקני נגישות ישראליים ובינלאומיים (WCAG 2.1 AA).
- סרגל נגישות צף המאפשר שליטה בגודל טקסט, ניגודיות גבוהה (High Contrast), הדגשת קישורים, תצוגת מונוכרום, ופונט קריא.

### 📜 מסמכים רשמיים ושקיפות ציבורית
- קישורים ישירים לצפייה והורדה של תקנון העמותה, אישור ניהול תקין וסעיף 46, ונוהל קבלת תרומות.
- הצגת צוות ההנהלה, הוועד המנהל, רואי החשבון ומשרד עורכי הדין (גולדפרב גרוס זליגמן).

---

## 🛠️ טכנולוגיות (Tech Stack)

- **Frontend**: React 19, Tailwind CSS, Lucide Icons.
- **Build Tool**: Vite 5.
- **Deployment & Hosting**:
  - **GitHub Pages**: פריסה אוטומטית מלאה באמצעות GitHub Actions CI/CD.
  - **Google Cloud Run**: קונטיינר Docker מרובה-שלבים עם שרת Nginx אלפיני ממוטב ל-SPA, דחיסת Gzip וכותרות אבטחה.

---

## 🚀 הרצה מקומית (Local Development)

### דרישות מוקדמות:
- Node.js (גרסה 18 ומעלה)
- npm

### התקנה והרצה:
```bash
# 1. התקנת תלויות
npm install

# 2. הרצת שרת פיתוח מקומי
npm run dev
```
האתר ייפתח בכתובת: `http://localhost:3000/`.

### בנייה לייצור (Production Build):
```bash
npm run build
```
התוצרים יישמרו בתיקיית `dist/`.

---

## 🌐 פריסה לאינטרנט (Deployment)

### 1. GitHub Pages (אוטומטי)
מאגר הפרויקט: [https://github.com/isaacbeeri/wolfsonfriends](https://github.com/isaacbeeri/wolfsonfriends)

בכל דחיפת קוד לענף `main`, תהליך ה-GitHub Action המוגדר ב-`.github/workflows/deploy.yml` יבנה ויפרסם את האתר אוטומטית.
- כתובת האתר החי ב-Pages: **`https://isaacbeeri.github.io/wolfsonfriends/`**

### 2. Google Cloud Run
פרויקט Google Cloud: `wolfsonfriends` (אזור תל אביב `me-west1`).
- לפריסה מהירה בקליק אחד, הרץ את הקובץ:
  ```powershell
  .\deploy-gcp.ps1
  ```
  או לחץ פעמיים על: `deploy-gcp.bat`.

לפרטים נוספים ומדריך חיבור דומיין אישי מותאם, עיין בקובץ [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📄 רישיון וזכויות יוצרים
© כל הזכויות שמורות לעמותת ידידי המרכז הרפואי וולפסון (ע"ר).
