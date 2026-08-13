import { useEffect, useState } from 'react';
import { SEED_MESSAGES } from '../../core/examples';
import { MESSAGE_TYPES } from '../../core/messageTypes';
import { getUserLibrary, removeLibraryEntry, type LibraryEntry } from './libraryStore';
import LibraryCard from './LibraryCard';
import './Library.css';

interface DisplayEntry {
  id: string;
  type: string;
  raw: string;
  meaning?: string;
  sourceRef?: string;
  removable: boolean;
}

export default function LibraryPage() {
  const [userEntries, setUserEntries] = useState<LibraryEntry[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    setUserEntries(getUserLibrary());
  }, []);

  const seedEntries: DisplayEntry[] = SEED_MESSAGES.map((s) => ({
    id: s.id,
    type: s.type,
    raw: s.raw,
    meaning: s.meaning,
    sourceRef: s.sourceRef,
    removable: false,
  }));
  const savedEntries: DisplayEntry[] = userEntries.map((e) => ({
    id: e.id,
    type: e.type,
    raw: e.raw,
    removable: true,
  }));

  const all = [...savedEntries, ...seedEntries];
  const types = ['ALL', ...Array.from(new Set(all.map((e) => e.type)))];
  const visible = filter === 'ALL' ? all : all.filter((e) => e.type === filter);

  async function copyAll() {
    const text = visible.map((e) => e.raw).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }

  function remove(id: string) {
    removeLibraryEntry(id);
    setUserEntries(getUserLibrary());
  }

  return (
    <div className="page library-page">
      <div className="section-label">Message library</div>
      <p className="page-intro">
        Worked examples straight from the ICAO PANS-ATM document, for each message type that's live today — plus
        anything you build and save yourself. Copy one message or grab the whole filtered set at once.
      </p>

      <div className="library-header">
        <div className="library-filters">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              className={`btn-action${filter === t ? ' primary' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'ALL' ? 'All' : t}
            </button>
          ))}
        </div>
        <button type="button" className={`btn-action${copiedAll ? ' copied' : ''}`} onClick={copyAll} disabled={visible.length === 0}>
          {copiedAll ? '✓ Copied all' : `Copy all (${visible.length})`}
        </button>
      </div>

      <div className="library-grid">
        {visible.map((entry) => (
          <LibraryCard
            key={entry.id}
            type={entry.type}
            typeName={MESSAGE_TYPES[entry.type]?.name}
            raw={entry.raw}
            meaning={entry.meaning}
            sourceRef={entry.sourceRef}
            onRemove={entry.removable ? () => remove(entry.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
