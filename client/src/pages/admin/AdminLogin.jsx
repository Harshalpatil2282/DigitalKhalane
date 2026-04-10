/**
 * Admin Login Page
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (isAdmin) { navigate('/admin/dashboard'); return null; }

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={page}>
      {/* Background */}
      <div style={bgOverlay} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        style={card}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>🪔</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(135deg,#FF6B00,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            DigitalKhalane
          </h1>
          <p style={{ color: 'rgba(255,248,240,0.5)', fontSize: '0.82rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin Panel</p>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={label}>Email Address</label>
            <div style={inputWrap}>
              <Mail size={16} style={icon} />
              <input name="email" type="email" value={form.email} onChange={onChange}
                style={input} placeholder="admin@digitalkhalane.in" required />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={label}>Password</label>
            <div style={inputWrap}>
              <Lock size={16} style={icon} />
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={onChange}
                style={{ ...input, paddingRight: '44px' }} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,248,240,0.4)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={loading} style={submitBtn}>
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px', background: 'rgba(255,107,0,0.06)', borderRadius: '10px', border: '1px dashed rgba(255,107,0,0.2)' }}>
          <p style={{ color: 'rgba(255,248,240,0.4)', fontSize: '0.78rem', marginBottom: '6px' }}>Default credentials</p>
          <p style={{ color: 'rgba(255,248,240,0.65)', fontSize: '0.82rem' }}>admin@digitalkhalane.in / khalane@2024</p>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,248,240,0.25)', fontSize: '0.75rem', marginTop: '20px' }}>
          Created by Harshal Parmeshvar Patil
        </p>
      </motion.div>
    </div>
  );
};

const page = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0D0500 0%,#2D0A00 50%,#1A0500 100%)', padding: '20px', position: 'relative', overflow: 'hidden' };
const bgOverlay = { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 40%, rgba(255,107,0,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(128,0,32,0.1) 0%, transparent 60%)' };
const card = { background: 'rgba(30,10,0,0.85)', border: '1px solid rgba(255,107,0,0.15)', borderRadius: '24px', padding: '44px 40px', width: '100%', maxWidth: '420px', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1, boxShadow: '0 30px 80px rgba(0,0,0,0.5)' };
const label = { display: 'block', color: 'rgba(255,248,240,0.6)', fontSize: '0.82rem', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.5px' };
const inputWrap = { position: 'relative' };
const icon = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,248,240,0.3)', pointerEvents: 'none' };
const input = { width: '100%', padding: '12px 14px 12px 42px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,107,0,0.15)', borderRadius: '10px', color: '#FFF8F0', fontSize: '0.93rem', outline: 'none', fontFamily: 'Poppins,sans-serif', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '14px', background: 'linear-gradient(135deg,#FF6B00,#D45500)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', boxShadow: '0 6px 20px rgba(255,107,0,0.35)' };

export default AdminLogin;
