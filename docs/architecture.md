# Architecture

## Stack

- **Vite + React 18 + TypeScript** — static SPA, no backend. Everything runs
  client-side, which is what makes offline PWA caching viable at all.
- **react-router** in `HashRouter` mode (`#/build`, `#/decode`, `#/library`,
  `#/about`) — avoids the classic GitHub Pages "refresh a deep link → 404"
  problem without needing a 404.html redirect trick.
- **Plain CSS with custom properties** (no Tailwind/CSS-in-JS) — theme tokens
  live in `src/theme/theme.css`, everything else is component-scoped `.css`
  files imported next to their component.
- **vite-plugin-pwa** — generates the manifest and a Workbox service worker
  (`generateSW` mode) that precaches the whole built app for offline use.
- **Vitest** for unit/integration tests — `src/core/*.test.ts`.
- **`localStorage`** for theme preference and user-saved library entries;
  `sessionStorage` for the one-shot decoder → builder handoff. No cookies,
  no accounts, no server round-trip of any kind.

## Project structure

```
src/
  core/                 # ICAO Doc 4444 domain model — the correctness-critical layer
    types.ts            # shared TS types (FieldSpec, MessageTypeDef, ...)
    fields.ts            # field catalog: encode/decode/validate per field, Appendix 3 A3-6..A3-34
    messageTypes.ts       # message catalog: field order per type, Appendix 3 A3-36..A3-49
    encoder.ts             # values -> canonical ICAO string, + live breakdown for the builder UI
    decoder.ts               # raw ICAO string -> typed values + breakdown + errors
    validators.ts              # regex validators for Doc 4444 data conventions (§1.6)
    examples.ts                 # seed messages for the Library (doc's own examples + user's FPL)
    *.test.ts                    # round-trip tests against real worked examples

  components/            # shared, presentational — FieldBlock, F18Editor, F22Editor,
                          # GenericFieldInputs, MessageTypeGrid, OutputPanel, BreakdownTable,
                          # ThemeToggle, InstallPwaPrompt, FieldEditor (dispatcher)

  features/
    builder/              # message-type grid -> field editing (3 display modes) -> live output
      FullForm.tsx          # vertical field-by-field form (FPL and, later, CPL/SPL/ALR)
      StripForm.tsx           # compact flight-progress-strip layout (DEP/ARR/DLA/CNL, later RCF/ACP/EST)
      DiffForm.tsx              # redline amendment view (CHG, later CDN)
      handoff.ts                 # sessionStorage bridge from Decoder's "edit in builder"
    decoder/               # paste -> decode -> breakdown -> validation -> handoff to builder
    library/                # seeded + user-saved messages, copy/copy-all, localStorage store

  app/                    # header, tab nav, routes, About page
  theme/                  # theme.css — TRON dark (default) + light "flight-plan paper" alt
```

## Why the field catalog is structured the way it is

Real Doc 4444 fields aren't uniform — some are a single value (Field 13:
aerodrome+time), some are dynamic key/value lists (Field 18: `KEY/value`
pairs in a required sequence), and one is explicitly repeatable (Field 22:
one or more amendments, each with its own leading hyphen). Rather than
force everything through one generic shape, `FieldSpec<T>` is generic over
the field's own natural value type, and the UI dispatches to either a
generic label+input renderer (`GenericFieldInputs`, driven by each field's
`inputs` metadata) or a bespoke widget (`F18Editor`, `F22Editor`) based on
field id. The **same** `encode`/`decode` functions back both the Builder
(live, as-you-type) and the Decoder (parse-once) — there is exactly one
implementation of each field's grammar, not two that could drift apart.

Two fields — 13 and 16 — have two real variants in the document itself
(with-time vs. aerodrome-only for 13; full dest+EET+alternates vs.
dest-only for 16), so they're modelled as separate `FieldSpec`s
(`F13`/`F13_NT`, `F16_FULL`/`F16_BASIC`) rather than one field with runtime
branching — see `docs/field-reference.md` for exactly which message types
use which variant.

## Message-level encode/decode

`MESSAGE_TYPES[type].fields` is an ordered list of "slots" (field id +
optional/repeatable flags) taken directly from the composition table in
Appendix 3 §1.3 / §2. Encoding walks the slots in order and joins each
field's encoded content with `-`, exactly as the document's
Start-of-Field Signal rule (§1.5.2) specifies. Decoding does the reverse:
split the raw string on top-level hyphens, then consume one segment per
slot in order — except `repeatable` slots (Field 22), which consume every
remaining segment matching that field's shape, and `optional` slots (e.g.
ARR's diversion Field 16), which use the field's `looksLike()` heuristic to
decide whether the next segment belongs to them or to the following field.
This mirrors how a real ATC system parses these messages: the field order
is known per message type, so a full generic grammar isn't needed.

## Deploy

`.github/workflows/deploy.yml` builds with `npm run test && npm run build`
and publishes `dist/` to GitHub Pages via `actions/upload-pages-artifact` +
`actions/deploy-pages` on every push to `main`. `vite.config.ts` sets
`base: '/wilco/'` to match the repo name; if the repo is ever renamed or
served from a custom domain, update `base` (and the PWA manifest's
`start_url`/`scope`, which are set explicitly since they aren't
rewritten by Vite's asset-path handling).

Enabling Pages itself (Settings → Pages → Source: GitHub Actions) is a
one-time manual step the repo owner needs to do; the workflow won't do
anything until that's set and a push lands on `main`.
