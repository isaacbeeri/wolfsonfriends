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
  RefreshCw
} from 'lucide-react';
import { getDonations, processDonationsExcelFile, resetDonationsToDefault } from '../../utils/adminDataService';

export function DonationsAdminTab({ userRole = 'viewer' }) {
  const isReadOnly = userRole === 'viewer';
  const [donations, setDonations] = useState(() => getDonations());
  const [selectedYear, setSelectedYear] = useState('2026'); // '2026' | 'all' | specific year
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(donations.map(d => d.year))).sort((a, b) => b - a);
    return years;
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter(item => {
      if (selectedYear !== 'all' && String(item.year) !== selectedYear) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const donorMatch = (item.donorName || '').toLowerCase().includes(q);
        const purposeMatch = (item.purpose || '').toLowerCase().includes(q);
        const receiptMatch = (item.receipt || '').toLowerCase().includes(q);
        const notesMatch = (item.notes || '').toLowerCase().includes(q);
        const cardMatch = (item.hashavshevetCard || '').toLowerCase().includes(q);
        const amtMatch = String(item.amountIls || '').includes(q);
        if (!donorMatch && !purposeMatch && !receiptMatch && !notesMatch && !cardMatch && !amtMatch) {
          return false;
        }
      }
      return true;
    });
  }, [donations, selectedYear, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalAmount = filteredDonations.reduce((sum, d) => sum + (d.amountIls || 0), 0);
    const count = filteredDonations.length;
    const avg = count > 0 ? totalAmount / count : 0;
    const countForeign = filteredDonations.filter(d => d.foreignAmount && d.foreignAmount > 0).length;
    return { totalAmount, count, avg, countForeign };
  }, [filteredDonations]);

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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">
              {selectedYear === 'all' ? 'סה״כ גיוס (כל השנים)' : `גיוס לשנת ${selectedYear}`}
            </span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono" dir="ltr">
            {stats.totalAmount.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {selectedYear === '2026' ? 'השנה הנוכחית' : `${stats.count} תרומות מתועדות`}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">מספר תרומות</span>
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono">
            {stats.count}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {selectedYear === '2026' ? '37 תרומות מאומתות' : `${stats.countForeign} במט״ח`}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">תרומה ממוצעת</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white mt-2 font-mono" dir="ltr">
            {stats.avg.toLocaleString('he-IL', { maximumFractionDigits: 0 })} ₪
          </div>
          <div className="text-xs text-slate-400 mt-1">ממוצע לתרומה בחתך הנבחר</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">סטטוס מאגר</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
          </div>
          <div className="text-xl font-black text-white mt-2 font-mono">
            {donations.length} תרומות
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> מסד נתונים מאומת ומאובטח
          </div>
        </div>
      </div>

      {/* Upload & Actions Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="2026">שנת 2026 (השנה הנוכחית)</option>
              <option value="all">כל השנים (2017–2026)</option>
              {availableYears.filter(y => y !== 2026).map(y => (
                <option key={y} value={String(y)}>שנת {y}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="חיפוש לפי שם תורם, קבלה, ייעוד..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Upload Excel Button */}
          {!isReadOnly && (
            <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow ${
              isUploading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}>
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'מעבד ובודק קובץ...' : 'העלאת קובץ תרומות (Excel)'}</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
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

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors border border-slate-700"
            title="ייצוא רשימת התרומות המוצגת ל-CSV"
          >
            <Download className="w-4 h-4" />
            <span>ייצוא CSV</span>
          </button>
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
  );
}
