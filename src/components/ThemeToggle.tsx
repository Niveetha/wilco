import { useEffect, useState } from 'react';

const STORAGE_KEY = 'wilco-theme';

function getInitialTheme(): 'dark' | 'light' {
  // TRON dark is Wilco's primary identity, so it's the default on first
  // visit regardless of OS preference — light is an opt-in alt theme,
  // remembered once the user picks it explicitly.
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'light' ? 'light' : 'dark';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="btn-action"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? '☀ LIGHT' : '● DARK'}
    </button>
  );
}
