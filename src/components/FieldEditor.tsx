import { FIELD_DEFS } from '../core/fields';
import type { AmendmentEntry, Indicator } from '../core/types';
import GenericFieldInputs from './GenericFieldInputs';
import F18Editor from './F18Editor';
import F22Editor from './F22Editor';

interface Props {
  fieldId: string;
  value: unknown;
  onChange: (value: unknown) => void;
  compact?: boolean;
}

/** Dispatches to the right editor widget for a field id — the generic
 * label/input renderer for simple fields, or a bespoke widget for the
 * fields with dynamic structure (Field 18 indicators, Field 22 amendments). */
export default function FieldEditor({ fieldId, value, onChange, compact }: Props) {
  if (fieldId === 'F18') {
    return <F18Editor value={value as { indicators: Indicator[] }} onChange={onChange} />;
  }
  if (fieldId === 'F22') {
    return <F22Editor value={value as AmendmentEntry[]} onChange={onChange} />;
  }
  const spec = FIELD_DEFS[fieldId];
  if (!spec) return null;
  return (
    <GenericFieldInputs
      spec={spec}
      value={value as Record<string, string>}
      onChange={(sub, v) => onChange({ ...(value as Record<string, string>), [sub]: v })}
      compact={compact}
    />
  );
}
