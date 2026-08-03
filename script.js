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
      links.forEach((a) => a.classList.toggle("is-active", key === id));
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

  /* ---------- Hero stream chart (canvas) ---------- */
  const canvas = $("#streamChart");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    // seed data first so resize() can safely redraw
    const COUNT = 64;
    const data = [];
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    let base = 0.5;
    for (let i = 0; i < COUNT; i++) {
      base += (rand() - 0.5) * 0.18;
      base = Math.max(0.18, Math.min(0.82, base));
      data.push(base);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(); // changing canvas.width clears the bitmap — always repaint
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const pad = 10;
      const gw = w - pad * 2;
      const gh = h - pad * 2;
      const stepX = gw / (data.length - 1);
      const pts = data.map((v, i) => [pad + i * stepX, pad + (1 - v) * gh]);

      // area fill
      const grad = ctx.createLinearGradient(0, pad, 0, h);
      grad.addColorStop(0, "rgba(37,99,235,0.18)");
      grad.addColorStop(1, "rgba(37,99,235,0)");
      ctx.beginPath();
      ctx.moveTo(pts[0][0], h - pad);
      pts.forEach((p) => ctx.lineTo(p[0], p[1]));
      ctx.lineTo(pts[pts.length - 1][0], h - pad);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // line
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.stroke();

      // leading dot
      const last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last[0], last[1], 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#2563EB";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(last[0], last[1], 6.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(37,99,235,0.18)";
      ctx.fill();
    }

    function tick() {
      base += (rand() - 0.5) * 0.2;
      base = Math.max(0.18, Math.min(0.82, base));
      data.push(base);
      data.shift();
      draw();
    }

    resize(); // sizes the canvas and paints the first frame
    window.addEventListener("resize", resize, { passive: true });

    if (!prefersReduced) {
      let timer = null;
      const start = () => { if (!timer) timer = setInterval(tick, 700); };
      const stop  = () => { clearInterval(timer); timer = null; };
      // Only animate while in view
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((e) => (e[0].isIntersecting ? start() : stop()), { threshold: 0.1 });
        io.observe(canvas);
      } else { start(); }
      document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    }
  }

  /* ---------- Hero stream log (SSE-style events) ---------- */
  const log = $("#streamLog");
  if (log && !prefersReduced) {
    const events = [
      'event: <b>measurement</b> · part #A-2291 · <span class="ok">ok</span>',
      'event: <b>stream.open</b> · client 0x4f · <span class="ok">200</span>',
      'event: <b>measurement</b> · part #B-1043 · <span class="ok">ok</span>',
      'event: <b>query</b> · pool hit · 6ms',
      'event: <b>measurement</b> · part #C-7788 · <span class="ok">ok</span>',
      'event: <b>heartbeat</b> · keep-alive',
    ];
    let i = 0;
    const MAX_LINES = 3;
    function push() {
      const p = document.createElement("p");
      p.innerHTML = events[i % events.length];
      log.appendChild(p);
      requestAnimationFrame(() => p.classList.add("show"));
      while (log.children.length > MAX_LINES) log.removeChild(log.firstChild);
      i++;
    }
    push(); push();
    setInterval(push, 1800);
  }
})();
