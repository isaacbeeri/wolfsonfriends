import React, { useState, useMemo, useRef } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle2, 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet,
  Save,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { 
  getContacts, 
  saveContacts, 
  resetContactsToDefault, 
  processContactsExcelFile, 
  updateContact, 
  addContact, 
  deleteContact 
} from '../../utils/adminDataService';

const CATEGORY_LABELS = {
  all: 'כל אנשי הקשר',
  board: 'ועד מנהל',
  management_and_audit: 'הנהלה וביקורת',
  general_members: 'חברי עמותה',
  advisors_and_emeriti: 'בדימוס ויועצים'
};

export function ContactsAdminTab({ userRole = 'viewer' }) {
  const isReadOnly = userRole === 'viewer';
  const fileInputRef = useRef(null);

  const [contacts, setContacts] = useState(() => getContacts());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Save & Upload feedback state
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }
  const [lastSavedTime, setLastSavedTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  });

  // Modals
  const [editingContact, setEditingContact] = useState(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    role: '',
    category: 'general_members',
    phone: '',
    email: ''
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const nameMatch = (c.fullName || '').toLowerCase().includes(q);
        const roleMatch = (c.role || '').toLowerCase().includes(q);
        const emailMatch = (c.email || '').toLowerCase().includes(q);
        const phoneMatch = (c.phone || '').includes(q);
        if (!nameMatch && !roleMatch && !emailMatch && !phoneMatch) {
          return false;
        }
      }
      return true;
    });
  }, [contacts, selectedCategory, searchTerm]);

  // Handle Excel Upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await processContactsExcelFile(file);
      if (result.success) {
        setContacts(result.contacts);
        setHasUnsavedChanges(false);
        const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        setLastSavedTime(now);
        showNotification('success', `קובץ האקסל נקלט בהצלחה! עודכנו ${result.totalParsed} אנשי קשר בדף הקשר.`);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', `שגיאה בקריאת קובץ האקסל: ${err.message || 'ודא שמבנה הקובץ תקין'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Manual Save All Changes Button
  const handleSaveAll = () => {
    const res = saveContacts(contacts);
    if (res.success) {
      setHasUnsavedChanges(false);
      const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      showNotification('success', `כל הפרטים נשמרו בהצלחה במאגר! (${now})`);
    } else {
      showNotification('error', `שגיאה בשמירת הנתונים: ${res.error}`);
    }
  };

  // Reset to original default directory
  const handleResetToDefault = () => {
    if (window.confirm('האם לשחזר את דף הקשר לרשימת המקור המאומתת (35 חברי הנהלה, ביקורת ועמותה)?')) {
      const def = resetContactsToDefault();
      setContacts(def);
      setHasUnsavedChanges(false);
      const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      showNotification('success', 'דף הקשר שוחזר בהצלחה לרשימת המקור המאומתת.');
    }
  };

  const handleEditClick = (c) => {
    if (isReadOnly) return;
    setEditingContact(c);
    setFormState({
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      role: c.role || '',
      category: c.category || 'general_members',
      phone: c.phone || '',
      email: c.email || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingContact) return;

    const updated = contacts.map(c => {
      if (c.id === editingContact.id) {
        return {
          ...c,
          firstName: formState.firstName,
          lastName: formState.lastName,
          fullName: `${formState.firstName} ${formState.lastName}`.trim() || c.fullName,
          role: formState.role,
          category: formState.category,
          phone: formState.phone,
          email: formState.email,
          allEmails: formState.email ? [formState.email] : []
        };
      }
      return c;
    });

    setContacts(updated);
    saveContacts(updated); // auto persist
    setHasUnsavedChanges(false);
    const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(now);
    setEditingContact(null);
    showNotification('success', `איש הקשר "${formState.firstName} ${formState.lastName}" עודכן ונשמר בהצלחה.`);
  };

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!formState.firstName && !formState.lastName) return;

    const newC = {
      id: Date.now(),
      excelRow: contacts.length + 2,
      firstName: formState.firstName || '',
      lastName: formState.lastName || '',
      fullName: `${formState.firstName || ''} ${formState.lastName || ''}`.trim(),
      role: formState.role || 'חבר/ת עמותה',
      category: formState.category || 'general_members',
      phone: formState.phone || '',
      email: formState.email || '',
      allEmails: formState.email ? [formState.email] : []
    };

    const updated = [newC, ...contacts];
    setContacts(updated);
    saveContacts(updated);
    setHasUnsavedChanges(false);
    const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(now);
    setIsAddingContact(false);
    setFormState({ firstName: '', lastName: '', role: '', category: 'general_members', phone: '', email: '' });
    showNotification('success', `איש הקשר "${newC.fullName}" נוסף ונשמר בהצלחה.`);
  };

  const handleDeleteContact = (id) => {
    if (isReadOnly) return;
    const target = contacts.find(c => c.id === id);
    if (window.confirm(`האם למחוק את "${target?.fullName || 'איש קשר זה'}" מדף הקשר?`)) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      saveContacts(updated);
      setHasUnsavedChanges(false);
      const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      showNotification('success', `איש הקשר הוסר בהצלחה מדף הקשר.`);
    }
  };

  const handleExportCsv = () => {
    const headers = ["שם פרטי", "שם משפחה", "שם מלא", "תפקיד / מחלקה", "קטגוריה", "טלפון נייד", "אימייל"];
    const rows = filteredContacts.map(c => [
      `"${(c.firstName || '').replace(/"/g, '""')}"`,
      `"${(c.lastName || '').replace(/"/g, '""')}"`,
      `"${(c.fullName || '').replace(/"/g, '""')}"`,
      `"${(c.role || '').replace(/"/g, '""')}"`,
      CATEGORY_LABELS[c.category] || c.category,
      c.phone || '',
      c.email || ''
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FWMC_Contacts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Hidden File Input for Excel */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleExcelUpload}
        accept=".xlsx,.xls"
        className="hidden"
      />

      {/* Top Action & Status Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              דף קשר - ועד מנהל, הנהלה ועמותה
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-normal">
                {contacts.length} אנשי קשר במאגר
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              עדכון ישיר על גבי המסך או העלאת קובץ אקסל מעודכן • נשמר ומאובטח במערכת
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isReadOnly && (
            <>
              {/* Upload Excel Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all shadow-md active:scale-95"
                title="העלאת קובץ אקסל מעודכן (למשל: דף קשר - ועד עמותה 2026.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isUploading ? 'מעבד אקסל...' : 'העלאת אקסל מעודכן'}</span>
              </button>

              {/* Save All Button */}
              <button
                onClick={handleSaveAll}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-white rounded-lg text-sm font-medium transition-all shadow-md active:scale-95 ${
                  hasUnsavedChanges 
                    ? 'bg-amber-600 hover:bg-amber-500 ring-2 ring-amber-400 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
                title="שמירת כל הנתונים והשינויים במסד הנתונים של המערכת"
              >
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? 'שמור שינויים עכשיו *' : 'שמור שינויים'}</span>
              </button>

              {/* Add New Contact Button */}
              <button
                onClick={() => {
                  setFormState({ firstName: '', lastName: '', role: '', category: 'general_members', phone: '', email: '' });
                  setIsAddingContact(true);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>איש קשר חדש</span>
              </button>

              {/* Reset to Default */}
              <button
                onClick={handleResetToDefault}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                title="איפוס ושחזור לדף קשר מקורי מאומת"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            title="ייצוא רשימת אנשי הקשר לקובץ CSV"
          >
            <Download className="w-4 h-4" />
            <span>ייצוא CSV</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-sm transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            : 'bg-red-950/60 border-red-500/40 text-red-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters, Search & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const count = key === 'all' ? contacts.length : contacts.filter(c => c.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  selectedCategory === key
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="חיפוש לפי שם, תפקיד, נייד או מייל..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-900/70 border-b border-slate-700 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span>מוצגות {filteredContacts.length} מתוך {contacts.length} רשומות</span>
            {selectedCategory !== 'all' && (
              <span className="text-xs text-blue-400 font-normal">
                (מסונן לפי: {CATEGORY_LABELS[selectedCategory]})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>שמירה אחרונה: {lastSavedTime}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">שם מלא</th>
                <th className="px-4 py-3 font-medium">תפקיד ומחלקה</th>
                <th className="px-4 py-3 font-medium">סיווג</th>
                <th className="px-4 py-3 font-medium">טלפון נייד</th>
                <th className="px-4 py-3 font-medium">אימייל</th>
                {!isReadOnly && <th className="px-4 py-3 text-center font-medium">פעולות ועריכה</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-500" />
                      <span>לא נמצאו אנשי קשר התואמים את החיפוש.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      {c.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs">
                      {c.role || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${
                        c.category === 'board'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : c.category === 'management_and_audit'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : c.category === 'general_members'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                      }`}>
                        {CATEGORY_LABELS[c.category] || c.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {c.phone ? (
                        <a 
                          href={`tel:${c.phone}`} 
                          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-blue-400 font-mono text-xs transition-colors"
                          dir="ltr"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {c.email ? (
                        <a 
                          href={`mailto:${c.email}`} 
                          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-blue-400 font-mono text-xs transition-colors"
                          dir="ltr"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                    {!isReadOnly && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                            title="ערוך איש קשר ישירות על המסך"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                            title="מחק איש קשר"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <span>עריכת איש קשר - {editingContact.fullName}</span>
              </h3>
              <button 
                onClick={() => setEditingContact(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">שם פרטי</label>
                  <input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">שם משפחה</label>
                  <input
                    type="text"
                    value={formState.lastName}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">תפקיד ומחלקה</label>
                <input
                  type="text"
                  value={formState.role}
                  onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">סיווג קטגוריה</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="board">ועד מנהל</option>
                  <option value="management_and_audit">הנהלה וביקורת</option>
                  <option value="general_members">חברי עמותה</option>
                  <option value="advisors_and_emeriti">בדימוס ויועצים</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">טלפון נייד</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="05X-XXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">אימייל</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setEditingContact(null)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>שמור שינויים</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Contact Modal */}
      {isAddingContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>הוספת איש קשר חדש לדף הקשר</span>
              </h3>
              <button 
                onClick={() => setIsAddingContact(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">שם פרטי</label>
                  <input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">שם משפחה</label>
                  <input
                    type="text"
                    value={formState.lastName}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">תפקיד ומחלקה</label>
                <input
                  type="text"
                  value={formState.role}
                  onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                  placeholder="לדוגמה: חבר ועד מנהל"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">סיווג קטגוריה</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="board">ועד מנהל</option>
                  <option value="management_and_audit">הנהלה וביקורת</option>
                  <option value="general_members">חברי עמותה</option>
                  <option value="advisors_and_emeriti">בדימוס ויועצים</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">טלפון נייד</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="05X-XXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">אימייל</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddingContact(false)}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>הוסף ושמור איש קשר</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
