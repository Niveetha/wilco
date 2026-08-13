// Regex validators for ICAO Doc 4444 data conventions (Appendix 3, 1.6).

export const RE_CALLSIGN = /^[A-Z0-9]{1,7}$/;
export const RE_SSR_OCTAL = /^[0-7]{4}$/;
export const RE_ICAO_AERODROME = /^([A-Z]{4}|ZZZZ|AFIL)$/;
export const RE_ICAO_AERODROME_NO_AFIL = /^([A-Z]{4}|ZZZZ)$/;
export const RE_TIME_HHMM = /^\d{4}$/;
export const RE_AIRCRAFT_TYPE = /^([A-Z0-9]{2,4}|ZZZZ)$/;
export const RE_WTC = /^[HML]$/;

// Field 15(b) / 14(c): level expression — F followed by 3 digits, S by 4,
// A by 3, M by 4, or the literal VFR (Appendix 3, 1.6.2).
export const RE_LEVEL = /^(F\d{3}|S\d{4}|A\d{3}|M\d{4}|VFR)$/;

// Field 15(a): cruising speed — K/N followed by 4 digits, or M followed by 3
// digits for Mach number (Appendix 3, 1.6.2 / Field Type 15).
export const RE_SPEED = /^(K\d{4}|N\d{4}|M\d{3})$/;

// Field 15(c3): a significant point — 2 to 5 characters, or geographical
// coordinates, or bearing/distance from a point (Appendix 3, 1.6.3).
export const RE_ROUTE_TOKEN =
  /^([A-Z0-9]{2,7}|DCT|VFR|IFR|T|\d{4}[NS]\d{5}[EW]|\d{2}[NS]\d{3}[EW]|[A-Z0-9]{2,5}\d{6}|C\/.+)$/;

export function isValidCallsign(v: string): boolean {
  return RE_CALLSIGN.test(v);
}

export function isValidSsr(v: string): boolean {
  return RE_SSR_OCTAL.test(v);
}

export function isValidAerodrome(v: string, allowAfil = false): boolean {
  return allowAfil ? RE_ICAO_AERODROME.test(v) : RE_ICAO_AERODROME_NO_AFIL.test(v);
}

export function isValidTime(v: string): boolean {
  if (!RE_TIME_HHMM.test(v)) return false;
  const hh = Number(v.slice(0, 2));
  const mm = Number(v.slice(2, 4));
  return hh <= 23 && mm <= 59;
}

export function isValidLevel(v: string): boolean {
  return RE_LEVEL.test(v);
}

export function isValidSpeed(v: string): boolean {
  return RE_SPEED.test(v);
}
