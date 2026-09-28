/**
 * Centralized Authentication Configuration
 * Supports production OAuth client credentials for Google Identity Services & Apple ID.
 */
window.BRANDNAME_AUTH_CONFIG = window.BRANDNAME_AUTH_CONFIG || {
  // Google OAuth 2.0 Web Client ID (Google Identity Services)
  googleClientId: '483226956889-webclient.apps.googleusercontent.com',

  // Apple Service ID / Client ID for Sign in with Apple
  appleClientId: 'com.brandname.auth.client',

  // Session duration (7 days in milliseconds)
  sessionDurationMs: 7 * 24 * 60 * 60 * 1000
};
