/**
 * Admin Data Service
 * Manages Donations, Contacts Directory, and Fundraising Forecasts.
 * Uses client-side XLSX parser for immediate Excel file ingestion and localStorage persistence.
 * Uses currencyService for real-time live exchange rates.
 */

import * as XLSX from 'xlsx';
import { INITIAL_DONATIONS, INITIAL_DONORS } from '../data/donationsData.js';
import initialBoardMembersData from '../data/boardMembers.json';
import { getStoredLiveRates, fetchLiveExchangeRates, convertToIls } from './currencyService.js';
import { 
  encryptData, 
  decryptData, 
  isEncrypted, 
  initSessionCryptoKey, 
  wipeSessionCryptoKey 
} from './cryptoService.js';

const DONATIONS_OVERRIDE_KEY = 'fwmc_portal_donations_override_v2';
const CONTACTS_OVERRIDE_KEY = 'fwmc_portal_contacts_override_v2';
const FORECAST_STORAGE_KEY = 'fwmc_portal_forecast_v3';

export { getStoredLiveRates, fetchLiveExchangeRates, convertToIls };

// Ephemeral in-memory decrypted cache for active authenticated session
let memoryVault = {
  donations: null,
  contacts: null,
  forecast: null
};

/**
 * Initializes the encrypted data vault upon authenticated 2FA login.
 * Transparently decrypts AES-256-GCM data into volatile memory and auto-encrypts any legacy items.
 */
export async function initializeAdminDataVault() {
  await initSessionCryptoKey();

  // 1. Decrypt Donations
  try {
    const rawDonations = localStorage.getItem(DONATIONS_OVERRIDE_KEY);
    if (rawDonations) {
      if (isEncrypted(rawDonations)) {
        memoryVault.donations = await decryptData(rawDonations);
      } else {
        memoryVault.donations = JSON.parse(rawDonations);
        const enc = await encryptData(memoryVault.donations);
        localStorage.setItem(DONATIONS_OVERRIDE_KEY, enc);
      }
    }
  } catch (e) {
    console.warn("Vault donations init notice:", e);
  }

  // 2. Decrypt Contacts
  try {
    const rawContacts = localStorage.getItem(CONTACTS_OVERRIDE_KEY);
    if (rawContacts) {
      if (isEncrypted(rawContacts)) {
        memoryVault.contacts = await decryptData(rawContacts);
      } else {
        memoryVault.contacts = JSON.parse(rawContacts);
        const enc = await encryptData(memoryVault.contacts);
        localStorage.setItem(CONTACTS_OVERRIDE_KEY, enc);
      }
    }
  } catch (e) {
    console.warn("Vault contacts init notice:", e);
  }

  // 3. Decrypt Forecast
  try {
    const rawForecast = localStorage.getItem(FORECAST_STORAGE_KEY);
    if (rawForecast) {
      if (isEncrypted(rawForecast)) {
        memoryVault.forecast = await decryptData(rawForecast);
      } else {
        memoryVault.forecast = JSON.parse(rawForecast);
        const enc = await encryptData(memoryVault.forecast);
        localStorage.setItem(FORECAST_STORAGE_KEY, enc);
      }
    }
  } catch (e) {
    console.warn("Vault forecast init notice:", e);
  }

  return true;
}

/**
 * Wipes the decrypted data and cryptographic keys from memory on logout/timeout
 */
export function wipeAdminDataVault() {
  memoryVault = {
    donations: null,
    contacts: null,
    forecast: null
  };
  wipeSessionCryptoKey();
}

export const OFFICIAL_BOI_RATES = {
  USD: 3.03,
  EUR: 3.48,
  GBP: 4.05,
  ILS: 1.0
};

export const DEFAULT_EXCHANGE_RATES = getStoredLiveRates();

/**
 * Parses free text containing pipeline grant / donation forecast items.
 * Extracts amounts in USD/EUR/GBP/ILS and calculates corresponding values in ILS (₪).
 */
