/**
 * Centralized Authentication System for BrandName
 * Provides:
 * - Real Google Identity Services (GIS) Sign-In
 * - Real Sign in with Apple (AppleID.auth)
 * - Session validation, persistence, and expiration
 * - Universal Logout with anti-back-navigation protection
 * - Cross-tab session synchronization
 * - Header user badge & logout button binding
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    SESSION: 'brandname_auth_session',
    USER: 'brandname_auth_user',
    PROVIDER: 'brandname_auth_provider',
    TOKEN: 'brandname_auth_token',
    GUEST: 'brandname_guest_access'
  };

  /**
   * Safe JWT Payload Parser
   * Decodes Base64URL string into JSON object without external dependencies.
   */
  function parseJwt(token) {
    if (!token || typeof token !== 'string') return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse JWT payload:', e);
      return null;
    }
  }

  const AuthManager = {
    config: window.BRANDNAME_AUTH_CONFIG || {
      googleClientId: '483226956889-webclient.apps.googleusercontent.com',
      appleClientId: 'com.brandname.auth.client',
      sessionDurationMs: 7 * 24 * 60 * 60 * 1000
    },

    /**
     * Checks if a valid, non-expired session currently exists.
     * @returns {boolean}
     */
    isAuthenticated: function () {
      try {
        const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (!rawSession) return false;

        const session = JSON.parse(rawSession);
        if (!session || !session.expiresAt) return false;

        // Check expiration
        if (Date.now() > session.expiresAt) {
          this.clearSession();
          return false;
        }

        // Validate user payload exists
        const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (!rawUser) return false;

        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Retrieves currently authenticated user info.
     * @returns {object|null}
     */
    getUser: function () {
      try {
        const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
        return rawUser ? JSON.parse(rawUser) : null;
      } catch (e) {
        return null;
      }
    },

    /**
     * Retrieves session object.
     * @returns {object|null}
     */
    getSession: function () {
      try {
        const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
        return rawSession ? JSON.parse(rawSession) : null;
      } catch (e) {
        return null;
      }
    },

    /**
     * Persists authenticated user and session metadata.
     */
    saveSession: function (user, provider, token, customDurationMs) {
      const duration = customDurationMs || this.config.sessionDurationMs || (7 * 24 * 60 * 60 * 1000);
      const session = {
        authenticated: true,
        provider: provider,
        createdAt: Date.now(),
        expiresAt: Date.now() + duration
      };

      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
        if (token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        }
      } catch (e) {
        console.error('Failed to store authentication session:', e);
      }
    },

    /**
     * Clears all session data.
     */
    clearSession: function () {
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.PROVIDER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.clear();
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
    },

    /**
     * Enables guest access mode so visitors can explore the website without signing in.
     */
    enableGuestAccess: function () {
      try {
        localStorage.setItem(STORAGE_KEYS.GUEST, 'true');
      } catch (e) {
        console.error('Failed to enable guest access:', e);
      }
    },

    /**
     * Checks if the current visitor is browsing in guest access mode.
     * @returns {boolean}
     */
    isGuest: function () {
      try {
        return localStorage.getItem(STORAGE_KEYS.GUEST) === 'true';
      } catch (e) {
        return false;
      }
    },

    /**
     * Clears guest access mode.
     */
    clearGuestAccess: function () {
      try {
        localStorage.removeItem(STORAGE_KEYS.GUEST);
      } catch (e) {
        console.error('Error clearing guest access:', e);
      }
    },

    /**
     * Signs out the user, invalidates provider state, clears guest access, and redirects to auth.html.
     */
    logout: function () {
      // If Google Identity Services autoSelect was active, disable it
      try {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          window.google.accounts.id.disableAutoSelect();
        }
      } catch (err) {
        // Non-critical if GIS is not loaded
      }

      this.clearSession();
      this.clearGuestAccess();

      // Prevent back button recovery by replacing history entry
      window.location.replace('auth.html');
    },

    /**
     * Resolves the redirect destination after successful login.
     * @returns {string}
     */
    getRedirectTarget: function () {
      try {
        const params = new URLSearchParams(window.location.search);
        let redirect = params.get('redirect');
        if (redirect) {
          redirect = decodeURIComponent(redirect);
          // Prevent redirect loops or open redirects
          if (
            redirect.startsWith('auth.html') ||
            redirect.startsWith('signin.html') ||
            redirect.startsWith('http://') ||
            redirect.startsWith('https://') ||
            redirect.startsWith('//')
          ) {
            redirect = 'index.html';
          }
          return redirect;
        }
      } catch (e) {
        // Fallback
      }
      return 'index.html';
    },

    /**
     * Initializes Google Identity Services on the auth page.
     * @param {object} options
     * @param {function} [options.onSuccess]
     * @param {function} [options.onError]
     */
    initGoogleAuth: function (options) {
      options = options || {};
      const self = this;
      const clientId = self.config.googleClientId;

      const setupGIS = function () {
        if (!window.google || !window.google.accounts || !window.google.accounts.id) {
          setTimeout(setupGIS, 150);
          return;
        }

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: function (response) {
              self.handleGoogleCredentialResponse(response, options);
            },
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false
          });

          // Render official Google button into container if present
          const btnContainer = document.getElementById('google-signin-btn-container');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'outline' : 'filled_black',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: btnContainer.offsetWidth || 340
            });
          }
        } catch (err) {
          console.error('Google Identity Services initialization failed:', err);
          if (options.onError) {
            options.onError(err);
          }
        }
      };

      setupGIS();
    },

    /**
     * Processes Google GIS Credential Response (JWT ID Token)
     */
    handleGoogleCredentialResponse: function (response, options) {
      options = options || {};
      if (!response || !response.credential) {
        const errorMsg = 'Google authentication response missing credential token.';
        if (options.onError) options.onError(new Error(errorMsg));
        return;
      }

      const payload = parseJwt(response.credential);
      if (!payload) {
        const errorMsg = 'Unable to decode Google authentication token.';
        if (options.onError) options.onError(new Error(errorMsg));
        return;
      }

      // Check token expiration
      if (payload.exp && (payload.exp * 1000) < Date.now()) {
        const errorMsg = 'Google authentication token has expired.';
        if (options.onError) options.onError(new Error(errorMsg));
        return;
      }

      // Verify token issuer
      const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
      if (payload.iss && !validIssuers.includes(payload.iss)) {
        const errorMsg = 'Invalid authentication token issuer.';
        if (options.onError) options.onError(new Error(errorMsg));
        return;
      }

      // Format authenticated user profile
      const user = {
        id: payload.sub,
        email: payload.email || 'user@gmail.com',
        name: payload.name || payload.given_name || (payload.email ? payload.email.split('@')[0] : 'Google User'),
        picture: payload.picture || '',
        verified: Boolean(payload.email_verified),
        provider: 'google'
      };

      // Calculate token lifetime or use standard
      let durationMs = this.config ? this.config.sessionDurationMs : null;
      if (payload.exp) {
        const tokenRemainingMs = (payload.exp * 1000) - Date.now();
        if (tokenRemainingMs > 0 && tokenRemainingMs < (durationMs || Infinity)) {
          durationMs = tokenRemainingMs;
        }
      }

      this.saveSession(user, 'google', response.credential, durationMs);

      if (options.onSuccess) {
        options.onSuccess(user);
      } else {
        const target = this.getRedirectTarget();
        window.location.replace(target);
      }
    },

    /**
     * Processes Google OAuth2 Token Client response
     */
    handleGoogleTokenResponse: function (tokenResponse, options) {
      options = options || {};
      const self = this;
      const accessToken = tokenResponse.access_token;

      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: 'Bearer ' + accessToken }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Failed to retrieve verified Google profile.');
          return res.json();
        })
        .then(function (profile) {
          const user = {
            id: profile.sub,
            email: profile.email || 'user@gmail.com',
            name: profile.name || (profile.email ? profile.email.split('@')[0] : 'Google User'),
            picture: profile.picture || '',
            verified: Boolean(profile.email_verified),
            provider: 'google'
          };
          const durationMs = tokenResponse.expires_in ? (Number(tokenResponse.expires_in) * 1000) : null;
          self.saveSession(user, 'google', accessToken, durationMs);

          if (options.onSuccess) {
            options.onSuccess(user);
          } else {
            const target = self.getRedirectTarget();
            window.location.replace(target);
          }
        })
        .catch(function (err) {
          if (options.onError) {
            options.onError(err);
          }
        });
    },

    /**
     * Triggers Google Sign-In Prompt or Token Client popup manually
     */
    triggerGooglePrompt: function (options) {
      options = options || {};
      const self = this;

      if (!window.google || !window.google.accounts) {
        if (options.onError) {
          options.onError(new Error('Google Identity Services SDK is loading. Please try again.'));
        }
        return;
      }

      // Check if OAuth2 token client can be used for seamless popup authentication
      if (window.google.accounts.oauth2 && typeof window.google.accounts.oauth2.initTokenClient === 'function') {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: self.config.googleClientId,
            scope: 'email profile openid',
            callback: function (tokenResponse) {
              if (tokenResponse && tokenResponse.access_token) {
                self.handleGoogleTokenResponse(tokenResponse, options);
              } else if (tokenResponse && tokenResponse.error) {
                if (options.onError) options.onError(new Error(tokenResponse.error_description || tokenResponse.error));
              }
            },
            error_callback: function (err) {
              if (options.onError) options.onError(new Error(err && err.message ? err.message : 'Google sign-in popup was cancelled.'));
            }
          });
          client.requestAccessToken({ prompt: 'select_account' });
          return;
        } catch (e) {
          console.warn('OAuth2 token client init failed, attempting GIS prompt fallback:', e);
        }
      }

      if (window.google.accounts.id) {
        window.google.accounts.id.prompt(function (notification) {
          if (notification.isNotDisplayed()) {
            console.log('Google prompt not displayed:', notification.getNotDisplayedReason());
          }
        });
      }
    },

    /**
     * Initializes Apple Sign-In on the auth page.
     * @param {object} options
     * @param {function} [options.onSuccess]
     * @param {function} [options.onError]
     */
    initAppleAuth: function (options) {
      options = options || {};
      const self = this;
      const clientId = self.config.appleClientId;

      const setupApple = function () {
        if (!window.AppleID || !window.AppleID.auth) {
          setTimeout(setupApple, 150);
          return;
        }

        try {
          // Initialize official Apple JS SDK
          window.AppleID.auth.init({
            clientId: clientId,
            scope: 'name email',
            redirectURI: window.location.origin + window.location.pathname,
            usePopup: true
          });
        } catch (err) {
          console.warn('AppleID.auth.init warning:', err);
        }
      };

      setupApple();
    },

    /**
     * Triggers official Apple Sign-in popup flow.
     * @param {object} options
     */
    signInWithApple: function (options) {
      options = options || {};
      const self = this;

      if (!window.AppleID || !window.AppleID.auth) {
        if (options.onError) {
          options.onError(new Error('Apple Sign-In SDK is still loading. Please check your internet connection or try again in a moment.'));
        }
        return;
      }

      window.AppleID.auth.signIn()
        .then(function (response) {
          if (!response || !response.authorization || !response.authorization.id_token) {
            throw new Error('Apple authorization response missing identity token.');
          }

          const idToken = response.authorization.id_token;
          const payload = parseJwt(idToken);
          if (!payload) {
            throw new Error('Failed to parse Apple authorization token.');
          }

          // Check token expiration
          if (payload.exp && (payload.exp * 1000) < Date.now()) {
            throw new Error('Apple authorization token has expired.');
          }

          // Verify Apple issuer
          if (payload.iss && payload.iss !== 'https://appleid.apple.com') {
            throw new Error('Invalid Apple token issuer.');
          }

          // Build user object
          let name = 'Apple Member';
          if (response.user && response.user.name) {
            const first = response.user.name.firstName || '';
            const last = response.user.name.lastName || '';
            name = (first + ' ' + last).trim() || name;
          }

          const user = {
            id: payload.sub,
            email: payload.email || (response.user && response.user.email) || 'apple.user@privaterelay.appleid.com',
            name: name,
            picture: '',
            verified: true,
            provider: 'apple'
          };

          self.saveSession(user, 'apple', idToken);

          if (options.onSuccess) {
            options.onSuccess(user);
          } else {
            const target = self.getRedirectTarget();
            window.location.replace(target);
          }
        })
        .catch(function (error) {
          let message = 'Sign in with Apple could not be completed.';
          if (error && error.error === 'popup_closed_by_user') {
            message = 'Sign in with Apple popup was closed before completing.';
          } else if (error && error.message) {
            message = error.message;
          }
          if (options.onError) {
            options.onError(new Error(message));
          }
        });
    },

    /**
     * Binds user info & logout button on protected pages, or shows Sign In button if guest.
     */
    bindProtectedPageUI: function () {
      const user = this.getUser();
      const isAuth = this.isAuthenticated();

      const userBar = document.getElementById('auth-user-bar');
      const headerSignInBtn = document.getElementById('btn-header-signin');
      const mobileSignInBtn = document.getElementById('btn-mobile-signin');
      const mobileLogoutBtn = document.getElementById('btn-mobile-logout');

      if (isAuth && user) {
        // Authenticated member mode
        if (userBar) userBar.style.display = 'inline-flex';
        if (headerSignInBtn) headerSignInBtn.style.display = 'none';
        if (mobileSignInBtn) mobileSignInBtn.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'flex';

        // 1. Update user greeting/name in header if element exists
        const userGreeting = document.getElementById('user-greeting');
        if (userGreeting) {
          userGreeting.textContent = user.name || user.email || 'Member';
          userGreeting.title = 'Signed in as ' + (user.email || user.name);
        }

        // 2. Update user avatar initial if present
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
          const initial = (user.name || user.email || 'M').charAt(0).toUpperCase();
          userAvatar.textContent = initial;
        }

        // 3. Bind header logout button
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn && !logoutBtn.dataset.bound) {
          logoutBtn.dataset.bound = 'true';
          logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            AuthManager.logout();
          });
        }

        // 4. Bind mobile nav logout button if present
        if (mobileLogoutBtn && !mobileLogoutBtn.dataset.bound) {
          mobileLogoutBtn.dataset.bound = 'true';
          mobileLogoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            AuthManager.logout();
          });
        }
        const ovGuest = document.getElementById('overview-auth-action-guest');
        const ovMember = document.getElementById('overview-auth-action-member');
        if (ovGuest) ovGuest.style.display = 'none';
        if (ovMember) ovMember.style.display = 'block';
      } else {
        // Guest mode / unauthenticated browsing
        if (userBar) userBar.style.display = 'none';
        if (headerSignInBtn) headerSignInBtn.style.display = 'inline-flex';
        if (mobileSignInBtn) mobileSignInBtn.style.display = 'flex';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';

        // Dynamically append current page redirect to sign-in buttons
        const currentFilename = window.location.pathname.split('/').pop() || 'index.html';
        const signInUrl = 'auth.html?redirect=' + encodeURIComponent(currentFilename + window.location.search + window.location.hash);
        if (headerSignInBtn) headerSignInBtn.href = signInUrl;
        if (mobileSignInBtn) mobileSignInBtn.href = signInUrl;

        const ovGuest = document.getElementById('overview-auth-action-guest');
        const ovMember = document.getElementById('overview-auth-action-member');
        if (ovGuest) ovGuest.style.display = 'block';
        if (ovMember) ovMember.style.display = 'none';
      }
    }
  };

  // Cross-Tab Session Synchronization
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEYS.SESSION && !event.newValue) {
      // Session was cleared in another tab
      const isAuthOrSignIn = window.location.pathname.endsWith('auth.html') || window.location.pathname.endsWith('signin.html');
      if (!isAuthOrSignIn) {
        if (!AuthManager.isGuest()) {
          window.location.replace('auth.html');
        } else {
          AuthManager.bindProtectedPageUI();
        }
      }
    }
  });

  // Anti-Back-Navigation & Page Restoration Guard
  window.addEventListener('pageshow', function (event) {
    const isAuthOrSignIn = window.location.pathname.endsWith('auth.html') || window.location.pathname.endsWith('signin.html');
    if (!isAuthOrSignIn && !AuthManager.isAuthenticated() && !AuthManager.isGuest()) {
      window.location.replace('auth.html');
    }
  });

  // Export to global scope
  window.AuthManager = AuthManager;

  // Auto-bind on DOM ready for protected pages
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      AuthManager.bindProtectedPageUI();
    });
  } else {
    AuthManager.bindProtectedPageUI();
  }

})(window);
