// Seed messages for the Library feature — the user's own FPL, plus the
// PANS-ATM document's own worked examples for each implemented type
// (Appendix 3 §2.3, pages A3-39 to A3-43).
export interface SeedMessage {
  id: string;
  type: string;
  title: string;
  raw: string;
  meaning: string;
  sourceRef: string;
}

export const SEED_MESSAGES: SeedMessage[] = [
  {
    id: 'fpl-sia001',
    type: 'FPL',
    title: 'SIA001 — Singapore to Kuala Lumpur',
    raw: '(FPL-SIA001-IS\n-B773/H-SBDE1E2E3FGHIRWXYZ/LB1D1\n-KSFO0500\n-N0490F320 DCT PORTE B473 ALASKA DCT CORDVA B473 AMUKTA B473\n NIKOL DCT OBTIS Y807 CHE DCT SAMON Y81 KAGNO DCT POTET\n M750 KANSU M750 CHALI M750 ENREP STAR\n-WSSS1630 WMKK\n-PBN/A1B1C1D1O1S2 NAV/RNVD1E2A1 REG/9VSNA SEL/CHMR\n CODE/76CE01 RVR/200 OPR/SIA PER/D RMK/TCAS)',
    meaning: 'Filed flight plan for SIA001, a Boeing 777-300 (heavy), from KSFO at 0500 UTC to WSSS with a total EET of 1630, alternate WMKK.',
    sourceRef: 'Supplied by user',
  },
  {
    id: 'chg-doc-example',
    type: 'CHG',
    title: 'Modification — Amsterdam to Frankfurt',
    raw: '(CHGA/F016A/F014-GABWE/A2173-EHAM0850-EDDF-DOF/080122-8/I-16/EDDN)',
    meaning: 'Amsterdam Centre corrects a previously filed flight plan for GABWE: Field 8 (flight rules) is corrected to IFR, and Field 16 (destination) is corrected to Nürnberg (EDDN).',
    sourceRef: 'Appendix 3 §2.3.2.2, p. A3-40',
  },
  {
    id: 'cnl-doc-example',
    type: 'CNL',
    title: 'Cancellation — Berlin to Paris',
    raw: '(CNL-DLH522-EDBB0900-LFPO-0)',
    meaning: 'Cancels the flight plan of DLH522, planned from Berlin (EOBT 0900) to Paris. No other information.',
    sourceRef: 'Appendix 3 §2.3.3.2, p. A3-41',
  },
  {
    id: 'dla-doc-example',
    type: 'DLA',
    title: 'Delay — Fiumicino to Dubrovnik',
    raw: '(DLA-KLM671-LIRF0900-LYDU-0)',
    meaning: 'Revised estimated off-block time for KLM671 at Fiumicino is 0900 UTC, destination Dubrovnik. No other information.',
    sourceRef: 'Appendix 3 §2.3.4.2, p. A3-41',
  },
  {
    id: 'dep-doc-example',
    type: 'DEP',
    title: 'Departure — Aberdeen to Stavanger',
    raw: '(DEP-CSA4311-EGPD1923-ENZV-0)',
    meaning: 'CSA4311 departed Aberdeen at 1923 UTC, destination Stavanger. No other information.',
    sourceRef: 'Appendix 3 §2.3.5.2, p. A3-42',
  },
  {
    id: 'arr-doc-example-1',
    type: 'ARR',
    title: 'Arrival — Budapest to Prague',
    raw: '(ARR-CSA406-LHBP0800-LKPR0913)',
    meaning: 'CSA406 departed Budapest/Ferihegy at 0800 and landed at Prague/Ruzyně at 0913 UTC.',
    sourceRef: 'Appendix 3 §2.3.6.2, p. A3-42',
  },
  {
    id: 'arr-doc-example-2',
    type: 'ARR',
    title: 'Arrival — diversion to an unlisted aerodrome',
    raw: '(ARR-HHE13-EHAM0900-EDDD-ZZZZ1030 DEN HELDER)',
    meaning: 'HHE13 departed Amsterdam at 0900, was flight-planned to Frankfurt, but landed at Den Helder heliport (no ICAO indicator) at 1030 UTC.',
    sourceRef: 'Appendix 3 §2.3.6.3, p. A3-42',
  },
];

export function seedsForType(type: string): SeedMessage[] {
  return SEED_MESSAGES.filter((s) => s.type === type);
}
