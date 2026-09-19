import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Target, 
  Clock, 
  FileText, 
  Layers, 
  Sparkles,
  Download,
  Calculator,
  RefreshCw,
  ArrowUpRight,
  Info,
  Calendar,
  Building2,
  Coins,
  RotateCcw,
  Zap,
  Globe
} from 'lucide-react';
import { 
  getForecast, 
  saveForecast, 
  parsePipelineText, 
  DEFAULT_EXCHANGE_RATES,
  OFFICIAL_BOI_RATES,
  fetchLiveExchangeRates,
  getStoredLiveRates 
} from '../../utils/adminDataService';

export function ForecastAdminTab({ userRole = 'viewer', currentUserName = 'צחי בארי' }) {
  const isReadOnly = userRole === 'viewer';
  const [forecast, setForecast] = useState(() => getForecast());
  const [saveStatus, setSaveStatus] = useState(null);
  const [autoNotice, setAutoNotice] = useState(null);

  // Form & Forecast State
  const [annualGoal, setAnnualGoal] = useState(forecast.annualGoalIls || 15000000);
  const [currentRaised, setCurrentRaised] = useState(forecast.currentRaisedIls || 3115244.75);
  const [pipelineNotes, setPipelineNotes] = useState(forecast.pipelineNotes || '');
  const [exchangeRates, setExchangeRates] = useState(() => getStoredLiveRates());
  const [pipelineItems, setPipelineItems] = useState(forecast.pipelineItems || []);
  const [lastTableUpdate, setLastTableUpdate] = useState(forecast.lastUpdated || '19.09.2026 20:45');
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [liveRateSource, setLiveRateSource] = useState(exchangeRates.source || 'בנק ישראל (שער יציג)');
  const [liveSyncTime, setLiveSyncTime] = useState(exchangeRates.displayTime || '19/09/2026 20:45');

  // Manual Row Modal / Form State
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDetails, setManualDetails] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualCurrency, setManualCurrency] = useState('USD');

  // Calculate totals dynamically
  const totalPipelineIls = pipelineItems.reduce((sum, item) => sum + (Number(item.amountIls) || 0), 0);
  const totalExpectedCombined = Number(currentRaised) + totalPipelineIls;
  const numGoal = Number(annualGoal) || 1;
  const progressCombinedPct = Math.round((totalExpectedCombined / numGoal) * 100);
  const progressRaisedPct = Math.round((Number(currentRaised) / numGoal) * 100);
  const progressPipelinePct = Math.round((totalPipelineIls / numGoal) * 100);
  const remainingToGoal = Math.max(0, numGoal - totalExpectedCombined);

  /**
   * Automatic Live Sync: Fetches real-time market / BOI rates on mount and recalculates
   */
  const syncLiveRates = async (showNotice = false) => {
    setIsFetchingRates(true);
    try {
      const res = await fetchLiveExchangeRates();
      if (res.success && res.rates) {
        setExchangeRates(res.rates);
        setLiveRateSource(res.rates.source || 'בנק ישראל / שוק המט״ח (חי)');
        setLiveSyncTime(res.rates.displayTime || new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }));
        
        // Recalculate pipeline items using fresh live rates
        const parsed = parsePipelineText(pipelineNotes, res.rates);
        if (parsed.length > 0) {
          setPipelineItems(parsed);
          const now = new Date();
          const dateStr = now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
          setLastTableUpdate(dateStr);
        }

        if (showNotice) {
          setAutoNotice(`שערי המטבע סונכרנו בהצלחה בזמן אמת! (דולר: ${res.rates.USD} ₪)`);
          setTimeout(() => setAutoNotice(null), 4000);
        }
      }
    } catch (e) {
      console.warn('Error fetching live rates:', e);
    } finally {
      setIsFetchingRates(false);
    }
  };

  // Run live sync automatically on component mount
  useEffect(() => {
    syncLiveRates(false);
  }, []);

  /**
   * Recalculates all items from notes and current exchange rates
   */
  const handleParseAndCalculate = async (notesToParse = pipelineNotes, ratesToUse = exchangeRates) => {
    // Also trigger background live check
    await syncLiveRates(false);

    const parsed = parsePipelineText(notesToParse, ratesToUse);
    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    setPipelineItems(parsed);
    setLastTableUpdate(dateStr);
    const total = parsed.reduce((s, i) => s + i.amountIls, 0);
    setAutoNotice(`המספרים עודכנו בהצלחה לפי שער דולר מעודכן ${ratesToUse.USD} ₪! סה״כ צפי חדש בשקלים: ${total.toLocaleString()} ₪`);
    setTimeout(() => setAutoNotice(null), 4500);
  };

  /**
   * Real-time calculation when notes are edited
   */
  const handleNotesChange = (e) => {
    const val = e.target.value;
    setPipelineNotes(val);
    const parsed = parsePipelineText(val, exchangeRates);
    if (parsed.length > 0) {
      setPipelineItems(parsed);
      const now = new Date();
      setLastTableUpdate(now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const handleRateChange = (currency, val) => {
    const num = parseFloat(val) || 1.0;
    const updatedRates = { ...exchangeRates, [currency]: num };
    setExchangeRates(updatedRates);
    // Recalculate existing items with adjusted rate
    const updatedItems = pipelineItems.map(item => {
      const rate = updatedRates[item.currency] || 1.0;
      return {
        ...item,
        exchangeRate: rate,
        amountIls: Math.round(item.originalAmount * rate)
      };
    });
    setPipelineItems(updatedItems);
  };

  const handleDeleteItem = (id) => {
    if (isReadOnly) return;
    setPipelineItems(pipelineItems.filter(i => i.id !== id));
  };

  const handleAddManualRow = (e) => {
    e.preventDefault();
    if (!manualTitle || !manualAmount) return;

    const rate = exchangeRates[manualCurrency] || 1.0;
    const origAmt = parseFloat(manualAmount) || 0;
    const amountIls = Math.round(origAmt * rate);
    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    const newItem = {
      id: `manual_${Date.now()}`,
      title: manualTitle.trim(),
      details: manualDetails.trim() || 'הזנה ידנית ישירה',
      currency: manualCurrency,
      originalAmount: origAmt,
      exchangeRate: rate,
      amountIls,
      lastUpdated: dateStr
    };

    setPipelineItems([newItem, ...pipelineItems]);
    setLastTableUpdate(dateStr);
    setIsAddingManual(false);
    setManualTitle('');
    setManualDetails('');
    setManualAmount('');
  };

  const handleSave = () => {
    if (isReadOnly) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

    const updated = {
      ...forecast,
      year: 2026,
      annualGoalIls: Number(annualGoal),
      currentRaisedIls: Number(currentRaised),
      totalExpectedIls: totalPipelineIls,
      pipelineNotes,
      pipelineItems,
      exchangeRates,
      lastUpdated: dateStr,
      updatedBy: currentUserName
    };

    const res = saveForecast(updated);
    if (res.success) {
      setForecast(res.forecast);
      setLastTableUpdate(dateStr);
      setSaveStatus('התחזית, שערי המטבע וטבלת הצפי נשמרו בהצלחה למערכת!');
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleExportBrief = () => {
    const lines = [
      `=== תמצית תחזית וצפי גיוס תרומות ומענקים - עמותת ידידי וולפסון ===`,
      `תאריך ושעת עדכון: ${lastTableUpdate} (עודכן ע"י: ${currentUserName})`,
      ``,
      `יעד שנתי מאושר לשנת 2026: ${Number(annualGoal).toLocaleString()} ₪`,
      `גיוס בפועל נכון להיום: ${Number(currentRaised).toLocaleString()} ₪ (${progressRaisedPct}% מהיעד)`,
      `צפי תקבולים נוספים (Pipeline): ${totalPipelineIls.toLocaleString()} ₪ (${progressPipelinePct}% מהיעד)`,
      `סה"כ צפי שנתי משולב: ${totalExpectedCombined.toLocaleString()} ₪ (${progressCombinedPct}% מהיעד)`,
      `יתרה להשגת היעד: ${remainingToGoal.toLocaleString()} ₪`,
      ``,
      `--- שערי חליפין מסונכרנים חיים (מקור: ${liveRateSource}, עודכן: ${liveSyncTime}) ---`,
      `דולר ארה"ב (USD): ${exchangeRates.USD} ₪ | אירו (EUR): ${exchangeRates.EUR} ₪ | ליש"ט (GBP): ${exchangeRates.GBP} ₪`,
      ``,
      `--- פירוט טבלת צפי תקבולים ומענקים לפי מקורות (מחושב בשקלים) ---`,
      ...pipelineItems.map((item, idx) => 
        `${idx + 1}. ${item.title}: ${item.originalAmount.toLocaleString()} ${item.currency} x ${item.exchangeRate} = ${item.amountIls.toLocaleString()} ₪ [עודכן: ${item.lastUpdated}] (${item.details})`
      ),
      ``,
      `--- טקסט הערות מקורי מתוך המערכת ---`,
      pipelineNotes
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FWMC_Forecast_Pipeline_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100" dir="rtl">
      {/* ========================================================
          TOP HEADER & STATS CARD
          ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white">
                  צפי ותחזית גיוס תרומות ומענקים (שנת 2026)
                </h2>
                
                {/* Live Real-Time Rates Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-bold shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>סנכרון שערים חי אוטומטי</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>תאריך עדכון אחרון: <strong className="text-white font-mono" dir="ltr">{lastTableUpdate}</strong></span>
                <span className="text-slate-600">|</span>
                <span>עודכן ע״י: <strong className="text-slate-300">{forecast.updatedBy || currentUserName}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportBrief}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>ייצוא דוח מפורט</span>
            </button>

            {!isReadOnly && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
              >
                <Save className="w-4 h-4" />
                <span>שמור שינויים</span>
              </button>
            )}
          </div>
        </div>

        {saveStatus && (
          <div className="mt-4 p-3.5 bg-emerald-950/70 border border-emerald-700 text-emerald-300 rounded-xl text-sm flex items-center gap-2 animate-fadeIn shadow">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {autoNotice && (
          <div className="mt-4 p-3.5 bg-blue-950/70 border border-blue-700 text-blue-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn shadow">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{autoNotice}</span>
          </div>
        )}

        {/* 4 Financial Progress & KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Annual Goal */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">יעד שנתי מאושר</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              {isReadOnly ? (
                <div className="text-2xl font-black text-white" dir="ltr">
                  {Number(annualGoal).toLocaleString()} ₪
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={annualGoal}
                    onChange={(e) => setAnnualGoal(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xl font-black text-white focus:outline-none focus:border-blue-500 font-mono"
                    dir="ltr"
                  />
                  <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₪</span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-2 block">יעד ועד עמותת ידידי וולפסון ל-2026</span>
          </div>

          {/* Card 2: Actual Raised */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-emerald-300">גויס בפועל (2026 עד כה)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono" dir="ltr">
              {Number(currentRaised).toLocaleString()} ₪
            </div>
            <span className="text-[11px] text-slate-500 mt-2 block">
              37 תרומות מאומתות במערכת ({progressRaisedPct}% מהיעד)
            </span>
          </div>

          {/* Card 3: Pipeline Forecast */}
          <div className="bg-gradient-to-br from-slate-950/90 to-amber-950/30 border border-amber-800/40 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-amber-300">צפי תקבולים נוספים (מהטבלה)</span>
              <Calculator className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono" dir="ltr">
              +{totalPipelineIls.toLocaleString()} ₪
            </div>
            <span className="text-[11px] text-amber-400/80 mt-2 block">
              {pipelineItems.length} מענקים בצנרת ({progressPipelinePct}% מהיעד)
            </span>
          </div>

          {/* Card 4: Combined Expected Total */}
          <div className="bg-gradient-to-br from-slate-950/90 to-indigo-950/40 border border-indigo-700/50 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-indigo-300">סה״כ צפי שנתי משולב</span>
              <ArrowUpRight className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono" dir="ltr">
              {totalExpectedCombined.toLocaleString()} ₪
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px]">
              <span className="text-indigo-400 font-bold">{progressCombinedPct}% מהיעד</span>
              <span className="text-slate-400 font-mono" dir="ltr">
                {remainingToGoal > 0 ? `נותרו: ${remainingToGoal.toLocaleString()} ₪` : 'היעד הושג!'}
              </span>
            </div>
          </div>
        </div>

        {/* Total Progress Bar */}
        <div className="mt-5 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 mb-2 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>גויס בפועל: <strong className="text-emerald-400 font-mono">{progressRaisedPct}%</strong> ({Number(currentRaised).toLocaleString()} ₪)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>צפי נוסף בצנרת: <strong className="text-amber-300 font-mono">+{progressPipelinePct}%</strong> ({totalPipelineIls.toLocaleString()} ₪)</span>
              </span>
            </div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>סה״כ משולב:</span>
              <span className="text-indigo-300 font-mono text-sm">{progressCombinedPct}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, progressRaisedPct)}%` }}
              title={`גויס בפועל: ${progressRaisedPct}%`}
            />
            <div 
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${Math.min(100 - Math.min(100, progressRaisedPct), progressPipelinePct)}%` }}
              title={`צפי נוסף: ${progressPipelinePct}%`}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          FREE TEXT AREA & LIVE CURRENCY EXCHANGE CONTROLS
          ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                הערות חופשיות, צנרת תורמים (Pipeline) ודגשים אסטרטגיים
              </h3>
              <p className="text-xs text-slate-400">
                הקלד כאן צפי חופשי. המערכת בודקת אוטומטית את שערי המטבע החיים, ממירה לשקלים ומעדכנת את הטבלה!
              </p>
            </div>
          </div>

          {/* Live Automatic Currency Rates Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium whitespace-nowrap ml-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>שערים חיים (₪):</span>
            </div>
            
            {/* USD */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700/70" dir="ltr">
              <span className="text-amber-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                value={exchangeRates.USD}
                onChange={(e) => handleRateChange('USD', e.target.value)}
                disabled={isReadOnly}
                className="w-14 bg-transparent text-amber-300 font-mono font-bold text-center focus:outline-none"
              />
            </div>

            {/* EUR */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700/70" dir="ltr">
              <span className="text-blue-400 font-bold">€</span>
              <input
                type="number"
                step="0.01"
                value={exchangeRates.EUR}
                onChange={(e) => handleRateChange('EUR', e.target.value)}
                disabled={isReadOnly}
                className="w-14 bg-transparent text-blue-300 font-mono font-bold text-center focus:outline-none"
              />
            </div>

            {/* GBP */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700/70" dir="ltr">
              <span className="text-purple-400 font-bold">£</span>
              <input
                type="number"
                step="0.01"
                value={exchangeRates.GBP}
                onChange={(e) => handleRateChange('GBP', e.target.value)}
                disabled={isReadOnly}
                className="w-14 bg-transparent text-purple-300 font-mono font-bold text-center focus:outline-none"
              />
            </div>

            {!isReadOnly && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => syncLiveRates(true)}
                  disabled={isFetchingRates}
                  className="p-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                  title="בדוק וסנכרן שערים חיים עכשיו"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRates ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">סנכרן חי</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={6}
          value={pipelineNotes}
          onChange={handleNotesChange}
          disabled={isReadOnly}
          placeholder="תקבולים ומענקים צפויים (המשך 2026)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 leading-relaxed placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
        />

        {/* Live Calculation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Calculator className="w-4 h-4" />
            </span>
            <span className="text-slate-300">
              זוהו <strong>{pipelineItems.length}</strong> מקורות צפי | סה״כ מחושב בשקלים עפ״י שער חי (<span className="font-mono text-amber-300 font-bold" dir="ltr">{exchangeRates.USD} ₪ לדולר</span>): 
              <strong className="text-emerald-400 font-mono mr-1 text-sm font-black" dir="ltr">{totalPipelineIls.toLocaleString()} ₪</strong>
            </span>
          </div>

          {!isReadOnly && (
            <button
              onClick={() => handleParseAndCalculate()}
              disabled={isFetchingRates}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>חשב הכל בשקלים עפ״י שער מעודכן</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          THE TABLE BELOW: CALCULATED PIPELINE IN ILS WITH LAST UPDATED DATE
          ======================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                טבלת צפי תקבולים ומענקים לפי מקורות (Pipeline) - מחושב בשקלים
              </h3>
              <p className="text-xs text-slate-400">
                כל מקור חושב והומר לשקלים לפי שער מעודכן | תאריך עדכון אחרון לכל סעיף מוצג בטבלה
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-slate-300 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>עדכון אחרון של הטבלה: <strong className="text-white font-mono" dir="ltr">{lastTableUpdate}</strong></span>
            </div>

            {!isReadOnly && (
              <button
                onClick={() => setIsAddingManual(!isAddingManual)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>הוסף שורה ידנית</span>
              </button>
            )}
          </div>
        </div>

        {/* Manual Row Form */}
        {isAddingManual && (
          <form onSubmit={handleAddManualRow} className="bg-slate-950 p-4 rounded-xl border border-blue-500/40 space-y-3">
            <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>הוספת שורת צפי תקבול חדשה לטבלה</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-400 block mb-1">שם הגורם המממן / הפרויקט</label>
                <input
                  type="text"
                  required
                  placeholder="למשל: קרן עזריאלי"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">סכום מקורי</label>
                <input
                  type="number"
                  required
                  placeholder="100000"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">מטבע</label>
                <select
                  value={manualCurrency}
                  onChange={(e) => setManualCurrency(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="USD">דולר ($) - שער חי {exchangeRates.USD} ₪</option>
                  <option value="ILS">שקל (₪)</option>
                  <option value="EUR">אירו (€) - שער חי {exchangeRates.EUR} ₪</option>
                  <option value="GBP">ליש"ט (£) - שער חי {exchangeRates.GBP} ₪</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">פירוט, אבני דרך והערות</label>
              <input
                type="text"
                placeholder="למשל: תרומה ייעודית לרכישת ציוד..."
                value={manualDetails}
                onChange={(e) => setManualDetails(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingManual(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
              >
                הוסף שורה וחשב
              </button>
            </div>
          </form>
        )}

        {/* The Pipeline Table with Full Width & High Quality BiDi Styling */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 font-semibold bg-slate-950">
                <th className="py-3.5 px-3 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[240px]">מקור / גורם מממן</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center">סכום מקורי</th>
                <th className="py-3.5 px-3 min-w-[100px] text-center">שער המרה</th>
                <th className="py-3.5 px-4 min-w-[150px] text-emerald-400 font-bold text-center">
                  סכום מחושב בשקלים (₪)
                </th>
                <th className="py-3.5 px-4 min-w-[260px]">אבני דרך והערות</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center">תאריך עדכון אחרון</th>
                {!isReadOnly && <th className="py-3.5 px-3 text-center w-12">פעולות</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs bg-slate-900/50">
              {pipelineItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    לא הוזנו עדיין פריטי צפי. הקלד צפי בתיבת הטקסט למעלה כדי לחשב אוטומטית.
                  </td>
                </tr>
              ) : (
                pipelineItems.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-3 text-center text-slate-500 font-mono font-bold">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <span dir="auto" className="leading-normal">
                          {item.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200" dir="ltr">
                      {item.currency === 'USD' && '$'}
                      {item.currency === 'EUR' && '€'}
                      {item.currency === 'GBP' && '£'}
                      {Number(item.originalAmount).toLocaleString()}
                      {item.currency === 'ILS' && ' ₪'}
                      <span className="text-[10px] text-slate-400 ml-1.5 uppercase font-sans">({item.currency})</span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block text-[11px]" dir="ltr">
                        {item.currency === 'ILS' ? '1.00 ₪' : `${item.exchangeRate} ₪`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-400 text-sm whitespace-nowrap" dir="ltr">
                      {Number(item.amountIls).toLocaleString()} ₪
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 text-xs leading-relaxed" dir="auto">
                      {item.details}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full font-mono text-[11px] text-slate-300 whitespace-nowrap" dir="ltr">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>{item.lastUpdated || lastTableUpdate}</span>
                      </span>
                    </td>

                    {!isReadOnly && (
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="מחק שורה זו"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {pipelineItems.length > 0 && (
              <tfoot>
                <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 text-xs">
                  <td colSpan={4} className="py-4 px-4 text-white">
                    סה״כ צפי תקבולים ומענקים חדש (מחושב בשקלים לפי שער מעודכן):
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-base font-black text-emerald-300" dir="ltr">
                    {totalPipelineIls.toLocaleString()} ₪
                  </td>
                  <td colSpan={3} className="py-4 px-4 text-slate-400 text-left">
                    עודכן לאחרונה: <span className="font-mono text-slate-200" dir="ltr">{lastTableUpdate}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