export function parsePipelineText(text, exchangeRates = getStoredLiveRates()) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (line.startsWith('תקבולים') && !line.includes(':')) continue;
    
    let title = line;
    let details = line;
    if (line.includes(':')) {
      const parts = line.split(':');
      title = parts[0].trim();
      details = parts.slice(1).join(':').trim();
    }
    
    // Detect currency
    let currency = 'ILS';
    let rate = 1.0;
    if (/דולר|\$|usd/i.test(line)) {
      currency = 'USD';
      rate = exchangeRates.USD || 3.03;
    } else if (/אירו|יורו|€|eur/i.test(line)) {
      currency = 'EUR';
      rate = exchangeRates.EUR || 3.48;
    } else if (/ליש"ט|פאונד|£|gbp/i.test(line)) {
      currency = 'GBP';
      rate = exchangeRates.GBP || 4.05;
    }
    
    // Detect amount
    let originalAmount = 0;
    const milMatch = details.match(/(\d+(?:\.\d+)?)\s*מיליון/);
    if (milMatch) {
      originalAmount = parseFloat(milMatch[1]) * 1000000;
    } else {
      const numMatch = details.match(/(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)/);
      if (numMatch) {
        originalAmount = parseFloat(numMatch[1].replace(/,/g, ''));
      }
    }
    
    if (originalAmount > 0) {
      const amountIls = Math.round(originalAmount * rate);
      items.push({
        id: `pipe_${idx}_${Date.now()}`,
        title,
        details,
        currency,
        originalAmount,
        exchangeRate: rate,
        amountIls,
        lastUpdated: dateStr
      });
    }
  }
  return items;
}

const DEFAULT_FORECAST_TEXT = `תקבולים ומענקים צפויים (המשך 2026)
קרן וולפסון (The Wolfson Foundation): מענק של כ-1.1 מיליון דולר (המקור המרכזי הצפוי עד סוף השנה).
מענק מחלקת המדינה האמריקאית / USAID לשעבר (Operating Together / טראומה): כ-400,000 דולר במסגרת אבני הדרך (Milestones) השוטפות.
קק"ל (JNF / KKL): תרומה צפויה בהיקף של כ-250,000 דולר.
הקדש דוריאו פאול: 280,000 ₪ עבור פרסי מחקר ומלגות לחוקרים.`;

const INITIAL_PIPELINE_ITEMS = parsePipelineText(DEFAULT_FORECAST_TEXT, OFFICIAL_BOI_RATES);

// Initial default forecast data
const DEFAULT_FORECAST = {
  year: 2026,
  annualGoalIls: 15000000,
  currentRaisedIls: 3115244.75,
  totalExpectedIls: 5582500,
  lastUpdated: '19.09.2026 20:45',
  updatedBy: 'צחי בארי',
  exchangeRates: OFFICIAL_BOI_RATES,
  pipelineNotes: DEFAULT_FORECAST_TEXT,
  pipelineItems: INITIAL_PIPELINE_ITEMS,
  campaigns: [
    {
      id: 'c1',
      title: 'ניידת PET-CT היברידית',
      targetIls: 18000000,
      raisedIls: 0,
      status: 'גיוס פילנתרופי פעיל - פנייה לקרנות מובילות בארץ ובחו״ל',
      priority: 'עליונה'
    },
    {
      id: 'c2',
      title: 'הסבת אקדמאים לסיעוד (קרן מקס ברני)',
      targetIls: 1200000,
      raisedIls: 957340,
      status: 'מחזורים 4, 6, 7, 8 ו-9 בפעילות',
      priority: 'גבוהה'
    },
    {
      id: 'c3',
      title: 'פרויקט טראומה והצלת חיים (USAID / State Dept)',
      targetIls: 1500000,
      raisedIls: 1241271,
      status: 'הושלמו אבני דרך 20-23',
      priority: 'גבוהה'
    },
    {
      id: 'c4',
      title: 'מערך עיניים (מיקרוסקופ ZEISS + מכשיר OCT Cirrus)',
      targetIls: 800000,
      raisedIls: 685000,
      status: 'תרומות משפחות מנדלבאום ועמוס ופנינה כהן',
      priority: 'הושלם ברובו'
    }
  ]
};

/* ============================================================
   DONATIONS API
   ============================================================ */

export function getDonations() {
  if (memoryVault.donations && Array.isArray(memoryVault.donations) && memoryVault.donations.length > 0) {
    return memoryVault.donations;
  }
  try {
    const raw = localStorage.getItem(DONATIONS_OVERRIDE_KEY);
    if (raw) {
      if (!isEncrypted(raw)) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryVault.donations = parsed;
          return parsed;
        }
      }
    }
  } catch (e) {}
  return INITIAL_DONATIONS;
}

