import { F18_INDICATOR_HINTS, F18_INDICATOR_KEYS } from '../core/fields';
import type { Indicator } from '../core/types';
import './F18Editor.css';

interface Props {
  value: { indicators: Indicator[] };
  onChange: (value: { indicators: Indicator[] }) => void;
}

export default function F18Editor({ value, onChange }: Props) {
  const active = new Set(value.indicators.map((i) => i.key));

  function toggle(key: string) {
    if (active.has(key)) {
      onChange({ indicators: value.indicators.filter((i) => i.key !== key) });
    } else {
      onChange({ indicators: [...value.indicators, { key, value: '' }] });
    }
  }

  function setValue(key: string, v: string) {
    onChange({
      indicators: value.indicators.map((i) => (i.key === key ? { ...i, value: v } : i)),
    });
  }

  return (
    <div>
      <div className="f18-grid">
        {F18_INDICATOR_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`f18-toggle${active.has(key) ? ' active' : ''}`}
            onClick={() => toggle(key)}
          >
            {key}/
          </button>
        ))}
      </div>
      {value.indicators.length > 0 && (
        <div className="f18-inputs">
          {value.indicators.map((i) => (
            <div className="f18-input-row" key={i.key}>
              <span className="f18-key">{i.key}/</span>
              <input
                type="text"
                className="w-full"
                value={i.value}
                placeholder={F18_INDICATOR_HINTS[i.key] ?? ''}
                onChange={(e) => setValue(i.key, e.target.value.toUpperCase())}
              />
            </div>
          ))}
        </div>
      )}
      {value.indicators.length === 0 && (
        <div className="f18-none">No indicators selected — message will encode Field 18 as "0".</div>
      )}
    </div>
  );
}
