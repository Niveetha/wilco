# Wilco

Build and decode ICAO Doc 4444 / PANS-ATM Appendix 2 & 3 air traffic
services (ATS) messages — FPL, CHG, CNL, DLA, DEP, ARR and (coming soon)
the rest of the 16-type catalog. Installable as a PWA on desktop, tablet,
and mobile; works offline once installed; no backend, no accounts.

Every field format and message composition rule is transcribed directly
from the ICAO PANS-ATM Doc 4444 text, cited page-by-page in
[`docs/field-reference.md`](docs/field-reference.md) and
[`docs/message-catalog.md`](docs/message-catalog.md).

## Features

- **Build** — pick a message type, fill in fields with inline hints and
  examples pulled straight from the spec, get a live, valid ICAO message
  as you type, with a field-by-field breakdown alongside it.
- **Decode** — paste a raw ATS message, get the message type, a full field
  breakdown, and validation warnings; hand it straight to the Builder to
  edit further.
- **Library** — the document's own worked examples plus anything you save,
  with one-click copy per message or copy-all.
- Three purpose-built layouts depending on the message: a full field-by-
  field form for flight-plan-carrying messages (FPL), a compact
  flight-progress-strip layout for short administrative messages
  (DEP/ARR/DLA/CNL), and a redlined amendment view for change messages
  (CHG).
- TRON-inspired dark theme by default, with a light "flight-plan paper"
  alt theme.
- Installable PWA — add to home screen on mobile, install as a desktop app,
  works offline.

## Status

Six message types are fully implemented: **FPL, CHG, CNL, DLA, DEP, ARR**.
The remaining ten (ALR, RCF, CPL, EST, CDN, ACP, LAM, RQP, RQS, SPL) are
cataloged and on the roadmap — see [`docs/roadmap.md`](docs/roadmap.md).

## Development

```bash
npm install
npm run dev      # start the dev server
npm run test     # run the Vitest suite (core encode/decode round-trip tests)
npm run build    # type-check + production build to dist/
```

## Deployment

Pushing to `main` builds and deploys to GitHub Pages automatically via
`.github/workflows/deploy.yml`. GitHub Pages needs to be enabled once,
manually, under **Settings → Pages → Source: GitHub Actions**.

## Docs

Start at [`docs/README.md`](docs/README.md) — it indexes the roadmap,
architecture notes, the full field/message reference (with page citations
into the source PDF), and the key design decisions and why they were made.
