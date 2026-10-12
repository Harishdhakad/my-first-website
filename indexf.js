(function () {
  'use strict';

  var root = document.documentElement;
  var yearEl = document.getElementById('year');
  var toggleBtn = document.getElementById('theme-toggle');
  var menuBtn = document.getElementById('menu-toggle');
  var menu = document.getElementById('nav-links');
  var header = document.querySelector('.site-header');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function onScroll() {
    if (header) header.classList.toggle('header-bg', window.scrollY > 8);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var links = document.querySelectorAll('.nav-links a');
  var sections = ['home', 'about', 'members', 'memories', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function highlightLink() {
    var pos = window.scrollY + 120;
    var current = sections[0] && sections[0].id;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', highlightLink, { passive: true });
  highlightLink();

  function reveal() {
    if (!('IntersectionObserver' in window)) {
      root.classList.remove('data-reveal-hidden');
      return;
    }
    var items = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (item) { observer.observe(item); });
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initTheme();
  window.addEventListener('load', function () {
    root.classList.add('data-reveal-hidden');
    reveal();
    requestAnimationFrame(function () {
      root.classList.remove('data-reveal-hidden');
    });
  });
})();