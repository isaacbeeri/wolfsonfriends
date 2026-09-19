import React, { useState, useMemo } from 'react';
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
  FileSpreadsheet 
} from 'lucide-react';
import { getContacts, updateContact, addContact, deleteContact } from '../../utils/adminDataService';

const CATEGORY_LABELS = {
  all: 'כל אנשי הקשר',
  board: 'ועד מנהל',
  management_and_audit: 'הנהלה וביקורת',
  general_members: 'חברי עמותה',
  advisors_and_emeriti: 'בדימוס ויועצים'
};

export function ContactsAdminTab({ userRole = 'viewer' }) {
  const isReadOnly = userRole === 'viewer';
  const [contacts, setContacts] = useState(() => getContacts());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
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

    const res = updateContact(editingContact.id, {
      firstName: formState.firstName,
      lastName: formState.lastName,
      fullName: `${formState.firstName} ${formState.lastName}`.trim(),
      role: formState.role,
      category: formState.category,
      phone: formState.phone,
      email: formState.email,
      allEmails: formState.email ? [formState.email] : []
    });

    if (res.success) {
      setContacts(getContacts());
      setEditingContact(null);
    }
  };

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!formState.firstName && !formState.lastName) return;

    addContact(formState);
    setContacts(getContacts());
    setIsAddingContact(false);
    setFormState({ firstName: '', lastName: '', role: '', category: 'general_members', phone: '', email: '' });
  };

  const handleDeleteContact = (id) => {
    if (isReadOnly) return;
    if (window.confirm('האם אתה בטוח שברצונך למחוק איש קשר זה מדף הקשר?')) {
      deleteContact(id);
      setContacts(getContacts());
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
    <div className="space-y-6">
      {/* Category Pills & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const count = key === 'all' ? contacts.length : contacts.filter(c => c.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="חיפוש איש קשר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {!isReadOnly && (
            <button
              onClick={() => {
                setFormState({ firstName: '', lastName: '', role: '', category: 'general_members', phone: '', email: '' });
                setIsAddingContact(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              <span>איש קשר חדש</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ייצוא CSV</span>
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow">
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-700 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">
            דף קשר - ועד, הנהלה ועמותה ({filteredContacts.length} רשומות)
          </div>
          <span className="text-xs text-slate-400">
            קובץ מקור: דף קשר - ועד עמותה (012026).xlsx
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">שם מלא</th>
                <th className="px-4 py-3">תפקיד ומחלקה</th>
                <th className="px-4 py-3">סיווג</th>
                <th className="px-4 py-3">טלפון נייד</th>
                <th className="px-4 py-3">אימייל</th>
                {!isReadOnly && <th className="px-4 py-3 text-center">פעולות</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    לא נמצאו אנשי קשר התואמים את החיפוש.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      {c.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {c.role || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        c.category === 'board'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : c.category === 'management_and_audit'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : c.category === 'general_members'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {CATEGORY_LABELS[c.category] || c.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {c.phone ? (
                        <a 
                          href={`tel:${c.phone}`} 
                          className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono text-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{c.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">לא צוין</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.email ? (
                        <a 
                          href={`mailto:${c.email}`} 
                          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-mono text-xs"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">לא צוין</span>
                      )}
                    </td>
                    {!isReadOnly && (
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white rounded-md transition-colors"
                            title="ערוך פרטים"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="p-1.5 bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white rounded-md transition-colors"
                            title="מחק איש קשר"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Edit / Add Modal */}
      {(editingContact || isAddingContact) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingContact ? `עריכת פרטי: ${editingContact.fullName}` : 'הוספת איש קשר חדש'}
              </h3>
              <button
                onClick={() => { setEditingContact(null); setIsAddingContact(false); }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingContact ? handleSaveEdit : handleCreateContact} className="space-y-4 text-right">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">שם פרטי</label>
                  <input
                    type="text"
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">שם משפחה</label>
                  <input
                    type="text"
                    value={formState.lastName}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">תפקיד / הגדרת מחלקה בעמותה</label>
                <input
                  type="text"
                  value={formState.role}
                  onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                  placeholder="למשל: חבר וועד מנהל, גזבר"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">סיווג / קטגוריה</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="board">ועד מנהל</option>
                  <option value="management_and_audit">הנהלה וביקורת</option>
                  <option value="general_members">חברי עמותה</option>
                  <option value="advisors_and_emeriti">בדימוס ויועצים</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">טלפון נייד</label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="05X-XXXXXXX"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">אימייל</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setEditingContact(null); setIsAddingContact(false); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow"
                >
                  {editingContact ? 'שמור שינויים' : 'הוסף איש קשר'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
