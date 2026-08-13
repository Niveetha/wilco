// localStorage-backed store for user-saved messages, shown alongside the
// seeded doc examples in the Library feature.
export interface LibraryEntry {
  id: string;
  type: string;
  raw: string;
  savedAt: number;
}

const KEY = 'wilco-library';

export function getUserLibrary(): LibraryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LibraryEntry[]) : [];
  } catch {
    return [];
  }
}

function save(entries: LibraryEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function addLibraryEntry(entry: { type: string; raw: string }): LibraryEntry {
  const full: LibraryEntry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, savedAt: Date.now(), ...entry };
  const entries = [full, ...getUserLibrary()];
  save(entries);
  return full;
}

export function removeLibraryEntry(id: string) {
  save(getUserLibrary().filter((e) => e.id !== id));
}
