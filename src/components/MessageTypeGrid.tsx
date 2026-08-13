import { CATEGORY_ORDER, messageTypesByCategory } from '../core/messageTypes';
import './MessageTypeGrid.css';

interface Props {
  selected: string | null;
  onSelect: (type: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  Emergency: 'EMERGENCY',
  'Filed flight plan and associated update': 'MOVEMENT',
  Coordination: 'CO-ORDINATION',
  Supplementary: 'SUPPLEMENTARY',
};

export default function MessageTypeGrid({ selected, onSelect }: Props) {
  const byCategory = messageTypesByCategory();
  return (
    <>
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat}>
          <div className="msg-category">{CATEGORY_LABEL[cat]}</div>
          <div className="msg-type-grid">
            {byCategory[cat].map((def) => (
              <button
                key={def.id}
                type="button"
                className={`msg-type-btn${selected === def.id ? ' active' : ''}${!def.implemented ? ' planned' : ''}`}
                disabled={!def.implemented}
                title={def.implemented ? def.purpose : `${def.purpose} — planned for a later step, see docs/roadmap.md`}
                onClick={() => def.implemented && onSelect(def.id)}
              >
                <span className="code">{def.id}</span>
                <span className="name">{def.name}</span>
                {!def.implemented && <span className="soon">SOON</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
