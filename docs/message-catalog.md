# Message catalog

All 16 standard ATS message types (Appendix 3 §1.1), with composition
confirmed against the worked examples in Appendix 3 §2 (pages A3-36 to
A3-49) of the supplied PANS-ATM document — not derived from memory. ✅ =
implemented in Step 1 with full encode/decode; the rest are on the roadmap.

| Type | Category | Name | Display mode | Status |
|---|---|---|---|---|
| ALR | Emergency | Alerting | Full form | Step 4 |
| RCF | Emergency | Radiocommunication Failure | Strip | Step 4 |
| **FPL** | Filed flight plan | Filed Flight Plan | Full form | ✅ |
| **CHG** | Filed flight plan | Modification | Diff | ✅ |
| **CNL** | Filed flight plan | Cancellation | Strip | ✅ |
| **DLA** | Filed flight plan | Delay | Strip | ✅ |
| **DEP** | Filed flight plan | Departure | Strip | ✅ |
| **ARR** | Filed flight plan | Arrival | Strip | ✅ |
| CPL | Coordination | Current Flight Plan | Full form | Step 2 |
| EST | Coordination | Estimate | Strip | Step 2 |
| CDN | Coordination | Co-ordination | Diff | Step 2 |
| ACP | Coordination | Acceptance | Strip | Step 2 |
| LAM | Coordination | Logical Acknowledgement | Strip | Step 2 |
| RQP | Supplementary | Request Flight Plan | Strip | Step 3 |
| RQS | Supplementary | Request Supplementary Flight Plan | Strip | Step 3 |
| SPL | Supplementary | Supplementary Flight Plan | Full form | Step 3 |

## Display mode rationale

Doc 4444 messages vary hugely in how much data they carry, and the UI
mirrors that rather than using one form layout for everything:

- **Full form** — FPL, and later CPL/SPL/ALR — carry a complete flight
  profile (aircraft, equipment, route, destination). These get the
  vertical field-by-field form: enough room to show each field's hint and
  example alongside its inputs.
- **Strip** — CNL, DLA, DEP, ARR, and later RCF/ACP/EST/LAM — are short
  administrative messages (2–4 fields) that exist to update or reference
  an already-filed flight plan. These render as a single horizontal card
  styled like a paper ATC flight-progress strip, which is closer to how
  controllers actually think about a "delay" or "departure" update than a
  tall form would be.
- **Diff** — CHG, and later CDN — exist specifically to say "this field on
  the original flight plan is now this instead." The UI shows the
  identifying fields (which flight) compactly, then a dedicated
  amendment editor with a redlined old-field-label → new-value layout,
  because the amendment *is* the message.

## Per-type composition (Step 1 types)

Each entry below cites the exact Appendix 3 §2 example the composition and
the seeded library entry were checked against.

### FPL — Filed Flight Plan
`3-7-8-9-10-13-15-16(full)-18` — §2.3.1, p. A3-39.
> `(FPL-ACA101-IS-B773/H-CHOV/C-EGLL1400-N0450F310 L9 UL9 STU285036/M082F310 UL9 LIMRI 52N020W 52N030W 50N040W 49N050W-CYQX0455 CYYR-EET/EISN0026 EGGX0111 020W0136 CYQX0228 040W0330 050W0415 SEL/FJEL)`

### CHG — Modification
`3-7-13-16(basic)-18-22(+)` — §2.3.2, p. A3-40.
> `(CHGA/F016A/F014-GABWE/A2173-EHAM0850-EDDF-DOF/080122-8/I-16/EDDN)`
>
> Amsterdam corrects a previously filed plan for GABWE: Field 8 → IFR,
> Field 16 (destination) → EDDN (Nürnberg).

### CNL — Cancellation
`3-7-13-16(basic)-18` — §2.3.3, p. A3-41.
> `(CNL-DLH522-EDBB0900-LFPO-0)`

### DLA — Delay
`3-7-13-16(basic)-18` — §2.3.4, p. A3-41.
> `(DLA-KLM671-LIRF0900-LYDU-0)`

### DEP — Departure
`3-7-13-16(basic)-18` — §2.3.5, p. A3-42.
> `(DEP-CSA4311-EGPD1923-ENZV-0)`

### ARR — Arrival
`3-7-13-[16(basic), diversion only]-17` — §2.3.6, p. A3-42.
> `(ARR-CSA406-LHBP0800-LKPR0913)` — normal case, no Field 16.
>
> `(ARR-HHE13-EHAM0900-EDDD-ZZZZ1030 DEN HELDER)` — diversion case: flight
> planned to EDDD (Frankfurt) but actually landed at an aerodrome with no
> ICAO indicator, so Field 16 (planned destination) is present and Field 17
> carries `ZZZZ` + a name.

## Per-type composition (planned — Steps 2–4)

For reference when implementing later steps, also confirmed against §2:

- **CPL**: `3-7-8-9-10-13(no-time)-14-15-16(basic)-18` — §2.4.1, p. A3-43.
- **EST**: `3-7-13(no-time)-14-16(basic)` — **no Field 18** — §2.4.2, p. A3-45.
- **CDN**: `3-7-13(no-time)-16(basic)-22(+)` — **no Field 18** — §2.4.3, p. A3-45.
- **ACP**: `3-7-13(no-time)-16(basic)` — **no Field 18** — §2.4.4, p. A3-46.
- **LAM**: `3` only — §2.4.5, p. A3-46. Example: `(LAMP/M178M/P100)`.
- **RQP**: `3-7-13-16(basic)-18` — §2.5.1, p. A3-47.
- **RQS**: `3-7-13-16(basic)-18` — §2.5.2, p. A3-47.
- **SPL**: `3-7-13-16(full)-18-19` — §2.5.3, p. A3-48.
- **ALR**: `3-5-7-8-9-10-13-15-16(full)-18-19-20` — §2.2.1, p. A3-36.
- **RCF**: `3-7-21` — §2.2.2, p. A3-38.
