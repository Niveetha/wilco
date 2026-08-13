import type { ReactNode } from 'react';
import type { AnyFieldSpec } from '../core/fields';
import './FieldBlock.css';

interface Props {
  spec: AnyFieldSpec;
  children: ReactNode;
}

export default function FieldBlock({ spec, children }: Props) {
  return (
    <div className={`field-block ${spec.mandatory ? 'mandatory' : 'optional'}`}>
      <div className="field-header">
        <span className="field-num">F{spec.number}</span>
        <span className="field-name">{spec.name}</span>
        <span className={`badge ${spec.mandatory ? 'badge-mandatory' : 'badge-optional'}`}>
          {spec.mandatory ? 'Required' : 'Optional'}
        </span>
      </div>
      <div className="field-hint">
        {spec.hint} <span className="eg">e.g. {spec.example}</span>
      </div>
      <div className="field-inputs">{children}</div>
    </div>
  );
}
