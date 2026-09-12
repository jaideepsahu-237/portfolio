/* =========================================================
   Jaideep Sahu — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Page-load fade-in ---------- */
  window.addEventListener("load", () => document.body.classList.add("is-ready"));
  // Fallback in case 'load' is delayed by fonts
  setTimeout(() => document.body.classList.add("is-ready"), 600);

  /* ---------- Nav: scroll state + progress bar ---------- */
  const nav = $("#nav");
  const progress = $("#scrollProgress");

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("is-scrolled", y > 12);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $("#navToggle");
  const mobile = $("#mobileMenu");
  if (mobile) mobile.removeAttribute("hidden"); // CSS now controls visibility

  function setMenu(open) {
    toggle.classList.toggle("is-open", open);
    mobile.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", () => setMenu(!mobile.classList.contains("is-open")));
  $$("[data-mobile-link]").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Stagger items that share a parent
        const siblings = $$("[data-reveal]", el.parentElement);
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(idx, 6) * 70 + "ms";
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => revealObs.observe(el));
  }

  /* ---------- Scrollspy: active nav link ---------- */
  const sections = $$("main section[id]");
  const linkMap = new Map();
  $$("[data-nav], [data-mobile-link]").forEach((a) => {
    const id = a.getAttribute("href").replace("#", "");
    if (!linkMap.has(id)) linkMap.set(id, []);
    linkMap.get(id).push(a);
  });

  function setActive(id) {
    linkMap.forEach((links, key) => {
      const on = key === id;
      links.forEach((a) => {
        a.classList.toggle("is-active", on);
        // expose the state to assistive tech, not just visually
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Count-up numbers ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }

    const dur = 1300;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => countObs.observe(c));
  } else {
    counters.forEach(animateCount);
  }
})();
