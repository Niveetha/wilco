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
        <span className="output-label">LIVE OUTPUT</span>
        <div className="output-actions">
          {onSaveToLibrary && (
            <button type="button" className={`btn-action${saved ? ' copied' : ''}`} onClick={onSaveToLibrary} disabled={!message}>
              {saved ? 'SAVED' : 'SAVE'}
            </button>
          )}
          <button type="button" className={`btn-action${copied ? ' copied' : ''}`} onClick={copy} disabled={!message}>
            {copied ? 'COPIED' : 'COPY'}
          </button>
          <button type="button" className="btn-action" onClick={download} disabled={!message}>
            DOWNLOAD
          </button>
        </div>
      </div>
      <div className="output-body">
        {!message && (
          <div className="no-selection">
            <span className="arrow">↖</span>
            {emptyHint ?? (
              <>
                SELECT A MESSAGE TYPE
                <br />
                TO BEGIN
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
