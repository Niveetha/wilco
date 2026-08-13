// Field catalog for ICAO Doc 4444 / PANS-ATM Appendix 3 ATS message fields.
// Grammar and examples are transcribed from the Appendix 3 field pages
// (A3-6 to A3-34) of the PANS-ATM document the user supplied — see
// docs/field-reference.md for the full write-up with page citations.
import type { AmendmentEntry, DecodeResult, FieldSpec, Indicator } from './types';
import {
  isValidAerodrome,
  isValidLevel,
  isValidSpeed,
  isValidTime,
} from './validators';

function seg(v: string | undefined): string {
  return (v ?? '').trim().toUpperCase();
}

// ---------------------------------------------------------------------------
// Field 7 — Aircraft identification and SSR mode and code (A3-9)
// ---------------------------------------------------------------------------
export interface F7Value {
  callsign: string;
  ssr: string;
}

export const F7: FieldSpec<F7Value> = {
  id: 'F7',
  number: '7',
  name: 'Aircraft Identification and SSR Mode/Code',
  mandatory: true,
  hint: 'Callsign (max 7 alphanumeric, no hyphens) [/A + 4 octal SSR digits]. SSR mode is always A.',
  example: 'SIA123/A2173',
  sourceRef: 'Appendix 3, Field Type 7, p. A3-9',
  inputs: [
    { id: 'callsign', label: 'Callsign (max 7)', placeholder: 'SIA123', maxLength: 7, transform: 'upper' },
    { id: 'ssr', label: 'SSR Code (octal 0–7)', placeholder: '2173', maxLength: 4, transform: 'upper' },
  ],
  isEmpty: (v) => !seg(v.callsign),
  encode: (v) => {
    const cs = seg(v.callsign);
    const ssr = seg(v.ssr);
    if (!cs) return '';
    return ssr.length === 4 ? `${cs}/A${ssr}` : cs;
  },
  decode: (raw) => {
    const m = /^([A-Z0-9]{1,7})(?:\/A(\d{4}))?$/.exec(raw.trim());
    if (!m) return { value: { callsign: raw.trim(), ssr: '' }, errors: [`F7: could not parse "${raw}"`] };
    return { value: { callsign: m[1], ssr: m[2] ?? '' }, errors: [] };
  },
};

// ---------------------------------------------------------------------------
// Field 8 — Flight rules and type of flight (A3-10)
// ---------------------------------------------------------------------------
export interface F8Value {
  rules: string;
  type: string;
}

export const F8: FieldSpec<F8Value> = {
  id: 'F8',
  number: '8',
  name: 'Flight Rules and Type of Flight',
  mandatory: true,
  hint: 'Rules: I=IFR  V=VFR  Y=IFR then VFR  Z=VFR then IFR.  Type (optional): S N G M X.',
  example: 'IS',
  sourceRef: 'Appendix 3, Field Type 8, p. A3-10',
  inputs: [
    {
      id: 'rules',
      label: 'Flight Rules',
      kind: 'select',
      options: [
        { value: '', label: '--' },
        { value: 'I', label: 'I — IFR' },
        { value: 'V', label: 'V — VFR' },
        { value: 'Y', label: 'Y — IFR then VFR' },
        { value: 'Z', label: 'Z — VFR then IFR' },
      ],
    },
    {
      id: 'type',
      label: 'Type of Flight',
      kind: 'select',
      options: [
        { value: '', label: '-- optional --' },
        { value: 'S', label: 'S — Scheduled' },
        { value: 'N', label: 'N — Non-scheduled' },
        { value: 'G', label: 'G — General aviation' },
        { value: 'M', label: 'M — Military' },
        { value: 'X', label: 'X — Other' },
      ],
    },
  ],
  isEmpty: (v) => !seg(v.rules),
  encode: (v) => seg(v.rules) + seg(v.type),
  decode: (raw) => {
    const r = raw.trim();
    if (!/^[IVYZ]([SNGMX])?$/.test(r)) {
      return { value: { rules: r.slice(0, 1), type: r.slice(1) }, errors: [`F8: unexpected value "${raw}"`] };
    }
    return { value: { rules: r.slice(0, 1), type: r.slice(1) }, errors: [] };
  },
};

