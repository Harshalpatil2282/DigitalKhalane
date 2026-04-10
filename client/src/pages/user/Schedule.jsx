/**
 * Schedule Page - Day-wise event timeline
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import API from '../../services/api';

const ICONS = { religious:'🛕', cultural:'🎭', sports:'🏆', music:'🎵', food:'🍱', procession:'🎆', competition:'🥇', other:'🎪' };

const Schedule = () => {
  const { t } = useLang();
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    API.get('/events?limit=100').then(r => {
      setEvents(r.data.events || []);
    }).finally(() => setLoading(false));
  }, []);

  // Group events by date
  const grouped = events.reduce((acc, ev) => {
    const dateKey = new Date(ev.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ev);
    return acc;
  }, {});

  const days = Object.keys(grouped);

  return (
    <div>
      <div className="page-hero">
        <h1>{t('festivalSchedule')}</h1>
        <p>{t('festivalScheduleDesc')}</p>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : days.length === 0 ? (
            <p style={{ textAlign:'center', color:'var(--text-muted)', padding:'40px' }}>{t('scheduleComingSoon')}</p>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:'32px', alignItems:'start' }}>
              {/* Day Tabs */}
              <div style={{ position:'sticky', top:'80px' }}>
                <h3 style={{ marginBottom:'16px', fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'2px', color:'var(--text-muted)' }}>{t('festivalDays')}</h3>
                {days.map((day, i) => (
                  <button key={day} onClick={() => setActiveDay(i)}
                    style={{ ...dayTab, ...(activeDay === i ? dayTabActive : {}) }}>
                    <Calendar size={16} />
                    <span>{day.split(',')[0]}</span>
                    <span style={{ fontSize:'0.75rem', color: activeDay===i ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                      {grouped[day].length} {t('eventsScheduled')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Timeline */}
              <div>
                <h2 style={{ marginBottom:'8px' }}>{days[activeDay]}</h2>
                <p style={{ color:'var(--text-muted)', marginBottom:'32px', fontSize:'0.9rem' }}>
                  {grouped[days[activeDay]]?.length} events scheduled
                </p>
                <div style={{ position:'relative' }}>
                  {/* Vertical line */}
                  <div style={{ position:'absolute', left:'24px', top:0, bottom:0, width:'2px', background:'linear-gradient(180deg, #FF6B00, #FFD700, #800020)', borderRadius:'1px' }} />

                  {grouped[days[activeDay]]?.sort((a,b) => a.time?.localeCompare(b.time)).map((ev, i) => (
                    <motion.div key={ev._id}
                      initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1 }}
                      style={timelineItem}
                    >
                      {/* Dot */}
                      <div style={{ ...timelineDot, background: ev.isFeatured ? '#FFD700' : '#FF6B00' }}>
                        <span style={{ fontSize:'14px' }}>{ICONS[ev.category] || '🎪'}</span>
                      </div>
                      {/* Card */}
                      <div className="card" style={{ padding:'18px 20px', flex:1, marginLeft:'12px' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                          <span className={`badge badge-${ev.category}`}>{ev.category}</span>
                          <span style={{ color:'#FF6B00', fontWeight:700, fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'5px' }}>
                            <Clock size={14}/> {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}
                          </span>
                        </div>
                        <h3 style={{ fontSize:'1rem', marginBottom:'6px' }}>{ev.title}</h3>
                        <p style={{ color:'var(--text-muted)', fontSize:'0.83rem', marginBottom:'8px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{ev.description}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', fontSize:'0.82rem', justifyContent:'space-between' }}>
                          <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin size={13}/>{ev.location}</span>
                          <Link to={`/events/${ev._id}`} style={{ color:'#FF6B00', fontWeight:600, fontSize:'0.82rem' }}>Details →</Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const dayTab = { width:'100%', display:'flex', flexDirection:'column', gap:'3px', padding:'12px 14px', borderRadius:'10px', background:'var(--bg-card)', border:'1px solid var(--border)', marginBottom:'8px', cursor:'pointer', textAlign:'left', color:'var(--text-secondary)', transition:'all 0.2s', fontSize:'0.88rem', fontWeight:500 };
const dayTabActive = { background:'linear-gradient(135deg, #FF6B00, #D45500)', border:'1px solid #FF6B00', color:'white' };
const timelineItem = { display:'flex', alignItems:'flex-start', marginBottom:'20px', position:'relative' };
const timelineDot = { width:'50px', height:'50px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(255,107,0,0.3)', zIndex:1 };

export default Schedule;
