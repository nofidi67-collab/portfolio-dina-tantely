document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  /* ---------- 1. Theme toggle ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'light');
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  };

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- 2. Mobile menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  mainNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- 3. Custom cursor (pointer devices only) ---------- */
  const cursor = document.querySelector('.custom-cursor');
  const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursor && !isCoarsePointer) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.opacity = '1';
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '36px';
        cursor.style.height = '36px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
      });
    });
  }

  /* ---------- 4. Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- 5. Back to top button ---------- */
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 400 ? '1' : '0.4';
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 6. Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  const fieldErrors = {
    name: 'Merci d\'indiquer votre nom.',
    email: 'Merci d\'indiquer une adresse email valide.',
    message: 'Dites-m\'en un peu plus sur votre besoin.',
  };

  const validateField = (field) => {
    const errorEl = document.getElementById(`${field.name}-error`);
    if (!field.checkValidity()) {
      errorEl.textContent = fieldErrors[field.name] || 'Champ invalide.';
      return false;
    }
    errorEl.textContent = '';
    return true;
  };

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      status.style.color = 'var(--danger)';
      status.textContent = 'Merci de corriger les champs indiqués.';
      return;
    }

    // Remplacez ce bloc par un appel réel à votre backend / service d'emailing.
    status.style.color = 'var(--success)';
    status.textContent = 'Message envoyé, merci ! Je vous réponds rapidement.';
    form.reset();
  });
});