// ---------------------------------------------------------------------------
// Field 9 — Number and type of aircraft and wake turbulence category (A3-11)
// ---------------------------------------------------------------------------
export interface F9Value {
  count: string;
  type: string;
  wtc: string;
}

export const F9: FieldSpec<F9Value> = {
  id: 'F9',
  number: '9',
  name: 'Number and Type of Aircraft / Wake Turbulence Category',
  mandatory: true,
  hint: '[count, formations only] ICAO type designator (Doc 8643) or ZZZZ / WTC: H=Heavy M=Medium L=Light.',
  example: 'B738/M',
  sourceRef: 'Appendix 3, Field Type 9, p. A3-11',
  inputs: [
    { id: 'count', label: 'Count (formations only)', placeholder: '1', maxLength: 2 },
    { id: 'type', label: 'ICAO Type Designator', placeholder: 'B738', maxLength: 4, transform: 'upper' },
    {
      id: 'wtc',
      label: 'Wake Turbulence',
      kind: 'select',
      options: [
        { value: '', label: '--' },
        { value: 'H', label: 'H — Heavy' },
        { value: 'M', label: 'M — Medium' },
        { value: 'L', label: 'L — Light' },
      ],
    },
  ],
  isEmpty: (v) => !seg(v.type) || !seg(v.wtc),
  encode: (v) => {
    const count = seg(v.count);
    const type = seg(v.type);
    const wtc = seg(v.wtc);
    if (!type || !wtc) return '';
    const n = count && count !== '1' ? count : '';
    return `${n}${type}/${wtc}`;
  },
  decode: (raw) => {
    const m = /^(\d{1,2})?([A-Z0-9]{2,4}|ZZZZ)\/([HML])$/.exec(raw.trim());
    if (!m) return { value: { count: '', type: raw.trim(), wtc: '' }, errors: [`F9: could not parse "${raw}"`] };
    return { value: { count: m[1] ?? '', type: m[2], wtc: m[3] }, errors: [] };
  },
};

// ---------------------------------------------------------------------------
// Field 10 — Equipment and capabilities (A3-12)
// ---------------------------------------------------------------------------
export interface F10Value {
  comnav: string;
  surveillance: string;
}

export const F10: FieldSpec<F10Value> = {
  id: 'F10',
  number: '10',
  name: 'Equipment and Capabilities',
  mandatory: true,
  hint: 'COM/NAV: N=None, S=Standard, and/or letters (A B C D E1 E2 E3 F G H I J1–J7 K L M1–M3 O P1–P9 R T U V W X Y Z)  /  Surveillance: N=None or codes (A C E H I L P S X, B1 B2 U1 U2 V1 V2, D1 G1).',
  example: 'SDE2E3FGHIRWXY/SB1',
  sourceRef: 'Appendix 3, Field Type 10, p. A3-12',
  inputs: [
    { id: 'comnav', label: 'COM/NAV/Approach equipment', placeholder: 'SDE2E3FGHIRWXY', width: 'full', transform: 'upper' },
    { id: 'surveillance', label: 'Surveillance equipment', placeholder: 'SB1', width: 'full', transform: 'upper' },
  ],
  isEmpty: (v) => !seg(v.comnav),
  encode: (v) => {
    const comnav = seg(v.comnav);
    if (!comnav) return '';
    return `${comnav}/${seg(v.surveillance)}`;
  },
  decode: (raw) => {
    const [comnav, surveillance = ''] = raw.trim().split('/');
    return { value: { comnav, surveillance }, errors: [] };
  },
};

// ---------------------------------------------------------------------------
// Field 13 — Departure aerodrome and time (A3-15)
// Two variants used across the catalog: with time (most types) and
// aerodrome-only (CPL/EST/CDN/ACP — not needed until Step 2).
// ---------------------------------------------------------------------------
export interface F13Value {
  aerodrome: string;
  time: string;
}

