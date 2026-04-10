/**
 * Gallery Page - Photo & video grid with lightbox
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image, Video, ZoomIn } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import API from '../../services/api';

const Gallery = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const { t } = useLang();
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '');

  useEffect(() => {
    API.get('/gallery').then(r => setItems(r.data.items || [])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const prev = () => setLightbox(l => (l - 1 + filtered.length) % filtered.length);
  const next = () => setLightbox(l => (l + 1) % filtered.length);

  return (
    <div>
      <div className="page-hero">
        <h1>{t('photoGalleryTitle')}</h1>
        <p>{t('photoGalleryDesc')}</p>
      </div>
      <section className="section">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'center', gap:'12px', marginBottom:'36px', flexWrap:'wrap' }}>
            {['all','photo','video'].map(v => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ padding:'10px 22px', borderRadius:'25px', background: filter===v ? '#FF6B00' : 'var(--bg-card)', border: filter===v ? '1.5px solid #FF6B00' : '1.5px solid var(--border)', color: filter===v ? 'white' : 'var(--text-secondary)', fontWeight:500, cursor:'pointer', transition:'all 0.2s', fontSize:'0.9rem' }}>
                {v === 'all' ? `🖼️ ${t('allItems')}` : v === 'photo' ? `📷 ${t('photos')}` : `🎥 ${t('videos')}`}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="loading-page"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:'60px', marginBottom:'16px' }}>📷</div>
              <h3>{t('noGalleryItems')}</h3>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'14px' }}>
              {filtered.map((item, i) => (
                <motion.div key={item._id}
                  initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay: i*0.04 }}
                  onClick={() => setLightbox(i)}
                  style={{ borderRadius:'14px', overflow:'hidden', cursor:'pointer', position:'relative', aspectRatio:'1', background:'var(--bg-secondary)' }}
                  whileHover={{ scale:1.03 }}
                >
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#2D0A00,#800020)', position:'relative' }}>
                    {item.url
                      ? <img src={`${apiBase}${item.url}`} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
                      : item.type==='video' ? <Video size={36} style={{ color:'white' }} /> : <Image size={36} style={{ color:'rgba(255,255,255,0.5)' }} />
                    }
                    {item.type==='video' && <span style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.7)', color:'white', fontSize:'0.68rem', fontWeight:700, padding:'2px 8px', borderRadius:'4px' }}>▶ VIDEO</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
            onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale:0.85 }} animate={{ scale:1 }} exit={{ scale:0.85 }}
              style={{ position:'relative', maxWidth:'900px', width:'100%' }}
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setLightbox(null)} style={{ position:'absolute', top:'-44px', right:0, background:'rgba(255,255,255,0.15)', border:'none', color:'white', borderRadius:'50%', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={20}/></button>
              <button onClick={prev} style={{ position:'absolute', left:'-50px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', color:'white', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><ChevronLeft size={26}/></button>
              <button onClick={next} style={{ position:'absolute', right:'-50px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.15)', border:'none', color:'white', borderRadius:'50%', width:'44px', height:'44px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><ChevronRight size={26}/></button>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                {filtered[lightbox]?.type === 'video'
                  ? <video controls style={{ maxWidth:'100%', maxHeight:'75vh', borderRadius:'10px' }}><source src={`${apiBase}${filtered[lightbox]?.url}`} /></video>
                  : <img src={`${apiBase}${filtered[lightbox]?.url}`} alt={filtered[lightbox]?.title} style={{ maxWidth:'100%', maxHeight:'75vh', objectFit:'contain', borderRadius:'10px' }} />
                }
              </div>
              <div style={{ textAlign:'center', marginTop:'12px' }}>
                <p style={{ color:'white', fontWeight:600 }}>{filtered[lightbox]?.title}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', marginTop:'4px' }}>{lightbox+1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
