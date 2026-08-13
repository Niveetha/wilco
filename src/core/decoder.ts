// Decodes a raw ICAO Doc 4444 ATS message string back into typed field
// values, using the message type's known field order (Appendix 3 §1.3) to
// guide a sequential split — plain dash-splitting isn't enough because
// Fields 15/18 contain internal spaces and Field 22 reintroduces hyphens.
import { FIELD_DEFS, FIELD_META } from './fields';
import { MESSAGE_TYPES } from './messageTypes';
import type { DecodedMessage } from './types';

function normalize(raw: string): string {
  return raw.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function detectType(raw: string): string | null {
  const cleaned = normalize(raw).replace(/^\(/, '');
  const m = /^([A-Z]{3})/.exec(cleaned);
  return m ? m[1] : null;
}

export function decodeMessage(raw: string): DecodedMessage {
  const errors: string[] = [];
  let cleaned = normalize(raw);
  if (cleaned.startsWith('(')) cleaned = cleaned.slice(1);
  if (cleaned.endsWith(')')) cleaned = cleaned.slice(0, -1);

  const segments = cleaned.split('-');
  const f3 = segments[0] ?? '';
  const type = f3.slice(0, 3);
  const messageRef = f3.slice(3);

  const def = MESSAGE_TYPES[type];
  const values: Record<string, unknown> = {};
  const breakdown: DecodedMessage['breakdown'] = [];

  if (!def) {
    errors.push(`Unrecognized message type "${type || raw.slice(0, 3)}"`);
    return { type, messageRef, values, breakdown, errors };
  }
  if (!def.implemented) {
    errors.push(`${type} (${def.name}) decoding lands in a later step — see docs/roadmap.md`);
    return { type, messageRef, values, breakdown, errors };
  }

  let i = 1; // segments[0] was Field 3
  for (const slot of def.fields) {
    const spec = FIELD_DEFS[slot.fieldId];
    if (!spec) continue;

    if (slot.repeatable) {
      const entries: unknown[] = [];
      while (i < segments.length) {
        const seg = segments[i];
        if (spec.looksLike && !spec.looksLike(seg)) break;
        const result = spec.decode(seg);
        entries.push(...(Array.isArray(result.value) ? result.value : [result.value]));
        errors.push(...result.errors);
        breakdown.push({ fieldId: slot.fieldId, number: spec.number, name: spec.name, raw: seg });
        i++;
      }
      values[slot.fieldId] = entries;
      continue;
    }

    if (i >= segments.length) {
      if (!slot.optional) errors.push(`Message ended before Field ${spec.number} (${spec.name})`);
      continue;
    }

    const seg = segments[i];
    if (slot.optional && spec.looksLike && !spec.looksLike(seg)) {
      // This segment belongs to the next slot, not this optional one.
      continue;
    }

    const result = spec.decode(seg);
    values[slot.fieldId] = result.value;
    errors.push(...result.errors);
    breakdown.push({ fieldId: slot.fieldId, number: spec.number, name: spec.name, raw: seg });
    i++;
  }

  if (i < segments.length) {
    errors.push(`Unparsed trailing data: "${segments.slice(i).join('-')}"`);
  }

  return { type, messageRef, values, breakdown, errors };
}

export function fieldLabel(fieldId: string): string {
  return FIELD_META[fieldId]?.name ?? fieldId;
}
