/**
 * Synchronous Authentication Protection Guard
 * Loaded in the <head> of every protected HTML page.
 * Enforces immediate redirect to auth.html if the user is unauthenticated.
 * Works in tandem with <style id="auth-guard-style"> to prevent any flash of protected content.
 */

(function () {
  'use strict';

  function enforceAuth() {
    // Current file / path
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';

    // If somehow on auth.html, do nothing
    if (filename === 'auth.html') {
      return;
    }

    var isAuth = false;
    try {
      if (window.AuthManager && typeof window.AuthManager.isAuthenticated === 'function') {
        isAuth = window.AuthManager.isAuthenticated();
      } else {
        // Direct fast-path check in case AuthManager is still loading
        var rawSession = localStorage.getItem('brandname_auth_session');
        var rawUser = localStorage.getItem('brandname_auth_user');
        if (rawSession && rawUser) {
          var session = JSON.parse(rawSession);
          if (session && session.expiresAt && Date.now() <= session.expiresAt) {
            isAuth = true;
          }
        }
      }
    } catch (e) {
      isAuth = false;
    }

    if (!isAuth) {
      // User is not authenticated: immediately redirect before body renders
      var target = encodeURIComponent(filename + window.location.search + window.location.hash);
      window.location.replace('auth.html?redirect=' + target);
    } else {
      // User is authenticated: reveal document immediately
      var guardStyle = document.getElementById('auth-guard-style');
      if (guardStyle && guardStyle.parentNode) {
        guardStyle.parentNode.removeChild(guardStyle);
      }
      document.documentElement.style.visibility = 'visible';
      document.documentElement.style.opacity = '1';
      document.documentElement.classList.add('auth-verified');
    }
  }

  // Execute synchronously in <head>
  enforceAuth();

  // Guard against browser history back/forward caching (BFCache)
  window.addEventListener('pageshow', function (event) {
    var rawSession = localStorage.getItem('brandname_auth_session');
    if (!rawSession) {
      window.location.replace('auth.html');
    }
  });
})();