export function saveDonations(donations) {
  memoryVault.donations = donations;
  // Encrypt with AES-256-GCM asynchronously at rest
  encryptData(donations).then(encryptedString => {
    try {
      localStorage.setItem(DONATIONS_OVERRIDE_KEY, encryptedString);
    } catch (e) {
      console.error("Could not write encrypted donations:", e);
    }
  }).catch(err => {
    console.error("Encryption error on donations save:", err);
  });
  return { success: true };
}

export function resetDonationsToDefault() {
  try {
    localStorage.removeItem(DONATIONS_OVERRIDE_KEY);
    localStorage.removeItem('fwmc_portal_donations_override_v1');
    memoryVault.donations = INITIAL_DONATIONS;
  } catch (e) {}
  return INITIAL_DONATIONS;
}

function cleanNum(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const s = String(val).replace(/,/g, '').trim();
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

function parseExcelDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  if (typeof val === 'number' && val > 30000 && val < 60000) {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    return d.toISOString().split('T')[0];
  }
  const s = String(val).trim();
  const parts = s.split(/[\.\/\-]/);
  if (parts.length === 3) {
    let d = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    let y = parseInt(parts[2], 10);
    if (y < 100) y += 2000;
    if (y > 2000 && y < 2050 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
  }
  return null;
}

function isInvalidDonorName(name) {
  if (!name) return true;
  const s = String(name).trim();
  if (!s || s.length < 2) return true;
  if (/^\d+$/.test(s)) return true; // pure numbers like '1', '2', '3'
  if (/^(חד פעמי|הוראת קבע|תשלום|מספר תשלום|סה"כ|סך הכל|ס ה " כ)$/i.test(s)) return true;
  if (s.includes('סה"כ') || s.includes('ס ה " כ') || s.includes('סך הכל')) return true;
  return false;
}

/**
 * Parses an uploaded Excel file for donations (.xlsx) with strict validation
 */
export async function processDonationsExcelFile(file) {
  const data = await file.arrayBuffer();
  const xlsx = XLSX;
  const workbook = xlsx.read(data, { type: 'array', cellDates: true });
  
  const parsedRecords = [];
  const validSheetRegex = /^תרומות\s*(\d{2,4})$/i;
  let sheetsProcessed = 0;

  for (const sheetName of workbook.SheetNames) {
    const match = sheetName.match(validSheetRegex);
    // Strictly skip auxiliary sub-schedules (like 'לב חבד' or 'משרד הבריאות')
    if (!match) continue;

    let defaultYear = parseInt(match[1], 10);
    if (defaultYear < 100) defaultYear += 2000;

    const ws = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: null });
    if (!rows || rows.length < 2) continue;

    sheetsProcessed++;

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

    for (let r = headerRowIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const rawDonor = row[colDonor];
      if (isInvalidDonorName(rawDonor)) continue;
      const donorStr = String(rawDonor).trim();

      const ilsVal = cleanNum(row[colIls]);
      if (ilsVal <= 0) continue;

      // Filter out 9-digit tax IDs mistakenly placed in amount column
      if (ilsVal > 100000000 && /^\d{9}$/.test(String(Math.round(ilsVal)))) {
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
    }
  }

  if (parsedRecords.length > 0) {
    saveDonations(parsedRecords);
  }

  const donations2026 = parsedRecords.filter(d => d.year === 2026);
  const sum2026 = donations2026.reduce((s, d) => s + d.amountIls, 0);
  const totalAmount = parsedRecords.reduce((s, d) => s + d.amountIls, 0);

  return {
    success: true,
    sheetsProcessed,
    importedCount: parsedRecords.length,
    totalImportedAmount: totalAmount,
    count2026: donations2026.length,
    sum2026: sum2026
  };
}

/* ============================================================
   CONTACTS DIRECTORY API
   ============================================================ */

