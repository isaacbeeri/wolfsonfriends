import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  LogOut, 
  FileSpreadsheet, 
  Users, 
  TrendingUp, 
  UserCheck, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  KeyRound,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert
} from 'lucide-react';
import { 
  getCurrentSession, 
  validateCredentials, 
  complete2FALogin, 
  logout,
  initializeUsersStore 
} from '../../utils/authService';
import { 
  initializeAdminDataVault, 
  wipeAdminDataVault 
} from '../../utils/adminDataService';
import { DonationsAdminTab } from './DonationsAdminTab';
import { ContactsAdminTab } from './ContactsAdminTab';
import { ForecastAdminTab } from './ForecastAdminTab';
import { UserManagementTab } from './UserManagementTab';

export function AdminPortal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [session, setSession] = useState(() => getCurrentSession());
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' | 'contacts' | 'forecast' | 'users'
  const [isVaultReady, setIsVaultReady] = useState(false);

  // Login State
  const [loginStep, setLoginStep] = useState(1); // 1 = credentials, 2 = 2FA TOTP
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const [totpInput, setTotpInput] = useState('');
  const [authError, setAuthError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showQrHelper, setShowQrHelper] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  // Strict anti-crawling meta tags
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow, noarchive, nosnippet';
    document.head.appendChild(metaRobots);

    const metaGoogle = document.createElement('meta');
    metaGoogle.name = 'googlebot';
    metaGoogle.content = 'noindex, nofollow';
    document.head.appendChild(metaGoogle);

    return () => {
      try {
        document.head.removeChild(metaRobots);
        document.head.removeChild(metaGoogle);
      } catch (e) {}
    };
  }, []);

  // Initialize store and decrypted vault on session
  useEffect(() => {
    initializeUsersStore();
    if (session) {
      initializeAdminDataVault().then(() => setIsVaultReady(true));
    }
  }, [session]);

  // Inactivity Auto-Lockout: 15 minutes of idle time auto-locks the session
  useEffect(() => {
    if (!session) return;
    let timer = null;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
        alert('החיבור ננעל אוטומטית עקב חוסר פעילות ממושך מטעמי אבטחת מידע וחיסיון.');
      }, 15 * 60 * 1000); // 15 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [session]);

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    try {
      const res = await validateCredentials(identifier, password);
      if (!res.success) {
        setAuthError(res.error);
        setIsVerifying(false);
        return;
      }

      setTempUser(res.user);
      setLoginStep(2);
      setShowQrHelper(true);
    } catch (err) {
      setAuthError('שגיאה בתהליך האימות');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (!tempUser) return;
    setAuthError(null);
    setIsVerifying(true);

    try {
      const res = await complete2FALogin(tempUser.id, totpInput);
      if (!res.success) {
        setAuthError(res.error);
        setIsVerifying(false);
        return;
      }

      // Initialize crypto key and decrypt in-memory vault
      await initializeAdminDataVault();
      setIsVaultReady(true);

      setSession(res.sessionUser);
      setLoginStep(1);
      setTotpInput('');
    } catch (err) {
      setAuthError('שגיאה באימות 2FA');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyKey = () => {
    if (tempUser?.totpSecret) {
      navigator.clipboard.writeText(tempUser.totpSecret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  const handleLogout = () => {
    logout();
    wipeAdminDataVault();
    setIsVaultReady(false);
    setSession(null);
    setLoginStep(1);
    setTempUser(null);
    setTotpInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 font-sans font-hebrew" dir="rtl">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wide text-white">פורטל ניהול מאובטח</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>AES-256-GCM Vault • 2FA Enforced</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Bot Shield | NoIndex
                </span>
              </div>
              <span className="text-[11px] text-slate-400">אגודת ידידי המרכז הרפואי וולפסון (ע"ר)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <div className="text-xs font-semibold text-white">{session.fullName}</div>
                  <div className="text-[10px] text-blue-400 font-mono">
                    {session.role === 'admin' ? 'מנהל ראשי (Master Admin)' : session.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 rounded-xl border border-slate-700 hover:border-rose-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="התנתק מהמערכת ונעל את הכספת"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">יציאה</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl">
                <Lock className="w-3.5 h-3.5" />
                <span>דרושה הזדהות 2FA</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-colors"
            >
              חזרה לאתר הציבורי
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!session ? (
          /* ========================================================
             LOGIN / 2FA AUTHENTICATION FORM
             ======================================================== */
          <div className="max-w-md mx-auto my-6 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                {loginStep === 1 ? <Lock className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
              </div>
              <h1 className="text-2xl font-bold text-white">כניסה לאזור ניהול מאובטח</h1>
              <p className="text-xs text-slate-400">
                הגישה מיועדת למשתמשים מאושרים בלבד ומוגנת באמצעות הצפנת AES-256-GCM ואימות דו-שלבי (2FA).
              </p>
            </div>

            {authError && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {loginStep === 1 ? (
              /* Step 1: Credentials */
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    שם משתמש או אימייל
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="isaac"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    סיסמה
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20 mt-2 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isVerifying ? 'מאמת פרטים...' : 'המשך לאימות 2FA'}</span>
                </button>
              </form>
            ) : (
              /* Step 2: Google Authenticator TOTP */
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200">
                  שלום <strong>{tempUser?.fullName}</strong>, הזן את קוד האימות בן 6 הספרות מאפליקציית <strong>Google Authenticator</strong> בנייד שלך.
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    קוד אימות 2FA (6 ספרות)
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={totpInput}
                    onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-2xl tracking-[0.5em] text-center font-bold text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || totpInput.length !== 6}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isVerifying ? 'פותח כספת...' : 'אימות וכניסה למערכת'}</span>
                </button>

                <div className="mt-4 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>אימות דו-שלבי מוגן: הזן את קוד 6 הספרות מאפליקציית Authenticator במכשירך בלבד.</span>
                </div>

                <div className="pt-2 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => { setLoginStep(1); setAuthError(null); }}
                    className="text-slate-400 hover:text-white"
                  >
                    חזרה לשלב הקודם
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ========================================================
             AUTHENTICATED ADMIN PORTAL DASHBOARD
             ======================================================== */
          <div className="space-y-6">
            {/* Tabs Bar */}
            <div className="flex border-b border-slate-800 overflow-x-auto gap-2 pb-2">
              <button
                onClick={() => setActiveTab('donations')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'donations'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>ניהול תרומות (2017–2026)</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'contacts'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>דף קשר - ועד והנהלה</span>
              </button>

              <button
                onClick={() => setActiveTab('forecast')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'forecast'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>צפי ותחזית תרומות</span>
              </button>

              {session.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'users'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>ניהול משתמשים ו-2FA</span>
                </button>
              )}
            </div>

            {/* Active Tab View */}
            <div className="pt-2">
              {activeTab === 'donations' && (
                <DonationsAdminTab userRole={session.role} />
              )}
              {activeTab === 'contacts' && (
                <ContactsAdminTab userRole={session.role} />
              )}
              {activeTab === 'forecast' && (
                <ForecastAdminTab userRole={session.role} currentUserName={session.fullName} />
              )}
              {activeTab === 'users' && session.role === 'admin' && (
                <UserManagementTab currentUserId={session.userId} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
