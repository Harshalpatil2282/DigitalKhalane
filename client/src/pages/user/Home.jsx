/**
 * Home Page - Landing page for Khalane Yatra Utsav
 * Sections: Hero, Countdown, About, Highlights, Gallery Preview, CTA
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Image, ChevronRight, Play } from 'lucide-react';
import API from '../../services/api';

/* ── Countdown Hook ─────────────────────────────────── */
function useCountdown(target) {
  const calc = useCallback(() => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [target]);
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [calc]);
  return time;
}

/* ── Animation Variants ─────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const Home = () => {
  const { t } = useLang();
  const [content,   setContent]   = useState(null);
  const [events,    setEvents]    = useState([]);
  const [gallery,   setGallery]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/content'),
      API.get('/events?featured=true&limit=3'),
      API.get('/gallery?type=photo&limit=6'),
    ]).then(([c, e, g]) => {
      setContent(c.data.content);
      setEvents(e.data.events || []);
      setGallery(g.data.items || []);
    }).finally(() => setLoading(false));
  }, []);

  const festivalDate = content?.festivalDate || '2025-04-14T00:00:00+05:30';
  const countdown = useCountdown(festivalDate);

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  );

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────── */}
      <section style={heroSection}>
        <div style={heroOverlay} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '100px 20px 80px' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p variants={fadeUp} style={heroEyebrow}>{t('heroEyebrow')}</motion.p>
            <motion.h1 variants={fadeUp} style={heroTitle} className="hindi-font">
              {content?.heroTitle || 'खलाने यात्रा उत्सव'}
            </motion.h1>
            <motion.p variants={fadeUp} style={heroSub}>
              {content?.heroSubtitle || 'A Grand Festival of Faith, Culture & Togetherness'}
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '36px' }}>
              <Link to="/events" className="btn btn-primary btn-lg">
                <Calendar size={20} /> {t('viewEvents')}
              </Link>
              <Link to="/register" className="btn btn-gold btn-lg">
                <Users size={20} /> {t('registerNow')}
              </Link>
              <Link to="/donate" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}>
                💛 {t('donate')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={scrollIndicator}>
            ↓
          </motion.div>
        </div>
      </section>

      {/* ── COUNTDOWN ─────────────────────────────────── */}
      <section style={countdownSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>{t('festivalBeginsIn')}</p>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '28px' }}>
            <span className="gradient-text">Khalane Yatra Utsav {content?.festivalYear || 2025}</span>
          </h2>
          <div style={countdownGrid}>
            {Object.entries(countdown).map(([unit, val]) => (
              <motion.div key={unit} whileHover={{ scale: 1.05 }} style={countCell}>
                <div style={countNum}>{String(val).padStart(2, '0')}</div>
                <div style={countLabel}>{t(unit)}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <MapPin size={16} style={{ color: '#FF6B00' }} />
            <span>{content?.contactAddress || 'Khalane Village, Maharashtra'}</span>
          </div>
        </div>
      </section>

      {/* ── ABOUT / HISTORY ───────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p style={{ color: '#FF6B00', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '12px' }}>{t('ourHeritage')}</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '20px' }}>
                {content?.historyTitle || 'History of Khalane Yatra'}
              </h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                {(content?.historyContent || '').split('\n\n').filter(Boolean).map((p, i) => (
                  <p key={i} style={{ marginBottom: '16px' }}>{p}</p>
                ))}
              </div>
              <Link to="/events" className="btn btn-primary" style={{ marginTop: '8px' }}>
                {t('exploreEvents')} <ChevronRight size={18} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div style={historyImgBox}>
                <div style={historyImgInner}>
                  <span style={{ fontSize: '80px' }}>🛕</span>
                  <p style={{ color: 'rgba(255,248,240,0.7)', marginTop: '16px', fontSize: '0.9rem' }}>Khalane Village Temple</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p style={{ color: '#FF6B00', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>{t('whatAwaitsYou')}</p>
            <h2>{t('festivalHighlights')}</h2>
            <div className="heading-line" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {(content?.highlights || []).map((h, i) => (
              <motion.div key={i} className="card"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: '28px', textAlign: 'center' }}
              >
                <div style={{ fontSize: '44px', marginBottom: '14px' }}>{h.icon}</div>
                <h3 style={{ marginBottom: '10px', fontSize: '1.05rem' }}>{h.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{h.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED EVENTS ───────────────────────────── */}
      {events.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-heading">
              <p style={{ color: '#FF6B00', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>Don't Miss Out</p>
              <h2>Featured Events</h2>
              <div className="heading-line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {events.map((ev, i) => (
                <motion.div key={ev._id} className="card"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                >
                  <div style={{ ...eventImgPlaceholder, background: categoryColors[ev.category] || '#FF6B00' }}>
                    <span style={{ fontSize: '40px' }}>{categoryIcons[ev.category] || '🎪'}</span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <span className={`badge badge-${ev.category}`}>{ev.category}</span>
                    <h3 style={{ margin: '10px 0 8px', fontSize: '1rem' }}>{ev.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '6px' }}>
                      <Calendar size={14} /> {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ev.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '14px' }}>
                      <MapPin size={14} /> {ev.location}
                    </div>
                    <Link to={`/events/${ev._id}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      {t('viewDetails')}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <Link to="/events" className="btn btn-primary btn-lg">{t('viewAllEvents')} <ChevronRight size={20} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY PREVIEW ───────────────────────────── */}
      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p style={{ color: '#FF6B00', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>{t('memories')}</p>
              <h2>{t('photoGallery')}</h2>
              <div className="heading-line" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {gallery.map((item, i) => (
                <motion.div key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '1', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                >
                  {item.url ? (
                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${item.url}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Image size={32} style={{ color: 'var(--text-muted)' }} />
                  )}
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <Link to="/gallery" className="btn btn-gold btn-lg"><Image size={20} /> {t('viewFullGallery')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section style={ctaBanner}>
        <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ color: 'white', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: '14px' }}>
              {t('bePartOf')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: '32px', maxWidth: '550px', margin: '0 auto 32px' }}>
              {t('bePartDesc')}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-gold btn-lg">{t('registerNow')}</Link>
              <Link to="/donate" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '16px 40px', fontWeight: 600, fontSize: '1.1rem' }}>
                💛 Donate
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

/* ── Styles & Constants ──────────────────────────────── */
const heroSection = {
  minHeight: '90vh', position: 'relative', display: 'flex', alignItems: 'center',
  background: 'linear-gradient(135deg, #1A0A00 0%, #5A0015 35%, #800020 65%, #FF4500 100%)',
  overflow: 'hidden',
};
const heroOverlay = {
  position: 'absolute', inset: 0,
  backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(255,107,0,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.1) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};
const heroEyebrow = { fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#FFD700', marginBottom: '12px', fontWeight: 500 };
const heroTitle = { fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.4)' };
const heroSub = { fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 };
const scrollIndicator = { marginTop: '50px', color: 'rgba(255,255,255,0.5)', fontSize: '1.4rem' };
const countdownSection = {
  background: 'var(--bg-card)', padding: '50px 20px',
  borderBottom: '1px solid var(--border)',
};
const countdownGrid = { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' };
const countCell = {
  background: 'linear-gradient(135deg, var(--maroon), #5A0015)',
  borderRadius: '16px', padding: '20px 24px', minWidth: '90px',
  boxShadow: '0 8px 25px rgba(128,0,32,0.3)',
};
const countNum = { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#FFD700', lineHeight: 1 };
const countLabel = { color: 'rgba(255,248,240,0.7)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '6px' };
const historyImgBox = {
  background: 'linear-gradient(135deg, #800020, #FF6B00)',
  borderRadius: '24px', padding: '4px',
  boxShadow: '0 20px 60px rgba(128,0,32,0.3)',
};
const historyImgInner = {
  background: 'linear-gradient(135deg, #2D0A00, #5A0015)',
  borderRadius: '20px', padding: '60px 40px',
  textAlign: 'center',
};
const eventImgPlaceholder = {
  height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  opacity: 0.9,
};
const ctaBanner = {
  background: 'linear-gradient(135deg, #800020 0%, #FF4500 50%, #FF6B00 100%)',
};
const categoryColors = {
  religious: 'linear-gradient(135deg, #5A0015, #800020)',
  cultural:  'linear-gradient(135deg, #D45500, #FF6B00)',
  sports:    'linear-gradient(135deg, #1A5200, #2D8000)',
  music:     'linear-gradient(135deg, #2D0080, #5000A0)',
  food:      'linear-gradient(135deg, #804000, #C06000)',
  procession:'linear-gradient(135deg, #806000, #C09000)',
};
const categoryIcons = {
  religious: '🛕', cultural: '🎭', sports: '🏆',
  music: '🎵', food: '🍱', procession: '🎆', competition: '🥇', other: '🎪',
};

export default Home;
