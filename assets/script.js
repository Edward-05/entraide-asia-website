// Entraide nonprofit template — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Mobile dropdown toggle (tap the caret icon to expand submenu)
  document.querySelectorAll('.nav-item > a').forEach((link) => {
    const caret = link.querySelector('.caret');
    if (!caret) return;
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 980) return;
      e.preventDefault();
      link.closest('.nav-item').classList.toggle('is-open');
    });
  });

  // Language switcher (click/tap to open; closes on outside click)
  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.lang-switch.is-open').forEach((el) => {
        if (el !== btn.closest('.lang-switch')) el.classList.remove('is-open');
      });
      btn.closest('.lang-switch').classList.toggle('is-open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-switch.is-open').forEach((el) => {
      if (!el.contains(e.target)) el.classList.remove('is-open');
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Filter tabs (Causes / Projects / Resources)
  const tabGroups = document.querySelectorAll('.filter-tabs');
  tabGroups.forEach((group) => {
    const buttons = group.querySelectorAll('button');
    const target = document.querySelector(group.dataset.target);
    if (!target) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        target.querySelectorAll('[data-category]').forEach((card) => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });

  // Basic contact form handling (demo only — no backend)
  const form = document.querySelector('#contact-form');
  if (form) {
    const isFrench = document.documentElement.lang === 'fr';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = isFrench ? 'Message envoyé ✓' : 'Message sent ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 2500);
    });
  }
});
