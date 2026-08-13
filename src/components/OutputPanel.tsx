import { useState } from 'react';
import BreakdownTable, { type BreakdownRow } from './BreakdownTable';
import './OutputPanel.css';

interface Props {
  message: string;
  breakdown: BreakdownRow[];
  errors?: string[];
  filenamePrefix?: string;
  emptyHint?: string;
  onSaveToLibrary?: () => void;
  saved?: boolean;
}

export default function OutputPanel({
  message,
  breakdown,
  errors = [],
  filenamePrefix = 'MSG',
  emptyHint,
  onSaveToLibrary,
  saved,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    if (!message) return;
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
    const blob = new Blob([message], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `WILCO_${filenamePrefix}_${ts}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="right-panel">
      <div className="output-header">
        <span className="output-label">Your message</span>
        <div className="output-actions">
          {onSaveToLibrary && (
            <button type="button" className={`btn-action${saved ? ' copied' : ''}`} onClick={onSaveToLibrary} disabled={!message}>
              {saved ? '✓ Saved' : 'Save'}
            </button>
          )}
          <button type="button" className={`btn-action${copied ? ' copied' : ' primary'}`} onClick={copy} disabled={!message}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button type="button" className="btn-action" onClick={download} disabled={!message}>
            Download
          </button>
        </div>
      </div>
      <div className="output-body">
        {!message && (
          <div className="no-selection">
            <span className="arrow">←</span>
            {emptyHint ?? (
              <>
                Pick a message type on the left to get started.
                <br />
                Your message builds here as you fill in each field.
              </>
            )}
          </div>
        )}
        {message && (
          <>
            <div className="msg-output-box">
              <div className="msg-output">{message}</div>
            </div>
            {errors.length > 0 && (
              <div className="errors-box">
                {errors.map((e, i) => (
                  <div className="validation-msg" key={i}>
                    ⚠ {e}
                  </div>
                ))}
              </div>
            )}
            <BreakdownTable rows={breakdown} />
          </>
        )}
      </div>
    </div>
  );
}
