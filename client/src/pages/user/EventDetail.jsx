/**
 * EventDetail Page - Single event full details
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Tag, ArrowLeft } from 'lucide-react';
import API from '../../services/api';

const ICONS = { religious:'🛕', cultural:'🎭', sports:'🏆', music:'🎵', food:'🍱', procession:'🎆', competition:'🥇', other:'🎪' };

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/events/${id}`)
      .then(r => setEvent(r.data.event))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!event)  return <div style={{ textAlign:'center', padding:'80px 20px' }}><h2>Event not found</h2><Link to="/events" className="btn btn-primary" style={{marginTop:'20px'}}>Back to Events</Link></div>;

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '');

  return (
    <div>
      {/* Hero */}
      <div style={{ ...heroBox, background: event.image ? undefined : 'linear-gradient(135deg, #800020, #FF6B00)' }}>
        {event.image && <img src={`${apiBase}${event.image}`} alt={event.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.4 }} />}
        <div style={{ position:'relative', zIndex:1, padding:'60px 20px', maxWidth:'900px', margin:'0 auto' }}>
          <Link to="/events" style={backBtn}><ArrowLeft size={18} /> Back to Events</Link>
          <span className={`badge badge-${event.category}`} style={{ margin:'16px 0', display:'inline-flex' }}>
            {ICONS[event.category]} {event.category}
          </span>
          {event.isFeatured && <span style={featuredBadge}>⭐ Featured Event</span>}
          <h1 style={{ color:'white', fontSize:'clamp(1.8rem, 5vw, 3rem)', marginTop:'12px', textShadow:'0 2px 10px rgba(0,0,0,0.4)' }}>{event.title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr minmax(280px,360px)', gap:'36px', alignItems:'start' }}>
            {/* Main Content */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
              <h2 style={{ marginBottom:'16px', fontSize:'1.4rem' }}>About This Event</h2>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.9, fontSize:'0.97rem', whiteSpace:'pre-wrap' }}>{event.description}</p>
              {event.tags?.length > 0 && (
                <div style={{ marginTop:'24px' }}>
                  <p style={{ fontWeight:600, marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}><Tag size={16}/> Tags</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                    {event.tags.map(t => <span key={t} style={tagChip}>#{t}</span>)}
                  </div>
                </div>
              )}
              {event.registrationRequired && (
                <div style={{ marginTop:'32px' }}>
                  <Link to={`/register?event=${event._id}`} className="btn btn-primary btn-lg">
                    <Users size={20}/> Register for this Event
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Info Card */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} className="card" style={{ padding:'24px' }}>
              <h3 style={{ marginBottom:'20px', borderBottom:'1px solid var(--border)', paddingBottom:'12px' }}>Event Details</h3>
              {[
                { icon:<Calendar size={18}/>, label:'Date', value: new Date(event.date).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
                { icon:<Clock size={18}/>,    label:'Time', value: `${event.time}${event.endTime ? ` – ${event.endTime}` : ''}` },
                { icon:<MapPin size={18}/>,   label:'Location', value: event.location },
                { icon:<Users size={18}/>,    label:'Organizer', value: event.organizer },
                ...(event.maxParticipants ? [{ icon:<Users size={18}/>, label:'Max Participants', value: event.maxParticipants.toString() }] : []),
              ].map(({ icon, label, value }) => (
                <div key={label} style={infoRow}>
                  <div style={{ color:'#FF6B00' }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'1px' }}>{label}</div>
                    <div style={{ fontWeight:500, marginTop:'2px', fontSize:'0.93rem' }}>{value}</div>
                  </div>
                </div>
              ))}
              <Link to="/register" className="btn btn-primary" style={{ marginTop:'20px', width:'100%', justifyContent:'center' }}>
                Register Now
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const heroBox = { position:'relative', minHeight:'280px', display:'flex', alignItems:'flex-end', overflow:'hidden' };
const backBtn = { display:'inline-flex', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.8)', textDecoration:'none', fontSize:'0.9rem', background:'rgba(255,255,255,0.1)', padding:'8px 14px', borderRadius:'8px', backdropFilter:'blur(6px)' };
const featuredBadge = { background:'#FFD700', color:'#1A0A00', fontSize:'0.75rem', fontWeight:700, padding:'3px 12px', borderRadius:'20px', marginLeft:'10px' };
const tagChip = { background:'var(--bg-secondary)', border:'1px solid var(--border)', padding:'4px 12px', borderRadius:'20px', fontSize:'0.82rem', color:'var(--text-secondary)' };
const infoRow = { display:'flex', alignItems:'flex-start', gap:'12px', padding:'12px 0', borderBottom:'1px solid var(--border)' };

export default EventDetail;
