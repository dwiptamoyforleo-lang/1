/**
 * Modern Website Multi-Page JavaScript
 * Handles navigation states, theme toggle (dark/light), mobile menu, FAQ accordions, filters, lightboxes, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initLightbox();
  initFaqAccordion();
  initFilterBar();
  initDynamicYear();
  initScrollReveal();
});

/* ==========================================================================
   1. THEME SELECTOR & DROPDOWN (LIGHT, DARK, SYSTEM DEFAULT)
   ========================================================================== */
const THEME_ICONS = {
  light: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  system: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
};

function resolveActualTheme(preference) {
  if (preference === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return preference === 'light' ? 'light' : 'dark';
}

function applyThemePreference(preference) {
  const actualTheme = resolveActualTheme(preference);
  document.documentElement.setAttribute('data-theme', actualTheme);
  document.documentElement.setAttribute('data-theme-preference', preference);
  localStorage.setItem('site-theme-preference', preference);
  localStorage.setItem('site-theme', actualTheme);

  // Update button trigger icons
  const btnIcons = document.querySelectorAll('.theme-btn-icon');
  btnIcons.forEach(span => {
    span.innerHTML = THEME_ICONS[preference] || THEME_ICONS[actualTheme] || THEME_ICONS.dark;
  });

  // Update active status on dropdown options
  const dropdownItems = document.querySelectorAll('.theme-dropdown-item');
  dropdownItems.forEach(item => {
    if (item.getAttribute('data-theme-value') === preference) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function initThemeToggle() {
  const savedPref = localStorage.getItem('site-theme-preference') || localStorage.getItem('site-theme') || 'dark';
  applyThemePreference(savedPref);

  // Listen to OS theme changes if user has 'system default' selected
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      const currentPref = localStorage.getItem('site-theme-preference') || 'dark';
      if (currentPref === 'system') {
        applyThemePreference('system');
      }
    });
  }

  // Handle dropdown toggle buttons
  const selectors = document.querySelectorAll('.theme-selector');
  selectors.forEach(selector => {
    const toggleBtn = selector.querySelector('.theme-toggle-btn');
    const dropdown = selector.querySelector('.theme-dropdown');
    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');

      // Close all other open dropdowns
      document.querySelectorAll('.theme-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.theme-selector')?.querySelector('.theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    const items = dropdown.querySelectorAll('.theme-dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const chosen = item.getAttribute('data-theme-value');
        applyThemePreference(chosen);
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-selector')) {
      document.querySelectorAll('.theme-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.theme-selector')?.querySelector('.theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.theme-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.theme-selector')?.querySelector('.theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   2. STICKY HEADER ELEVATION
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================================
   3. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!menuBtn || !drawer) return;

  const toggleMenu = () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));
    drawer.classList.toggle('active');
    drawer.setAttribute('aria-hidden', String(isExpanded));
  };

  menuBtn.addEventListener('click', toggleMenu);

  // Close drawer when any mobile link is clicked
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link, .btn:not(.theme-toggle-btn)');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });

  // Close drawer on outside click
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !menuBtn.contains(e.target) && drawer.classList.contains('active')) {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ==========================================================================
   4. MULTI-PAGE ACTIVE NAV LINK
   ========================================================================== */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-links .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && (href === 'index.html' || href === '/'))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   5. LIGHTBOX / MODAL CONTROLLER
   ========================================================================== */
const CUSTOM_MODAL_ICONS = {
  speed: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  analytics: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><path d="M4 20h16"></path></svg>`,
  mobile: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
  cloud: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  finance: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  ecommerce: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  security: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  standards: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  design: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>`,
  collaboration: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  default: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><path d="M4 20h16"></path></svg>`
};

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalTitle = document.getElementById('lightbox-title');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalIcon = document.getElementById('lightbox-icon');
  const closeBtn = document.getElementById('lightbox-close');
  if (!modal) return;

  const triggers = document.querySelectorAll('[data-lightbox]');

  const openModal = (title, desc, icon) => {
    if (modalTitle) modalTitle.textContent = title;
    if (modalCaption) modalCaption.textContent = desc;
    if (modalIcon) {
      if (icon && icon.trim().startsWith('<svg')) {
        modalIcon.innerHTML = icon;
      } else if (icon && CUSTOM_MODAL_ICONS[icon]) {
        modalIcon.innerHTML = CUSTOM_MODAL_ICONS[icon];
      } else {
        modalIcon.innerHTML = CUSTOM_MODAL_ICONS['default'];
      }
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const title = trigger.getAttribute('data-title') || 'Feature Preview';
      const desc = trigger.getAttribute('data-desc') || 'Expanded view of the selected component.';
      const icon = trigger.getAttribute('data-icon') || 'analytics';
      openModal(title, desc, icon);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. FAQ ACCORDION TOGGLE
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all open items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. SHOWCASE FILTER BAR
   ========================================================================== */
function initFilterBar() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.showcase-card[data-category]');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION
   ========================================================================== */
window.handleContactSubmit = function(form) {
  const formCard = document.getElementById('contact-form');
  const successBox = document.getElementById('contact-success-box');
  if (formCard && successBox) {
    formCard.style.display = 'none';
    successBox.style.display = 'block';
  }
};

window.resetContactForm = function() {
  const formCard = document.getElementById('contact-form');
  const successBox = document.getElementById('contact-success-box');
  if (formCard && successBox) {
    formCard.reset();
    formCard.style.display = 'flex';
    successBox.style.display = 'none';
  }
};

/* ==========================================================================
   9. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year, #current-year');
  const yearStr = new Date().getFullYear().toString();
  yearEls.forEach(el => {
    el.textContent = yearStr;
  });
}

/* ==========================================================================
   10. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return;

  // Select transition units across sections, cards, banners, and grids
  const targets = document.querySelectorAll(
    '.section-header, .card, .action-card, .why-card, .split-content, .split-visual, .cta-banner, .table-wrapper, .faq-item, [data-reveal]'
  );

  if (!targets.length) return;

  targets.forEach(el => {
    el.classList.add('reveal');

    // Add gentle stagger delay for cards inside responsive grids
    if (el.classList.contains('card') && el.parentElement && el.parentElement.classList.contains('grid')) {
      const cardsInGrid = Array.from(el.parentElement.children).filter(child => child.classList.contains('card'));
      const indexInGrid = cardsInGrid.indexOf(el);
      if (indexInGrid > 0) {
        const delay = (indexInGrid % 3) * 0.12;
        el.style.transitionDelay = `${delay}s`;
      }
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  targets.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   11. SCROLL UTILITIES
   ========================================================================== */
function initScrollProgressBar() {
  // Scroll progress bar disabled to remove scroll coloring completely
}


