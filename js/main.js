// ──────────────────────────────────────────────
//  main.js — Language switching, nav, scroll FX
// ──────────────────────────────────────────────

(function () {
  "use strict";

  /* ── State ── */
  let currentLang = localStorage.getItem("portfolioLang") || "en";

  /* ── DOM refs ── */
  const html = document.documentElement;
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelector(".nav-links");
  const hamburger = document.querySelector(".nav-hamburger");
  const langBtn = document.getElementById("langToggle");

  /* ════════════════════════════════════════════
     1. LANGUAGE SWITCHING
     ════════════════════════════════════════════ */

  function applyLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    if (!t) return;

    // HTML attributes
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    // Simple text nodes
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Comma-separated → skill tags
    document.querySelectorAll("[data-i18n-tags]").forEach((container) => {
      const key = container.getAttribute("data-i18n-tags");
      if (t[key]) {
        const items = t[key].split(/[,،]\s*/);
        container.innerHTML = items
          .map((item) => `<span class="skill-tag">${item.trim()}</span>`)
          .join("");
      }
    });

    // Comma-separated → tech pills
    document.querySelectorAll("[data-i18n-tech]").forEach((ul) => {
      const key = ul.getAttribute("data-i18n-tech");
      if (t[key]) {
        const items = t[key].split(/[,،]\s*/);
        ul.innerHTML = items
          .map((item) => `<li>${item.trim()}</li>`)
          .join("");
      }
    });

    // Persist
    localStorage.setItem("portfolioLang", lang);
  }

  // Toggle
  langBtn.addEventListener("click", () => {
    applyLanguage(currentLang === "en" ? "ar" : "en");
  });

  /* ════════════════════════════════════════════
     2. MOBILE NAVIGATION
     ════════════════════════════════════════════ */

  function closeDrawer() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeDrawer();
    }
  });

  /* ════════════════════════════════════════════
     3. NAVBAR SCROLL EFFECTS
     ════════════════════════════════════════════ */

  function onScroll() {
    const y = window.scrollY;

    // Backdrop shadow
    navbar.classList.toggle("scrolled", y > 50);

    // Active section
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach((s) => {
      const top = s.offsetTop - 120;
      if (y >= top && y < top + s.offsetHeight) {
        current = s.id;
      }
    });

    navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ════════════════════════════════════════════
     4. SMOOTH SCROLL
     ════════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      // Handle "#" and "#top" gracefully
      if (!href || href === "#" || href === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      e.preventDefault();
      try {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        // Fallback safely if invalid selector
      }
    });
  });

  /* ════════════════════════════════════════════
     5. SCROLL REVEAL (Intersection Observer)
     ════════════════════════════════════════════ */

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

  /* ════════════════════════════════════════════
     6. STAGGERED CARD REVEAL
     ════════════════════════════════════════════ */

  function stagger(selector, delay = 100) {
    const els = document.querySelectorAll(selector);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
  }

  stagger(".skill-card");
  stagger(".detail-card");

  /* ════════════════════════════════════════════
     7. INIT
     ════════════════════════════════════════════ */

  applyLanguage(currentLang);
  onScroll();
})();
