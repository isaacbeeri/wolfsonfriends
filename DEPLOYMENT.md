# מדריך העלאה לאינטרנט: עמותת ידידי המרכז הרפואי וולפסון
## Deployment Guide: GitHub & Google Cloud Platform

מדריך זה מרכז את כל המידע וההנחיות להעלאת האתר לאוויר ב-**GitHub** (כולל GitHub Pages חינמי עם עדכונים אוטומטיים) וב-**Google Cloud** (כולל שרת Cloud Run מאובטח בישראל עם תעודת SSL).

---

## יעדי הפריסה שהוגדרו (Target Locations)
- **מאגר GitHub**: [https://github.com/isaacbeeri/wolfsonfriends](https://github.com/isaacbeeri/wolfsonfriends)
  - כתובת Git מרוחקת: `https://github.com/isaacbeeri/wolfsonfriends.git`
- **פרויקט Google Cloud**: [wolfsonfriends](https://console.cloud.google.com/welcome?project=wolfsonfriends)
  - מזהה פרויקט: `wolfsonfriends`
  - אזור שרת ראשי: `me-west1` (תל אביב, ישראל - זמני תגובה אפסיים)

---

## חלק א': העלאה ל-GitHub והפעלת GitHub Pages

האתר מוכן עם תהליך CI/CD אוטומטי מלא בקובץ `.github/workflows/deploy.yml`. בכל פעם שיועלה קוד לענף `main`, גיטהאב יבנה ויפרסם את האתר אוטומטית!

### 1. דחיפת הקוד למאגר (Git Push)
פתח מסוף (Terminal / PowerShell) בתיקיית הפרויקט והרץ:
```bash
git push -u origin main
```
*(במידה וזו הפעם הראשונה, ייתכן שייפתח חלון הזדהות מאובטח של GitHub בדפדפן - יש לאשר אותו).*

### 2. הפעלת GitHub Pages במאגר (חד-פעמי)
1. היכנס לעמוד המאגר ב-GitHub: [https://github.com/isaacbeeri/wolfsonfriends](https://github.com/isaacbeeri/wolfsonfriends)
2. לחץ על **Settings** (הלשונית העליונה הימנית).
3. בתפריט הצדדי משמאל לחץ על **Pages**.
4. תחת הסעיף **Build and deployment**:
   - בשדה **Source** בחר: **GitHub Actions** (במקום Deploy from a branch).
5. זה הכל! תהליך ה-Workflow ירוץ מיידית תוך כדקה.
6. כתובת האתר שלך תהיה זמינה בכתובת:
   👉 **`https://isaacbeeri.github.io/wolfsonfriends/`**

---

## חלק ב': פריסה ל-Google Cloud (Cloud Run)

בפרויקט הוגדרו `Dockerfile` מתקדם ושרת `nginx.conf` ממוטב במיוחד ל-SPA עם כותרות אבטחה ו-Gzip, וכן סקריפטי פריסה מוכנים.

### אפשרות 1: פריסה בקליק אחד (מומלץ)
- לחץ פעמיים על הקובץ: **`deploy-gcp.bat`**
- או הרץ ב-PowerShell:
  ```powershell
  .\deploy-gcp.ps1
  ```

### אפשרות 2: פקודת gcloud ידנית
```bash
gcloud run deploy fwmc-friends-site \
  --source . \
  --platform managed \
  --region me-west1 \
  --allow-unauthenticated \
  --project wolfsonfriends
```

### מה קורה בעת הפריסה?
1. Google Cloud Build בונה את הקונטיינר המאובטח בענן.
2. Google Cloud Run מפעיל את השרת באזור תל אביב (`me-west1`).
3. מוקצה לאתר קישור ציבורי מאובטח בחינם (למשל `https://fwmc-friends-site-xxxxx-lz.a.run.app`).
4. השרת מתרחב אוטומטית (Auto-scaling) ומאזן עומסים, ובעת היעדר תנועה לא צורך משאבים (עלות כמעט 0).

---

## חלק ג': חיבור דומיין אישי מותאם (Custom Domain)

במידה ותרצו לחבר דומיין רשמי (למשל `www.wolfsonfriends.org.il` או `friends-wolfson.org.il`):

### ב-Google Cloud Run:
1. היכנסו ל-Cloud Run בקונסולת Google Cloud בפרויקט `wolfsonfriends`.
2. לחצו על **Manage Custom Domains** (ניהול דומיינים מותאמים).
3. לחצו על **Add Mapping** (הוספת מיפוי) ובחרו בשירות `fwmc-friends-site`.
4. הזינו את שם הדומיין שלכם.
5. גוגל תספק לכם רשומות DNS (למשל CNAME ו-A Records) לעדכון אצל רשם הדומיינים שלכם (כגון איגוד האינטרנט / LiveDNS / Box וכו').
6. גוגל תנפיק אוטומטית תעודת **SSL חינמית** (HTTPS ירוק ומאובטח).

---

## בדיקת שרת מקומי (Local Development)
להרצת האתר מקומית במחשב:
```bash
npm run dev
```
האתר פועל בכתובת: `http://localhost:3000/`.
קיצור מקשים למערכת ניהול העדכונים (Admin): **`Ctrl + Shift + A`** (קוד גישה: `wolfson2026`).
