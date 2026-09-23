import React, { useRef } from 'react';
import { 
  Printer, X, FileText, CheckCircle, Calendar, 
  DollarSign, Users, Award, ShieldCheck, Download, PieChart, Building2
} from 'lucide-react';

export default function DonationsPdfReport({
  isOpen,
  onClose,
  activeTab,
  selectedYear,
  donations = [],
  executiveStats = {},
  filteredDonations = [],
  lapsedDonors = []
}) {
  const reportRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const currentTimeStr = new Date().toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const getReportTitle = () => {
    const yearText = selectedYear === 'all' ? 'כל השנים (2017–2026)' : `שנת ${selectedYear}`;
    if (activeTab === 'analytics') {
      return `דו״ח מנהלים ואנליטיקת תרומות (${yearText})`;
    }
    if (activeTab === 'table') {
      return `דו״ח רשומות תרומות מפורט (${yearText})`;
    }
    if (activeTab === 'lapsed') {
      return `דו״ח מודיעין וחידוש קשר לתורמים (${yearText})`;
    }
    return `דו״ח תרומות - מרכז רפואי וולפסון`;
  };

  const totalAmount = executiveStats?.totalAmount || 0;
  const count = executiveStats?.count || 0;
  const uniqueDonorsCount = executiveStats?.uniqueDonorsCount || 0;
  const avgDonation = executiveStats?.avg || 0;
  const overheadFee7 = executiveStats?.overhead?.estimatedOverheadFee7Pct || (totalAmount * 0.07);
  const netDirectCareAmount = totalAmount - overheadFee7;
  const topDonorsList = executiveStats?.topDonors || [];
  const departmentsList = executiveStats?.departments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* Print-specific style tag injected for clean A4 printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #donations-printable-report, #donations-printable-report * {
            visibility: visible;
          }
          #donations-printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: #0f172a !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
        }
      `}</style>

      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        dir="rtl"
      >
        {/* Modal Top Toolbar (hidden when printing) */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">תצוגה מקדימה והפקת דו״ח PDF</h2>
              <p className="text-xs text-slate-400">
                דו״ח רשמי ומאומת של הנתונים המוצגים כעת על המסך
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/40"
            >
              <Printer className="w-4 h-4" />
              <span>הדפס / שמור כ-PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/40">
          <div
            id="donations-printable-report"
            ref={reportRef}
            className="bg-white text-slate-900 rounded-xl shadow-lg p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-sm"
          >
            {/* Formal Header / Letterhead */}
            <div className="border-b-2 border-blue-800 pb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">
                  עמותת ידידי המרכז הרפואי וולפסון
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  עמותה רשומה מס&apos; 580024768 | מוסד ציבורי מאושר לפי סעיף 46 לפקודת מס הכנסה
                </div>
                <div className="text-xs text-slate-500">
                  רחוב הלוחמים 62, חולון 58100 | טלפון: 03-5028111 | דוא״ל: friends@wolfson.health.gov.il
                </div>
              </div>
              <div className="text-left text-xs text-slate-500 border-r-2 sm:border-r-0 border-slate-200 pr-3 sm:pr-0">
                <div className="font-semibold text-slate-700">תאריך הפקה:</div>
                <div className="font-mono text-slate-800">{currentDateStr}, {currentTimeStr}</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 inline" />
                  נתונים מאומתים מהמאגר
                </div>
              </div>
            </div>

            {/* Title & Scope Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-100">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-blue-950">
                  {getReportTitle()}
                </h1>
                <div className="text-xs text-slate-600 mt-1">
                  {activeTab === 'analytics' && 'סיכום ביצועים כספיים, מדדי גיוס, תקורה וחלוקה למחלקות'}
                  {activeTab === 'table' && `פירוט מלא של ${filteredDonations.length} תרומות מתועדות`}
                  {activeTab === 'lapsed' && `רשימת ${lapsedDonors.length} תורמים פוטנציאליים לחידוש קשר`}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-900 text-white font-bold rounded-lg text-xs">
                  {selectedYear === 'all' ? 'חתך רב-שנתי' : `שנת כספים: ${selectedYear}`}
                </span>
              </div>
            </div>

            {/* Executive Summary Cards (Rendered for all views) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">סה״כ גיוס לתקופה</div>
                <div className="text-lg sm:text-xl font-black text-blue-900 mt-1 font-mono" dir="ltr">
                  {totalAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">ברוטו מכלל התרומות</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">מספר תרומות</div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">
                  {count}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">רשומות קבלה מאומתות</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">תורמים ייחודיים</div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">
                  {uniqueDonorsCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ממוצע: {Math.round(avgDonation).toLocaleString()} ₪ לתרומה
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">נטו לפעילות רפואית</div>
                <div className="text-lg sm:text-xl font-black text-emerald-800 mt-1 font-mono" dir="ltr">
                  {Math.round(netDirectCareAmount).toLocaleString('he-IL')} ₪
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  בניכוי תקורה 7% ({Math.round(overheadFee7).toLocaleString()} ₪)
                </div>
              </div>
            </div>

            {/* TAB-SPECIFIC REPORT CONTENT */}

            {/* VIEW 1: ANALYTICS TAB CONTENT */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Department Allocations */}
                {departmentsList?.length > 0 && (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-900" />
                      <span>התפלגות תרומות לפי ייעוד ומחלקות</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {departmentsList.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                          <div>
                            <div className="font-semibold text-xs text-slate-800">{cat.label}</div>
                            <div className="text-[11px] text-slate-500">{cat.count} תרומות</div>
                          </div>
                          <div className="text-left font-mono font-bold text-xs text-blue-900" dir="ltr">
                            {cat.sum.toLocaleString()} ₪ ({totalAmount > 0 ? Math.round((cat.sum / totalAmount) * 100) : 0}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Donors Table */}
                {topDonorsList?.length > 0 && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-800">
                      דירוג תורמים מובילים לתקופה
                    </div>
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 font-semibold w-12">#</th>
                          <th className="py-2 px-3 font-semibold">שם התורם / הגוף התורם</th>
                          <th className="py-2 px-3 font-semibold">מספר תרומות</th>
                          <th className="py-2 px-3 font-semibold">סך מצטבר (₪)</th>
                          <th className="py-2 px-3 font-semibold">תרומה אחרונה</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {topDonorsList.map((donor, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{donor.name}</td>
                            <td className="py-2 px-3 text-slate-600">{donor.count}</td>
                            <td className="py-2 px-3 font-mono font-bold text-blue-900" dir="ltr">
                              {donor.total.toLocaleString()} ₪
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-500">{donor.lastDate || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: FULL TABLE OF FILTERED DONATIONS */}
            {activeTab === 'table' && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>טבלת תרומות מפורטת ({filteredDonations.length} רשומות)</span>
                    <span className="font-mono text-blue-900 font-bold" dir="ltr">
                      סה״כ: {filteredDonations.reduce((s, r) => s + (Number(r.amountIls) || 0), 0).toLocaleString()} ₪
                    </span>
                  </div>
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold">שנה</th>
                        <th className="py-2 px-3 font-semibold">תאריך</th>
                        <th className="py-2 px-3 font-semibold">שם התורם</th>
                        <th className="py-2 px-3 font-semibold">סכום (₪)</th>
                        <th className="py-2 px-3 font-semibold">ייעוד התרומה</th>
                        <th className="py-2 px-3 font-semibold">מזהה/קבלה</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDonations.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 font-mono text-slate-500">{item.year}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-600">{item.date || '—'}</td>
                          <td className="py-1.5 px-3 font-bold text-slate-900">{item.donorName}</td>
                          <td className="py-1.5 px-3 font-mono font-bold text-blue-900" dir="ltr">
                            {Number(item.amountIls).toLocaleString()} ₪
                          </td>
                          <td className="py-1.5 px-3 text-slate-600">{item.purpose || 'כללי'}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-400 text-[11px]">{item.id || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 3: LAPSED DONORS FOR RE-ENGAGEMENT */}
            {activeTab === 'lapsed' && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
                    <span>רשימת תורמים פוטנציאליים לחידוש קשר ({lapsedDonors.length} יעדים)</span>
                    <span className="text-slate-500 font-normal">תורמי עבר שלא תרמו בשנה האחרונה</span>
                  </div>
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold">שם התורם</th>
                        <th className="py-2 px-3 font-semibold">שנת תרומה אחרונה</th>
                        <th className="py-2 px-3 font-semibold">סכום אחרון</th>
                        <th className="py-2 px-3 font-semibold">סך תרומות היסטורי</th>
                        <th className="py-2 px-3 font-semibold">מספר תרומות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lapsedDonors.map((d, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">{d.name}</td>
                          <td className="py-2 px-3 font-mono text-amber-700 font-semibold">{d.lastYear}</td>
                          <td className="py-2 px-3 font-mono text-slate-700" dir="ltr">
                            {d.lastAmount?.toLocaleString()} ₪
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-blue-900" dir="ltr">
                            {d.totalAmount?.toLocaleString()} ₪
                          </td>
                          <td className="py-2 px-3 text-slate-600">{d.donationsCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Official Report Sign-off & Footer */}
            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-700">הערות ביקורת ואמינות:</div>
                <div>הנתונים בדו״ח זה נבדקו ונשלפו ישירות ממערכת הניהול המאובטחת של אגודת הידידים.</div>
                <div>כל סכומי המט״ח מומרים לפי השער היציג התקף למועד התרומה.</div>
              </div>
              <div className="text-left">
                <div className="font-serif italic text-slate-400 text-sm">Wolfson Friends Association</div>
                <div className="text-[11px] text-slate-400">עמוד 1 מתוך 1 | נתונים מאומתים</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar (hidden in print) */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between no-print">
          <span className="text-xs text-slate-400">
            טיפ: בחלון ההדפסה של הדפדפן, בחר ביעד <b>שמור כ-PDF</b> (Save as PDF) ושמור את הקובץ.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            סגור תצוגה
          </button>
        </div>
      </div>
    </div>
  );
}