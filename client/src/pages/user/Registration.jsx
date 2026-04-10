/**
 * Registration Page - Event registration form
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Users, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import API from '../../services/api';

const Registration = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t } = useLang();
  const [form, setForm] = useState({
    name:'', phone:'', email:'', village:'', age:'', gender:'prefer_not_to_say',
    event: searchParams.get('event') || '', message:'',
  });

  useEffect(() => {
    API.get('/events?registrationRequired=true').then(r => {
      // get all events for dropdown
      API.get('/events').then(r2 => setEvents(r2.data.events || []));
    });
    API.get('/events').then(r => setEvents(r.data.events || []));
  }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.event) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      await API.post('/registrations', form);
      setSuccess(true);
      toast.success('Registration successful! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-hero">
        <h1><Users size={32} style={{ display:'inline', verticalAlign:'middle', marginRight:'10px' }} />{t('registerTitle')}</h1>
        <p>{t('registerDesc')}</p>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth:'640px' }}>
          {success ? (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="card"
              style={{ padding:'60px 40px', textAlign:'center' }}>
              <div style={{ fontSize:'70px', marginBottom:'16px' }}>🎉</div>
              <CheckCircle size={48} style={{ color:'#22c55e', margin:'0 auto 16px' }} />
              <h2 style={{ marginBottom:'12px' }}>{t('registrationSuccess')}</h2>
              <p style={{ color:'var(--text-muted)', lineHeight:1.8 }}>
                Thank you <strong>{form.name}</strong>! {t('registrationSuccessMsg')}
              </p>
              <button onClick={() => setSuccess(false)} className="btn btn-primary" style={{ marginTop:'28px' }}>
                {t('registerAnother')}
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="card" style={{ padding:'36px' }}>
              <h2 style={{ marginBottom:'6px' }}>{t('registerTitle')}</h2>
              <p style={{ color:'var(--text-muted)', marginBottom:'28px', fontSize:'0.9rem' }}>{t('required')}</p>
              <form onSubmit={onSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label>{t('fullName')} *</label>
                    <div style={inputWrap}>
                      <User size={16} style={inputIcon} />
                      <input name="name" value={form.name} onChange={onChange} className="form-control" placeholder={t('fullName')} style={{ paddingLeft:'40px' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('phoneNumber')} *</label>
                    <div style={inputWrap}>
                      <Phone size={16} style={inputIcon} />
                      <input name="phone" value={form.phone} onChange={onChange} className="form-control" placeholder="+91 XXXXX XXXXX" style={{ paddingLeft:'40px' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('emailAddress')} *</label>
                    <div style={inputWrap}>
                      <Mail size={16} style={inputIcon} />
                      <input name="email" type="email" value={form.email} onChange={onChange} className="form-control" placeholder="you@email.com" style={{ paddingLeft:'40px' }} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('village')}</label>
                    <div style={inputWrap}>
                      <MapPin size={16} style={inputIcon} />
                      <input name="village" value={form.village} onChange={onChange} className="form-control" placeholder={t('village')} style={{ paddingLeft:'40px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t('age')}</label>
                    <input name="age" type="number" value={form.age} onChange={onChange} className="form-control" placeholder={t('age')} min="5" max="100" />
                  </div>
                  <div className="form-group">
                    <label>{t('gender')}</label>
                    <select name="gender" value={form.gender} onChange={onChange} className="form-control">
                      <option value="prefer_not_to_say">{t('preferNot')}</option>
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label>{t('selectEvent')} *</label>
                    <select name="event" value={form.event} onChange={onChange} className="form-control" required>
                      <option value="">{t('selectEventPlaceholder')}</option>
                      {events.map(ev => (
                        <option key={ev._id} value={ev._id}>{ev.title} — {new Date(ev.date).toLocaleDateString('en-IN')}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label>{t('message')}</label>
                    <textarea name="message" value={form.message} onChange={onChange} className="form-control" placeholder={t('message')} rows={3} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', marginTop:'8px' }} disabled={loading}>
                  {loading ? <><div className="spinner spinner-sm" /> Registering...</> : `🎉 ${t('registerNow')}`}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

const inputWrap = { position:'relative' };
const inputIcon = { position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' };

export default Registration;
