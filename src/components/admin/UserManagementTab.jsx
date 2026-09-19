import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Trash2, 
  CheckCircle2, 
  QrCode, 
  X, 
  Copy, 
  AlertCircle,
  Eye,
  Edit3,
  Shield
} from 'lucide-react';
import { 
  getUsers, 
  createUser, 
  deleteUser, 
  updateUserRole, 
  toggleUserStatus 
} from '../../utils/authService';
import { renderQrCodeDataUrl } from '../../utils/totp';

const ROLE_DESCRIPTIONS = {
  admin: {
    label: 'מנהל ראשי (Admin)',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    desc: 'גישה מלאה: ניהול משתמשים, העלאת קבצים, עריכת תרומות ודף קשר'
  },
  editor: {
    label: 'עורך תוכן (Editor)',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    desc: 'יכולת צפייה, העלאת קובצי אקסל, עריכת דף קשר ותחזיות (ללא ניהול משתמשים)'
  },
  viewer: {
    label: 'צפייה בלבד (Viewer)',
    badge: 'bg-slate-700 text-slate-300 border-slate-600',
    desc: 'הרשאת צפייה וייצוא דוחות בלבד. ללא אפשרות עריכה או העלאת קבצים'
  }
};

export function UserManagementTab({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [createdUserResult, setCreatedUserResult] = useState(null);
  const [showSecretModal, setShowSecretModal] = useState(null);

  // Add User Form State
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  const [formError, setFormError] = useState(null);

  const loadUsers = async () => {
    setIsLoading(true);
    const list = await getUsers();
    setUsers(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password.length < 6) {
      setFormError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    const res = await createUser(formData);
    if (!res.success) {
      setFormError(res.error);
      return;
    }

    setCreatedUserResult(res);
    setIsAddingUser(false);
    setFormData({ username: '', fullName: '', email: '', password: '', role: 'viewer' });
    await loadUsers();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${name}"?`)) {
      const res = await deleteUser(id);
      if (!res.success) {
        alert(res.error);
      } else {
        await loadUsers();
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    const res = await updateUserRole(id, newRole);
    if (!res.success) {
      alert(res.error);
    } else {
      await loadUsers();
    }
  };

  const handleToggleStatus = async (id) => {
    const res = await toggleUserStatus(id);
    if (!res.success) {
      alert(res.error);
    } else {
      await loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              ניהול משתמשים והרשאות גישה (2FA)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            כל משתמש מוגן בהזדהות כפולה (שם + סיסמה + Google Authenticator). באפשרותך לקבוע מי רשאי רק לצפות ומי רשאי לערוך.
          </p>
        </div>

        <button
          onClick={() => { setFormError(null); setIsAddingUser(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow"
        >
          <UserPlus className="w-4 h-4" />
          <span>הוסף משתמש חדש</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden shadow">
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-700 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-200">
            רשימת מורשי כניסה למערכת ({users.length} משתמשים)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">שם מלא</th>
                <th className="px-4 py-3">שם משתמש / אימייל</th>
                <th className="px-4 py-3">הרשאה</th>
                <th className="px-4 py-3">אימות 2FA</th>
                <th className="px-4 py-3">סטטוס</th>
                <th className="px-4 py-3">כניסה אחרונה</th>
                <th className="px-4 py-3 text-center">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {users.map((u) => {
                const roleInfo = ROLE_DESCRIPTIONS[u.role] || ROLE_DESCRIPTIONS.viewer;
                const isMaster = u.username === 'isaac';
                return (
                  <tr key={u.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{u.fullName}</span>
                        {isMaster && (
                          <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] rounded font-mono">
                            Master Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                      <div>{u.username}</div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {isMaster ? (
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold border ${roleInfo.badge}`}>
                          {roleInfo.label}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="viewer">צפייה בלבד</option>
                          <option value="editor">עורך תוכן</option>
                          <option value="admin">מנהל ראשי</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setShowSecretModal(u)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                        title="צפה בברקוד 2FA והנחיות"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>מוגדר (הצג QR)</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {isMaster ? (
                        <span className="text-xs text-emerald-400 font-medium">פעיל תמיד</span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                            u.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          }`}
                        >
                          {u.status === 'active' ? 'פעיל' : 'מושבת'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString('he-IL') : 'טרם התחבר'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!isMaster && (
                        <button
                          onClick={() => handleDelete(u.id, u.fullName)}
                          className="p-1.5 bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white rounded-md transition-colors"
                          title="מחק משתמש"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <span>הוספת משתמש מורשה חדש</span>
              </h3>
              <button
                onClick={() => setIsAddingUser(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">שם מלא</label>
                <input
                  type="text"
                  required
                  placeholder="למשל: דני כהן"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">אימייל</label>
                <input
                  type="email"
                  required
                  placeholder="dani@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">שם משתמש לכניסה</label>
                <input
                  type="text"
                  required
                  placeholder="dani"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">סיסמה ראשונית (לפחות 6 תווים)</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">הרשאת גישה</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="viewer">צפייה בלבד (Viewer) - לא יכול לערוך או להעלות</option>
                  <option value="editor">עורך תוכן (Editor) - יכול להעלות קבצים ולערוך</option>
                  <option value="admin">מנהל ראשי (Admin) - כולל ניהול משתמשים מלא</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow"
                >
                  צור משתמש והפק 2FA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Show New User 2FA QR Result Modal */}
      {(createdUserResult || showSecretModal) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-right">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>הגדרת Google Authenticator</span>
              </h3>
              <button
                onClick={() => { setCreatedUserResult(null); setShowSecretModal(null); }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const target = createdUserResult?.user || showSecretModal;
              const secret = target?.totpSecret;
              const qrUrl = renderQrCodeDataUrl(`otpauth://totp/WolfsonFriends:${target?.email || target?.username}?secret=${secret}&issuer=WolfsonFriends`);

              return (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 text-right">
                    סרוק ברקוד זה באפליקציית <strong>Google Authenticator</strong> בנייד של המשתמש ({target?.fullName}):
                  </p>

                  <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto">
                    <img 
                      src={qrUrl} 
                      alt="Google Authenticator QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-right">
                    <span className="text-[11px] text-slate-400 block mb-1">או הזן קוד סודי ידנית:</span>
                    <div className="flex items-center justify-between gap-2 font-mono text-sm text-amber-300 font-bold bg-slate-900 px-3 py-1.5 rounded-lg">
                      <span>{secret}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(secret);
                          alert('המפתח הועתק ללוח!');
                        }}
                        className="p-1 hover:text-white text-slate-400"
                        title="העתק מפתח"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => { setCreatedUserResult(null); setShowSecretModal(null); }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    אישור וסיום
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
