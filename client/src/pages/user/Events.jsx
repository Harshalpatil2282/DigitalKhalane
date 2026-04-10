/**
 * Events Page - List all festival events with filter & search
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Search, Filter } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import API from '../../services/api';

const CATEGORIES = ['all', 'religious', 'cultural', 'sports', 'music', 'food', 'procession', 'competition', 'other'];
const ICONS = { religious:'🛕', cultural:'🎭', sports:'🏆', music:'🎵', food:'🍱', procession:'🎆', competition:'🥇', other:'🎪' };

const Events = () => {
  const { t } = useLang();
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState('all');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    API.get(`/events?${params}`)
      .then(r => setEvents(r.data.events || []))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div>
      <div className="page-hero">
        <h1>{t('festivalEvents')}</h1>
        <p>{t('festivalEventsDesc')}</p>
      </div>

      <section className="section">
        <div className="container">
          {/* Search + Filter Bar */}
          <div style={filterBar}>
            <div style={searchBox}>
              <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text" placeholder="Search events..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={categoryTabs}>
              <Filter size={16} style={{ color: 'var(--text-muted)' }} />
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  style={{ ...catBtn, ...(category === cat ? catBtnActive : {}) }}>
                  {ICONS[cat] || ''} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>🔍</div>
              <h3>{t('noEventsFound')}</h3>
              <p>{t('tryDifferent')}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {events.map((ev, i) => (
                <motion.div key={ev._id} className="card"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {/* Image / Placeholder */}
                  <div style={{ height: '180px', background: `linear-gradient(135deg, #800020, #FF6B00)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', position: 'relative' }}>
                    {ev.image
                      ? <img src={`${import.meta.env.VITE_API_URL?.replace('/api','')}${ev.image}`} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      : <span>{ICONS[ev.category] || '🎪'}</span>
                    }
                    {ev.isFeatured && <span style={{ position: 'absolute', top: 12, right: 12, background: '#FFD700', color: '#1A0A00', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>⭐ Featured</span>}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <span className={`badge badge-${ev.category}`}>{ICONS[ev.category]} {ev.category}</span>
                    <h3 style={{ margin: '10px 0 12px', fontSize: '1.05rem', lineHeight: 1.4 }}>{ev.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ev.description}
                    </p>
                    <div style={metaRow}><Calendar size={14} />{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div style={metaRow}><Clock size={14} />{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}</div>
                    <div style={{ ...metaRow, marginBottom: '16px' }}><MapPin size={14} />{ev.location}</div>
                    <Link to={`/events/${ev._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      {t('viewDetails')}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const filterBar = { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' };
const searchBox = {
  display: 'flex', alignItems: 'center', gap: '10px',
  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
  borderRadius: '12px', padding: '12px 16px',
};
const categoryTabs = { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' };
const catBtn = {
  padding: '7px 14px', borderRadius: '20px',
  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500,
  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
};
const catBtnActive = { background: '#FF6B00', border: '1px solid #FF6B00', color: 'white' };
const metaRow = { display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: '6px' };

export default Events;
