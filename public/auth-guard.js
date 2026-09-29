/**
 * Synchronous Authentication Protection Guard
 * Loaded in the <head> of every protected HTML page.
 * Enforces immediate redirect to auth.html if the user is unauthenticated and hasn't chosen guest access.
 * Works in tandem with <style id="auth-guard-style"> to prevent any flash of protected content.
 */

(function () {
  'use strict';

  function enforceAuth() {
    // Current file / path
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';

    // If on auth.html or signin.html, do nothing
    if (
      filename === 'auth.html' || path.endsWith('/auth.html') || path.endsWith('/auth') ||
      filename === 'signin.html' || path.endsWith('/signin.html') || path.endsWith('/signin')
    ) {
      return;
    }

    var isAuth = false;
    var isGuest = false;

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

    try {
      if (window.AuthManager && typeof window.AuthManager.isGuest === 'function') {
        isGuest = window.AuthManager.isGuest();
      } else {
        isGuest = localStorage.getItem('brandname_guest_access') === 'true';
      }
    } catch (e) {
      isGuest = false;
    }

    if (!isAuth && !isGuest) {
      // User is neither authenticated nor in guest mode: redirect to auth.html
      var target = encodeURIComponent(filename + window.location.search + window.location.hash);
      window.location.replace('auth.html?redirect=' + target);
    } else {
      // User has access (either authenticated or guest): reveal document immediately
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
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    if (filename === 'auth.html' || filename === 'signin.html') {
      return;
    }
    var rawSession = localStorage.getItem('brandname_auth_session');
    var isGuest = localStorage.getItem('brandname_guest_access') === 'true';
    if (!rawSession && !isGuest) {
      window.location.replace('auth.html');
    }
  });
})();