export function getContacts() {
  if (memoryVault.contacts && Array.isArray(memoryVault.contacts) && memoryVault.contacts.length > 0) {
    return memoryVault.contacts;
  }
  try {
    const raw = localStorage.getItem(CONTACTS_OVERRIDE_KEY);
    if (raw) {
      if (!isEncrypted(raw)) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryVault.contacts = parsed;
          return parsed;
        }
      }
    }
  } catch (e) {}
  return (initialBoardMembersData.contacts || initialBoardMembersData.members || []);
}

export function saveContacts(contacts) {
  memoryVault.contacts = contacts;
  encryptData(contacts).then(encryptedString => {
    try {
      localStorage.setItem(CONTACTS_OVERRIDE_KEY, encryptedString);
    } catch (e) {
      console.error("Could not write encrypted contacts:", e);
    }
  }).catch(err => {
    console.error("Encryption error on contacts save:", err);
  });
  return { success: true };
}

export function resetContactsToDefault() {
  try {
    localStorage.removeItem(CONTACTS_OVERRIDE_KEY);
    memoryVault.contacts = (initialBoardMembersData.contacts || initialBoardMembersData.members || []);
  } catch (e) {}
  return (initialBoardMembersData.contacts || initialBoardMembersData.members || []);
}

/**
 * Parses an uploaded Excel file for Contacts Directory (.xlsx)
 */
export async function processContactsExcelFile(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('קובץ האקסל אינו מכיל גיליונות.');
  }

  // Use the first sheet or the sheet named דף קשר
  let targetSheetName = workbook.SheetNames.find(n => n.includes('קשר') || n.includes('ועד')) || workbook.SheetNames[0];
  const ws = workbook.Sheets[targetSheetName];
  const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  if (rawRows.length < 2) {
    throw new Error('קובץ האקסל ריק או אינו מכיל שורות נתונים.');
  }

  function classifyRole(role) {
    const r = (role || '').toLowerCase();
    if (r.includes('ועד מנהל') || r.includes('יושב ראש') || r.includes('יו"ר') || r.includes('גזבר') || r.includes('חתימה')) {
      return 'board';
    }
    if (r.includes('רו"ח') || r.includes('רואה חשבון') || r.includes('מנכ"ל') || r.includes('חשבונות') || r.includes('ביקורת')) {
      return 'management_and_audit';
    }
    if (r.includes('בדימוס') || r.includes('יועץ') || r.includes('לשעבר') || r.includes('מתנדב')) {
      return 'advisors_and_emeriti';
    }
    return 'general_members';
  }

  function parsePhone(val) {
    if (!val) return '';
    let s = String(val).trim().replace(/[^\d]/g, '');
    if (s.startsWith('972')) s = '0' + s.slice(3);
    if (s.length === 9 && s.startsWith('5')) s = '0' + s;
    if (s.length === 10 && s.startsWith('05')) {
      return s.slice(0, 3) + '-' + s.slice(3);
    }
    if (s.length === 9 && s.startsWith('0')) {
      return s.slice(0, 2) + '-' + s.slice(2);
    }
    return String(val).trim();
  }

  let headerIdx = -1;
  let colMap = { role: -1, firstName: -1, lastName: -1, fullName: -1, phone: -1, email: -1 };

  for (let i = 0; i < Math.min(15, rawRows.length); i++) {
    const row = rawRows[i].map(c => String(c).trim().toLowerCase());
    for (let c = 0; c < row.length; c++) {
      const cell = row[c];
      if (cell.includes('מחלקה') || cell.includes('תפקיד') || cell.includes('הגדרה') || cell === 'role') colMap.role = c;
      if (cell.includes('שם פרטי') || cell === 'פרטי' || cell === 'first name') colMap.firstName = c;
      if (cell.includes('שם משפחה') || cell === 'משפחה' || cell === 'last name') colMap.lastName = c;
      if (cell === 'שם מלא' || cell === 'שם' || cell === 'שם חבר' || cell === 'full name') colMap.fullName = c;
      if (cell.includes('נייד') || cell.includes('סלולרי') || cell.includes('טלפון') || cell.includes('phone') || cell.includes('mobile')) colMap.phone = c;
      if (cell.includes('מייל') || cell.includes('אימייל') || cell.includes('דוא"ל') || cell.includes('email')) colMap.email = c;
    }
    if (colMap.phone !== -1 || (colMap.firstName !== -1 && colMap.lastName !== -1) || colMap.role !== -1) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx === -1) {
    headerIdx = 0;
    colMap = { role: 0, firstName: 1, lastName: 2, fullName: -1, phone: 3, email: 4 };
  }

  const parsedContacts = [];
  for (let i = headerIdx + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.every(cell => !String(cell).trim())) continue;

    const firstName = colMap.firstName !== -1 ? String(row[colMap.firstName] || '').trim() : '';
    const lastName = colMap.lastName !== -1 ? String(row[colMap.lastName] || '').trim() : '';
    let fullName = '';
    if (colMap.fullName !== -1 && row[colMap.fullName]) {
      fullName = String(row[colMap.fullName]).trim();
    } else {
      fullName = `${firstName} ${lastName}`.trim();
    }
    
    // Skip empty names or duplicate headers
    if (!fullName || fullName === 'שם מלא' || fullName.includes('שם פרטי')) continue;

    const role = colMap.role !== -1 ? String(row[colMap.role] || '').trim() : '';
    const phone = colMap.phone !== -1 ? parsePhone(row[colMap.phone]) : '';
    const email = colMap.email !== -1 ? String(row[colMap.email] || '').trim() : '';
    const category = classifyRole(role);

    parsedContacts.push({
      id: Date.now() + i,
      excelRow: i + 1,
      firstName: firstName || fullName.split(' ')[0] || '',
      lastName: lastName || fullName.split(' ').slice(1).join(' ') || '',
      fullName,
      role,
      category,
      phone,
      email,
      allEmails: email ? [email] : []
    });
  }

  if (parsedContacts.length === 0) {
    throw new Error('לא זוהו רשומות אנשי קשר תקינות בקובץ.');
  }

  saveContacts(parsedContacts);

  return {
    success: true,
    totalParsed: parsedContacts.length,
    contacts: parsedContacts,
    message: `נקלטו בהצלחה ${parsedContacts.length} אנשי קשר מדף הקשר המעודכן.`
  };
}

