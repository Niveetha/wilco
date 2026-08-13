# Field reference

Transcribed from Appendix 3 ("Air Traffic Services Messages"), §1.2 and the
field pages A3-6 to A3-34, of the ICAO PANS-ATM Doc 4444 PDF supplied for
this project. Page numbers below refer to that document. Fields marked
**Implemented** have a working `FieldSpec` in `src/core/fields.ts` today
(Step 1); the rest are documented here ready for Steps 2–4.

Structuring rules that apply to every field (§1.5): a message opens with
`(`, each field after the first is introduced by a single hyphen `-`,
elements within a field are separated by `/` or a space only where the
field table says so, and the message closes with `)`.

## Field 3 — Message type, number and reference data (p. A3-6)

`(a) message type designator` (3 letters) `[/ (b) message number][ / (c)
reference data]`. Element (a) alone is all the Builder collects; (b)/(c)
are computer-to-computer identifiers (e.g. `CHGA/F016A/F014`) used when
ATS units exchange messages between computers — the decoder tolerates them
in `messageRef` but the Builder doesn't generate them. **Not implemented**
as a standalone editable field — implicit as the message type prefix.

## Field 5 — Description of emergency (p. A3-8), ALR only

`phase / originator / nature`. Phase is `INCERFA` (uncertainty), `ALERFA`
(alert — note: no "T", unlike a common mis-transcription) or `DETRESFA`
(distress). Originator is 8 letters: the 4-letter ICAO location indicator
of the ATS unit plus its 3-letter designator plus `X` (or a division
letter). Nature is short plain-language text. Example: `ALERFA/EINNZQZX/REPORT
OVERDUE`. **Planned for Step 4.**

## Field 7 — Aircraft identification and SSR mode/code (p. A3-9) · Implemented

`callsign [/A ssr]`. Callsign: max 7 alphanumeric characters, no hyphens,
composed per Appendix 2 §2 Item 7. SSR mode is always the fixed letter
`A`; SSR code is 4 octal digits (0–7). Example: `SIA123/A2173`.

## Field 8 — Flight rules and type of flight (p. A3-10) · Implemented

`rules[type]`. Rules: `I` IFR, `V` VFR, `Y` IFR→VFR, `Z` VFR→IFR. Type
(optional, only when required by the ATS authority): `S` scheduled, `N`
non-scheduled, `G` general aviation, `M` military, `X` other. Example: `IS`.

## Field 9 — Number and type of aircraft / wake turbulence category (p. A3-11) · Implemented

`[count]type/wtc`. Count only for formation flights (1–2 digits). Type: 2–4
character ICAO designator (Doc 8643) or `ZZZZ` if none assigned. WTC in
this edition of the document: `H` Heavy (≥136 000 kg), `M` Medium
(7 000–136 000 kg), `L` Light (≤7 000 kg). (Later ICAO amendments added `J`
Super for aircraft like the A380; not present in this document's text, so
not implemented — see `docs/roadmap.md`.) Example: `B738/M`.

## Field 10 — Equipment and capabilities (p. A3-12–14) · Implemented

`comnav/surveillance`.

**COM/NAV/approach** (`comnav`): `N` none, or `S` standard (VHF RTF + VOR +
ILS unless the ATS authority prescribes otherwise), and/or any of: `A`
GBAS landing system, `B` LPV (SBAS), `C` LORAN C, `D` DME, `E1` FMC WPR
ACARS, `E2` D-FIS ACARS, `E3` PDC ACARS, `F` ADF, `G` GNSS, `H` HF RTF, `I`
inertial nav, `J1`–`J7` CPDLC variants, `K` MLS, `L` ILS, `M1`–`M3` ATC
SATVOICE variants, `O` VOR, `P1`–`P3` CPDLC/SATVOICE RCP (`P4`–`P9`
reserved), `R` PBN approved, `T` TACAN, `U` UHF RTF, `V` VHF RTF, `W` RVSM
approved, `X` MNPS approved, `Y` 8.33 kHz channel spacing, `Z` other (spelt
out in Field 18 under `COM/`, `NAV/`, `DAT/`).

