# Roadmap

## Step 1 — Core movement messages (shipped)

Full encode + decode + a responsive mission-console UI + PWA + docs for the six most
commonly used ATS message types.

- [x] Vite + React + TypeScript scaffold, Vitest, GitHub Actions → GitHub Pages deploy
- [x] Mission-console dark theme (default) + a clean light ops-room alt theme
- [x] Redesigned Field 18/22 editors and message picker for readability (see `decisions.md`)
- [x] Core domain module: field catalog, message catalog, encoder, decoder, validators
- [x] **FPL** — Filed Flight Plan (full form)
- [x] **CHG** — Modification (diff/amendment form)
- [x] **CNL** — Cancellation (flight-strip form)
- [x] **DLA** — Delay (flight-strip form)
- [x] **DEP** — Departure (flight-strip form)
- [x] **ARR** — Arrival (flight-strip form, incl. diversion case)
- [x] Decoder: paste a raw message → detected type, field breakdown, validation warnings, edit-in-builder handoff
- [x] Library: seeded with the document's own worked examples + the user's FPL, save/copy/copy-all
- [x] PWA manifest, service worker, install prompt, icons
- [x] Round-trip tests against the document's own worked examples for every implemented type

## Step 2 — Co-ordination messages (planned)

- [ ] **CPL** — Current Flight Plan (full form; introduces the aerodrome-only Field 13 variant and Field 14 Estimate Data)
- [ ] **EST** — Estimate (strip form; no Field 18 in this type)
- [ ] **CDN** — Co-ordination (diff form, like CHG but no Field 18)
- [ ] **ACP** — Acceptance (strip form; shortest composition after LAM)
- [ ] **LAM** — Logical Acknowledgement (Field 3 reference data only)

## Step 3 — Supplementary messages (planned)

- [ ] **RQP** — Request Flight Plan
- [ ] **RQS** — Request Supplementary Flight Plan
- [ ] **SPL** — Supplementary Flight Plan (introduces Field 19 Supplementary Information)

## Step 4 — Emergency messages (planned)

- [ ] **ALR** — Alerting (introduces Field 5 Description of Emergency and Field 20 SAR Information)
- [ ] **RCF** — Radiocommunication Failure (introduces Field 21 Radio Failure Information)

## Step 5 — Polish (planned)

- [ ] Structured Field 15 route builder (typed tokens: SID / ATS route / significant point / DCT / speed-level change / cruise climb / STAR) instead of free-text route, per Appendix 3 §1.7 element grammar (c1–c7)
- [ ] AFTN header (priority/addressee/originator/filing time) wired into the live output, not just cosmetic
- [ ] Offline install smoke test on a real mobile device
- [ ] Expanded library: more worked examples per type, tagging/search
- [ ] Self-host fonts for full offline-first behaviour (currently Google Fonts CDN, cached after first load via the service worker but not bundled)

## Known limitations (tracked, not blocking)

- The teletype "Alignment Function" line-wrapping (Appendix 3 §1.5.5) isn't
  reproduced in encoded output — messages are emitted as a single clean
  line, which is content-equivalent and is how modern AMHS/computer-to-computer
  exchange represents the same data.
- The decoder splits fields on top-level hyphens per the known field order
  for each message type; a field value that itself contains a literal
  hyphen (rare, mostly hypothetical in RMK/ free text) could be
  mis-split. Not observed in any real example transcribed from the
  document so far.
