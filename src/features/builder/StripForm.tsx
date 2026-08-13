import { Fragment } from 'react';
import FieldEditor from '../../components/FieldEditor';
import { FIELD_DEFS } from '../../core/fields';
import type { MessageTypeDef } from '../../core/types';
import './StripForm.css';

interface Props {
  def: MessageTypeDef;
  values: Record<string, unknown>;
  onChange: (fieldId: string, value: unknown) => void;
}

export default function StripForm({ def, values, onChange }: Props) {
  const stripSlots = def.fields.filter((s) => s.fieldId !== 'F18' && !s.repeatable);
  const hasF18 = def.fields.some((s) => s.fieldId === 'F18');

  return (
    <div>
      <div className="flight-strip">
        {stripSlots.map((slot, i) => {
          const spec = FIELD_DEFS[slot.fieldId];
          if (!spec) return null;
          return (
            <Fragment key={slot.fieldId}>
              <div className="strip-segment">
                <div className="strip-segment-label">
                  F{spec.number} {spec.name}
                  {slot.optional ? <span className="strip-optional-tag">Diversion only</span> : null}
                </div>
                <FieldEditor
                  fieldId={slot.fieldId}
                  value={values[slot.fieldId]}
                  onChange={(v) => onChange(slot.fieldId, v)}
                  compact
                />
              </div>
              {i < stripSlots.length - 1 && <span className="strip-divider">/</span>}
            </Fragment>
          );
        })}
      </div>
      {hasF18 && (
        <div className="strip-other-info">
          <div className="section-label">OTHER INFORMATION (FIELD 18)</div>
          <FieldEditor fieldId="F18" value={values.F18} onChange={(v) => onChange('F18', v)} />
        </div>
      )}
    </div>
  );
}
