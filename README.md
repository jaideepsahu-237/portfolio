# Jaideep Sahu — Portfolio

A minimal, modern, fully responsive personal portfolio for **Jaideep Sahu**, a
backend-focused Software Engineer. Built from scratch with plain HTML, CSS and
JavaScript — no frameworks, no build step.

## ✨ Highlights

- **Premium, light UI** inspired by Vercel / Stripe / Linear — charcoal text,
  a single blue accent (`#2563EB`), soft shadows and generous whitespace.
- **A hero case card** for the FLUXJIVA WebSockets → SSE migration: real,
  résumé-backed impact figures, factual notes on the migration, and an animated
  `<canvas>` waveform that is **labelled as decorative**. Everything stated as
  fact in this card is true — keep it that way. It is deliberately *not* styled
  as a live monitor (no fake route, no "live" badge, no simulated event log);
  mixing real numbers with simulated telemetry made both look invented.
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

- **Résumé** — `assets/resume.pdf` is a copy of your latest LaTeX résumé.
  Replace this file anytime to update the download. **When you do, re-check the
  page copy against it** — the summary, experience bullets and skill cards are
  transcribed from the résumé and will drift otherwise.
- **Metrics** in the hero monitor are real, résumé-backed figures (InfluxDB CPU
  90%+ → 20–40%, TIFF→PDF peak memory −93%, output PDF size −90%). Don't replace
  them with illustrative numbers.
- **"2+ years" of experience** is hardcoded in four places — the `<meta
  name="description">`, the hero lead, the About prose ("over two years") and
  the About stat card (`data-count="2" data-suffix="+"`). Started Aug 2024;
  bump all four as time passes.

## 🎨 Tech

- Fonts: Plus Jakarta Sans (display), Inter (body), JetBrains Mono (labels) via
  Google Fonts.
- No dependencies. ~one HTML, one CSS, one JS file.

---

Designed & built from scratch — Pune, India.
