/**
 * Footer Component — Multilingual support
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLang();

  const links = [
    ['/events', t('events')],
    ['/schedule', t('schedule')],
    ['/gallery', t('gallery')],
    ['/announcements', t('news')],
    ['/register', t('register')],
    ['/donate', t('donate')],
    ['/contact', t('contact')],
  ];

  return (
    <footer style={footerStyle}>
      <div style={borderTop} />
      <div className="container">
        <div style={grid}>
          <div>
            <div style={brand}>
              <span style={{ fontSize: '36px' }}>🪔</span>
              <div>
                <div style={brandName}>DigitalKhalane</div>
                <div style={brandSub}>खलाने यात्रा उत्सव</div>
              </div>
            </div>
            <p style={desc}>{t('officialPlatform')}</p>
            <p style={creator}>
              {t('createdBy').split('Harshal Parmeshvar Patil')[0]}
              <Heart size={12} style={{ display: 'inline', color: '#FF6B00', margin: '0 2px' }} />
              <strong style={{ color: '#FFD700' }}>Harshal Parmeshvar Patil</strong>
            </p>
          </div>

          <div>
            <h4 style={heading}>{t('quickLinks')}</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {links.map(([to, label]) => (
                <li key={to} style={{ marginBottom: '8px' }}>
                  <Link to={to} style={linkStyle}>→ {label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={heading}>{t('contactUs')}</h4>
            <div style={contactItem}><MapPin size={16} style={{ color: '#FF6B00', flexShrink: 0 }} /><span>Khalane Village, Nashik District, Maharashtra - 422207</span></div>
            <div style={contactItem}><Phone size={16} style={{ color: '#FF6B00', flexShrink: 0 }} /><span>+91 98765 43210</span></div>
            <div style={contactItem}><Mail size={16} style={{ color: '#FF6B00', flexShrink: 0 }} /><span>info@digitalkhalane.in</span></div>
          </div>
        </div>

        <div style={bottom}>
          <p>© {new Date().getFullYear()} DigitalKhalane. {t('allRightsReserved')}</p>
          <p style={{ color: 'rgba(255,248,240,0.4)', fontSize: '0.8rem' }}>{t('poweredBy')}</p>
        </div>
      </div>
    </footer>
  );
};

const footerStyle = { background: 'linear-gradient(135deg, #0D0500 0%, #2D0A00 50%, #1A0A00 100%)', color: 'rgba(255,248,240,0.8)', marginTop: 'auto' };
const borderTop = { height: '4px', background: 'linear-gradient(90deg, #FF6B00, #FFD700, #800020, #FF6B00)' };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', padding: '50px 0 30px' };
const brand = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' };
const brandName = { fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg,#FF6B00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };
const brandSub = { fontSize: '0.7rem', color: 'rgba(255,248,240,0.5)', fontFamily: "'Tiro Devanagari Hindi',serif" };
const desc = { fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '12px', color: 'rgba(255,248,240,0.65)' };
const creator = { fontSize: '0.82rem', color: 'rgba(255,248,240,0.5)' };
const heading = { color: '#FFD700', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' };
const linkStyle = { color: 'rgba(255,248,240,0.7)', textDecoration: 'none', fontSize: '0.88rem', transition: 'color 0.2s', display: 'block' };
const contactItem = { display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', fontSize: '0.88rem' };
const bottom = { borderTop: '1px solid rgba(255,248,240,0.1)', padding: '20px 0', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,248,240,0.5)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px' };

export default Footer;
