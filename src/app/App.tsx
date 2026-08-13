import { NavLink, Route, Routes } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import InstallPwaPrompt from '../components/InstallPwaPrompt';
import BuilderPage from '../features/builder/BuilderPage';
import DecoderPage from '../features/decoder/DecoderPage';
import LibraryPage from '../features/library/LibraryPage';
import AboutPage from './AboutPage';
import './App.css';

const TABS = [
  { to: '/build', label: 'BUILD' },
  { to: '/decode', label: 'DECODE' },
  { to: '/library', label: 'LIBRARY' },
  { to: '/about', label: 'ABOUT' },
];

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="logo-block">
          <span className="logo-title">WILCO</span>
          <span className="logo-sub">ICAO DOC 4444 / PANS-ATM — APPENDIX 2 &amp; 3</span>
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
          <span className="live-badge">● LIVE</span>
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
