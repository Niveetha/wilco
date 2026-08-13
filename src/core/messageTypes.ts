// Message type catalog — composition confirmed against the worked examples
// in Appendix 3, Section 2 (pages A3-36 to A3-49) of the PANS-ATM document.
// See docs/message-catalog.md for the full per-type writeup with citations.
import type { MessageTypeDef } from './types';

export const MESSAGE_TYPES: Record<string, MessageTypeDef> = {
  ALR: {
    id: 'ALR',
    category: 'Emergency',
    name: 'Alerting',
    purpose: 'Aircraft in a state of emergency (uncertainty/alert/distress phase). Sent to ATS units and rescue co-ordination centres.',
    displayMode: 'full',
    implemented: false,
    fields: [
      { fieldId: 'F5' }, { fieldId: 'F7' }, { fieldId: 'F8' }, { fieldId: 'F9' },
      { fieldId: 'F10' }, { fieldId: 'F13' }, { fieldId: 'F15' }, { fieldId: 'F16_FULL' },
      { fieldId: 'F18' }, { fieldId: 'F19', optional: true }, { fieldId: 'F20', optional: true },
    ],
    sourceRef: 'Appendix 3 §2.2.1, p. A3-36',
  },
  RCF: {
    id: 'RCF',
    category: 'Emergency',
    name: 'Radiocommunication Failure',
    purpose: 'Aircraft experiencing radio failure. Sent to all subsequent ATS units along the route.',
    displayMode: 'strip',
    implemented: false,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F21' }],
    sourceRef: 'Appendix 3 §2.2.2, p. A3-38',
  },
  FPL: {
    id: 'FPL',
    category: 'Filed flight plan and associated update',
    name: 'Filed Flight Plan',
    purpose: 'Filed before departure to obtain ATC/FIS/alerting service.',
    displayMode: 'full',
    implemented: true,
    fields: [
      { fieldId: 'F7' }, { fieldId: 'F8' }, { fieldId: 'F9' }, { fieldId: 'F10' },
      { fieldId: 'F13' }, { fieldId: 'F15' }, { fieldId: 'F16_FULL' }, { fieldId: 'F18' },
    ],
    sourceRef: 'Appendix 3 §2.3.1, p. A3-39',
  },
  CHG: {
    id: 'CHG',
    category: 'Filed flight plan and associated update',
    name: 'Modification',
    purpose: 'Change to basic flight plan data. Sent to all addressees of the filed flight plan message.',
    displayMode: 'diff',
    implemented: true,
    fields: [
      { fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_BASIC' },
      { fieldId: 'F18' }, { fieldId: 'F22', repeatable: true },
    ],
    sourceRef: 'Appendix 3 §2.3.2, p. A3-40',
  },
  CNL: {
    id: 'CNL',
    category: 'Filed flight plan and associated update',
    name: 'Cancellation',
    purpose: 'Flight plan has been cancelled. Sent to all addressees of the filed flight plan message.',
    displayMode: 'strip',
    implemented: true,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_BASIC' }, { fieldId: 'F18' }],
    sourceRef: 'Appendix 3 §2.3.3, p. A3-41',
  },
  DLA: {
    id: 'DLA',
    category: 'Filed flight plan and associated update',
    name: 'Delay',
    purpose: 'Departure delayed. Sent to all addressees of the filed flight plan message.',
    displayMode: 'strip',
    implemented: true,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_BASIC' }, { fieldId: 'F18' }],
    sourceRef: 'Appendix 3 §2.3.4, p. A3-41',
  },
  DEP: {
    id: 'DEP',
    category: 'Filed flight plan and associated update',
    name: 'Departure',
    purpose: 'Aircraft has departed. Sent immediately after departure.',
    displayMode: 'strip',
    implemented: true,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_BASIC' }, { fieldId: 'F18' }],
    sourceRef: 'Appendix 3 §2.3.5, p. A3-42',
  },
  ARR: {
    id: 'ARR',
    category: 'Filed flight plan and associated update',
    name: 'Arrival',
    purpose: 'Aircraft has landed. Sent by the arrival aerodrome ATS unit to the departure aerodrome.',
    displayMode: 'strip',
    implemented: true,
    fields: [
      { fieldId: 'F7' }, { fieldId: 'F13' },
      { fieldId: 'F16_BASIC', optional: true },
      { fieldId: 'F17' },
    ],
    sourceRef: 'Appendix 3 §2.3.6, p. A3-42',
  },
  CPL: {
    id: 'CPL',
    category: 'Coordination',
    name: 'Current Flight Plan',
    purpose: 'Transmitted by ACC to next ACC at least 20 min before the boundary.',
    displayMode: 'full',
    implemented: false,
    fields: [
      { fieldId: 'F7' }, { fieldId: 'F8' }, { fieldId: 'F9' }, { fieldId: 'F10' },
      { fieldId: 'F13_NT' }, { fieldId: 'F14' }, { fieldId: 'F15' }, { fieldId: 'F16_BASIC' },
      { fieldId: 'F18' },
    ],
    sourceRef: 'Appendix 3 §2.4.1, p. A3-43',
  },
  EST: {
    id: 'EST',
    category: 'Coordination',
    name: 'Estimate',
    purpose: 'Boundary estimate transmitted to the next ATS unit.',
    displayMode: 'strip',
    implemented: false,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13_NT' }, { fieldId: 'F14' }, { fieldId: 'F16_BASIC' }],
    sourceRef: 'Appendix 3 §2.4.2, p. A3-45',
  },
  CDN: {
    id: 'CDN',
    category: 'Coordination',
    name: 'Co-ordination',
    purpose: 'Propose a change to the co-ordination data in a CPL or EST message.',
    displayMode: 'diff',
    implemented: false,
    fields: [
      { fieldId: 'F7' }, { fieldId: 'F13_NT' }, { fieldId: 'F16_BASIC' }, { fieldId: 'F22', repeatable: true },
    ],
    sourceRef: 'Appendix 3 §2.4.3, p. A3-45',
  },
  ACP: {
    id: 'ACP',
    category: 'Coordination',
    name: 'Acceptance',
    purpose: 'Accepting unit confirms CPL/EST data is acceptable.',
    displayMode: 'strip',
    implemented: false,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13_NT' }, { fieldId: 'F16_BASIC' }],
    sourceRef: 'Appendix 3 §2.4.4, p. A3-46',
  },
  LAM: {
    id: 'LAM',
    category: 'Coordination',
    name: 'Logical Acknowledgement',
    purpose: 'ATC computer acknowledgement only. Contains Field 3 reference data only.',
    displayMode: 'strip',
    implemented: false,
    fields: [{ fieldId: 'F3_LAM' }],
    sourceRef: 'Appendix 3 §2.4.5, p. A3-46',
  },
  RQP: {
    id: 'RQP',
    category: 'Supplementary',
    name: 'Request Flight Plan',
    purpose: 'Request basic flight plan data from the transferring ATS unit.',
    displayMode: 'strip',
    implemented: false,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_BASIC' }, { fieldId: 'F18' }],
    sourceRef: 'Appendix 3 §2.5.1, p. A3-47',
  },
  RQS: {
    id: 'RQS',
    category: 'Supplementary',
    name: 'Request Supplementary Flight Plan',
    purpose: 'Request supplementary flight plan data from the departure aerodrome.',
    displayMode: 'strip',
    implemented: false,
    fields: [{ fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_BASIC' }, { fieldId: 'F18' }],
    sourceRef: 'Appendix 3 §2.5.2, p. A3-47',
  },
  SPL: {
    id: 'SPL',
    category: 'Supplementary',
    name: 'Supplementary Flight Plan',
    purpose: 'Supplementary information not transmitted in FPL/CPL messages.',
    displayMode: 'full',
    implemented: false,
    fields: [
      { fieldId: 'F7' }, { fieldId: 'F13' }, { fieldId: 'F16_FULL' }, { fieldId: 'F18' }, { fieldId: 'F19' },
    ],
    sourceRef: 'Appendix 3 §2.5.3, p. A3-48',
  },
};

export const CATEGORY_ORDER: MessageTypeDef['category'][] = [
  'Emergency',
  'Filed flight plan and associated update',
  'Coordination',
  'Supplementary',
];

export function messageTypesByCategory(): Record<string, MessageTypeDef[]> {
  const out: Record<string, MessageTypeDef[]> = {};
  for (const cat of CATEGORY_ORDER) out[cat] = [];
  for (const def of Object.values(MESSAGE_TYPES)) out[def.category].push(def);
  return out;
}

export const IMPLEMENTED_TYPES = Object.values(MESSAGE_TYPES).filter((t) => t.implemented);
