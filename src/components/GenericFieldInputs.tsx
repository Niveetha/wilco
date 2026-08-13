import type { AnyFieldSpec } from '../core/fields';

interface Props {
  spec: AnyFieldSpec;
  value: Record<string, string>;
  onChange: (subId: string, value: string) => void;
  compact?: boolean;
}

const WIDTH_CLASS: Record<string, string> = {
  xs: 'w-xs',
  sm: 'w-sm',
  md: 'w-md',
  lg: 'w-lg',
  full: 'w-full',
};

export default function GenericFieldInputs({ spec, value, onChange, compact }: Props) {
  if (!spec.inputs) return null;
  return (
    <div className="input-row">
      {spec.inputs.map((input) => {
        const raw = value?.[input.id] ?? '';
        const widthClass = WIDTH_CLASS[input.width ?? (input.kind === 'select' ? 'md' : 'sm')];
        return (
          <div className={`input-group ${widthClass}`} key={input.id}>
            {!compact && <label>{input.label}</label>}
            {input.kind === 'select' ? (
              <select value={raw} onChange={(e) => onChange(input.id, e.target.value)}>
                {input.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={raw}
                maxLength={input.maxLength}
                placeholder={input.placeholder}
                title={compact ? input.label : undefined}
                onChange={(e) => {
                  const v = input.transform === 'upper' ? e.target.value.toUpperCase() : e.target.value;
                  onChange(input.id, v);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
