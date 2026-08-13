import { describe, expect, it } from 'vitest';
import { F7, F8, F9, F10, F13, F15, F16_FULL, F16_BASIC, F17, F18, F22 } from './fields';

describe('F7 — Aircraft identification and SSR', () => {
  it('encodes with and without SSR', () => {
    expect(F7.encode({ callsign: 'SIA001', ssr: '' })).toBe('SIA001');
    expect(F7.encode({ callsign: 'SIA123', ssr: '2173' })).toBe('SIA123/A2173');
  });
  it('decodes both forms', () => {
    expect(F7.decode('SIA001')).toEqual({ value: { callsign: 'SIA001', ssr: '' }, errors: [] });
    expect(F7.decode('SAS912/A5100')).toEqual({ value: { callsign: 'SAS912', ssr: '5100' }, errors: [] });
  });
});

describe('F8 — Flight rules and type', () => {
  it('round-trips', () => {
    expect(F8.encode({ rules: 'I', type: 'S' })).toBe('IS');
    expect(F8.decode('IS').value).toEqual({ rules: 'I', type: 'S' });
    expect(F8.encode({ rules: 'V', type: '' })).toBe('V');
  });
});

describe('F9 — Number/type/WTC', () => {
  it('omits count of 1', () => {
    expect(F9.encode({ count: '1', type: 'B738', wtc: 'M' })).toBe('B738/M');
    expect(F9.encode({ count: '2', type: 'FK27', wtc: 'M' })).toBe('2FK27/M');
  });
  it('decodes formation flights', () => {
    expect(F9.decode('2FK27/M').value).toEqual({ count: '2', type: 'FK27', wtc: 'M' });
    expect(F9.decode('B773/H').value).toEqual({ count: '', type: 'B773', wtc: 'H' });
  });
});

describe('F10 — Equipment', () => {
  it('round-trips', () => {
    expect(F10.encode({ comnav: 'SDE2E3FGHIRWXY', surveillance: 'SB1' })).toBe('SDE2E3FGHIRWXY/SB1');
    expect(F10.decode('SDE2E3FGHIRWXY/SB1').value).toEqual({
      comnav: 'SDE2E3FGHIRWXY',
      surveillance: 'SB1',
    });
  });
});

describe('F13 — Departure aerodrome and time', () => {
  it('round-trips and validates', () => {
    expect(F13.encode({ aerodrome: 'WSSS', time: '0500' })).toBe('WSSS0500');
    const d = F13.decode('WSSS0500');
    expect(d.value).toEqual({ aerodrome: 'WSSS', time: '0500' });
    expect(d.errors).toEqual([]);
  });
  it('accepts AFIL and ZZZZ', () => {
    expect(F13.decode('AFIL1625').value).toEqual({ aerodrome: 'AFIL', time: '1625' });
  });
});

describe('F15 — Route', () => {
  it('round-trips speed/level/route', () => {
    const raw = 'N0490F320 DCT PORTE B473 ALASKA';
    const d = F15.decode(raw);
    expect(d.value).toEqual({ speed: 'N0490', level: 'F320', route: 'DCT PORTE B473 ALASKA' });
    expect(F15.encode(d.value)).toBe(raw);
  });
  it('handles no-route (speed/level only)', () => {
    const d = F15.decode('N0420A220');
    expect(d.value).toEqual({ speed: 'N0420', level: 'A220', route: '' });
    expect(F15.encode(d.value)).toBe('N0420A220');
  });
});

describe('F16 — Destination variants', () => {
  it('FULL round-trips dest+EET+alternates', () => {
    const raw = 'WMKK0045 WMKP';
    const d = F16_FULL.decode(raw);
    expect(d.value).toEqual({ dest: 'WMKK', eet: '0045', alt1: 'WMKP', alt2: '' });
    expect(F16_FULL.encode(d.value)).toBe(raw);
  });
  it('BASIC is dest-only, no EET', () => {
    const d = F16_BASIC.decode('LFPO');
    expect(d.value).toEqual({ dest: 'LFPO' });
    expect(F16_BASIC.encode(d.value)).toBe('LFPO');
  });
});

describe('F17 — Arrival aerodrome and time', () => {
  it('round-trips plain form', () => {
    const d = F17.decode('WMKK1045');
    expect(d.value).toEqual({ aerodrome: 'WMKK', time: '1045', name: '' });
    expect(F17.encode(d.value)).toBe('WMKK1045');
  });
  it('round-trips ZZZZ+name form', () => {
    const d = F17.decode('ZZZZ1030 DEN HELDER');
    expect(d.value).toEqual({ aerodrome: 'ZZZZ', time: '1030', name: 'DEN HELDER' });
    expect(F17.encode(d.value)).toBe('ZZZZ1030 DEN HELDER');
  });
});

describe('F18 — Other information', () => {
  it('encodes 0 for empty', () => {
    expect(F18.encode({ indicators: [] })).toBe('0');
    expect(F18.decode('0').value).toEqual({ indicators: [] });
  });
  it('round-trips multiple indicators incl. non-standard ones', () => {
    const raw = 'PBN/A1B1C1D1O1S2 NAV/RNVD1E2A1 REG/9VSNA SEL/CHMR CODE/76CE01 RVR/200 OPR/SIA PER/D RMK/TCAS';
    const d = F18.decode(raw);
    expect(F18.encode(d.value)).toBe(raw);
    expect(d.value.indicators.find((i) => i.key === 'RVR')).toEqual({ key: 'RVR', value: '200' });
    // RVR/ isn't a standard Doc 4444 indicator, so it should produce a soft warning.
    expect(d.errors.some((e) => e.includes('RVR'))).toBe(true);
  });
  it('keeps multi-word remarks together', () => {
    const raw = 'RMK/NO POSITION REPORT SINCE DEP PLUS 2 MINUTES';
    const d = F18.decode(raw);
    expect(d.value.indicators).toEqual([{ key: 'RMK', value: 'NO POSITION REPORT SINCE DEP PLUS 2 MINUTES' }]);
    expect(F18.encode(d.value)).toBe(raw);
  });
});

describe('F22 — Amendment', () => {
  it('encodes each entry with its own leading hyphen', () => {
    expect(F22.encode([{ field: '8', value: 'I' }, { field: '16', value: 'EDDN' }])).toBe('-8/I-16/EDDN');
  });
  it('decodes a single amendment segment', () => {
    expect(F22.decode('16/EDDN').value).toEqual([{ field: '16', value: 'EDDN' }]);
  });
});
