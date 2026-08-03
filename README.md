# Jaideep Sahu — Portfolio

A minimal, modern, fully responsive personal portfolio for **Jaideep Sahu**, a
backend-focused Software Engineer. Built from scratch with plain HTML, CSS and
JavaScript — no frameworks, no build step.

## ✨ Highlights

- **Premium, light UI** inspired by Vercel / Stripe / Linear — charcoal text,
  a single blue accent (`#2563EB`), soft shadows and generous whitespace.
- **A real-time stream monitor** in the hero (animated `<canvas>` sparkline,
  counting metrics and SSE-style event log) — a nod to Jaideep's work migrating
  WebSockets to Server-Sent Events.
- **Subtle, professional motion**: scroll-reveal sections, count-up stats,
  sticky/blurring nav, active-link scrollspy, a scroll-progress bar and tasteful
  hover states.
- **Accessible & fast**: semantic HTML, keyboard focus styles, a skip link,
  `prefers-reduced-motion` support, and zero third-party JS.

## 📂 Structure

```
portfolio/
├── index.html        # markup + content
├── style.css         # design tokens + all styling
├── script.js         # interactions (reveal, scrollspy, canvas, counters)
├── assets/
│   ├── images/       # (room for future imagery / OG image)
│   ├── icons/        # favicon.svg
│   └── resume.pdf    # downloadable résumé (wired to the download buttons)
└── README.md
```

## 🚀 Run it

It's static — just open `index.html` in a browser. For best results (so the
résumé download and fonts behave like production) serve it locally:

```bash
# from the portfolio/ folder
python -m http.server 8000
# then visit http://localhost:8000
```

## 🛠️ Sections

Hero · About · Experience (timeline) · Projects · Skills · Contact

## ✏️ Things to personalise

- **GitHub URL** — currently `https://github.com/jaideepsahu` (placeholder).
  Update the two links in `index.html` (hero social row + contact card).
- **Résumé** — `assets/resume.pdf` is a copy of your latest LaTeX résumé.
  Replace this file anytime to update the download.
- **Metrics** in the hero monitor (`events/s`, `p95 latency`, `uptime`) are
  illustrative; tweak the `data-count` values in `index.html` if you'd like
  real figures.

## 🎨 Tech

- Fonts: Plus Jakarta Sans (display), Inter (body), JetBrains Mono (labels) via
  Google Fonts.
- No dependencies. ~one HTML, one CSS, one JS file.

---

Designed & built from scratch — Pune, India.
