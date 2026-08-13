import { useState } from 'react';
import type { AmendmentEntry } from '../core/types';
import './F22Editor.css';

interface Props {
  value: AmendmentEntry[];
  onChange: (value: AmendmentEntry[]) => void;
}

// The fields a CHG/CDN amendment realistically corrects — the same set
// carried by a filed flight plan. Named explicitly (rather than looked up
// from the field catalog) because Field 22 amends whatever the *original*
// filed message's field looked like — for CHG that's always the
// destination-only form of Field 16, never the full dest+EET+alternates
// form the catalog's F16_FULL entry is named for.
const AMENDABLE: { value: string; label: string }[] = [
  { value: '7', label: 'F7 — Aircraft Identification and SSR Mode/Code' },
  { value: '8', label: 'F8 — Flight Rules and Type of Flight' },
  { value: '9', label: 'F9 — Number and Type of Aircraft / Wake Turbulence Category' },
  { value: '10', label: 'F10 — Equipment and Capabilities' },
  { value: '13', label: 'F13 — Departure Aerodrome and Time' },
  { value: '15', label: 'F15 — Cruising Speed / Level / Route' },
  { value: '16', label: 'F16 — Destination Aerodrome' },
  { value: '18', label: 'F18 — Other Information' },
];
const AMENDABLE_NUMBERS = new Set(AMENDABLE.map((o) => o.value));

function optionsFor(current: string) {
  if (current && !AMENDABLE_NUMBERS.has(current)) {
    return [...AMENDABLE, { value: current, label: `F${current} — Custom field` }];
  }
  return AMENDABLE;
}

export default function F22Editor({ value, onChange }: Props) {
  const [customFor, setCustomFor] = useState<Set<number>>(new Set());

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
        <p className="f22-empty">No amendments yet. Add the field that's changing and its corrected value.</p>
      )}
      <div className="f22-rows">
        {value.map((entry, i) => {
          const isCustom = customFor.has(i) || (entry.field !== '' && !AMENDABLE_NUMBERS.has(entry.field));
          return (
            <div className="f22-row" key={i}>
              <div className="f22-row-top">
                <div className="input-group w-full">
                  <label>Field being corrected</label>
                  {isCustom ? (
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="Field number"
                      value={entry.field}
                      onChange={(e) => update(i, { field: e.target.value.replace(/\D/g, '') })}
                    />
                  ) : (
                    <select
                      value={entry.field}
                      onChange={(e) => {
                        if (e.target.value === '__custom') {
                          setCustomFor((s) => new Set(s).add(i));
                          update(i, { field: '' });
                        } else {
                          update(i, { field: e.target.value });
                        }
                      }}
                    >
                      <option value="">Select a field…</option>
                      {optionsFor(entry.field).map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                      <option value="__custom">Other field number…</option>
                    </select>
                  )}
                </div>
                <button type="button" className="btn-icon remove" onClick={() => remove(i)} title="Remove amendment">
                  ×
                </button>
              </div>
              <div className="input-group w-full">
                <label>New value (complete, as normally written for that field)</label>
                <input
                  type="text"
                  placeholder="EDDN"
                  value={entry.value}
                  onChange={(e) => update(i, { value: e.target.value.toUpperCase() })}
                />
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn-add-f22" onClick={add}>
        + Add amendment
      </button>
    </div>
  );
}
