import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Search, 
  Upload, 
  Download, 
  Calendar, 
  Building2, 
  TrendingUp, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  RefreshCw,
  PieChart,
  BarChart3,
  Users,
  Globe,
  Percent,
  Award,
  ArrowUpRight,
  UserCheck,
  HeartHandshake,
  Layers,
  ChevronDown,
  Printer
} from 'lucide-react';
import { getDonations, processDonationsExcelFile, resetDonationsToDefault } from '../../utils/adminDataService';
import DonationsUploadModal from './DonationsUploadModal';
import DonationsPdfReport from './DonationsPdfReport';

export function DonationsAdminTab({ userRole = 'viewer' }) {
  const isReadOnly = userRole === 'viewer';
  const [donations, setDonations] = useState(() => getDonations());
  const [selectedYear, setSelectedYear] = useState('2026'); // '2026' | 'all' | specific year
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'table' | 'lapsed'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPdfReportOpen, setIsPdfReportOpen] = useState(false);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(donations.map(d => d.year))).sort((a, b) => b - a);
    return years;
  }, [donations]);

  // Donations filtered by selected year (and search for table)
  const yearDonations = useMemo(() => {
    return donations.filter(item => {
      if (selectedYear !== 'all' && String(item.year) !== selectedYear) {
        return false;
      }
      return true;
    });
  }, [donations, selectedYear]);

  const filteredDonations = useMemo(() => {
    if (!searchTerm.trim()) return yearDonations;
    const q = searchTerm.trim().toLowerCase();
    return yearDonations.filter(item => {
      const donorMatch = (item.donorName || '').toLowerCase().includes(q);
      const purposeMatch = (item.purpose || '').toLowerCase().includes(q);
      const receiptMatch = (item.receipt || '').toLowerCase().includes(q);
      const notesMatch = (item.notes || '').toLowerCase().includes(q);
      const cardMatch = (item.hashavshevetCard || item.cardCode || '').toLowerCase().includes(q);
      const amtMatch = String(item.amountIls || '').includes(q);
      return donorMatch || purposeMatch || receiptMatch || notesMatch || cardMatch || amtMatch;
    });
  }, [yearDonations, searchTerm]);

  /* ============================================================
     ADVANCED EXECUTIVE STATISTICS
     ============================================================ */
  const executiveStats = useMemo(() => {
    const data = yearDonations;
    const totalAmount = data.reduce((sum, d) => sum + (d.amountIls || 0), 0);
    const count = data.length;
    const avg = count > 0 ? totalAmount / count : 0;

    // Median calculation
    const sortedAmounts = [...data].map(d => d.amountIls || 0).sort((a, b) => a - b);
    let median = 0;
    if (sortedAmounts.length > 0) {
      const mid = Math.floor(sortedAmounts.length / 2);
      median = sortedAmounts.length % 2 !== 0 
        ? sortedAmounts[mid] 
        : (sortedAmounts[mid - 1] + sortedAmounts[mid]) / 2;
    }

    // Unique donors
    const donorMap = new Map();
    data.forEach(d => {
      const name = (d.donorName || 'עילום שם').trim();
      if (!donorMap.has(name)) {
        donorMap.set(name, { count: 0, total: 0, lastDate: d.date, lastPurpose: d.purpose });
      }
      const entry = donorMap.get(name);
      entry.count += 1;
      entry.total += (d.amountIls || 0);
      if (d.date && (!entry.lastDate || d.date > entry.lastDate)) {
        entry.lastDate = d.date;
        entry.lastPurpose = d.purpose;
      }
    });
    const uniqueDonorsCount = donorMap.size;
    const avgDonationsPerDonor = uniqueDonorsCount > 0 ? (count / uniqueDonorsCount) : 0;

    // Top Donors (Sorted)
    const topDonors = Array.from(donorMap.entries())
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    // 1. Overhead Analysis (תקורה)
    // Notes or purposes containing 'ללא תקורה', 'פטור מתקורה', 'ללא עמלה', 'ישות זרה', 'usaid'
    let withoutOverheadSum = 0;
    let withoutOverheadCount = 0;
    let withOverheadSum = 0;
    let withOverheadCount = 0;

    data.forEach(d => {
      const text = `${d.notes || ''} ${d.purpose || ''}`.toLowerCase();
      const isExempt = text.includes('ללא תקורה') || text.includes('פטור מתקורה') || text.includes('ללא עמלה') || text.includes('usaid') || text.includes('ישות זרה');
      if (isExempt) {
        withoutOverheadSum += (d.amountIls || 0);
        withoutOverheadCount += 1;
      } else {
        withOverheadSum += (d.amountIls || 0);
        withOverheadCount += 1;
      }
    });

    const overheadEligiblePct = totalAmount > 0 ? (withOverheadSum / totalAmount) * 100 : 0;
    const overheadExemptPct = totalAmount > 0 ? (withoutOverheadSum / totalAmount) * 100 : 0;
    // Estimated potential overhead revenue for the NGO (standard 7% on eligible gifts)
    const estimatedOverheadFee7Pct = withOverheadSum * 0.07;

    // 2. Donation Brackets / Gift Pyramid
    const brackets = {
      mega: { label: 'תרומות עוגן וענק (1M+ ₪)', min: 1000000, count: 0, sum: 0, color: 'emerald' },
      major: { label: 'תרומות גדולות (100K-1M ₪)', min: 100000, max: 999999.99, count: 0, sum: 0, color: 'blue' },
      mid: { label: 'תרומות בינוניות (10K-100K ₪)', min: 10000, max: 99999.99, count: 0, sum: 0, color: 'purple' },
      community: { label: 'תרומות קהילתיות (עד 10K ₪)', min: 0, max: 9999.99, count: 0, sum: 0, color: 'amber' }
    };

    data.forEach(d => {
      const amt = d.amountIls || 0;
      if (amt >= 1000000) {
        brackets.mega.count++;
        brackets.mega.sum += amt;
      } else if (amt >= 100000) {
        brackets.major.count++;
        brackets.major.sum += amt;
      } else if (amt >= 10000) {
        brackets.mid.count++;
        brackets.mid.sum += amt;
      } else {
        brackets.community.count++;
        brackets.community.sum += amt;
      }
    });

    // 3. Geographic / Currency Mix
    let foreignSum = 0;
    let foreignCount = 0;
    let domesticSum = 0;
    let domesticCount = 0;
    const currencyBreakdown = { ILS: 0, USD: 0, OTHER: 0 };

    data.forEach(d => {
      const amt = d.amountIls || 0;
      const isForeign = (d.foreignAmount && d.foreignAmount !== '0' && d.foreignAmount !== '-') || 
                        d.currency === 'USD' || 
                        (d.notes && d.notes.includes('ישות זרה'));
      if (isForeign) {
        foreignSum += amt;
        foreignCount += 1;
        if (d.currency === 'USD' || (d.foreignAmount && String(d.foreignAmount).includes('$'))) {
          currencyBreakdown.USD += amt;
        } else {
          currencyBreakdown.OTHER += amt;
        }
      } else {
        domesticSum += amt;
        domesticCount += 1;
        currencyBreakdown.ILS += amt;
      }
    });

    // 4. Department / Purpose Allocation
    const deptCategories = [
      { id: 'trauma', label: 'טראומה ומלר״ד', keywords: ['טראומה', 'מיון', 'מלרד', 'operating together', 'usaid', 'מחסומי'], sum: 0, count: 0, color: 'bg-rose-500' },
      { id: 'pediatrics', label: 'פגים, ילדים וילודים', keywords: ['פג', 'ילד', 'נוירו ילדים', 'גסטרו ילדים', 'ספרים'], sum: 0, count: 0, color: 'bg-blue-500' },
      { id: 'imaging', label: 'דימות, סיטי ו-PET-CT', keywords: ['דימות', 'סיטי', 'ct', 'pet', 'רדיולוגיה'], sum: 0, count: 0, color: 'bg-emerald-500' },
      { id: 'women', label: 'נשים, יולדות ו-IVF', keywords: ['נשים', 'יולדות', 'הפריה', 'ivf'], sum: 0, count: 0, color: 'bg-pink-500' },
      { id: 'cardio', label: 'מכון הלב וקרדיולוגיה', keywords: ['לב', 'קרדיולוג'], sum: 0, count: 0, color: 'bg-red-500' },
      { id: 'nursing', label: 'סיעוד ואקדמאים (מקס ברני)', keywords: ['סיעוד', 'אקדמאים', 'ברני', 'class', 'מלג'], sum: 0, count: 0, color: 'bg-indigo-500' },
      { id: 'surgery', label: 'כירורגיה, עיניים ורובוטיקה', keywords: ['עיניים', 'כירורג', 'רובוט', 'da vinci', 'א.א.ג', 'פתולוגיה'], sum: 0, count: 0, color: 'bg-purple-500' },
      { id: 'general', label: 'בינוי, הנהלה וכללי', keywords: ['הנהלה', 'אירוח', 'בינוי', 'בריאות הציבור', 'כללי'], sum: 0, count: 0, color: 'bg-amber-500' },
    ];

    data.forEach(d => {
      const amt = d.amountIls || 0;
      const text = `${d.purpose || ''} ${d.donorName || ''}`.toLowerCase();
      let matched = false;
      for (const cat of deptCategories) {
        if (cat.keywords.some(kw => text.includes(kw))) {
          cat.sum += amt;
          cat.count += 1;
          matched = true;
          break;
        }
      }
      if (!matched) {
        const gen = deptCategories.find(c => c.id === 'general');
        gen.sum += amt;
        gen.count += 1;
      }
    });

    const activeDepts = deptCategories
      .filter(c => c.sum > 0)
      .sort((a, b) => b.sum - a.sum);

    return {
      totalAmount,
      count,
      avg,
      median,
      uniqueDonorsCount,
      avgDonationsPerDonor,
      topDonors,
      overhead: {
        withOverheadSum,
        withOverheadCount,
        withoutOverheadSum,
        withoutOverheadCount,
        overheadEligiblePct,
        overheadExemptPct,
        estimatedOverheadFee7Pct
      },
      brackets,
      geography: {
        foreignSum,
        foreignCount,
        domesticSum,
        domesticCount,
        foreignPct: totalAmount > 0 ? (foreignSum / totalAmount) * 100 : 0,
        domesticPct: totalAmount > 0 ? (domesticSum / totalAmount) * 100 : 0,
        currencyBreakdown
      },
      departments: activeDepts
    };
  }, [yearDonations]);

  /* ============================================================
     MULTI-YEAR TRENDS (2017-2026)
     ============================================================ */
  const multiYearStats = useMemo(() => {
    const yearMap = new Map();
    for (let y = 2017; y <= 2026; y++) {
      yearMap.set(y, { year: y, sum: 0, count: 0 });
    }
    donations.forEach(d => {
      if (yearMap.has(d.year)) {
        const e = yearMap.get(d.year);
        e.sum += (d.amountIls || 0);
        e.count += 1;
      }
    });
    const list = Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
    const maxYearSum = Math.max(...list.map(y => y.sum), 1);
    return { list, maxYearSum };
  }, [donations]);

  /* ============================================================
     LAPSED DONORS (תורמים רדומים לחידוש קשר לקראת החגים)
     ============================================================ */
  const lapsedDonors = useMemo(() => {
    const activeDonorsCurrentYear = new Set(
      donations.filter(d => d.year === 2026).map(d => (d.donorName || '').trim().toLowerCase())
    );

    const donorTotals = new Map();
    donations.filter(d => d.year >= 2020 && d.year <= 2025).forEach(d => {
      const name = (d.donorName || '').trim();
      if (!name || name.length < 2) return;
      const key = name.toLowerCase();
      if (!donorTotals.has(key)) {
        donorTotals.set(key, { 
          name, 
          totalHistoric: 0, 
          lastYear: d.year, 
          lastDate: d.date, 
          lastPurpose: d.purpose,
          count: 0
        });
      }
      const entry = donorTotals.get(key);
      entry.totalHistoric += (d.amountIls || 0);
      entry.count += 1;
      if (d.year > entry.lastYear) {
        entry.lastYear = d.year;
        entry.lastDate = d.date;
        entry.lastPurpose = d.purpose;
      }
    });

    const lapsed = Array.from(donorTotals.values())
      .filter(item => !activeDonorsCurrentYear.has(item.name.toLowerCase()) && item.totalHistoric >= 15000)
      .sort((a, b) => b.totalHistoric - a.totalHistoric);

    return lapsed;
  }, [donations]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const result = await processDonationsExcelFile(file);
      const updated = getDonations();
      setDonations(updated);
      setUploadMessage({
        type: 'success',
        text: `הקובץ נקלט ונבדק בהצלחה! סוננו לשוניות עזר, נבדקו שמות התורמים ונוקו שגיאות. נקלטו סה״כ ${result.importedCount} תרומות מאומתות (מתוכן ${result.count2026} בשנת 2026 בסך ${result.sum2026?.toLocaleString()} ₪).`
      });
    } catch (err) {
      console.error(err);
      setUploadMessage({
        type: 'error',
        text: `שגיאה בעיבוד קובץ האקסל: ${err.message || 'ודא שהקובץ במבנה תקין'}`
      });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm('האם לאפס את המאגר לבסיס הנתונים המאומת המקורי (701 תרומות, 37 תרומות בשנת 2026)?')) {
      const clean = resetDonationsToDefault();
      setDonations(clean);
      setUploadMessage({
        type: 'success',
        text: 'המאגר אופס בהצלחה לבסיס הנתונים המאומת המקורי (37 תרומות בשנת 2026 בסך 3,115,245 ₪).'
      });
      setTimeout(() => setUploadMessage(null), 5000);
    }
  };

  const handleExportCsv = () => {
    const headers = ["שנה", "תאריך", "שם התורם", "סכום בש״ח", "סכום במט״ח", "מטבע", "ייעוד", "מספר קבלה", "כרטיס חשבשבת", "הערות"];
    const rows = filteredDonations.map(d => [
      d.year,
      d.date || '',
      `"${(d.donorName || '').replace(/"/g, '""')}"`,
      d.amountIls,
      d.foreignAmount || '',
      d.currency || '',
      `"${(d.purpose || '').replace(/"/g, '""')}"`,
      d.receipt || '',
      d.cardCode || '',
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FWMC_Donations_${selectedYear}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-100" dir="rtl">
      {/* View Mode & Filter Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>לוח מחוונים וסטטיסטיקה מנהלתית</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>רשימת תרומות מלאה ({filteredDonations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lapsed')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lapsed'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>מודיעין וחידוש קשר ({lapsedDonors.length})</span>
          </button>
        </div>

        {/* Global Year Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400 font-semibold">חתך שנה:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="2026" className="bg-slate-900">שנת 2026 (השנה הנוכחית)</option>
              <option value="all" className="bg-slate-900">כל השנים (2017–2026)</option>
              {availableYears.filter(y => y !== 2026).map(y => (
                <option key={y} value={String(y)} className="bg-slate-900">שנת {y}</option>
              ))}
            </select>
          </div>

          {/* Primary Upload Button */}
          {!isReadOnly && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/30"
              title="העלאת קובץ תרומות מעודכן (Excel) ואימות נתונים"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>העלאת קובץ תרומות (Excel)</span>
            </button>
          )}

          {/* Primary PDF Report Button */}
          <button
            onClick={() => setIsPdfReportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
            title="הפקת דו״ח PDF רשמי של הנתונים המוצגים כעת על המסך"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>הפקת דו״ח PDF</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors border border-slate-700 shadow-sm"
            title="ייצוא רשימת התרומות המוצגת ל-CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">ייצוא CSV</span>
          </button>
        </div>
      </div>

      {/* Top Executive KPI Bar (Always Visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Raised */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              {selectedYear === 'all' ? 'סה״כ גיוס (כל השנים)' : `גיוס לשנת ${selectedYear}`}
            </span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono" dir="ltr">
            {executiveStats.totalAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-400">{executiveStats.count}</span> תרומות מתועדות
            <span className="text-slate-600">•</span>
            <span>{executiveStats.uniqueDonorsCount} תורמים</span>
          </div>
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        {/* KPI 2: Average vs Median */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">תרומה ממוצעת מול חציון</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono" dir="ltr">
            {executiveStats.avg.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>חציון תרומה (Median):</span>
            <span className="font-mono font-bold text-purple-300" dir="ltr">
              {executiveStats.median.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪
            </span>
          </div>
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        </div>

        {/* KPI 3: Donors & Retention */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">תורמים ייחודיים ויחס נתינה</span>
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">
            {executiveStats.uniqueDonorsCount} <span className="text-sm font-normal text-slate-400">תורמים</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>יחס תרומות לתורם:</span>
            <span className="font-mono font-bold text-blue-300">
              {executiveStats.avgDonationsPerDonor.toFixed(1)} תרומות
            </span>
          </div>
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        {/* KPI 4: Overhead & Vault Security */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">הכנסות פוטנציאל תקורה (7%)</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Percent className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2 font-mono" dir="ltr">
            {Math.round(executiveStats.overhead.estimatedOverheadFee7Pct).toLocaleString('he-IL')} ₪
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>תרומות חייבות תקורה:</span>
            <span className="font-mono font-bold text-slate-300">
              {executiveStats.overhead.overheadEligiblePct.toFixed(0)}% מסך הגיוס
            </span>
          </div>
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
        </div>
      </div>

      {/* ============================================================
          VIEW 1: EXECUTIVE ANALYTICS DASHBOARD
          ============================================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Row 1: Overhead Analysis & Geographic Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel A: Overhead & Management Fee Analysis */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <Percent className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">ניתוח תקורה ודמי ניהול לעמותה</h3>
                    <p className="text-[11px] text-slate-400">פילוח תרומות החייבות בתקורה לעומת פטורות (נטו)</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-mono">
                  מודל תקורה: 7%
                </span>
              </div>

              {/* Overhead Ratio Progress Bar */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    עם תקורה ({executiveStats.overhead.overheadEligiblePct.toFixed(1)}%)
                  </span>
                  <span className="text-blue-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    ללא תקורה / ישות זרה ({executiveStats.overhead.overheadExemptPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.max(executiveStats.overhead.overheadEligiblePct, 3)}%` }}
                    title={`עם תקורה: ${executiveStats.overhead.withOverheadSum.toLocaleString()} ₪`}
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                    style={{ width: `${Math.max(executiveStats.overhead.overheadExemptPct, 3)}%` }}
                    title={`ללא תקורה: ${executiveStats.overhead.withoutOverheadSum.toLocaleString()} ₪`}
                  />
                </div>
              </div>

              {/* Overhead Detail Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="text-[11px] text-slate-400 mb-1">תרומות חייבות תקורה</div>
                  <div className="text-lg font-bold font-mono text-emerald-400" dir="ltr">
                    {executiveStats.overhead.withOverheadSum.toLocaleString()} ₪
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {executiveStats.overhead.withOverheadCount} תרומות (מאפשרות תקורה שוטפת)
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="text-[11px] text-slate-400 mb-1">פטורות / ייעודיות 100%</div>
                  <div className="text-lg font-bold font-mono text-blue-400" dir="ltr">
                    {executiveStats.overhead.withoutOverheadSum.toLocaleString()} ₪
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {executiveStats.overhead.withoutOverheadCount} תרומות (USAID, מענקים ייעודיים)
                  </div>
                </div>
              </div>

              {/* Note for the Director */}
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>הערה ניהולית:</strong> תרומות בסיווג "ללא תקורה" כוללות הסכמי מענק בינלאומיים ייעודיים (כגון USAID / שגרירות ארה״ב) בהם כל הסכום מחויב לעבור ישירות לציוד והקמה.
                </span>
              </div>
            </div>

            {/* Panel B: Geographic & Currency Mix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">פילוח גיאוגרפי ומקורות מט״ח</h3>
                    <p className="text-[11px] text-slate-400">תרומות מישראל מול ארה״ב, בריטניה וחו״ל</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-mono">
                  {executiveStats.geography.foreignCount} במט״ח
                </span>
              </div>

              {/* Geographic Ratio Bar */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-teal-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                    ישראל בש״ח ({executiveStats.geography.domesticPct.toFixed(1)}%)
                  </span>
                  <span className="text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    חו״ל ומט״ח ({executiveStats.geography.foreignPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-500"
                    style={{ width: `${Math.max(executiveStats.geography.domesticPct, 3)}%` }}
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
                    style={{ width: `${Math.max(executiveStats.geography.foreignPct, 3)}%` }}
                  />
                </div>
              </div>

              {/* Geographic Channels Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="text-[11px] text-slate-400 mb-1">גיוס מקומי בישראל</div>
                  <div className="text-lg font-bold font-mono text-teal-400" dir="ltr">
                    {executiveStats.geography.domesticSum.toLocaleString()} ₪
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {executiveStats.geography.domesticCount} תרומות (חברות, בנקים ופרטיים)
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="text-[11px] text-slate-400 mb-1">גיוס בינלאומי ומט״ח</div>
                  <div className="text-lg font-bold font-mono text-indigo-400" dir="ltr">
                    {executiveStats.geography.foreignSum.toLocaleString()} ₪
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {executiveStats.geography.foreignCount} תרומות (ערך מומר לש״ח)
                  </div>
                </div>
              </div>

              {/* Channels List */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 space-y-1.5">
                <div className="font-bold text-white text-xs mb-1">ערוצי גיוס בינלאומיים בולטים:</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">• The Max Barney Foundation (בריטניה)</span>
                  <span className="font-semibold text-white">פרויקט הכשרת אקדמאים לסיעוד</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">• USAID / State Department (ארה״ב)</span>
                  <span className="font-semibold text-white">מיגון והצלת חיים בטראומה</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">• PEF Israel Endowments & JGive (ארה״ב)</span>
                  <span className="font-semibold text-white">תרומות מוכרות לפטור 501(c)(3)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Gift Pyramid & Department Allocations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panel C: Gift Pyramid / Donation Brackets */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">פירמידת סכומי תרומה (Gift Pyramid)</h3>
                    <p className="text-[11px] text-slate-400">התפלגות התרומות לפי סדרי גודל וסכומי מדרגות</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-mono">
                  4 מדרגות
                </span>
              </div>

              <div className="space-y-4">
                {Object.entries(executiveStats.brackets).map(([key, bracket]) => {
                  const pct = executiveStats.totalAmount > 0 
                    ? (bracket.sum / executiveStats.totalAmount) * 100 
                    : 0;
                  return (
                    <div key={key} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{bracket.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full font-mono text-[11px]">
                            {bracket.count} תרומות
                          </span>
                          <span className="font-mono font-bold text-purple-300" dir="ltr">
                            {bracket.sum.toLocaleString()} ₪ ({pct.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel D: Department & Purpose Allocation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">התפלגות לפי מחלקות ויעדים בבית החולים</h3>
                    <p className="text-[11px] text-slate-400">לאן מיועדים כספי התרומות שגויסו</p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-mono">
                  {executiveStats.departments.length} מחלקות
                </span>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {executiveStats.departments.map((dept) => {
                  const pct = executiveStats.totalAmount > 0 
                    ? (dept.sum / executiveStats.totalAmount) * 100 
                    : 0;
                  return (
                    <div key={dept.id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span className={`w-2.5 h-2.5 rounded-full ${dept.color}`} />
                          <span>{dept.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">{dept.count} תרומות</span>
                          <span className="font-mono font-black text-emerald-400" dir="ltr">
                            {dept.sum.toLocaleString()} ₪ ({pct.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${dept.color} transition-all duration-500`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Multi-Year Trend Chart (2017 - 2026) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">מגמת גיוס רב-שנתית (2017–2026)</h3>
                  <p className="text-[11px] text-slate-400">השוואת היקפי הגיוס השנתיים לאורך עשור של פעילות</p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-mono font-bold">
                10 שנות תיעוד
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-6 pb-2 items-end">
              {multiYearStats.list.map((item) => {
                const heightPct = Math.round((item.sum / multiYearStats.maxYearSum) * 100);
                const isSelected = String(item.year) === selectedYear;
                return (
                  <button
                    key={item.year}
                    onClick={() => setSelectedYear(String(item.year))}
                    className={`flex flex-col items-center group focus:outline-none transition-all ${
                      isSelected ? 'scale-105' : 'hover:opacity-90'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-400 mb-1 opacity-80 group-hover:opacity-100 whitespace-nowrap">
                      {(item.sum / 1000000).toFixed(1)}M ₪
                    </div>
                    <div className="w-full max-w-[36px] bg-slate-950 h-32 rounded-t-xl p-1 flex items-end justify-center border border-slate-800">
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isSelected 
                            ? 'bg-gradient-to-t from-emerald-500 to-teal-300 ring-2 ring-emerald-400' 
                            : 'bg-gradient-to-t from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-cyan-400'
                        }`}
                        style={{ height: `${Math.max(heightPct, 8)}%` }}
                        title={`שנת ${item.year}: ${item.sum.toLocaleString()} ₪ (${item.count} תרומות)`}
                      />
                    </div>
                    <div className={`mt-2 text-xs font-bold font-mono transition-colors ${
                      isSelected ? 'text-emerald-400 underline underline-offset-4' : 'text-slate-400 group-hover:text-white'
                    }`}>
                      {item.year}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Top Donors Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">תורמי העוגן המובילים בתקופה</h3>
                  <p className="text-[11px] text-slate-400">עשרת התורמים הגדולים בחתך השנה הנבחרת</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('table')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <span>לכל התרומות</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60">
                    <th className="py-2.5 px-3 text-center w-10">#</th>
                    <th className="py-2.5 px-4 min-w-[200px]">שם התורם / הקרן</th>
                    <th className="py-2.5 px-4 text-emerald-400 font-bold min-w-[130px]">סך תרומות בתקופה</th>
                    <th className="py-2.5 px-3 text-center min-w-[90px]">מס׳ תרומות</th>
                    <th className="py-2.5 px-4 min-w-[120px]">מועד אחרון</th>
                    <th className="py-2.5 px-4 min-w-[200px]">ייעוד אחרון</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {executiveStats.topDonors.map((donor, idx) => (
                    <tr key={donor.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white">
                        <span dir="auto">{donor.name}</span>
                      </td>
                      <td className="py-2.5 px-4 font-mono font-black text-emerald-400 whitespace-nowrap" dir="ltr">
                        {donor.total.toLocaleString()} ₪
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-300">
                        {donor.count}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-400" dir="ltr">
                        {donor.lastDate || '-'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300 truncate max-w-xs" title={donor.lastPurpose} dir="auto">
                        {donor.lastPurpose || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 2: DETAILED DONATIONS TABLE (ORIGINAL FULL VIEW)
          ============================================================ */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          {/* Actions & Search Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="חיפוש לפי שם תורם, קבלה, ייעוד, הערות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Upload Excel Button */}
              {!isReadOnly && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow"
                  title="העלאת קובץ תרומות מעודכן"
                >
                  <Upload className="w-4 h-4" />
                  <span>העלאת קובץ תרומות (Excel)</span>
                </button>
              )}

              {/* Reset to Default Button */}
              {!isReadOnly && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors"
                  title="איפוס מהיר למאגר המאומת המקורי"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">איפוס למאגר מאומת</span>
                </button>
              )}
            </div>
          </div>

          {/* Upload Feedback Message */}
          {uploadMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-3 shadow ${
              uploadMessage.type === 'success' 
                ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/70 border border-rose-800 text-rose-300'
            }`}>
              {uploadMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              )}
              <span className="leading-relaxed">{uploadMessage.text}</span>
            </div>
          )}

          {/* Donations Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 font-bold text-white">
                <span>רשימת תרומות</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-mono text-[11px]">
                  {filteredDonations.length} תוצאות
                </span>
              </div>
              <span className="text-[11px]">
                {selectedYear === '2026' ? 'שנת 2026 (נתונים מאומתים)' : `שנה: ${selectedYear}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                    <th className="py-3 px-3 text-center w-10">#</th>
                    <th className="py-3 px-4 min-w-[100px]">תאריך</th>
                    <th className="py-3 px-4 min-w-[200px]">שם התורם</th>
                    <th className="py-3 px-4 text-emerald-400 font-bold min-w-[120px]">סכום בש״ח</th>
                    <th className="py-3 px-4 min-w-[120px]">סכום במט״ח</th>
                    <th className="py-3 px-4 min-w-[220px]">ייעוד התרומה</th>
                    <th className="py-3 px-3 text-center min-w-[90px]">מס׳ קבלה</th>
                    <th className="py-3 px-3 min-w-[100px]">חשבשבת</th>
                    <th className="py-3 px-4 min-w-[180px]">הערות / תקורה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        לא נמצאו תרומות התואמות את החיפוש או הסינון שנבחר.
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((d, idx) => (
                      <tr key={d.id || idx} className="hover:bg-slate-800/60 transition-colors">
                        <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap" dir="ltr">
                          {d.date || '-'}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          <span dir="auto">{d.donorName}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-emerald-400 whitespace-nowrap" dir="ltr">
                          {Number(d.amountIls).toLocaleString()} ₪
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap" dir="ltr">
                          {d.foreignAmount ? d.foreignAmount : '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={d.purpose} dir="auto">
                          {d.purpose || '-'}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-300 whitespace-nowrap" dir="ltr">
                          {d.receipt || '-'}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap" dir="ltr">
                          {d.cardCode || '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-400 max-w-xs truncate text-[11px]" title={d.notes} dir="auto">
                          {d.notes || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 3: DONOR INTELLIGENCE & LAPSED DONORS (חידוש קשר לקראת החגים)
          ============================================================ */}
      {activeTab === 'lapsed' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <HeartHandshake className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">מודיעין תורמים רדומים (Lapsed Donors) לחידוש קשר</h3>
                  <p className="text-[11px] text-slate-400">
                    תורמים משמעותיים שתרמו בעבר (סך מצטבר מעל 15,000 ₪) אך טרם ביצעו תרומה בשנת 2026
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono text-xs font-bold">
                {lapsedDonors.length} יעדי פנייה
              </span>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>הזדמנות לגיוס משאבים:</strong> רשימה זו מרכזת תורמים עם היסטוריה מוכחת של תמיכה בוולפסון, ומהווה את מאגר הפניות בעל הסיכוי הגבוה ביותר לתרומה לקראת החגים וסוף שנת המס.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950">
                    <th className="py-3 px-3 text-center w-10">#</th>
                    <th className="py-3 px-4 min-w-[220px]">שם התורם / החברה</th>
                    <th className="py-3 px-4 text-emerald-400 font-bold min-w-[140px]">סך היסטורי מצטבר</th>
                    <th className="py-3 px-3 text-center min-w-[90px]">כמות תרומות</th>
                    <th className="py-3 px-3 text-center min-w-[100px]">שנה אחרונה</th>
                    <th className="py-3 px-4 min-w-[220px]">ייעוד תרומה אחרון</th>
                    <th className="py-3 px-3 text-center min-w-[120px]">פעולה</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {lapsedDonors.map((item, idx) => (
                    <tr key={item.name} className="hover:bg-slate-800/60 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        <span dir="auto">{item.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-400 whitespace-nowrap" dir="ltr">
                        {item.totalHistoric.toLocaleString()} ₪
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {item.count}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">
                        {item.lastYear}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={item.lastPurpose} dir="auto">
                        {item.lastPurpose || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedYear('all');
                            setSearchTerm(item.name);
                            setActiveTab('table');
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          הצג היסטוריה
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Upload and Audit Modal */}
      <DonationsUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentDonations={donations}
        onDonationsUpdated={(updatedRecords, summary) => {
          setDonations(updatedRecords);
          setUploadMessage({
            type: 'success',
            text: `קובץ התרומות נקלט, אומת ועודכן בהצלחה! סה״כ ${summary.importedCount} תרומות במאגר (מתוכן ${summary.count2026} בשנת 2026 בסך ${summary.sum2026?.toLocaleString()} ₪). כל הסטטיסטיקות והמדדים במסך עודכנו.`
          });
        }}
      />

      {/* PDF Report Generation Modal */}
      <DonationsPdfReport
        isOpen={isPdfReportOpen}
        onClose={() => setIsPdfReportOpen(false)}
        activeTab={activeTab}
        selectedYear={selectedYear}
        donations={donations}
        executiveStats={executiveStats}
        filteredDonations={filteredDonations}
        lapsedDonors={lapsedDonors}
      />
    </div>
  );
}
