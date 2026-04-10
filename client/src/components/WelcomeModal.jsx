/**
 * WelcomeModal - Beautiful full-screen welcome popup with multilingual support
 * Shows once per session for all visitors
 * Created by Harshal Parmeshvar Patil
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const WelcomeModal = () => {
  const [show, setShow] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const seen = sessionStorage.getItem('dk_welcomed');
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('dk_welcomed', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={overlay}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={modal}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button style={closeBtn} onClick={handleClose}><X size={20} /></button>

            {/* Bg decorations */}
            <div style={bgCircle1} /><div style={bgCircle2} /><div style={bgCircle3} />

            {/* Diya */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '72px', lineHeight: 1, position: 'relative', zIndex: 1 }}
            >🪔</motion.div>

            {/* Hindi title - always shown as it is the festival name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={titleHindi}
            >
              खलाने यात्रा उत्सव
            </motion.h1>

            {/* Welcome text in selected language */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            >
              <h2 style={welcomeText}>🙏 {t('welcomeMsg')}</h2>
              <p style={subText}>
                The official digital platform of <strong>Khalane Yatra Utsav</strong>.
                Explore events, register, donate, and be part of our grand celebration!
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.5 }}
              style={divider}
            />

            {/* Creator Credit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              style={creatorBox}
            >
              <Sparkles size={16} style={{ color: '#FFD700' }} />
              <div>
                <p style={createdByStyle}>{t('craftedBy')}</p>
                <p style={creatorName}>Harshal Parmeshvar Patil</p>
                <p style={warmWelcomeStyle}>{t('warmWelcome')}</p>
              </div>
              <Sparkles size={16} style={{ color: '#FFD700' }} />
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              style={ctaBtn} onClick={handleClose}
            >
              {t('exploreBtn')}
            </motion.button>

            {/* Decorative dots */}
            <div style={dotsRow}>
              {['🌸','✨','🌼','✨','🌸'].map((d, i) => (
                <motion.span key={i}
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                  style={{ fontSize: '18px' }}
                >{d}</motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const overlay = { position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modal = { position: 'relative', background: 'linear-gradient(145deg, #2D0A00 0%, #5A0015 40%, #800020 70%, #A0002A 100%)', borderRadius: '28px', padding: '48px 40px 40px', maxWidth: '520px', width: '100%', textAlign: 'center', overflow: 'hidden', border: '1px solid rgba(255,215,0,0.3)', boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,0,0.2)' };
const closeBtn = { position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 };
const bgCircle1 = { position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', top: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(255,107,0,0.15), transparent 70%)' };
const bgCircle2 = { position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', bottom: '-60px', left: '-60px', background: 'radial-gradient(circle, rgba(255,215,0,0.1), transparent 70%)' };
const bgCircle3 = { position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', bottom: '30px', right: '20px', background: 'radial-gradient(circle, rgba(255,107,0,0.08), transparent 70%)' };
const titleHindi = { fontFamily: "'Tiro Devanagari Hindi', serif", fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: '#FFD700', marginTop: '16px', marginBottom: '12px', textShadow: '0 2px 12px rgba(255,215,0,0.4)', position: 'relative', zIndex: 1 };
const welcomeText = { fontSize: '1.25rem', color: '#FFF8F0', marginBottom: '10px', fontWeight: 700, position: 'relative', zIndex: 1 };
const subText = { color: 'rgba(255,248,240,0.8)', fontSize: '0.92rem', lineHeight: 1.7, position: 'relative', zIndex: 1 };
const divider = { height: '1px', margin: '22px auto', background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)', position: 'relative', zIndex: 1 };
const creatorBox = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px', position: 'relative', zIndex: 1 };
const createdByStyle = { color: 'rgba(255,248,240,0.6)', fontSize: '0.8rem', marginBottom: '2px' };
const creatorName = { color: '#FFD700', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.5px' };
const warmWelcomeStyle = { color: 'rgba(255,248,240,0.75)', fontSize: '0.82rem', marginTop: '2px' };
const ctaBtn = { background: 'linear-gradient(135deg, #FF6B00, #FFD700)', color: '#2D0A00', fontWeight: 700, fontSize: '1rem', padding: '14px 36px', borderRadius: '50px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,107,0,0.4)', position: 'relative', zIndex: 1, fontFamily: "'Poppins', sans-serif" };
const dotsRow = { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', position: 'relative', zIndex: 1 };

export default WelcomeModal;
