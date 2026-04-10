/**
 * Navbar Component - Responsive navigation with dark/light toggle + Language Switcher
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Settings, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLang, LANGUAGES } from '../context/LanguageContext';

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { lang, setLang, t, currentLang } = useLang();
  const [open, setOpen]     = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const langRef  = useRef(null);

  const navLinks = [
    { to: '/',              key: 'home' },
    { to: '/events',        key: 'events' },
    { to: '/schedule',      key: 'schedule' },
    { to: '/gallery',       key: 'gallery' },
    { to: '/announcements', key: 'news' },
    { to: '/register',      key: 'register' },
    { to: '/donate',        key: 'donate' },
    { to: '/contact',       key: 'contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav style={{ ...navStyle, ...(scrolled ? scrolledStyle : {}) }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={logoStyle}>
          <span style={{ fontSize: '28px' }}>🪔</span>
          <div>
            <div style={logoMain}>DigitalKhalane</div>
            <div style={logoSub}>खलाने यात्रा उत्सव</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul style={desktopNav} className="desktop-nav">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeLinkStyle : {}) })}
              >
                {t(link.key)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Language Switcher */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{ ...iconBtnWide, ...(langOpen ? { borderColor: '#FF6B00', color: '#FF6B00' } : {}) }}
              aria-label="Switch language"
              title="Switch language"
            >
              <Globe size={15} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                {currentLang?.nativeLabel}
              </span>
              <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: langOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={langDropdown}
                >
                  {/* Arrow */}
                  <div style={dropdownArrow} />
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      style={{
                        ...langOption,
                        ...(lang === l.code ? langOptionActive : {}),
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{l.flag}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.2 }}>{l.nativeLabel}</div>
                        <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>{l.label}</div>
                      </div>
                      {lang === l.code && <span style={{ marginLeft: 'auto', color: '#FF6B00', fontSize: '12px' }}>✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button onClick={toggle} style={iconBtn} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Admin Link */}
          <Link to="/admin" style={{ ...iconBtn, textDecoration: 'none' }} title="Admin Panel">
            <Settings size={17} />
          </Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen(o => !o)}
            style={{ ...iconBtn, display: 'none' }}
            className="hamburger"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={mobileMenu}
          >
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  ...mobileLinkStyle,
                  ...(isActive ? { color: '#FF6B00', fontWeight: 700 } : {}),
                })}
              >
                {t(link.key)}
              </NavLink>
            ))}

            {/* Mobile Language Options */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Globe size={16} style={{ color: 'var(--text-muted)' }} />
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
                  style={{ padding: '5px 12px', borderRadius: '20px', border: lang === l.code ? '1.5px solid #FF6B00' : '1.5px solid var(--border)', background: lang === l.code ? 'rgba(255,107,0,0.1)' : 'var(--bg-secondary)', color: lang === l.code ? '#FF6B00' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  {l.nativeLabel}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 980px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

// ── Styles ─────────────────────────────────────────────
const navStyle = { position: 'sticky', top: 0, zIndex: 1000, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 20px', transition: 'all 0.3s ease' };
const scrolledStyle = { boxShadow: '0 4px 20px var(--shadow)' };
const logoStyle = { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' };
const logoMain = { fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg, #FF6B00, #FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const logoSub  = { fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: "'Tiro Devanagari Hindi', serif", lineHeight: 1 };
const desktopNav = { display: 'flex', listStyle: 'none', gap: '2px', alignItems: 'center', margin: 0, padding: 0 };
const navLinkStyle = { padding: '22px 10px', display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.2s', textDecoration: 'none', borderBottom: '2px solid transparent', whiteSpace: 'nowrap' };
const activeLinkStyle = { color: '#FF6B00', fontWeight: 700, borderBottom: '2px solid #FF6B00' };
const iconBtn = { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' };
const iconBtnWide = { height: '36px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '9px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' };
const langDropdown = { position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', boxShadow: '0 12px 40px var(--shadow)', minWidth: '170px', overflow: 'hidden', zIndex: 100 };
const dropdownArrow = { position: 'absolute', top: '-6px', right: '16px', width: '12px', height: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none', borderBottom: 'none', transform: 'rotate(45deg)' };
const langOption = { width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s', color: 'var(--text-primary)' };
const langOptionActive = { background: 'rgba(255,107,0,0.07)' };
const mobileMenu = { display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', background: 'var(--bg-card)', overflow: 'hidden' };
const mobileLinkStyle = { padding: '14px 20px', textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--border)', fontSize: '0.95rem' };

export default Navbar;
