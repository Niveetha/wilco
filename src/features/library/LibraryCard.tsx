import { useState } from 'react';

interface Props {
  type: string;
  typeName?: string;
  raw: string;
  meaning?: string;
  sourceRef?: string;
  onRemove?: () => void;
}

export default function LibraryCard({ type, typeName, raw, meaning, sourceRef, onRemove }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="library-card">
      <div className="library-card-header">
        <span className="badge badge-mandatory">{type}</span>
        <span className="library-card-name">{typeName ?? type}</span>
        {onRemove && (
          <button type="button" className="btn-icon remove" onClick={onRemove} title="Remove from library">
            ×
          </button>
        )}
      </div>
      <pre className="library-card-raw">{raw}</pre>
      {meaning && <p className="library-card-meaning">{meaning}</p>}
      <div className="library-card-footer">
        {sourceRef && <span className="library-card-source">{sourceRef}</span>}
        <button type="button" className={`btn-action${copied ? ' copied' : ''}`} onClick={copy}>
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
    </div>
  );
}
