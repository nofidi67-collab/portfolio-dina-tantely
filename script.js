/* ==========================================================================
   Dina Bee — Portfolio — script.js
   Thème clair/sombre, menu mobile, curseur personnalisé, scroll-spy,
   révélation au scroll, validation du formulaire de contact, retour en haut.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initCustomCursor();
  initHeaderScrollState();
  initScrollSpy();
  initRevealOnScroll();
  initBackToTop();
  initContactForm();
  initDemoLinks();
  initCurrentYear();
});

/* ---------- Thème clair / sombre ----------
   Le thème initial est déjà posé sur <html data-theme="..."> par le script
   bloquant placé dans <head> (évite le flash). Ici, on synchronise juste
   l'icône/aria avec cet état, puis on gère le clic. */
function initThemeToggle() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const icon = btn.querySelector("i");
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  applyTheme(root.getAttribute("data-theme") || "dark", { persist: false });

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(current, { persist: true });
  });

  function applyTheme(theme, { persist }) {
    root.setAttribute("data-theme", theme);
    const isLight = theme === "light";
    icon.classList.toggle("fa-sun", !isLight);
    icon.classList.toggle("fa-moon", isLight);
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute("aria-label", isLight ? "Activer le mode sombre" : "Activer le mode clair");
    if (metaTheme) {
      metaTheme.setAttribute("content", isLight ? "#f5f7fa" : "#0b0e14");
    }
    if (persist) localStorage.setItem("dina-theme", theme);
  }
}

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!menuBtn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    menuBtn.classList.remove("is-active");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Ouvrir le menu");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    nav.classList.add("is-open");
    menuBtn.classList.add("is-active");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Fermer le menu");
    document.body.style.overflow = "hidden";
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menuBtn.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

/* ---------- Curseur personnalisé ---------- */
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;

  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isCoarse || reducedMotion) return;

  let x = 0, y = 0, targetX = 0, targetY = 0;
  let rafId = null;

  const loop = () => {
    x += (targetX - x) * 0.18;
    y += (targetY - y) * 0.18;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(loop);
  };

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursor.classList.add("is-active");
    if (!rafId) rafId = requestAnimationFrame(loop);
  }, { passive: true });

  document.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  document.addEventListener("mousedown", () => cursor.classList.add("is-click"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-click"));

  const hoverTargets = "a, button, input, textarea, .skill-card, .project-card";
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
}

/* ---------- En-tête : ombre/fond au scroll ---------- */
function initHeaderScrollState() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Scroll-spy : lien de nav actif ---------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  if (!links.length) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.toggleAttribute("aria-current", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Révélation des blocs au scroll ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 3, 2) * 0.08}s`;
    observer.observe(el);
  });
}

/* ---------- Bouton retour en haut ---------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("is-visible", window.scrollY > 480);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Formulaire de contact ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const fields = {
    name: { el: document.getElementById("name"), error: document.getElementById("name-error") },
    email: { el: document.getElementById("email"), error: document.getElementById("email-error") },
    message: { el: document.getElementById("message"), error: document.getElementById("message-error") },
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Merci d'indiquer votre nom (2 caractères minimum)."),
    email: (v) => (emailRegex.test(v.trim()) ? "" : "Merci d'indiquer une adresse email valide."),
    message: (v) => (v.trim().length >= 10 ? "" : "Décrivez votre besoin en quelques mots (10 caractères minimum)."),
  };

  const validateField = (key) => {
    const { el, error } = fields[key];
    const message = validators[key](el.value);
    el.closest(".form-group").classList.toggle("has-error", Boolean(message));
    el.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    return !message;
  };

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("blur", () => validateField(key));
    fields[key].el.addEventListener("input", () => {
      if (fields[key].el.closest(".form-group").classList.contains("has-error")) {
        validateField(key);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map(validateField);
    const isValid = results.every(Boolean);

    if (!isValid) {
      const firstInvalid = Object.keys(fields).find((key) => !validateField(key));
      if (firstInvalid) fields[firstInvalid].el.focus();
      status.textContent = "Merci de corriger les champs indiqués ci-dessus.";
      status.className = "form-status is-error";
      return;
    }

    // Pas de backend connecté : simulation d'un envoi (à remplacer par un
    // vrai appel fetch() vers votre service d'envoi d'e-mails).
    submitBtn.disabled = true;
    const label = submitBtn.querySelector(".btn-label");
    const originalLabel = label.textContent;
    label.textContent = "Envoi en cours…";
    status.textContent = "";
    status.className = "form-status";

    setTimeout(() => {
      submitBtn.disabled = false;
      label.textContent = originalLabel;
      status.textContent = "Message envoyé ! Je vous réponds sous 24 à 48h.";
      status.className = "form-status is-success";
      form.reset();
      Object.keys(fields).forEach((key) => {
        fields[key].el.closest(".form-group").classList.remove("has-error");
        fields[key].error.textContent = "";
      });
    }, 1100);
  });
}

/* ---------- Liens de démonstration (projets sans URL réelle) ---------- */
function initDemoLinks() {
  document.querySelectorAll('a.project-card[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}

/* ---------- Année courante dans le footer ---------- */
function initCurrentYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}
