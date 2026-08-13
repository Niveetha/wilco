# Changelog

## Step 1.1 — Visual redesign

Reworked the entire visual/UX layer after feedback that the Step 1 look
(closely following the reference mockup's visual style) read as an
unfriendly spec sheet. No logic changes — same field catalog, encoder,
decoder, all 34 tests still passing. See `decisions.md` for the full
rationale. Highlights:

- New "mission console" design language: IBM Plex Sans/Mono, one accent
  blue plus meaning-only status colors, generous spacing, no scanline
  overlay.
- Field 18 editor rebuilt from a 23-button grid into a searchable
  "add a detail" pattern with quick-add chips for common indicators.
- Field 22 amendment editor rebuilt from a strikethrough "diff" into a
  calm field-picker + new-value layout, with a real field-name dropdown.
- Message type picker rebuilt as readable cards with purpose text visible
  up front, not hidden behind hover.
- New light theme: clean daytime ops-room palette instead of "aged paper."
- Regenerated PWA icons and favicon to match the new palette.

## Step 1 — Core movement messages

- Scaffolded Vite + React + TypeScript + Vitest + vite-plugin-pwa.
- Built the core domain module (`src/core/`): field catalog, message
  catalog, encoder, decoder, validators — grammar transcribed directly from
  the user-supplied ICAO PANS-ATM Doc 4444 PDF (Appendix 2 & 3).
- Implemented full encode + decode for **FPL, CHG, CNL, DLA, DEP, ARR**,
  with round-trip tests against the document's own worked examples and the
  user's own SIA001 FPL message.
- Built the Builder (three display modes: full form, flight-strip, diff),
  Decoder (paste → breakdown → edit-in-builder handoff), and Library
  (seeded examples, save/copy/copy-all) features, in a TRON-inspired dark
  theme (default) with a light "flight-plan paper" alt theme, responsive
  from mobile through desktop.
- Added PWA manifest, service worker, install prompt, and icons; GitHub
  Actions workflow to deploy to GitHub Pages on push to `main`.
- Cataloged all 16 message types (10 more still to come — see
  `roadmap.md`), so the type grid always shows the complete picture with
  not-yet-implemented types marked "planned".
