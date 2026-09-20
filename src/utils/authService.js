/**
 * Authentication and Role-Based Access Control (RBAC) Service
 * Supports Master Admin (Isaac Beeri) + Multi-User management with 2FA
 * Defense-in-Depth:
 * - Brute-Force Throttling: Locks after 5 failed attempts for 5 minutes
 * - Mandatory 2FA for all accounts
 * - 15-minute inactivity session tracking
 */

import { generateBase32Secret, verifyTOTP, getOtpAuthUrl } from './totp.js';

const USERS_STORAGE_KEY = 'fwmc_portal_users_v2';
const SESSION_STORAGE_KEY = 'fwmc_portal_session_v1';
const FAILED_ATTEMPTS_KEY = 'fwmc_auth_failed_throttle_v1';

const SESSION_DURATION_MS = 60 * 60 * 1000; // 60 minutes absolute max
export const SESSION_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes idle timeout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 5 * 60 * 1000; // 5 minutes lockout

// Fixed Master Secret for Isaac Beeri to enable instant setup with Google Authenticator
const MASTER_DEFAULT_SECRET = 'FWMCWOLFSONADMIN';

function checkThrottle() {
  try {
    const raw = sessionStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return { locked: false };
    const data = JSON.parse(raw);
    if (data.count >= MAX_FAILED_ATTEMPTS) {
      const remainingMs = data.lockedUntil - Date.now();
      if (remainingMs > 0) {
        const remainingMin = Math.ceil(remainingMs / 60000);
        return { 
          locked: true, 
          error: `הגישה נחסמה זמנית עקב ${MAX_FAILED_ATTEMPTS} ניסיונות שגויים רצופים. נסה שוב בעוד ${remainingMin} דקות מטעמי אבטחה.` 
        };
      } else {
        sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
      }
    }
  } catch (e) {}
  return { locked: false };
}

function recordFailedAttempt() {
  try {
    const raw = sessionStorage.getItem(FAILED_ATTEMPTS_KEY);
    let data = raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
    data.count += 1;
    if (data.count >= MAX_FAILED_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_TIME_MS;
    }
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(data));
  } catch (e) {}
}

function clearFailedAttempts() {
  try {
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
  } catch (e) {}
}

async function hashPassword(password, salt = 'wolfson_salt_2026') {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initial default admin user
const DEFAULT_ADMIN = {
  id: 'usr_master_1',
  username: 'isaac',
  email: 'isaac.beeri@gmail.com',
  fullName: 'צחי בארי',
  role: 'admin', // 'admin' | 'editor' | 'viewer'
  passwordHash: null, // Initialized on first load
  totpSecret: MASTER_DEFAULT_SECRET,
  totpEnabled: true,
  createdAt: '2026-09-19',
  lastLogin: null,
  status: 'active'
};

export async function initializeUsersStore() {
  let users = null;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      users = JSON.parse(raw);
    } else {
      // Check legacy v1 key to migrate
      const legacyRaw = localStorage.getItem('fwmc_portal_users_v1');
      if (legacyRaw) {
        users = JSON.parse(legacyRaw);
      }
    }
  } catch (e) {}

  if (!users || !Array.isArray(users) || users.length === 0) {
    const master = { ...DEFAULT_ADMIN };
    master.passwordHash = await hashPassword('Wolfson2026!');
    users = [master];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } else {
    // Migration: fix any old invalid Base32 secret (such as '0' in '2026' or 'FWMCWOLFSON2026I')
    let modified = false;
    for (const u of users) {
      if (!u.passwordHash && u.username === 'isaac') {
        u.passwordHash = await hashPassword('Wolfson2026!');
        modified = true;
      }
      if (!u.totpSecret || u.totpSecret === 'FWMCWOLFSON2026I' || /[0189]/.test(u.totpSecret)) {
        u.totpSecret = MASTER_DEFAULT_SECRET;
        modified = true;
      }
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
  return users;
}

export async function getUsers() {
  return await initializeUsersStore();
}

/**
 * Step 1 Login: Validate Username & Password with Throttling
 */
export async function validateCredentials(identifier, password) {
  const throttle = checkThrottle();
  if (throttle.locked) {
    return { success: false, error: throttle.error };
  }

  const users = await getUsers();
  const cleanId = identifier.trim().toLowerCase();
  
  const user = users.find(u => 
    u.status === 'active' && 
    (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId)
  );

  if (!user) {
    recordFailedAttempt();
    return { success: false, error: 'שם משתמש או סיסמה שגויים' };
  }

  const enteredHash = await hashPassword(password);
  // Also support default fallback for fresh setup
  const isMatch = (user.passwordHash === enteredHash);

  if (!isMatch) {
    recordFailedAttempt();
    return { success: false, error: 'שם משתמש או סיסמה שגויים' };
  }

  return {
    success: true,
    requires2FA: true, // Strictly mandatory 2FA
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      totpSecret: user.totpSecret
    }
  };
}

/**
 * Step 2 Login: Validate TOTP 6-digit code
 */
export async function complete2FALogin(userId, totpCode) {
  const throttle = checkThrottle();
  if (throttle.locked) {
    return { success: false, error: throttle.error };
  }

  const users = await getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'משתמש לא נמצא' };
  }

  const user = users[userIndex];
  const isValid = await verifyTOTP(totpCode, user.totpSecret);

  if (!isValid) {
    recordFailedAttempt();
    return { success: false, error: 'קוד אימות 2FA שגוי או פג תוקף' };
  }

  // Clear throttle on verified successful login
  clearFailedAttempts();

  // Update last login
  users[userIndex].lastLogin = new Date().toISOString();
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Create session
  const session = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_MS
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {}

  return {
    success: true,
    sessionUser: session
  };
}

export function getCurrentSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {}
}

/**
 * Add a new user with generated 2FA secret
 */
export async function createUser({ username, fullName, email, password, role = 'viewer' }) {
  const users = await getUsers();
  const cleanUsername = username.trim().toLowerCase();
  
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: 'שם משתמש זה כבר קיים במערכת' };
  }

  const newSecret = generateBase32Secret(16);
  const passwordHash = await hashPassword(password);

  const newUser = {
    id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    username: cleanUsername,
    fullName: fullName.trim(),
    email: email.trim(),
    role: ['admin', 'editor', 'viewer'].includes(role) ? role : 'viewer',
    passwordHash,
    totpSecret: newSecret,
    totpEnabled: true,
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: null,
    status: 'active'
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return {
    success: true,
    user: newUser,
    otpUrl: getOtpAuthUrl(newSecret, email, 'WolfsonFriends')
  };
}

export async function deleteUser(userId) {
  let users = await getUsers();
  if (users.find(u => u.id === userId)?.username === 'isaac') {
    return { success: false, error: 'לא ניתן למחוק את משתמש המנהל הראשי' };
  }
  users = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return { success: true };
}

export async function updateUserRole(userId, newRole) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { success: false, error: 'משתמש לא נמצא' };
  if (user.username === 'isaac' && newRole !== 'admin') {
    return { success: false, error: 'לא ניתן לשנות את הרשאת המנהל הראשי' };
  }
  user.role = newRole;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return { success: true, user };
}

export async function toggleUserStatus(userId) {
  const users = await getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return { success: false, error: 'משתמש לא נמצא' };
  if (user.username === 'isaac') {
    return { success: false, error: 'לא ניתן להשבית את חשבון המנהל הראשי' };
  }
  user.status = user.status === 'active' ? 'disabled' : 'active';
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return { success: true, status: user.status };
}
