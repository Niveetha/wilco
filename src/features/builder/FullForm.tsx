import FieldBlock from '../../components/FieldBlock';
import FieldEditor from '../../components/FieldEditor';
import { FIELD_DEFS } from '../../core/fields';
import type { MessageTypeDef } from '../../core/types';

interface Props {
  def: MessageTypeDef;
  values: Record<string, unknown>;
  onChange: (fieldId: string, value: unknown) => void;
}

export default function FullForm({ def, values, onChange }: Props) {
  return (
    <div className="fields-container">
      {def.fields
        .filter((slot) => !slot.repeatable)
        .map((slot) => {
          const spec = FIELD_DEFS[slot.fieldId];
          if (!spec) return null;
          return (
            <FieldBlock spec={spec} key={slot.fieldId}>
              <FieldEditor fieldId={slot.fieldId} value={values[slot.fieldId]} onChange={(v) => onChange(slot.fieldId, v)} />
            </FieldBlock>
          );
        })}
    </div>
  );
}
