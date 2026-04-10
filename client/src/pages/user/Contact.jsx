/**
 * Contact Page - Contact form + Google Map
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../services/api';

const Contact = () => {
  const [content, setContent] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { API.get('/content').then(r => setContent(r.data.content)); }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await API.post('/contact', form);
      setSuccess(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-hero">
        <h1>📞 Contact Us</h1>
        <p>Get in touch with the Khalane Yatra Utsav committee</p>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px,1fr))', gap:'36px', alignItems:'start' }}>

            {/* Contact Info */}
            <div>
              <h2 style={{ marginBottom:'24px' }}>Get In Touch</h2>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.8, marginBottom:'28px', fontSize:'0.95rem' }}>
                Have questions about the festival, events, or registration? We'd love to hear from you!
              </p>
              {[
                { icon:<MapPin size={22}/>, label:'Address', value: content?.contactAddress || 'Khalane Village, Maharashtra' },
                { icon:<Phone size={22}/>, label:'Phone', value: content?.contactPhone || '+91 8530372289' },
                { icon:<Mail size={22}/>,  label:'Email', value: content?.contactEmail || 'info@digitalkhalane.in' },
              ].map(({icon, label, value}) => (
                <motion.div key={label} whileHover={{ x:4 }}
                  style={{ display:'flex', gap:'16px', padding:'16px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', marginBottom:'14px' }}>
                  <div style={{ width:'44px', height:'44px', background:'linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,215,0,0.08))', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#FF6B00', flexShrink:0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'2px' }}>{label}</div>
                    <div style={{ fontWeight:500, fontSize:'0.93rem' }}>{value}</div>
                  </div>
                </motion.div>
              ))}

              {/* Google Map */}
              {content?.mapEmbedUrl && (
                <div style={{ marginTop:'24px', borderRadius:'16px', overflow:'hidden', border:'1px solid var(--border)' }}>
                  <iframe src={content.mapEmbedUrl} width="100%" height="240" style={{ border:0, display:'block' }}
                    allowFullScreen loading="lazy" title="Khalane Village Location" />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="card" style={{ padding:'32px' }}>
              {success ? (
                <div style={{ textAlign:'center', padding:'30px 0' }}>
                  <CheckCircle size={56} style={{ color:'#22c55e', margin:'0 auto 16px' }} />
                  <h2 style={{ marginBottom:'12px' }}>Message Sent!</h2>
                  <p style={{ color:'var(--text-muted)', lineHeight:1.8 }}>Thank you for reaching out! We will get back to you as soon as possible. 🙏</p>
                  <button onClick={() => { setSuccess(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }); }} className="btn btn-primary" style={{ marginTop:'24px' }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ marginBottom:'6px' }}>Send a Message</h2>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'24px' }}>We'll respond within 24–48 hours</p>
                  <form onSubmit={onSubmit}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                      <div className="form-group">
                        <label>Your Name *</label>
                        <input name="name" value={form.name} onChange={onChange} className="form-control" placeholder="Full name" required />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input name="email" type="email" value={form.email} onChange={onChange} className="form-control" placeholder="your@email.com" required />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input name="phone" value={form.phone} onChange={onChange} className="form-control" placeholder="+91 XXXXX" />
                      </div>
                      <div className="form-group">
                        <label>Subject *</label>
                        <input name="subject" value={form.subject} onChange={onChange} className="form-control" placeholder="How can we help?" required />
                      </div>
                      <div className="form-group" style={{ gridColumn:'1/-1' }}>
                        <label>Message *</label>
                        <textarea name="message" value={form.message} onChange={onChange} className="form-control" placeholder="Write your message here..." rows={5} required />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                      {loading ? <><div className="spinner spinner-sm" /> Sending...</> : <><Send size={18}/> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
