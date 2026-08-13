# Wilco docs

Wilco builds and decodes ICAO Doc 4444 / PANS-ATM Appendix 2 & 3 air traffic
services (ATS) messages. This folder is the working record of what's built,
what's next, and why — read `roadmap.md` first if you want to know "where are
we right now".

- **[roadmap.md](./roadmap.md)** — phased build plan, what's shipped vs. planned.
- **[architecture.md](./architecture.md)** — stack, project structure, data flow, PWA/deploy setup.
- **[field-reference.md](./field-reference.md)** — every ATS message field (3–22), transcribed from Appendix 3 with page citations.
- **[message-catalog.md](./message-catalog.md)** — all 16 message types, composition, and implementation status.
- **[decisions.md](./decisions.md)** — key architectural/scope decisions and why we made them.
- **[CHANGELOG.md](./CHANGELOG.md)** — dated entries per shipped step.

## Source of truth

Every field format and message composition rule in this app is transcribed
directly from the ICAO PANS-ATM Doc 4444 PDF the project owner supplied
(Appendix 2: Flight Plan, and Appendix 3: Air Traffic Services Messages),
not from general knowledge or the initial visual-reference mockup. Where the
mockup's assumptions turned out to differ from the actual document (several
did — see `decisions.md`), the document wins and the mockup was corrected.