export function updateContact(contactId, updatedFields) {
  const contacts = getContacts();
  const idx = contacts.findIndex(c => c.id === contactId);
  if (idx === -1) return { success: false, error: 'איש קשר לא נמצא' };
  
  contacts[idx] = { ...contacts[idx], ...updatedFields };
  saveContacts(contacts);
  return { success: true, contact: contacts[idx] };
}

export function addContact(newContact) {
  const contacts = getContacts();
  const contact = {
    id: Date.now(),
    excelRow: contacts.length + 2,
    firstName: newContact.firstName || '',
    lastName: newContact.lastName || '',
    fullName: `${newContact.firstName || ''} ${newContact.lastName || ''}`.trim(),
    role: newContact.role || 'חבר/ת עמותה',
    category: newContact.category || 'general_members',
    phone: newContact.phone || '',
    email: newContact.email || '',
    allEmails: newContact.email ? [newContact.email] : []
  };
  contacts.push(contact);
  saveContacts(contacts);
  return { success: true, contact };
}

export function deleteContact(contactId) {
  let contacts = getContacts();
  contacts = contacts.filter(c => c.id !== contactId);
  saveContacts(contacts);
  return { success: true };
}

/* ============================================================
   FORECAST API
   ============================================================ */

export function getForecast() {
  if (memoryVault.forecast && typeof memoryVault.forecast === 'object' && Array.isArray(memoryVault.forecast.pipelineItems)) {
    return memoryVault.forecast;
  }
  try {
    const raw = localStorage.getItem(FORECAST_STORAGE_KEY);
    if (raw) {
      if (!isEncrypted(raw)) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.pipelineItems)) {
          memoryVault.forecast = parsed;
          return parsed;
        }
      }
    }
  } catch (e) {}
  return DEFAULT_FORECAST;
}

export function saveForecast(forecast) {
  try {
    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL') + ' ' + now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const data = {
      ...forecast,
      lastUpdated: dateStr
    };
    memoryVault.forecast = data;
    encryptData(data).then(encryptedString => {
      try {
        localStorage.setItem(FORECAST_STORAGE_KEY, encryptedString);
      } catch (e) {
        console.error("Could not write encrypted forecast:", e);
      }
    }).catch(err => {
      console.error("Encryption error on forecast save:", err);
    });
    return { success: true, forecast: data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
