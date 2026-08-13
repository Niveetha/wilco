export const HANDOFF_KEY = 'wilco-builder-handoff';

export interface HandoffPayload {
  type: string;
  values: Record<string, unknown>;
}

export function consumeHandoff(): HandoffPayload | null {
  const raw = sessionStorage.getItem(HANDOFF_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(HANDOFF_KEY);
  try {
    return JSON.parse(raw) as HandoffPayload;
  } catch {
    return null;
  }
}
