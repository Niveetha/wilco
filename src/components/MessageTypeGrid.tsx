import { CATEGORY_ORDER, messageTypesByCategory } from '../core/messageTypes';
import './MessageTypeGrid.css';

interface Props {
  selected: string | null;
  onSelect: (type: string) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  Emergency: 'Emergency',
  'Filed flight plan and associated update': 'Movement',
  Coordination: 'Co-ordination',
  Supplementary: 'Supplementary',
};

export default function MessageTypeGrid({ selected, onSelect }: Props) {
  const byCategory = messageTypesByCategory();
  return (
    <>
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat} className="msg-category-block">
          <div className="msg-category">{CATEGORY_LABEL[cat]}</div>
          <div className="msg-type-grid">
            {byCategory[cat].map((def) => (
              <button
                key={def.id}
                type="button"
                className={`msg-type-card${selected === def.id ? ' active' : ''}${!def.implemented ? ' planned' : ''}`}
                disabled={!def.implemented}
                onClick={() => def.implemented && onSelect(def.id)}
              >
                <span className="msg-type-code">{def.id}</span>
                <span className="msg-type-copy">
                  <span className="msg-type-name-row">
                    <span className="msg-type-name">{def.name}</span>
                    {!def.implemented && <span className="msg-type-soon">Soon</span>}
                  </span>
                  <span className="msg-type-purpose">{def.purpose}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
