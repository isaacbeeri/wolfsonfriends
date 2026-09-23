import React, { useState, useRef } from 'react';
import { 
  Upload, X, CheckCircle, AlertTriangle, FileSpreadsheet, 
  ArrowRight, RefreshCw, Layers, DollarSign, Calendar, Eye
} from 'lucide-react';
import { inspectDonationsExcelFile, applyParsedDonations } from '../../utils/excelDonationsParser';

export default function DonationsUploadModal({ isOpen, onClose, currentDonations = [], onDonationsUpdated }) {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setError(null);
    setAnalysisResult(null);
    setFile(selectedFile);
    setIsAnalyzing(true);

    try {
      const result = await inspectDonationsExcelFile(selectedFile, currentDonations);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'שגיאה בקריאת וניתוח קובץ האקסל.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCommit = () => {
    if (!analysisResult || !analysisResult.records) return;
    setIsApplying(true);
    try {
      const commitRes = applyParsedDonations(analysisResult.records);
      if (onDonationsUpdated) {
        onDonationsUpdated(analysisResult.records, {
          importedCount: commitRes.count,
          totalImportedAmount: commitRes.totalIls,
          count2026: analysisResult.donations2026Count,
          sum2026: analysisResult.donations2026Sum
        });
      }
      onClose();
    } catch (err) {
      setError('שגיאה בשמירת הנתונים המעודכנים: ' + err.message);
    } finally {
      setIsApplying(false);
    }
  };

  const handleResetModal = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">העלאת ועדכון קובץ תרומות (Excel)</h2>
              <p className="text-xs text-slate-400">
                קליטת קובץ אקסל מעודכן, ניתוח הפרשים לפני אישור והחלה במאגר
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Upload Dropzone */}
          {!analysisResult && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-700 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                גרור ושחרר קובץ אקסל כאן, או לחץ לבחירת קובץ
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                תמיכה בקבצי תרומות מרובי-גליונות (כגון &apos;תרומות 17-26.xlsx&apos;). המערכת מסננת אוטומטית שורות סיכום, לשוניות עזר ומספרי זהות.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-mono">
                פורמטים נתמכים: .xlsx, .xls
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              <div className="text-sm font-semibold text-white">מנתח ומאמת את נתוני הקובץ...</div>
              <div className="text-xs text-slate-400">בודק גליונות, מנרמל תאריכים ומחשב הפרשים מול המאגר הנוכחי</div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-red-300">שגיאה בניתוח הקובץ</div>
                <div className="mt-1">{error}</div>
                <button
                  onClick={handleResetModal}
                  className="mt-2 text-xs text-red-400 underline hover:text-red-300"
                >
                  בחר קובץ אחר
                </button>
              </div>
            </div>
          )}

          {/* Analysis & Audit Comparison View */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              {/* File details bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">{analysisResult.fileName}</span>
                  <span className="text-xs text-slate-500">
                    ({Math.round(analysisResult.fileSize / 1024)} KB)
                  </span>
                </div>
                <button
                  onClick={handleResetModal}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  החלף קובץ...
                </button>
              </div>

              {/* Summary Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 2026 Specifics */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      שנת 2026 בקובץ
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold rounded-md border border-emerald-500/20">
                      מאומת
                    </span>
                  </div>
                  <div className="text-xl font-black text-white font-mono" dir="ltr">
                    {analysisResult.donations2026Sum.toLocaleString()} ₪
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {analysisResult.donations2026Count} תרומות מתועדות
                  </div>
                </div>

                {/* Total All-Time in File */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                    סה״כ כל השנים בקובץ
                  </div>
                  <div className="text-xl font-black text-white font-mono" dir="ltr">
                    {analysisResult.newTotalIls.toLocaleString()} ₪
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {analysisResult.parsedCount} רשומות בסך הכל
                  </div>
                </div>

                {/* Diff from current state */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    הפרש מול המאגר הפעיל
                  </div>
                  <div className="text-xl font-black font-mono" dir="ltr">
                    <span className={analysisResult.diffTotalIls >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                      {analysisResult.diffTotalIls >= 0 ? '+' : ''}{analysisResult.diffTotalIls.toLocaleString()} ₪
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {analysisResult.diffCount >= 0 ? `+${analysisResult.diffCount}` : analysisResult.diffCount} תרומות
                  </div>
                </div>
              </div>

              {/* Yearly Breakdown Comparison Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">פילוח והשוואה לפי שנים</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    זוהו {Object.keys(analysisResult.sheetStats).length} גליונות נתונים
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3 font-semibold">שנה</th>
                        <th className="py-2 px-3 font-semibold">רשומות בקובץ</th>
                        <th className="py-2 px-3 font-semibold">סכום בקובץ (₪)</th>
                        <th className="py-2 px-3 font-semibold">במאגר כעת</th>
                        <th className="py-2 px-3 font-semibold">שינוי</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {analysisResult.yearComparison.map((yc) => (
                        <tr key={yc.year} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-bold text-white font-mono">{yc.year}</td>
                          <td className="py-2 px-3 text-slate-200">{yc.newCount}</td>
                          <td className="py-2 px-3 font-mono font-semibold text-emerald-400" dir="ltr">
                            {yc.newSum.toLocaleString()} ₪
                          </td>
                          <td className="py-2 px-3 text-slate-400 font-mono" dir="ltr">
                            {yc.oldSum.toLocaleString()} ₪ ({yc.oldCount})
                          </td>
                          <td className="py-2 px-3 font-mono">
                            {yc.diffSum === 0 ? (
                              <span className="text-slate-500">ללא שינוי</span>
                            ) : (
                              <span className={yc.diffSum > 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                {yc.diffSum > 0 ? '+' : ''}{yc.diffSum.toLocaleString()} ₪
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Records Preview */}
              {analysisResult.sampleRecords?.length > 0 && (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      דגימת שורות ראשונות מהקובץ
                    </span>
                    <span className="text-[11px] text-slate-500">תצוגה מקדימה</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-1.5 px-3">שנה</th>
                          <th className="py-1.5 px-3">תורם</th>
                          <th className="py-1.5 px-3">סכום</th>
                          <th className="py-1.5 px-3">תאריך</th>
                          <th className="py-1.5 px-3">ייעוד</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {analysisResult.sampleRecords.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/20">
                            <td className="py-1.5 px-3 font-mono text-slate-400">{r.year}</td>
                            <td className="py-1.5 px-3 font-medium text-white">{r.donorName}</td>
                            <td className="py-1.5 px-3 font-mono font-semibold text-emerald-400" dir="ltr">
                              {r.amountIls.toLocaleString()} ₪
                            </td>
                            <td className="py-1.5 px-3 text-slate-400 font-mono">{r.date || '—'}</td>
                            <td className="py-1.5 px-3 text-slate-400 truncate max-w-[140px]">{r.purpose || 'כללי'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            ביטול
          </button>

          {analysisResult && (
            <button
              onClick={handleCommit}
              disabled={isApplying}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>מעדכן מאגר...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>אשר והחל עדכון נתונים במאגר ({analysisResult.parsedCount} רשומות)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}