import { describe, expect, it } from 'vitest';
import { decodeMessage, detectType } from './decoder';
import { encodeMessage } from './encoder';
import { SEED_MESSAGES } from './examples';

// Field 3 message-number/reference data (computer-to-computer identifiers
// like "A/F016A/F014") isn't collected by the builder UI, so round-trip
// comparisons operate on field VALUES rather than the raw string when the
// source example carries one.
describe('decode -> encode round trip on doc-sourced examples', () => {
  // "Not a standard Doc 4444 indicator" is an informational soft-warning
  // (real-world messages, incl. the user's own SIA001, carry regional
  // extensions like RVR/) — it doesn't indicate a decode failure.
  const isHardError = (e: string) => !e.includes('is not a standard Doc 4444 indicator');

  for (const seed of SEED_MESSAGES) {
    it(`${seed.id} (${seed.type})`, () => {
      const decoded = decodeMessage(seed.raw);
      expect(decoded.errors.filter(isHardError)).toEqual([]);
      expect(decoded.type).toBe(seed.type);

      const reEncoded = encodeMessage(seed.type, decoded.values);
      const reDecoded = decodeMessage(reEncoded);
      expect(reDecoded.errors.filter(isHardError)).toEqual([]);
      expect(reDecoded.values).toEqual(decoded.values);
    });
  }
});

describe('exact string round trip (no Field 3 message-ref present)', () => {
  it('SIA001 FPL reproduces as a clean canonical single line', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'fpl-sia001')!;
    const decoded = decodeMessage(seed.raw);
    const reEncoded = encodeMessage('FPL', decoded.values);
    expect(reEncoded).toBe(
      '(FPL-SIA001-IS-B773/H-SBDE1E2E3FGHIRWXYZ/LB1D1-KSFO0500-N0490F320 DCT PORTE B473 ALASKA DCT CORDVA B473 AMUKTA B473 NIKOL DCT OBTIS Y807 CHE DCT SAMON Y81 KAGNO DCT POTET M750 KANSU M750 CHALI M750 ENREP STAR-WSSS1630 WMKK-PBN/A1B1C1D1O1S2 NAV/RNVD1E2A1 REG/9VSNA SEL/CHMR CODE/76CE01 RVR/200 OPR/SIA PER/D RMK/TCAS)',
    );
  });

  it('CNL doc example reproduces exactly', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'cnl-doc-example')!;
    const decoded = decodeMessage(seed.raw);
    expect(encodeMessage('CNL', decoded.values)).toBe(seed.raw);
  });

  it('DLA doc example reproduces exactly', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'dla-doc-example')!;
    const decoded = decodeMessage(seed.raw);
    expect(encodeMessage('DLA', decoded.values)).toBe(seed.raw);
  });

  it('DEP doc example reproduces exactly', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'dep-doc-example')!;
    const decoded = decodeMessage(seed.raw);
    expect(encodeMessage('DEP', decoded.values)).toBe(seed.raw);
  });

  it('ARR doc example 1 (no diversion) reproduces exactly', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'arr-doc-example-1')!;
    const decoded = decodeMessage(seed.raw);
    expect(encodeMessage('ARR', decoded.values)).toBe(seed.raw);
  });

  it('ARR doc example 2 (diversion, Field 16 present) reproduces exactly', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'arr-doc-example-2')!;
    const decoded = decodeMessage(seed.raw);
    expect(encodeMessage('ARR', decoded.values)).toBe(seed.raw);
  });
});

describe('detectType', () => {
  it('reads the 3-letter designator regardless of message-ref suffix', () => {
    expect(detectType('(FPL-SIA001-IS ...')).toBe('FPL');
    expect(detectType('(CHGA/F016A/F014-...')).toBe('CHG');
  });
});

describe('CHG amendment decoding', () => {
  it('splits Field 18 from repeated Field 22 amendments', () => {
    const seed = SEED_MESSAGES.find((s) => s.id === 'chg-doc-example')!;
    const decoded = decodeMessage(seed.raw);
    expect(decoded.errors).toEqual([]);
    expect(decoded.values.F18).toEqual({ indicators: [{ key: 'DOF', value: '080122' }] });
    expect(decoded.values.F22).toEqual([
      { field: '8', value: 'I' },
      { field: '16', value: 'EDDN' },
    ]);
  });
});
