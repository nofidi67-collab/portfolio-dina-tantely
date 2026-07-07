(() => {
    'use strict';

    /* ----------------------------------------------------------------
       Menu mobile (burger)
       ---------------------------------------------------------------- */
    const menuBtn = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuBtn && mainNav) {
        const closeMenu = () => {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
            mainNav.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        const openMenu = () => {
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.setAttribute('aria-label', 'Fermer le menu');
            mainNav.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };

        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            isOpen ? closeMenu() : openMenu();
        });

        // Ferme le menu quand on clique un lien
        mainNav.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Ferme le menu avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Ferme le menu si on repasse en desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    /* ----------------------------------------------------------------
       Thème clair / sombre
       ---------------------------------------------------------------- */
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const STORAGE_KEY = 'dina-bee-theme';

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            const isLight = theme === 'light';
            themeBtn.setAttribute('aria-pressed', String(isLight));
            themeBtn.setAttribute('aria-label', isLight ? 'Activer le mode sombre' : 'Activer le mode clair');
            if (icon) {
                icon.classList.toggle('fa-sun', !isLight);
                icon.classList.toggle('fa-moon', isLight);
            }
        }
    };

    // Respecte un choix déjà mémorisé, sinon garde le thème sombre par défaut du site
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) applyTheme(saved);
    } catch (err) {
        /* localStorage indisponible (mode privé, etc.) — on garde le thème par défaut */
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem(STORAGE_KEY, next); } catch (err) { /* silencieux */ }
        });
    }

    /* ----------------------------------------------------------------
       Bouton retour en haut
       ---------------------------------------------------------------- */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        const toggleVisibility = () => {
            backToTop.style.opacity = window.scrollY > 500 ? '1' : '0';
            backToTop.style.pointerEvents = window.scrollY > 500 ? 'auto' : 'none';
        };
        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------------
       Validation du formulaire de contact
       ---------------------------------------------------------------- */
    const form = document.getElementById('contact-form');
    if (form) {
        const status = document.getElementById('form-status');

        const fields = [
            { input: document.getElementById('name'), error: document.getElementById('name-error'), message: 'Merci de renseigner votre nom.' },
            {
                input: document.getElementById('email'),
                error: document.getElementById('email-error'),
                message: 'Merci de renseigner une adresse email valide.',
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            },
            { input: document.getElementById('message'), error: document.getElementById('message-error'), message: 'Merci de décrire votre besoin.' },
        ];

        const validateField = ({ input, error, message, validate }) => {
            if (!input) return true;
            const value = input.value.trim();
            const isValid = value.length > 0 && (validate ? validate(value) : true);
            if (error) error.textContent = isValid ? '' : message;
            input.setAttribute('aria-invalid', String(!isValid));
            return isValid;
        };

        fields.forEach((field) => {
            if (!field.input) return;
            field.input.addEventListener('blur', () => validateField(field));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const allValid = fields.map(validateField).every(Boolean);

            if (!allValid) {
                if (status) {
                    status.textContent = 'Merci de corriger les champs indiqués.';
                    status.style.color = 'var(--danger)';
                }
                return;
            }

            // Emplacement pour brancher un vrai envoi (fetch vers une API / service d'emailing)
            if (status) {
                status.textContent = 'Message envoyé — merci, je vous réponds rapidement !';
                status.style.color = 'var(--cyan)';
            }
            form.reset();
        });
    }
})();
