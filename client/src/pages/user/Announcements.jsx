/**
 * Announcements Page - Festival news & updates
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Pin, Clock } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import API from '../../services/api';

const TYPE_STYLES = {
  info:    { bg:'rgba(0,100,200,0.08)', border:'rgba(0,100,200,0.2)', icon:'ℹ️', label:'Info' },
  success: { bg:'rgba(0,150,0,0.08)',   border:'rgba(0,150,0,0.2)',   icon:'✅', label:'Success' },
  warning: { bg:'rgba(200,150,0,0.1)',  border:'rgba(200,150,0,0.25)',icon:'⚠️', label:'Notice' },
  urgent:  { bg:'rgba(200,0,0,0.08)',   border:'rgba(200,0,0,0.2)',   icon:'🚨', label:'Urgent' },
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    API.get('/announcements').then(r => setAnnouncements(r.data.announcements || [])).finally(() => setLoading(false));
  }, []);

  const pinned  = announcements.filter(a => a.isPinned);
  const regular = announcements.filter(a => !a.isPinned);

  return (
    <div>
      <div className="page-hero">
        <h1><Bell size={32} style={{ display:'inline', verticalAlign:'middle', marginRight:'10px' }} />{t('announcementsTitle')}</h1>
        <p>{t('announcementsDesc')}</p>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth:'760px' }}>
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : announcements.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'60px', marginBottom:'16px' }}>📢</div>
              <h3>{t('noAnnouncements')}</h3>
            </div>
          ) : (
            <>
              {/* Pinned */}
              {pinned.length > 0 && (
                <div style={{ marginBottom:'36px' }}>
                  <h3 style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'2px' }}>
                    <Pin size={16}/> {t('pinned')}
                  </h3>
                  {pinned.map((a, i) => <AnnouncementCard key={a._id} a={a} i={i} t={t} />)}
                </div>
              )}

              {/* Regular */}
              {regular.length > 0 && (
                <div>
                  <h3 style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', color:'var(--text-muted)', fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'2px' }}>
                    <Bell size={16}/> {t('latestUpdates')}
                  </h3>
                  {regular.map((a, i) => <AnnouncementCard key={a._id} a={a} i={i} t={t} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const AnnouncementCard = ({ a, i, t = (k) => k }) => {
  const s = TYPE_STYLES[a.type] || TYPE_STYLES.info;
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
      style={{ background: s.bg, border:`1.5px solid ${s.border}`, borderRadius:'14px', padding:'22px', marginBottom:'16px', position:'relative' }}>
      {a.isPinned && (
        <span style={{ position:'absolute', top:'-10px', right:'16px', background:'#FFD700', color:'#1A0A00', fontSize:'0.72rem', fontWeight:700, padding:'3px 10px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'4px' }}>
          <Pin size={11}/> {t('pinned')}
        </span>
      )}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
        <span style={{ fontSize:'28px', flexShrink:0 }}>{s.icon}</span>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:'1.05rem', marginBottom:'8px' }}>{a.title}</h3>
          <p style={{ color:'var(--text-secondary)', lineHeight:1.8, fontSize:'0.93rem' }}>{a.content}</p>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', fontSize:'0.78rem', marginTop:'12px' }}>
            <Clock size={13}/>{new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Announcements;
