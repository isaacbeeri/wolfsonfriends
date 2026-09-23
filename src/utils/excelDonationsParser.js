/**
 * Excel Donations Parser & Audit Inspector
 * fwmc - Wolfson Medical Center Friends Association
 *
 * Provides resilient, audited parsing of donation spreadsheets ('תרומות 17-26.xlsx').
 * Detects headers dynamically, handles legacy sub-schedules, strips phone numbers/tax IDs from amounts,
 * provides detailed pre-import diff analysis, and commits changes safely to storage.
 */

import * as XLSX from 'xlsx';
import { saveDonations } from './adminDataService.js';

export function cleanNum(val) {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/,/g, '').replace(/[₪$€]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function isInvalidDonorName(name) {
  if (!name) return true;
  const str = String(name).trim();
  if (str.length < 2) return true;
  // Summary lines, subheadings, or column repeats
  if (/^(סה"?כ|סך הכל|סהכ|סה״כ|סך-הכל|total|סיכום)/i.test(str)) return true;
  if (/^תרומות שהתקבלו|^העברות|^פירוט|^שם תורם|^תורם/i.test(str)) return true;
  return false;
}

export function parseExcelDate(val) {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toISOString().substring(0, 10);
  }
  const str = String(val).trim();
  const m = str.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{2,4})$/);
  if (m) {
    let day = parseInt(m[1], 10);
    let month = parseInt(m[2], 10);
    let year = parseInt(m[3], 10);
    if (year < 100) year += 2000;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return null;
}

/**
 * Parses XLSX workbook with donation sheets.
 * @param {XLSX.WorkBook} workbook
 * @returns {{ records: Array, sheetStats: Object }}
 */
export function parseDonationsWorkbook(workbook) {
  const parsedRecords = [];
  const validSheetRegex = /^תרומות\s*(\d{2,4})$/i;
  const sheetStats = {};

  for (const sheetName of workbook.SheetNames) {
    const match = sheetName.match(validSheetRegex);
    if (!match) continue;

    let defaultYear = parseInt(match[1], 10);
    if (defaultYear < 100) defaultYear += 2000;

    const ws = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    if (!rows || rows.length < 2) continue;

    let colDonor = 0, colDate = 1, colReceipt = 2, colTax = -1, colIls = -1, colForeign = -1, colPurpose = -1, colCard = -1, colNotes = -1;
    let headerRowIdx = -1;

    for (let r = 0; r < Math.min(rows.length, 5); r++) {
      const row = rows[r];
      if (!row) continue;
      let foundDonor = -1, foundIls = -1;
      for (let c = 0; c < Math.min(row.length, 9); c++) {
        const s = String(row[c] || '').trim();
        if (s.includes('תורם') && !s.includes('משרד הבריאות')) foundDonor = c;
        if ((s.includes('בש"ח') || s.includes('ש"ח') || s.includes('סכום')) && !s.includes('מט"ח') && !s.includes('תרומה')) {
          foundIls = c;
        }
      }
      if (foundDonor >= 0 && foundIls >= 0) {
        headerRowIdx = r;
        colDonor = foundDonor;
        colIls = foundIls;
        for (let c = 0; c < Math.min(row.length, 12); c++) {
          const s = String(row[c] || '').trim();
          if (s.includes('תאריך')) colDate = c;
          else if (s.includes('קבלה')) colReceipt = c;
          else if (s.includes('ח.פ') || s.includes('זהות')) colTax = c;
          else if (s.includes('מט"ח')) colForeign = c;
          else if (s.includes('ייעוד') || s.includes('יעוד')) colPurpose = c;
          else if (s.includes('חשבשבת') || s.includes('כרטיס')) colCard = c;
          else if (s.includes('תקורה') || s.includes('הערות')) colNotes = c;
        }
        break;
      }
    }

    if (headerRowIdx === -1 || colIls === -1 || colIls === colTax) {
      if (defaultYear >= 2021) {
        colDonor = 0; colDate = 2; colReceipt = 3; colTax = 4; colIls = 5; colForeign = 6; colPurpose = 7; colCard = 8;
        headerRowIdx = 0;
      } else if (defaultYear === 2019 || defaultYear === 2020) {
        colDonor = 0; colDate = 1; colReceipt = 2; colTax = 3; colIls = 4; colForeign = 5; colPurpose = 6; colCard = 7;
        headerRowIdx = 0;
      } else {
        colDonor = 0; colDate = 1; colReceipt = 2; colTax = -1; colIls = 3; colForeign = 4; colPurpose = 5; colCard = 6;
        headerRowIdx = defaultYear === 2018 ? 2 : 0;
      }
    }

    let sheetCount = 0;
    let sheetSum = 0;

    for (let r = headerRowIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const rawDonor = row[colDonor];
      if (isInvalidDonorName(rawDonor)) continue;
      const donorStr = String(rawDonor).trim();

      const ilsVal = cleanNum(row[colIls]);
      if (ilsVal <= 0) continue;

      // Filter out 9-10 digit tax IDs or phone numbers mistakenly placed in amount column
      if (ilsVal > 100000000 && /^\d{9,10}$/.test(String(Math.round(ilsVal)))) {
        continue;
      }

      const dateIso = parseExcelDate(row[colDate]);
      let recordYear = defaultYear;
      if (dateIso) {
        const parsedYear = parseInt(dateIso.substring(0, 4), 10);
        if (parsedYear >= 2016 && parsedYear <= 2030) {
          recordYear = parsedYear;
        }
      }

      const receiptVal = (colReceipt >= 0 && row[colReceipt]) ? String(row[colReceipt]).trim() : null;
      const foreignVal = (colForeign >= 0 && row[colForeign]) ? String(row[colForeign]).trim() : null;
      const purposeVal = (colPurpose >= 0 && row[colPurpose]) ? String(row[colPurpose]).trim() : 'כללי';
      const cardVal = (colCard >= 0 && row[colCard]) ? String(row[colCard]).trim() : null;
      const notesVal = (colNotes >= 0 && row[colNotes]) ? String(row[colNotes]).trim() : null;

      parsedRecords.push({
        id: `${recordYear}_${r}_${receiptVal || 'r'}`,
        year: recordYear,
        donorName: donorStr,
        date: dateIso,
        amountIls: Math.round(ilsVal * 100) / 100,
        foreignAmount: foreignVal,
        currency: (foreignVal && foreignVal.includes('$')) ? 'USD' : 'ILS',
        purpose: purposeVal,
        cardCode: cardVal,
        notes: notesVal,
        sheet: sheetName
      });

      sheetCount++;
      sheetSum += ilsVal;
    }

    sheetStats[sheetName] = {
      year: defaultYear,
      count: sheetCount,
      sumIls: Math.round(sheetSum * 100) / 100
    };
  }

  return { records: parsedRecords, sheetStats };
}

/**
 * Inspects uploaded file and compares against current active records without committing yet.
 * @param {File|Blob} file
 * @param {Array} currentRecords
 * @returns {Promise<Object>}
 */
export async function inspectDonationsExcelFile(file, currentRecords = []) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array', cellDates: true });
  const { records: newRecords, sheetStats } = parseDonationsWorkbook(workbook);

  if (newRecords.length === 0) {
    throw new Error('לא זוהו רשומות תרומות תקינות בקובץ. אנא ודא שהקובץ כולל גליונות בשם "תרומות 20XX" או "תרומות XX".');
  }

  // Pre-calculate statistics
  const currentTotalIls = currentRecords.reduce((s, r) => s + (Number(r.amountIls) || 0), 0);
  const newTotalIls = newRecords.reduce((s, r) => s + (Number(r.amountIls) || 0), 0);

  // By-year breakdown comparison
  const yearsSet = new Set([
    ...currentRecords.map(r => r.year),
    ...newRecords.map(r => r.year)
  ]);
  const sortedYears = Array.from(yearsSet).filter(Boolean).sort((a, b) => b - a);

  const yearComparison = sortedYears.map(year => {
    const curForYear = currentRecords.filter(r => r.year === year);
    const newForYear = newRecords.filter(r => r.year === year);
    const curSum = curForYear.reduce((s, r) => s + (Number(r.amountIls) || 0), 0);
    const newSum = newForYear.reduce((s, r) => s + (Number(r.amountIls) || 0), 0);

    return {
      year,
      oldCount: curForYear.length,
      newCount: newForYear.length,
      diffCount: newForYear.length - curForYear.length,
      oldSum: Math.round(curSum),
      newSum: Math.round(newSum),
      diffSum: Math.round(newSum - curSum)
    };
  });

  const donations2026 = newRecords.filter(r => r.year === 2026);
  const sum2026 = donations2026.reduce((s, r) => s + (Number(r.amountIls) || 0), 0);

  return {
    success: true,
    fileName: file.name,
    fileSize: file.size,
    parsedCount: newRecords.length,
    currentCount: currentRecords.length,
    diffCount: newRecords.length - currentRecords.length,
    newTotalIls: Math.round(newTotalIls),
    currentTotalIls: Math.round(currentTotalIls),
    diffTotalIls: Math.round(newTotalIls - currentTotalIls),
    donations2026Count: donations2026.length,
    donations2026Sum: Math.round(sum2026),
    yearComparison,
    sheetStats,
    sampleRecords: newRecords.slice(0, 8),
    records: newRecords
  };
}

/**
 * Commits the inspected records into the encrypted vault & local cache.
 * @param {Array} records
 * @returns {Object}
 */
export function applyParsedDonations(records) {
  if (!records || !Array.isArray(records) || records.length === 0) {
    throw new Error('רשימת הרשומות להחלה ריקה או לא תקינה.');
  }
  saveDonations(records);
  return {
    success: true,
    count: records.length,
    totalIls: records.reduce((s, r) => s + (Number(r.amountIls) || 0), 0)
  };
}