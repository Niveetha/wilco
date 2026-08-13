import './BreakdownTable.css';

export interface BreakdownRow {
  number: string;
  name: string;
  value: string;
}

export default function BreakdownTable({ rows }: { rows: BreakdownRow[] }) {
  return (
    <div className="breakdown">
      <div className="breakdown-header">FIELD BREAKDOWN</div>
      {rows.map((r, i) => (
        <div className="breakdown-row" key={`${r.number}-${i}`}>
          <span className="bk-field">F{r.number}</span>
          <span className="bk-name">{r.name}</span>
          <span className="bk-value">{r.value || '—'}</span>
        </div>
      ))}
    </div>
  );
}
