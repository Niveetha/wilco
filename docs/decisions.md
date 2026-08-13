# Decisions

## Source document, and how we actually got it

The plan was always to ground field/message grammar in the real ICAO Doc
4444 text rather than general knowledge, but getting the PDF into the
session took a few tries: direct fetches of two public mirrors
(`vfr-europe.eu`, `icao.int`) and a Google Drive share link were all
blocked by this environment's network egress policy (confirmed via the
agent-proxy status endpoint — org policy denial, not a transient failure,
so not worth retrying or routing around). The working path was a direct
file upload of the PDF into the session, which doesn't go through that
network policy at all. From there: `pdftoppm`/`pdftotext` weren't
installed, `pypdf` hit a broken `cryptography`/`cffi` binding in this
image, and `pymupdf` (`fitz`) worked cleanly — full text extraction of all
76 pages (Appendix 2 + Appendix 3), read in full before writing any field
or message code.

## Corrections this made vs. the initial visual-reference mockup

The project started from a supplied HTML mockup for visual direction. It's
a reasonable encoder for a first pass, but several of its field/message
assumptions don't match the actual document once checked against it:

- **Field 5** (ALR only) is `phase/originator/nature`, not
  `phase/frequency/position`. The mockup also spelled the alert phase
  `ALERTFA`; the document spells it `ALERFA`.
- **Field 16** has two real forms — full (`dest+EET[+alternates]`) only in
  ALR/FPL/SPL, and destination-only in every other type that carries it
  (CHG/CNL/DLA/DEP/CPL/EST/CDN/ACP/RQP/RQS). The mockup used the full form
  everywhere, which would produce a structurally wrong CHG/CNL/DLA/DEP
  message (extra data where the doc's own worked examples have none).
- **ARR's Field 13 does include a time** (confirmed by the doc's own
  example, `LHBP0800`) — worth calling out because it's easy to assume
  otherwise by analogy with CPL/EST/CDN/ACP's aerodrome-only Field 13.
- **Field 7's SSR mode is always the fixed letter `A`**, not a user choice
  between A/C — the mockup exposed a mode dropdown that doesn't reflect
  the field's actual grammar.
- **Field 20** (SAR info, part of ALR's composition) was missing from the
  mockup's ALR field list entirely.
- Field 9's wake turbulence category is `H`/`M`/`L` in this document; the
  mockup's `J` (Super) option is a later ICAO amendment not present in
  this text, so it's left out (see `roadmap.md`) rather than added on
  outside authority.

## Why field specs carry their own encode *and* decode

A field's grammar is one fact; encoding and decoding are just that fact
read in two directions. Keeping them on the same `FieldSpec` object in
`src/core/fields.ts` means the Builder and the Decoder can never drift
apart on what a field's format actually is — there's nowhere for a second,
slightly-different implementation to hide.

## Why message-level decode is "guided sequential split", not a generic grammar

Doc 4444 doesn't have a context-free grammar in the traditional sense —
which fields can follow which is entirely determined by the message type
(Appendix 3's composition table), and a handful of fields contain spaces
or (for Field 22) their own hyphens. Rather than write a general ATS-message
parser, the decoder uses the same per-type field order the encoder uses,
consuming one raw segment per field in sequence. This is simpler, matches
how the fields were actually designed to be read, and made the round-trip
tests (`decode(encode(x)) === x`) straightforward to get right.

## Why React + TypeScript + Vite over the mockup's vanilla JS

Confirmed with the project owner up front. The mockup is a fine encoder
for one screen; this project needs an encoder *and* a decoder sharing the
exact same field logic, a growing 16-type catalog, a persisted library,
and PWA tooling — component structure and static typing earn their keep
once decode logic and three different form layouts (full/strip/diff) are
all reusing the same field widgets.

## Why HashRouter instead of BrowserRouter

GitHub Pages serves static files with no server-side rewrite, so a
deep link like `/wilco/decode` refreshed in the browser 404s under
BrowserRouter unless you add a 404.html-redirects-to-index.html trick.
HashRouter (`#/decode`) sidesteps the problem entirely at the cost of the
`#` in the URL — an acceptable trade for a project with no SEO
requirement and simple, memorable routes.

## Why no backend, ever

Every one of Wilco's operations — building a message from field values,
parsing one back, keeping a personal library — is a pure function of data
already on the user's device. Adding a server would only add a point of
failure and a reason the app couldn't work offline, which is one of the
explicit requirements (installable PWA).
