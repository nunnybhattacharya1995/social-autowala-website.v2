import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { NAV_LINKS } from '../../data/content';
import styles from './Nav.module.css';

function scrollTo(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const go = (e, hash) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(hash);
  };

  return (
    <nav className={styles.nav}>
      <a href="#home" className={styles.brand} data-magnet onClick={e => go(e, '#home')}>
        <span className={styles.brandDot} />SOCIAL AUTOWALA
      </a>

      <div className={`${styles.links} ${open ? styles.open : ''}`}>
        {NAV_LINKS.map(l => {
          const hash = l === 'Home' ? '#home' : `#${l.toLowerCase()}`;
          return (
            <a key={l} href={hash} onClick={e => go(e, hash)}>{l}</a>
          );
        })}
        <a href="#contact" className={styles.cta} data-magnet onClick={e => go(e, '#contact')}>Book Strategy Call</a>
      </div>

      <button
        className={styles.toggle}
        aria-label="Toggle dark/light mode"
        title="Toggle theme"
        onClick={toggle}
      >
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        )}
      </button>

      <button
        className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
