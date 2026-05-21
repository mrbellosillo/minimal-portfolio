/**
 * RBJ Portfolio — script.js
 * Pure vanilla JS interactions: mobile nav toggle, smooth scroll, scroll fade-in
 */
(function () {
  'use strict';

  /* ---- Mobile Navigation Toggle ---- */
  var navToggle = document.getElementById('nav-toggle');
  var navMenus  = document.getElementById('nav-menus');

  if (navToggle && navMenus) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenus.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close nav when a link is clicked */
    navMenus.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenus.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close nav when clicking outside */
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navMenus.contains(e.target)) {
        navMenus.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      
      var target = document.querySelector(href);
      // If the target anchor exists on the current page, handle it smoothly
      if (target) {
        e.preventDefault();
        
        var header = document.querySelector('.site-header');
        var headerHeight = header ? header.offsetHeight : 0;
        
        // Recalculate target position precisely at the moment of click
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        var top = targetPosition - headerHeight - 20;
        
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // If target doesn't exist on this page, let native browser redirect route normally
    });
  });

  /* ---- Scroll Fade-in (Intersection Observer) ---- */
  if ('IntersectionObserver' in window) {
    // Note: removed general hero-section from here so it doesn't conflict with crossword observer
    var fadeTargets = document.querySelectorAll('.case-study, .section-title');

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)'; // Added standard micro-distance for dynamic slide-up
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      fadeObserver.observe(el); 
    });
  }

  /* ---- Smart Header & Back-to-Top FAB ---- */
  var headerElem = document.querySelector('.site-header');
  var backToTopBtn = document.getElementById('back-to-top');
  var subNavElem = document.getElementById('projectSubNav');
  
  var lastScrollTop = 0;
  var scrollThreshold = 200; 

  window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 1. Smart Header Logic
    if (headerElem) {
      if (scrollTop > 96) {
        if (scrollTop > lastScrollTop) {
          headerElem.classList.add('header-hidden');
        } else {
          headerElem.classList.remove('header-hidden');
        }
      } else {
        headerElem.classList.remove('header-hidden');
      }
    }
    
    // 2. Project Sub-Nav Logic
    if (subNavElem && headerElem) {
      if (scrollTop > 96 && headerElem.classList.contains('header-hidden')) { 
        subNavElem.classList.add('is-active');
      } else {
        subNavElem.classList.remove('is-active');
      }
    }
    
    // 3. Back-to-Top Logic
    if (backToTopBtn) {
      if (scrollTop > scrollThreshold) {
        backToTopBtn.classList.add('fab-visible');
      } else {
        backToTopBtn.classList.remove('fab-visible');
      }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  // Click Event for Back-to-Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---- Crossword Dynamic Reveal Logic ---- */
  var revealCrossword = function () {
    var cells = document.querySelectorAll('.xw-cell, .af-xw-cell, .cell');
    cells.forEach(function (cell, index) {
      setTimeout(function () {
        cell.classList.add('is-visible');
      }, index * 80); // 80ms delay sequential chain
    });
  };

  /* Unified Hero & Grid Observer */
  if ('IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealCrossword();
          heroObserver.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.25 }); // Fires securely when visible above fold

    var hero = document.querySelector('.hero-section') || document.querySelector('.af-overview');
    if (hero) heroObserver.observe(hero);
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealCrossword();
  }
  
  /* ---- On-Load Element Intros ---- */
  window.addEventListener('DOMContentLoaded', function () {
    var revealElements = document.querySelectorAll('.reveal-on-load');
    revealElements.forEach(function (element, index) {
      setTimeout(function () {
        element.classList.add('is-revealed');
      }, index * 150); // Clean 150ms structural staggered delay
    });
  });

})();