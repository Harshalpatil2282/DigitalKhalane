/**
 * Donation Page
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../services/api';

const AMOUNTS = [101, 251, 501, 1001, 2501, 5001];

const Donation = () => {
  const [content, setContent] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', amount:'', paymentMethod:'upi', transactionId:'', message:'', village:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [custom, setCustom] = useState(false);

  useEffect(() => { API.get('/content').then(r => setContent(r.data.content)); }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.amount) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      await API.post('/donations', form);
      setSuccess(true);
      toast.success('Thank you for your donation! 🙏');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-hero">
        <h1>💛 Support the Festival</h1>
        <p>Your donation helps make Khalane Yatra Utsav grander every year</p>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px,1fr))', gap:'36px', alignItems:'start' }}>

            {/* Donation Form */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="card" style={{ padding:'32px' }}>
              {success ? (
                <div style={{ textAlign:'center', padding:'20px 0' }}>
                  <div style={{ fontSize:'60px', marginBottom:'12px' }}>🙏</div>
                  <CheckCircle size={44} style={{ color:'#22c55e', margin:'0 auto 16px' }} />
                  <h2 style={{ marginBottom:'10px' }}>Thank You!</h2>
                  <p style={{ color:'var(--text-muted)' }}>Your generous donation of <strong>₹{form.amount}</strong> has been recorded. May God bless you! 🌸</p>
                  <button onClick={() => { setSuccess(false); setForm({ name:'', email:'', phone:'', amount:'', paymentMethod:'upi', transactionId:'', message:'', village:'' }); }} className="btn btn-primary" style={{ marginTop:'24px' }}>Donate Again</button>
                </div>
              ) : (
                <>
                  <h2 style={{ marginBottom:'6px' }}>Make a Donation</h2>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'24px' }}>Every rupee counts towards making this festival grand!</p>
                  <form onSubmit={onSubmit}>
                    {/* Preset amounts */}
                    <div className="form-group">
                      <label>Select Amount (₹)</label>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'10px' }}>
                        {AMOUNTS.map(a => (
                          <button type="button" key={a} onClick={() => { setForm(f => ({...f, amount: a})); setCustom(false); }}
                            style={{ padding:'9px 18px', borderRadius:'25px', border: form.amount==a ? '2px solid #FF6B00' : '1.5px solid var(--border)', background: form.amount==a ? 'rgba(255,107,0,0.1)' : 'var(--bg-secondary)', color: form.amount==a ? '#FF6B00' : 'var(--text-secondary)', fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>
                            ₹{a.toLocaleString()}
                          </button>
                        ))}
                        <button type="button" onClick={() => { setCustom(true); setForm(f => ({...f,amount:''})); }}
                          style={{ padding:'9px 18px', borderRadius:'25px', border: custom ? '2px solid #FF6B00' : '1.5px solid var(--border)', background: custom ? 'rgba(255,107,0,0.1)' : 'var(--bg-secondary)', color: custom ? '#FF6B00' : 'var(--text-secondary)', fontWeight:600, cursor:'pointer', fontSize:'0.88rem' }}>
                          Custom
                        </button>
                      </div>
                      {custom && <input name="amount" type="number" value={form.amount} onChange={onChange} className="form-control" placeholder="Enter custom amount (₹)" min="1" required />}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                      <div className="form-group" style={{ gridColumn:'1/-1' }}>
                        <label>Full Name *</label>
                        <input name="name" value={form.name} onChange={onChange} className="form-control" placeholder="Donor name" required />
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
                        <label>Village</label>
                        <input name="village" value={form.village} onChange={onChange} className="form-control" placeholder="Your village" />
                      </div>
                      <div className="form-group">
                        <label>Payment Method</label>
                        <select name="paymentMethod" value={form.paymentMethod} onChange={onChange} className="form-control">
                          <option value="upi">UPI</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="cash">Cash</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ gridColumn:'1/-1' }}>
                        <label>Transaction ID (after payment)</label>
                        <input name="transactionId" value={form.transactionId} onChange={onChange} className="form-control" placeholder="UPI/Bank transaction ID" />
                      </div>
                      <div className="form-group" style={{ gridColumn:'1/-1' }}>
                        <label>Message (optional)</label>
                        <textarea name="message" value={form.message} onChange={onChange} className="form-control" placeholder="Leave a message with your donation..." rows={2} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-gold btn-lg" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
                      {loading ? <><div className="spinner spinner-sm" /> Submitting...</> : '💛 Donate Now'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Bank Details Card */}
            <div>
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }} className="card" style={{ padding:'28px', marginBottom:'20px' }}>
                <h3 style={{ marginBottom:'20px', color:'#FF6B00' }}>🏦 Bank Details</h3>
                {[
                  ['Bank Name', content?.bankName || 'SBI, Khalane Branch'],
                  ['Account No.', content?.accountNumber || '1234 5678 9012 3456'],
                  ['IFSC Code', content?.ifscCode || 'SBIN0012345'],
                  ['UPI ID', content?.upiId || 'khalaneyatra@sbi'],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:'0.9rem' }}>
                    <span style={{ color:'var(--text-muted)', fontWeight:500 }}>{k}</span>
                    <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25 }} style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.08), rgba(255,215,0,0.08))', border:'1.5px solid rgba(255,107,0,0.2)', borderRadius:'16px', padding:'24px', textAlign:'center' }}>
                <HeartHandshake size={40} style={{ color:'#FF6B00', margin:'0 auto 12px' }} />
                <h3 style={{ marginBottom:'8px' }}>Why Donate?</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.88rem', lineHeight:1.8 }}>Your donation directly supports the organization of Khalane Yatra Utsav — from temple decorations to cultural programs and prasad distribution for thousands of devotees.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donation;
