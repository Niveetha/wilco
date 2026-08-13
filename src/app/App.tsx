import { NavLink, Route, Routes } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import InstallPwaPrompt from '../components/InstallPwaPrompt';
import BuilderPage from '../features/builder/BuilderPage';
import DecoderPage from '../features/decoder/DecoderPage';
import LibraryPage from '../features/library/LibraryPage';
import AboutPage from './AboutPage';
import './App.css';

const TABS = [
  { to: '/build', label: 'Build' },
  { to: '/decode', label: 'Decode' },
  { to: '/library', label: 'Library' },
  { to: '/about', label: 'About' },
];

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="var(--border-strong)" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="9.5" stroke="var(--border-strong)" strokeWidth="1" />
      <path
        d="M16 5 L18.4 14 L27 16 L18.4 18 L16 27 L13.6 18 L5 16 L13.6 14 Z"
        fill="var(--accent)"
        fillOpacity="0.85"
      />
      <circle cx="16" cy="16" r="2.1" fill="var(--positive)" />
    </svg>
  );
}

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="logo-block">
          <LogoMark />
          <div className="logo-text">
            <span className="logo-title">Wilco</span>
            <span className="logo-sub">ICAO Doc 4444 · ATS message builder</span>
          </div>
        </div>
        <nav className="tab-nav">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `tab-link${isActive ? ' active' : ''}`}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-right">
          <span className="live-badge">
            <span>Runs offline</span>
          </span>
          <InstallPwaPrompt />
          <ThemeToggle />
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BuilderPage />} />
          <Route path="/build" element={<BuilderPage />} />
          <Route path="/decode" element={<DecoderPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </>
  );
}
