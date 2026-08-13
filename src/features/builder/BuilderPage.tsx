import { useState } from 'react';
import MessageTypeGrid from '../../components/MessageTypeGrid';
import OutputPanel from '../../components/OutputPanel';
import FullForm from './FullForm';
import StripForm from './StripForm';
import DiffForm from './DiffForm';
import { MESSAGE_TYPES } from '../../core/messageTypes';
import { defaultValueFor } from '../../core/fields';
import { encodeMessage, messageBreakdown } from '../../core/encoder';
import { addLibraryEntry } from '../library/libraryStore';
import { consumeHandoff } from './handoff';
import './Builder.css';

interface BuilderState {
  type: string | null;
  values: Record<string, unknown>;
}

function initialState(): BuilderState {
  const handoff = consumeHandoff();
  if (handoff && MESSAGE_TYPES[handoff.type]?.implemented) {
    return { type: handoff.type, values: handoff.values };
  }
  return { type: null, values: {} };
}

export default function BuilderPage() {
  const [{ type, values }, setState] = useState<BuilderState>(initialState);
  const [saved, setSaved] = useState(false);

  const def = type ? MESSAGE_TYPES[type] : null;

  function selectType(t: string) {
    const d = MESSAGE_TYPES[t];
    const initial: Record<string, unknown> = {};
    for (const slot of d.fields) initial[slot.fieldId] = defaultValueFor(slot.fieldId);
    setState({ type: t, values: initial });
    setSaved(false);
  }

  function setFieldValue(fieldId: string, value: unknown) {
    setState((s) => ({ ...s, values: { ...s.values, [fieldId]: value } }));
    setSaved(false);
  }

  let message = '';
  let errors: string[] = [];
  if (type && def) {
    try {
      message = encodeMessage(type, values);
    } catch (e) {
      errors = [(e as Error).message];
    }
  }
  const breakdown = type ? messageBreakdown(type, values) : [];

  return (
    <div className="page builder-layout">
      <div className="left-panel">
        <p className="builder-intro">Pick a message type, fill in the fields, get a ready-to-send ICAO message.</p>
        <div className="section-label">Step 1 — Choose a message type</div>
        <MessageTypeGrid selected={type} onSelect={selectType} />

        {def && (
          <div id="fields-area">
            <div className="section-label">
              Step 2 — {def.name} ({type})
            </div>
            <p className="field-step-hint">{def.purpose}</p>
            {def.displayMode === 'full' && <FullForm def={def} values={values} onChange={setFieldValue} />}
            {def.displayMode === 'strip' && <StripForm def={def} values={values} onChange={setFieldValue} />}
            {def.displayMode === 'diff' && <DiffForm def={def} values={values} onChange={setFieldValue} />}
          </div>
        )}
      </div>

      <OutputPanel
        message={message}
        breakdown={breakdown}
        errors={errors}
        filenamePrefix={type ?? 'MSG'}
        saved={saved}
        onSaveToLibrary={
          type
            ? () => {
                addLibraryEntry({ type, raw: message });
                setSaved(true);
              }
            : undefined
        }
      />
    </div>
  );
}
