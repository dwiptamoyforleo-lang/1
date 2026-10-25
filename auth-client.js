/**
 * Centralized Firebase Authentication & User Account Management Client
 * Supports:
 * - Email & Password Sign Up (Create Account) with Name & Firestore Profile Creation
 * - Email & Password Sign In
 * - 1-Click Google Sign In (via Popup)
 * - Sign Out
 * - Live auth state listener with automatic header user bar updates across all pages
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore with specific Database ID
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sync user profile to Firestore
 */
async function syncUserProfile(user, additionalData = {}) {
  if (!user) return;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userDocRef);
    
    const nowIso = new Date().toISOString();
    const profileData = {
      id: user.uid,
      email: user.email || '',
      displayName: additionalData.displayName || user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || '',
      updatedAt: nowIso,
      ...additionalData
    };

    if (!existingSnap.exists()) {
      profileData.createdAt = nowIso;
      await setDoc(userDocRef, profileData);
    } else {
      await setDoc(userDocRef, profileData, { merge: true });
    }
  } catch (err) {
    console.warn('Could not sync user profile to Firestore (this is non-blocking):', err);
  }
}

/**
 * Sign In with Email & Password
 */
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  await syncUserProfile(credential.user);
  return credential.user;
}

/**
 * Create a New Account with Name, Email & Password
 */
export async function createAccount(name, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const trimmedName = name.trim();
  
  if (trimmedName) {
    try {
      await updateProfile(credential.user, { displayName: trimmedName });
    } catch (e) {
      console.warn('Failed to update displayName:', e);
    }
  }
  
  await syncUserProfile(credential.user, { displayName: trimmedName });
  return credential.user;
}

/**
 * Sign In / Register with Google via Popup
 */
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(credential.user);
  return credential.user;
}

/**
 * Log Out
 */
export async function logOut() {
  await signOut(auth);
}

/**
 * Parse Firebase auth error codes into friendly human-readable messages
 */
export function formatAuthError(error) {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Sign in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'Email/password authentication is not enabled in Firebase Console. Please try Google Sign In or enable it in console.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Mount header authentication UI automatically across pages
 */
export function initHeaderAuth() {
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHeaderAuth());
    return;
  }

  const headerActions = document.querySelector('.header-actions');
  const mobileNavCta = document.querySelector('.mobile-nav-cta');

  if (!headerActions) return;

  // Create or retrieve auth bar in desktop header
  let authBar = document.getElementById('header-auth-bar');
  if (!authBar) {
    authBar = document.createElement('div');
    authBar.id = 'header-auth-bar';
    authBar.className = 'header-auth-bar';
    
    // Insert right before theme-selector or before "Get Started"
    const getStartedBtn = headerActions.querySelector('.btn-primary');
    if (getStartedBtn) {
      headerActions.insertBefore(authBar, getStartedBtn);
    } else {
      headerActions.appendChild(authBar);
    }
  }

  // Create or retrieve auth slot in mobile menu drawer
  let mobileAuthSlot = document.getElementById('mobile-auth-slot');
  if (mobileNavCta && !mobileAuthSlot) {
    mobileAuthSlot = document.createElement('div');
    mobileAuthSlot.id = 'mobile-auth-slot';
    mobileAuthSlot.style.marginTop = '0.75rem';
    mobileNavCta.appendChild(mobileAuthSlot);
  }

  // Listen to auth state changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const displayName = user.displayName || user.email?.split('@')[0] || 'Member';
      const initial = displayName.charAt(0).toUpperCase();

      // Desktop Auth Bar: User Avatar + Name + Dropdown Logout
      authBar.innerHTML = `
        <div class="user-profile-menu">
          <button type="button" class="user-profile-btn" id="user-profile-trigger" aria-haspopup="true" aria-expanded="false" title="${user.email || displayName}">
            <span class="user-avatar-circle">${initial}</span>
            <span class="user-display-name">${escapeHtml(displayName)}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="user-profile-dropdown" id="user-profile-dropdown">
            <div class="profile-dropdown-header">
              <strong>${escapeHtml(displayName)}</strong>
              <span>${escapeHtml(user.email || '')}</span>
            </div>
            <div class="profile-dropdown-divider"></div>
            <button type="button" class="profile-dropdown-item btn-signout" id="btn-signout-desktop">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;

      // Setup click toggle for profile menu
      const trigger = authBar.querySelector('#user-profile-trigger');
      const dropdown = authBar.querySelector('#user-profile-dropdown');
      const logoutBtn = authBar.querySelector('#btn-signout-desktop');

      if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = dropdown.classList.toggle('open');
          trigger.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', () => {
          dropdown.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          await logOut();
          window.location.reload();
        });
      }

      // Mobile Menu: Greeting + Logout
      if (mobileAuthSlot) {
        mobileAuthSlot.innerHTML = `
          <div class="mobile-user-card">
            <div class="mobile-user-info">
              <span class="user-avatar-circle sm">${initial}</span>
              <div>
                <strong style="display:block; font-size:0.9rem; color:#fff;">${escapeHtml(displayName)}</strong>
                <small style="color:#94a3b8; font-size:0.75rem;">${escapeHtml(user.email || '')}</small>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-signout-mobile" style="width:100%; margin-top:0.65rem; justify-content:center;">
              Sign Out
            </button>
          </div>
        `;
        const mobileLogout = mobileAuthSlot.querySelector('#btn-signout-mobile');
        if (mobileLogout) {
          mobileLogout.addEventListener('click', async () => {
            await logOut();
            window.location.reload();
          });
        }
      }

    } else {
      // User is signed out: Display Sign In button
      authBar.innerHTML = `
        <a href="auth.html" class="btn-header-auth" aria-label="Sign in or register">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <span>Sign In</span>
        </a>
      `;

      if (mobileAuthSlot) {
        mobileAuthSlot.innerHTML = `
          <a href="auth.html" class="btn btn-outline" style="width:100%; text-align:center; justify-content:center; display:flex; gap:0.5rem; align-items:center;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            <span>Sign In / Register</span>
          </a>
        `;
      }
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Automatically initialize header auth on all pages that import this module
initHeaderAuth();