export const F13: FieldSpec<F13Value> = {
  id: 'F13',
  number: '13',
  name: 'Departure Aerodrome and Time',
  mandatory: true,
  hint: 'ICAO 4-letter aerodrome (or ZZZZ / AFIL) + EOBT or actual departure time (HHMM UTC), no space.',
  example: 'WSSS0500',
  sourceRef: 'Appendix 3, Field Type 13, p. A3-15',
  inputs: [
    { id: 'aerodrome', label: 'Departure ICAO', placeholder: 'WSSS', maxLength: 4, transform: 'upper' },
    { id: 'time', label: 'EOBT / Departure Time (UTC)', placeholder: '0500', maxLength: 4 },
  ],
  isEmpty: (v) => !seg(v.aerodrome) || !seg(v.time),
  encode: (v) => {
    const a = seg(v.aerodrome);
    const t = seg(v.time);
    return a && t ? `${a}${t}` : '';
  },
  decode: (raw) => {
    const m = /^([A-Z]{4}|ZZZZ|AFIL)(\d{4})$/.exec(raw.trim());
    if (!m) return { value: { aerodrome: raw.trim(), time: '' }, errors: [`F13: could not parse "${raw}"`] };
    const errors: string[] = [];
    if (!isValidAerodrome(m[1], true)) errors.push(`F13: "${m[1]}" is not a valid aerodrome code`);
    if (!isValidTime(m[2])) errors.push(`F13: "${m[2]}" is not a valid HHMM time`);
    return { value: { aerodrome: m[1], time: m[2] }, errors };
  },
};

// ---------------------------------------------------------------------------
// Field 15 — Route (A3-18)
// ---------------------------------------------------------------------------
export interface F15Value {
  speed: string;
  level: string;
  route: string;
}

export const F15: FieldSpec<F15Value> = {
  id: 'F15',
  number: '15',
  name: 'Cruising Speed / Level / Route',
  mandatory: true,
  hint: 'Speed: K####(km/h) N####(kts) M###(Mach), no space before level. Level: F### S#### A### M#### VFR. Then route: SID / ATS route / significant points / DCT / speed-level changes (POINT/N0000F000) / VFR / IFR / cruise climb (C/point/speed/levelPLUS).',
  example: 'N0490F320 DCT PORTE B473 ALASKA',
  sourceRef: 'Appendix 3, Field Type 15, p. A3-18 to A3-20',
  inputs: [
    { id: 'speed', label: 'Speed', placeholder: 'N0490', maxLength: 5, transform: 'upper' },
    { id: 'level', label: 'Level', placeholder: 'F320', maxLength: 5, transform: 'upper' },
    { id: 'route', label: 'Route', placeholder: 'DCT PORTE B473 ALASKA DCT CORDVA', width: 'full', transform: 'upper' },
  ],
  isEmpty: (v) => !seg(v.speed) || !seg(v.level),
  encode: (v) => {
    const s = seg(v.speed);
    const l = seg(v.level);
    if (!s || !l) return '';
    const r = seg(v.route);
    return r ? `${s}${l} ${r}` : `${s}${l}`;
  },
  decode: (raw) => {
    const m = /^(K\d{4}|N\d{4}|M\d{3})(F\d{3}|S\d{4}|A\d{3}|M\d{4}|VFR)(?:\s+([\s\S]*))?$/.exec(raw.trim());
    if (!m) return { value: { speed: '', level: '', route: raw.trim() }, errors: [`F15: could not parse speed/level from "${raw}"`] };
    const errors: string[] = [];
    if (!isValidSpeed(m[1])) errors.push(`F15: "${m[1]}" is not a valid speed`);
    if (!isValidLevel(m[2])) errors.push(`F15: "${m[2]}" is not a valid level`);
    return { value: { speed: m[1], level: m[2], route: (m[3] ?? '').trim() }, errors };
  },
};

// ---------------------------------------------------------------------------
// Field 16 — Destination aerodrome and total EET, alternate aerodrome(s) (A3-21)
// FULL variant (dest + EET [+ up to 2 alternates]) is used only by ALR/FPL/SPL.
// BASIC variant (dest only) is used by every other message type that carries F16.
// ---------------------------------------------------------------------------
export interface F16FullValue {
  dest: string;
  eet: string;
  alt1: string;
  alt2: string;
}

