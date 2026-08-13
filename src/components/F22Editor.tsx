import { FIELD_META } from '../core/fields';
import type { AmendmentEntry } from '../core/types';
import './F22Editor.css';

interface Props {
  value: AmendmentEntry[];
  onChange: (value: AmendmentEntry[]) => void;
}

function labelFor(fieldNumber: string): string {
  const entry = Object.values(FIELD_META).find((m) => m.number === fieldNumber);
  return entry ? entry.name : 'Unknown field';
}

export default function F22Editor({ value, onChange }: Props) {
  function update(i: number, patch: Partial<AmendmentEntry>) {
    onChange(value.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }
  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...value, { field: '', value: '' }]);
  }

  return (
    <div className="f22-editor">
      {value.length === 0 && (
        <div className="f22-none">No amendments yet — add at least one field to correct.</div>
      )}
      <div className="f22-rows">
        {value.map((entry, i) => (
          <div className="f22-row" key={i}>
            <div className="input-group w-xs">
              <label>Field No.</label>
              <input
                type="text"
                maxLength={2}
                placeholder="16"
                value={entry.field}
                onChange={(e) => update(i, { field: e.target.value.replace(/\D/g, '') })}
              />
            </div>
            <div className="f22-diff">
              <div className="f22-old">{entry.field ? `F${entry.field} — ${labelFor(entry.field)}` : 'Select a field number'}</div>
              <div className="input-group w-full">
                <label>Corrected value (complete, as for that field)</label>
                <input
                  type="text"
                  placeholder="EDDN"
                  value={entry.value}
                  onChange={(e) => update(i, { value: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
            <button type="button" className="btn-icon remove" onClick={() => remove(i)} title="Remove amendment">
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn-add-f22" onClick={add}>
        + ADD AMENDMENT
      </button>
    </div>
  );
}
