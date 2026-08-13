// Shared types for the ICAO Doc 4444 / PANS-ATM Appendix 2 & 3 domain model.
// Every field/message shape here is traceable to a page in docs/field-reference.md
// and docs/message-catalog.md, which cite the Appendix 3 page numbers directly.

export type FieldValue = Record<string, string> | AmendmentEntry[];

export interface AmendmentEntry {
  field: string;
  value: string;
}

export interface Indicator {
  key: string;
  value: string;
}

export interface SubInputSpec {
  id: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  width?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  kind?: 'text' | 'select';
  options?: { value: string; label: string }[];
  transform?: 'upper';
}

export interface DecodeResult<T = Record<string, string>> {
  value: T;
  errors: string[];
}

export interface FieldSpec<T = Record<string, string>> {
  id: string;
  number: string;
  name: string;
  mandatory: boolean;
  hint: string;
  example: string;
  sourceRef: string;
  inputs?: SubInputSpec[];
  isEmpty: (value: T) => boolean;
  encode: (value: T) => string;
  decode: (raw: string) => DecodeResult<T>;
  /** Used only for slots marked optional in a message's field list, to decide
   * whether the next raw segment belongs to this field during decode. */
  looksLike?: (raw: string) => boolean;
}

export type DisplayMode = 'full' | 'strip' | 'diff';

export type MessageCategory =
  | 'Emergency'
  | 'Filed flight plan and associated update'
  | 'Coordination'
  | 'Supplementary';

export interface FieldSlot {
  fieldId: string;
  /** Slot may be absent from the encoded message; decode uses the field's looksLike(). */
  optional?: boolean;
  /** Slot may repeat zero or more times (only Field 22 in this catalog). */
  repeatable?: boolean;
}

export interface MessageTypeDef {
  id: string;
  category: MessageCategory;
  name: string;
  purpose: string;
  displayMode: DisplayMode;
  implemented: boolean;
  fields: FieldSlot[];
  sourceRef: string;
}

export interface DecodedMessage {
  type: string;
  messageRef: string;
  values: Record<string, unknown>;
  breakdown: { fieldId: string; number: string; name: string; raw: string }[];
  errors: string[];
}