export const F16_FULL: FieldSpec<F16FullValue> = {
  id: 'F16_FULL',
  number: '16',
  name: 'Destination Aerodrome, EET, Alternates',
  mandatory: true,
  hint: 'Dest ICAO (or ZZZZ) + total EET (HHMM), no space. Then up to 2 alternate aerodromes, space separated. Full form used only in ALR / FPL / SPL messages.',
  example: 'WMKK0045 WMKP',
  sourceRef: 'Appendix 3, Field Type 16, p. A3-21',
  inputs: [
    { id: 'dest', label: 'Destination ICAO', placeholder: 'WMKK', maxLength: 4, transform: 'upper' },
    { id: 'eet', label: 'Total EET (HHMM)', placeholder: '0045', maxLength: 4 },
    { id: 'alt1', label: 'Alternate 1', placeholder: 'WMKP', maxLength: 4, transform: 'upper' },
    { id: 'alt2', label: 'Alternate 2', placeholder: '', maxLength: 4, transform: 'upper' },
  ],
  isEmpty: (v) => !seg(v.dest),
  encode: (v) => {
    const d = seg(v.dest);
    if (!d) return '';
    let out = `${d}${seg(v.eet)}`;
    if (seg(v.alt1)) out += ` ${seg(v.alt1)}`;
    if (seg(v.alt2)) out += ` ${seg(v.alt2)}`;
    return out;
  },
  decode: (raw) => {
    const tokens = raw.trim().split(/\s+/);
    const m = /^([A-Z]{4}|ZZZZ)(\d{4})?$/.exec(tokens[0] ?? '');
    if (!m) return { value: { dest: tokens[0] ?? '', eet: '', alt1: '', alt2: '' }, errors: [`F16: could not parse "${raw}"`] };
    return {
      value: { dest: m[1], eet: m[2] ?? '', alt1: tokens[1] ?? '', alt2: tokens[2] ?? '' },
      errors: [],
    };
  },
};

export interface F16BasicValue {
  dest: string;
}

export const F16_BASIC: FieldSpec<F16BasicValue> = {
  id: 'F16_BASIC',
  number: '16',
  name: 'Destination Aerodrome',
  mandatory: true,
  hint: 'Dest ICAO (or ZZZZ) only — no EET, no alternates, in this message type (Appendix 3, Field 16 note *).',
  example: 'WMKK',
  sourceRef: 'Appendix 3, Field Type 16, p. A3-21 (note *)',
  inputs: [{ id: 'dest', label: 'Destination ICAO', placeholder: 'WMKK', maxLength: 4, transform: 'upper' }],
  isEmpty: (v) => !seg(v.dest),
  encode: (v) => seg(v.dest),
  decode: (raw) => {
    const d = raw.trim();
    if (!isValidAerodrome(d)) return { value: { dest: d }, errors: [`F16: "${d}" is not a valid aerodrome code`] };
    return { value: { dest: d }, errors: [] };
  },
  looksLike: (raw) => /^([A-Z]{4}|ZZZZ)$/.test(raw.trim()),
};

// ---------------------------------------------------------------------------
// Field 17 — Arrival aerodrome and time (A3-23)
// ---------------------------------------------------------------------------
export interface F17Value {
  aerodrome: string;
  time: string;
  name: string;
}

export const F17: FieldSpec<F17Value> = {
  id: 'F17',
  number: '17',
  name: 'Arrival Aerodrome and Time',
  mandatory: true,
  hint: 'Arrival ICAO (or ZZZZ) + actual landing time (HHMM), no space. If ZZZZ, add the aerodrome name after a space.',
  example: 'WMKK1045',
  sourceRef: 'Appendix 3, Field Type 17, p. A3-23',
  inputs: [
    { id: 'aerodrome', label: 'Arrival ICAO', placeholder: 'WMKK', maxLength: 4, transform: 'upper' },
    { id: 'time', label: 'Landing Time (UTC)', placeholder: '1045', maxLength: 4 },
    { id: 'name', label: 'Name (if ZZZZ)', placeholder: '', width: 'full', transform: 'upper' },
  ],
  isEmpty: (v) => !seg(v.aerodrome) || !seg(v.time),
  encode: (v) => {
    const a = seg(v.aerodrome);
    const t = seg(v.time);
    if (!a || !t) return '';
    const n = seg(v.name);
    return a === 'ZZZZ' && n ? `${a}${t} ${n}` : `${a}${t}`;
  },
  decode: (raw) => {
    const tokens = raw.trim().split(/\s+/);
    const m = /^([A-Z]{4}|ZZZZ)(\d{4})$/.exec(tokens[0] ?? '');
    if (!m) return { value: { aerodrome: tokens[0] ?? '', time: '', name: '' }, errors: [`F17: could not parse "${raw}"`] };
    return { value: { aerodrome: m[1], time: m[2], name: tokens.slice(1).join(' ') }, errors: [] };
  },
};