**Surveillance** (`surveillance`, max 20 characters): `N` none, or any of:
SSR Mode A/C — `A`, `C`; SSR Mode S — `E`, `H`, `I`, `L`, `P`, `S`, `X`
(each a different combination of aircraft-ID/pressure-altitude/enhanced
capability, see the doc for the exact mapping); ADS-B — `B1`, `B2`, `U1`,
`U2`, `V1`, `V2`; ADS-C — `D1`, `G1`. Example: `SDE2E3FGHIRWXY/SB1`.

## Field 13 — Departure aerodrome and time (p. A3-15) · Implemented (with-time variant)

**With time** (`F13`, used by ALR/FPL/CHG/CNL/DLA/DEP/ARR/RQP/RQS/SPL):
`aerodrome` (4-letter ICAO indicator, or `ZZZZ` if none assigned, or
`AFIL` if filed in the air) immediately followed by `time` — EOBT for
FPL/CHG/CNL/DLA/RQS(/RQP if known), or actual departure time for
ALR/DEP/SPL/**ARR**. Example: `WSSS0500`.

**Aerodrome-only** (`F13_NT`, used by CPL/EST/CDN/ACP): just the
4-letter/`ZZZZ`/`AFIL` aerodrome, no time. **Planned for Step 2** (not
needed until CPL/EST/CDN/ACP are implemented).

## Field 14 — Estimate data (p. A3-16), CPL/EST only

`point/time+clearedLevel[suppLevel condition]`. Point: 2–5 character
designator or coordinates. Time: 4 digits at the boundary point. Cleared
level: `F###`/`S####`/`A###`/`M####`. Optionally, a supplementary crossing
level plus `A` (at/above) or `B` (at/below). Examples: `LN/1746F160`,
`CLN/1831F240F180A`. **Planned for Step 2.**

## Field 15 — Route (p. A3-18–20) · Implemented

`speed level route`. Speed: `K####` km/h, `N####` knots, or `M###` Mach
(hundredths). Level: `F###`/`S####`/`A###`/`M####`/`VFR`, no space before
it. Route: a space-separated sequence of any of — (c1) SID designator,
(c2) ATS route designator, (c3) significant point, (c4)
`point/speed+level` change, (c5) `VFR`/`IFR`/`DCT`/`T` indicator, (c6)
cruise climb `C/point/speed/level1level2` or `level`+`PLUS`, (c7) STAR
designator. Step 1 stores the route as a validated free-text string rather
than parsing it into typed tokens — see `docs/roadmap.md` Step 5 for the
planned structured route builder. Example: `N0490F320 DCT PORTE B473 ALASKA`.

## Field 16 — Destination aerodrome, EET, alternates (p. A3-21–22) · Implemented (both variants)

**Full** (`F16_FULL`, used **only** by ALR/FPL/SPL): `dest` (4-letter or
`ZZZZ`) immediately followed by `eet` (4-digit total estimated elapsed
time), then up to 2 alternate aerodromes separated by spaces. Example:
`WMKK0045 WMKP`.

**Basic** (`F16_BASIC`, used by every other message type that carries
Field 16 — CHG/CNL/DLA/DEP/CPL/EST/CDN/ACP/RQP/RQS, and ARR's optional
diversion field): destination aerodrome only, no EET, no alternates. This
is easy to get wrong — a reference implementation not grounded in the
document text used the full form everywhere. Example: `WMKK`.

## Field 17 — Arrival aerodrome and time (p. A3-23), ARR only · Implemented

`aerodrome time[ name]`. Aerodrome: 4-letter or `ZZZZ`. Time: 4-digit
actual arrival time, no space. If `ZZZZ`, a plain-language name follows a
space. Example: `WMKK1045`; diversion example: `ZZZZ1030 DEN HELDER`.

## Field 18 — Other information (p. A3-24–28) · Implemented

`0` if none, otherwise a sequence of `INDICATOR/value` pairs separated by
spaces, in the order shown below:

| Indicator | Meaning |
|---|---|
| `STS/` | Special handling reason: `ALTRV ATFMX FFR FLTCK HAZMAT HEAD HOSP HUM MARSA MEDEVAC NONRVSM SAR STATE` |
| `PBN/` | RNAV/RNP capability, up to 8 of: `A1 B1 B2 B3 B4 B5 B6 C1 C2 C3 C4 D1 D2 D3 D4 L1 O1 O2 O3 O4 S1 S2 T1 T2` |
| `NAV/` | Nav equipment not in Field 10a, e.g. GNSS augmentation methods |
| `COM/` | Comm equipment not in Field 10a |
| `DAT/` | Data comm equipment not in Field 10a |
| `SUR/` | Surveillance equipment/RSP not in Field 10b |
| `DEP/` | Name/location of departure aerodrome if `ZZZZ`/`AFIL` in Field 13 |
| `DEST/` | Name/location of destination aerodrome if `ZZZZ` in Field 16 |
| `DOF/` | Date of flight, `YYMMDD` |
| `REG/` | Aircraft registration, if different from Field 7 |
| `EET/` | Accumulated EET to significant points/FIR boundaries |
| `SEL/` | SELCAL code |
| `TYP/` | Aircraft type(s) if `ZZZZ` in Field 9 |
| `CODE/` | Aircraft address, 6 hex characters |
| `DLE/` | En-route delay point + duration |
| `OPR/` | Operating agency, if different from Field 7 |
| `ORGN/` | Originator's 8-letter AFTN address |
| `PER/` | Aircraft performance category letter |
| `ALTN/` | Name of destination alternate(s) if `ZZZZ` in Field 16 |
| `RALT/` | En-route alternate aerodrome(s) |
| `TALT/` | Take-off alternate aerodrome |
| `RIF/` | Revised route/destination |
| `RMK/` | Plain-language remarks |

The decoder accepts well-formed `KEY/value` tokens even when the key isn't
in this list (flagged as a soft warning, not an error) — real-world
messages sometimes carry regional extensions, e.g. `RVR/` for runway
visual range, which appears in the FPL example supplied for this project.

## Field 19 — Supplementary information (p. A3-29–30), SPL only

Space-separated, in order: `E/HHMM` fuel endurance, `P/n` persons on
board, `R/`(any of `U` UHF `V` VHF `E` ELT), `S/`(any of `P` polar `D`
desert `M` maritime `J` jungle), `J/`(`L` lights / `F` fluorescein, plus
`U`/`V` for life-jacket radio), `D/count capacity C colour` dinghies,
`A/colour markings` aircraft colour, `N/text` other survival remarks,
`C/name` pilot-in-command. Not transmitted in FPL/CPL messages. **Planned
for Step 3.**

## Field 20 — Alerting search and rescue information (p. A3-31–32), ALR only

8 space-separated elements: operator, unit of last contact (6 letters),
time of last contact, frequency, last reported position + time, method of
determining position, action taken, other pertinent information. Any
unavailable element is `NIL` or `NOT KNOWN`, never simply omitted. **Planned
for Step 4.**

## Field 21 — Radio failure information (p. A3-33), RCF only

6 space-separated elements: time of last contact, frequency, last
reported position, time at that position, remaining COM capability, any
remarks. **Planned for Step 4.**

## Field 22 — Amendment (p. A3-34), CHG/CDN only · Implemented

`fieldNumber/correctedValue`, repeatable — each repetition gets its own
leading hyphen (`-8/I-16/EDDN`), and the corrected value is constructed
exactly as specified for the field being amended. Example:
`-14/ENO/0145F290A090A`.
