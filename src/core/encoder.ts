// Encodes builder field values into a canonical ICAO Doc 4444 ATS message
// string, following the exact field order in MESSAGE_TYPES (Appendix 3 §1.3).
import { FIELD_DEFS } from './fields';
import { MESSAGE_TYPES } from './messageTypes';

export function encodeMessage(type: string, values: Record<string, unknown>): string {
  const def = MESSAGE_TYPES[type];
  if (!def || !def.implemented) {
    throw new Error(`Message type "${type}" is not implemented yet`);
  }

  let body = `(${type}`;

  for (const slot of def.fields) {
    const spec = FIELD_DEFS[slot.fieldId];
    if (!spec) continue;
    const value = values[slot.fieldId];

    if (slot.repeatable) {
      // Field 22: encode() already returns the full "-a/b-c/d" chain,
      // including each entry's own leading hyphen.
      const encoded = spec.encode((value ?? []) as never);
      body += encoded;
      continue;
    }

    const isEmpty = value === undefined || spec.isEmpty(value as never);
    if (slot.optional && isEmpty) continue; // e.g. ARR's diversion Field 16

    const encoded = spec.encode((value ?? {}) as never);
    if (encoded) body += `-${encoded}`;
  }

  body += ')';
  return body;
}

export interface BreakdownEntry {
  fieldId: string;
  number: string;
  name: string;
  value: string;
}

/** Field-by-field display breakdown of the current in-progress builder
 * state, independent of whether the message is complete yet. */
export function messageBreakdown(type: string, values: Record<string, unknown>): BreakdownEntry[] {
  const def = MESSAGE_TYPES[type];
  if (!def) return [];
  const rows: BreakdownEntry[] = [];
  for (const slot of def.fields) {
    const spec = FIELD_DEFS[slot.fieldId];
    if (!spec) continue;
    const value = values[slot.fieldId];
    if (slot.repeatable) {
      const entries = (value ?? []) as { field: string; value: string }[];
      if (entries.length === 0) {
        rows.push({ fieldId: slot.fieldId, number: spec.number, name: spec.name, value: '' });
      }
      for (const e of entries) {
        rows.push({ fieldId: slot.fieldId, number: spec.number, name: spec.name, value: e.field ? `${e.field}/${e.value}` : '' });
      }
      continue;
    }
    const encoded = value === undefined ? '' : spec.encode(value as never);
    rows.push({ fieldId: slot.fieldId, number: spec.number, name: spec.name, value: encoded });
  }
  return rows;
}

/** True once every mandatory (non-optional, non-repeatable) field in the
 * message type has a non-empty value — used to gate a "ready to copy" state
 * in the builder UI. */
export function isMessageComplete(type: string, values: Record<string, unknown>): boolean {
  const def = MESSAGE_TYPES[type];
  if (!def) return false;
  for (const slot of def.fields) {
    if (slot.optional || slot.repeatable) continue;
    const spec = FIELD_DEFS[slot.fieldId];
    if (!spec) continue;
    const value = values[slot.fieldId];
    if (value === undefined || spec.isEmpty(value as never)) return false;
  }
  return true;
}