// ---------------------------------------------------------------------------
// Field 18 — Other information (A3-24 to A3-28)
// ---------------------------------------------------------------------------
export interface F18Value {
  indicators: Indicator[];
}

export const F18_INDICATOR_KEYS = [
  'STS', 'PBN', 'NAV', 'COM', 'DAT', 'SUR', 'DEP', 'DEST', 'DOF', 'REG',
  'EET', 'SEL', 'TYP', 'CODE', 'DLE', 'OPR', 'ORGN', 'PER', 'ALTN', 'RALT',
  'TALT', 'RIF', 'RMK',
] as const;

export const F18_INDICATOR_HINTS: Record<string, string> = {
  STS: 'ALTRV ATFMX FFR FLTCK HAZMAT HEAD HOSP HUM MARSA MEDEVAC NONRVSM SAR STATE',
  PBN: 'A1 B1-B6 C1-C4 D1-D4 L1 O1-O4 S1 S2 T1 T2 (max 8 entries)',
  NAV: 'GNSS augmentation methods, space separated e.g. GBAS SBAS',
  COM: 'Communication equipment not in Field 10a',
  DAT: 'Data communication equipment not in Field 10a',
  SUR: 'Surveillance equipment/RSP not in Field 10b, e.g. RSP180',
  DEP: 'Name/location of departure aerodrome if ZZZZ/AFIL in Field 13',
  DEST: 'Name/location of destination aerodrome if ZZZZ in Field 16',
  DOF: 'Date of flight, YYMMDD',
  REG: 'Aircraft registration, if different from Field 7',
  EET: 'Significant points/FIR boundaries + accumulated EET, e.g. CAP0745 XYZ0830',
  SEL: 'SELCAL code',
  TYP: 'Aircraft type(s) if ZZZZ in Field 9, e.g. 2F15 5F5',
  CODE: 'Aircraft address, 6 hex characters',
  DLE: 'En-route delay point + duration HHMM, e.g. MDG0030',
  OPR: 'Operating agency, if different from Field 7',
  ORGN: "Originator's 8-letter AFTN address",
  PER: 'Aircraft performance category letter (PANS-OPS)',
  ALTN: 'Name of destination alternate(s) if ZZZZ in Field 16',
  RALT: 'En-route alternate aerodrome(s)',
  TALT: 'Take-off alternate aerodrome',
  RIF: 'Revised route/destination, e.g. DTA HEC KLAX',
  RMK: 'Plain-language remarks',
};

export const F18: FieldSpec<F18Value> = {
  id: 'F18',
  number: '18',
  name: 'Other Information',
  mandatory: false,
  hint: 'Insert 0 if none, or indicator/value pairs in sequence: STS/ PBN/ NAV/ COM/ DAT/ SUR/ DEP/ DEST/ DOF/ REG/ EET/ SEL/ TYP/ CODE/ DLE/ OPR/ ORGN/ PER/ ALTN/ RALT/ TALT/ RIF/ RMK/',
  example: 'PBN/A1B1C1D1O1S2 DOF/260307 REG/9VSNA',
  sourceRef: 'Appendix 3, Field Type 18, p. A3-24 to A3-28',
  isEmpty: () => false,
  encode: (v) => {
    const parts = v.indicators.filter((i) => i.key && i.value).map((i) => `${i.key}/${i.value}`);
    return parts.length ? parts.join(' ') : '0';
  },
  decode: (raw) => {
    const r = raw.trim();
    if (r === '0' || r === '') return { value: { indicators: [] }, errors: [] };
    const words = r.split(/\s+/);
    const indicators: Indicator[] = [];
    const errors: string[] = [];
    const keySet: Set<string> = new Set(F18_INDICATOR_KEYS);
    for (const word of words) {
      const m = /^([A-Z]{2,6})\/(.*)$/.exec(word);
      if (m) {
        // Any well-formed KEY/value token starts a new indicator, even if
        // the key isn't in the standard Doc 4444 list — some regions add
        // operational extensions (e.g. RVR/) that real messages carry.
        if (!keySet.has(m[1])) errors.push(`F18: "${m[1]}/" is not a standard Doc 4444 indicator (kept as-is)`);
        indicators.push({ key: m[1], value: m[2] });
      } else if (indicators.length) {
        indicators[indicators.length - 1].value += ` ${word}`;
      } else {
        indicators.push({ key: '?', value: word });
        errors.push(`F18: could not classify "${word}"`);
      }
    }
    return { value: { indicators }, errors };
  },
  looksLike: (raw) => {
    const first = raw.trim().split(/\s+/)[0] ?? '';
    return !/^\d{1,2}\//.test(first);
  },
};

