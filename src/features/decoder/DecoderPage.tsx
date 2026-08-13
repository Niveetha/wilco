import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BreakdownTable from '../../components/BreakdownTable';
import { decodeMessage } from '../../core/decoder';
import { FIELD_DEFS } from '../../core/fields';
import { MESSAGE_TYPES } from '../../core/messageTypes';
import { HANDOFF_KEY } from '../builder/handoff';
import './Decoder.css';

const PLACEHOLDER = `(FPL-SIA001-IS
-B773/H-SBDE1E2E3FGHIRWXYZ/LB1D1
-KSFO0500
-N0490F320 DCT PORTE B473 ALASKA
-WSSS1630 WMKK
-PBN/A1B1C1D1O1S2 REG/9VSNA)`;

export default function DecoderPage() {
  const [raw, setRaw] = useState('');
  const navigate = useNavigate();

  const decoded = useMemo(() => (raw.trim() ? decodeMessage(raw) : null), [raw]);
  const def = decoded ? MESSAGE_TYPES[decoded.type] : null;

  const breakdown =
    decoded?.breakdown.map((row) => {
      const spec = FIELD_DEFS[row.fieldId];
      const value = spec ? spec.encode(decoded.values[row.fieldId] as never) : row.raw.trim();
      return { number: row.number, name: row.name, value };
    }) ?? [];

  function editInBuilder() {
    if (!decoded || !def?.implemented) return;
    sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ type: decoded.type, values: decoded.values }));
    navigate('/build');
  }

  return (
    <div className="page-narrow decoder-page">
      <div className="section-label">01 — PASTE AN ATS MESSAGE</div>
      <textarea
        className="decoder-input"
        rows={8}
        placeholder={PLACEHOLDER}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
      />

      {decoded && (
        <div className="decoder-result">
          <div className="decoder-result-header">
            <span className={`badge ${def?.implemented ? 'badge-mandatory' : 'badge-muted'}`}>
              {decoded.type || '???'}
            </span>
            <span className="decoder-type-name">{def?.name ?? 'Unrecognized message type'}</span>
          </div>

          {decoded.errors.length > 0 && (
            <div className="errors-box">
              {decoded.errors.map((e, i) => (
                <div className="validation-msg" key={i}>
                  ⚠ {e}
                </div>
              ))}
            </div>
          )}

          {def?.implemented && breakdown.length > 0 && (
            <>
              <BreakdownTable rows={breakdown} />
              <button type="button" className="btn-action primary" onClick={editInBuilder}>
                EDIT IN BUILDER →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
