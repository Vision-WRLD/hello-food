# HINATA 日向 — Counter Omakase

A ten-seat counter-omakase restaurant site. Sunlit Mediterranean stone × Japanese omakase — light, warm, editorial.

Static site (vanilla HTML/CSS/JS, no build step). Six pages: Home · Omakase · Story · Reserve · Visit · Legal.

## Features
- Full-bleed graded photography, Fraunces + Inter, terracotta accent, filmic grain
- Editorial kanji course list, vertical stacked wordmark, alternating bands
- Working reservation widget (day strip, deterministic seatings, live summary) — front-end demo, no backend
- Static-first images (local `/img`), CSP via `<meta>`, no trackers, real privacy/terms
- Static heroes; gentle below-fold text reveals + hover micro-interactions; reduced-motion aware

## Run locally
```
python -m http.server 5510 --directory .
```
Then open http://localhost:5510

*Fictional restaurant — demo build.*
