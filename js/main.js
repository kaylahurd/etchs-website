/* ============================================================
   ETC Hearing Solutions Inc. — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Navigation Toggle ──────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      navList.classList.toggle('open');
      const expanded = navList.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (expanded) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ── Mobile Dropdown Toggle ────────────────────────────────
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('a');
    if (link && item.querySelector('.dropdown-menu')) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (navList && !e.target.closest('.header-inner')) {
      navList.classList.remove('open');
    }
  });

  // ── Active Nav Link ───────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Services Page: Sticky Nav Highlight ──────────────────
  const servicesStickyNav = document.querySelector('.services-nav');
  if (servicesStickyNav) {
    const sections   = document.querySelectorAll('.service-section[id]');
    const navItems   = document.querySelectorAll('.services-nav-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(s => observer.observe(s));

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = document.getElementById(item.dataset.section);
        if (target) {
          const offset = servicesStickyNav.offsetHeight + 74 + 16;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ── Animate counter numbers ───────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const isDecimal = String(target).includes('.');
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statEls = document.querySelectorAll('[data-count]');
  if (statEls.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const target = parseFloat(entry.target.dataset.count);
          animateCounter(entry.target, target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statsObserver.observe(el));
  }

  // ── Scroll reveal ─────────────────────────────────────────
  const revealEls = document.querySelectorAll('.service-card, .timeline-item, .detail-card, .equipment-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    revealObserver.observe(el);
  });

  // ── Contact Form ──────────────────────────────────────────
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      btn.style.background = 'var(--green)';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
  }

});