// ---------------------------------------------------------------------------
// Field 22 — Amendment (A3-34), used by CHG and CDN; repeatable.
// ---------------------------------------------------------------------------
export const F22: FieldSpec<AmendmentEntry[]> = {
  id: 'F22',
  number: '22',
  name: 'Amendment',
  mandatory: true,
  hint: 'Field number / complete corrected data, constructed exactly as for that field. Repeat (each with its own leading hyphen) for multiple amendments.',
  example: '16/EDDN',
  sourceRef: 'Appendix 3, Field Type 22, p. A3-34',
  isEmpty: (v) => v.length === 0,
  encode: (v) => v.filter((e) => e.field && e.value).map((e) => `-${e.field}/${e.value}`).join(''),
  decode: (raw) => {
    const m = /^(\d{1,2})\/(.*)$/.exec(raw.trim());
    if (!m) return { value: [{ field: '', value: raw.trim() }], errors: [`F22: could not parse "${raw}"`] };
    return { value: [{ field: m[1], value: m[2] }], errors: [] };
  },
  looksLike: (raw) => /^\d{1,2}\//.test(raw.trim()),
};

export type AnyFieldSpec = FieldSpec<any>;

export const FIELD_DEFS: Record<string, AnyFieldSpec> = {
  F7, F8, F9, F10, F13, F15, F16_FULL, F16_BASIC, F17, F18, F22,
};

export function decodeField(fieldId: string, raw: string): DecodeResult<unknown> {
  const spec = FIELD_DEFS[fieldId];
  if (!spec) return { value: { raw }, errors: [`${fieldId}: decoder not implemented yet`] };
  return spec.decode(raw);
}

export function encodeField(fieldId: string, value: unknown): string {
  const spec = FIELD_DEFS[fieldId];
  if (!spec) return '';
  return spec.encode(value as never);
}

export function defaultValueFor(fieldId: string): unknown {
  if (fieldId === 'F22') return [];
  if (fieldId === 'F18') return { indicators: [] };
  const spec = FIELD_DEFS[fieldId];
  if (spec?.inputs) return Object.fromEntries(spec.inputs.map((i) => [i.id, '']));
  return {};
}

// Metadata-only entries for fields not yet wired up for encode/decode
// (arriving in Steps 2–4, see docs/roadmap.md). Used to label field lists
// on "planned" message type tiles and in docs/field-reference.md.
export const FIELD_META: Record<string, { number: string; name: string }> = {
  F3: { number: '3', name: 'Message Type, Number and Reference Data' },
  F3_LAM: { number: '3', name: 'Message Type, Number and Reference Data' },
  F5: { number: '5', name: 'Description of Emergency' },
  F7: { number: F7.number, name: F7.name },
  F8: { number: F8.number, name: F8.name },
  F9: { number: F9.number, name: F9.name },
  F10: { number: F10.number, name: F10.name },
  F13: { number: F13.number, name: F13.name },
  F13_NT: { number: '13', name: 'Departure Aerodrome' },
  F14: { number: '14', name: 'Estimate Data' },
  F15: { number: F15.number, name: F15.name },
  F16_FULL: { number: F16_FULL.number, name: F16_FULL.name },
  F16_BASIC: { number: F16_BASIC.number, name: F16_BASIC.name },
  F17: { number: F17.number, name: F17.name },
  F18: { number: F18.number, name: F18.name },
  F19: { number: '19', name: 'Supplementary Information' },
  F20: { number: '20', name: 'Alerting Search and Rescue Information' },
  F21: { number: '21', name: 'Radio Failure Information' },
  F22: { number: F22.number, name: F22.name },
};
