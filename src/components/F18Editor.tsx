import { useMemo, useRef, useState } from 'react';
import {
  F18_COMMON_INDICATORS,
  F18_INDICATOR_HINTS,
  F18_INDICATOR_KEYS,
  F18_INDICATOR_LABELS,
} from '../core/fields';
import type { Indicator } from '../core/types';
import './F18Editor.css';

interface Props {
  value: { indicators: Indicator[] };
  onChange: (value: { indicators: Indicator[] }) => void;
}

export default function F18Editor({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = new Set(value.indicators.map((i) => i.key));
  const available = F18_INDICATOR_KEYS.filter((k) => !active.has(k));
  const commonAvailable = F18_COMMON_INDICATORS.filter((k) => !active.has(k));

  const matches = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return available;
    return available.filter((k) => k.includes(q) || F18_INDICATOR_LABELS[k]?.toUpperCase().includes(q));
  }, [query, available]);

  function add(key: string) {
    onChange({ indicators: [...value.indicators, { key, value: '' }] });
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function remove(key: string) {
    onChange({ indicators: value.indicators.filter((i) => i.key !== key) });
  }

  function setValue(key: string, v: string) {
    onChange({ indicators: value.indicators.map((i) => (i.key === key ? { ...i, value: v } : i)) });
  }

  return (
    <div className="f18-editor">
      {value.indicators.length > 0 && (
        <div className="f18-items">
          {value.indicators.map((i) => (
            <div className="f18-item" key={i.key}>
              <div className="f18-item-head">
                <span className="f18-item-code">{i.key}/</span>
                <span className="f18-item-label">{F18_INDICATOR_LABELS[i.key] ?? 'Custom indicator'}</span>
                <button type="button" className="btn-icon remove" onClick={() => remove(i.key)} title="Remove">
                  ×
                </button>
              </div>
              <input
                type="text"
                value={i.value}
                placeholder={F18_INDICATOR_HINTS[i.key] ?? ''}
                onChange={(e) => setValue(i.key, e.target.value.toUpperCase())}
              />
            </div>
          ))}
        </div>
      )}

      {commonAvailable.length > 0 && (
        <div className="f18-quick-row">
          {commonAvailable.map((key) => (
            <button type="button" className="f18-chip" key={key} onClick={() => add(key)}>
              + {key}
            </button>
          ))}
        </div>
      )}

      <div className="f18-search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add another detail — search by code (e.g. RMK, DOF, OPR)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
        />
        {open && matches.length > 0 && (
          <div className="f18-dropdown">
            {matches.map((key) => (
              <button type="button" className="f18-option" key={key} onMouseDown={() => add(key)}>
                <span className="f18-option-code">{key}/</span>
                <span className="f18-option-label">{F18_INDICATOR_LABELS[key]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {value.indicators.length === 0 && (
        <p className="f18-empty-hint">Nothing added — Field 18 will encode as "0" (none), which is valid.</p>
      )}
    </div>
  );
}
