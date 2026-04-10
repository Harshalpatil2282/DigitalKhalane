/**
 * Admin Events - CRUD management for festival events
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const CATEGORIES = ['religious','cultural','sports','music','food','procession','competition','other'];
const empty = { title:'', description:'', category:'religious', date:'', time:'', endTime:'', location:'', organizer:'Khalane Yatra Utsav Committee', isFeatured:false, registrationRequired:false, maxParticipants:0, tags:'' };

const AdminEvents = () => {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(empty);
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving,  setSaving]  = useState(false);
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api','');

  const load = () => { setLoading(true); API.get('/events/all' ).catch(() => API.get('/events')).then(r => setEvents(r.data.events||[])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(empty); setImgFile(null); setPreview(''); setModal(true); };
  const openEdit = ev => {
    setEditing(ev);
    setForm({ ...ev, date: ev.date ? ev.date.slice(0,10) : '', tags: (ev.tags||[]).join(', '), isFeatured:!!ev.isFeatured, registrationRequired:!!ev.registrationRequired, maxParticipants: ev.maxParticipants||0 });
    setPreview(ev.image ? `${apiBase}${ev.image}` : '');
    setImgFile(null);
    setModal(true);
  };

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if (k !== 'tags') fd.append(k, v); });
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t=>t.trim()).filter(Boolean)));
      if (imgFile) fd.append('image', imgFile);

      if (editing) {
        await API.put(`/events/${editing._id}`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
        toast.success('Event updated!');
      } else {
        await API.post('/events', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
        toast.success('Event created!');
      }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message||'Error saving event'); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete this event?')) return;
    try { await API.delete(`/events/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-primary)' }}>
      <AdminSidebar />
      <main style={{ flex:1, padding:'28px', overflow:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div><h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>Manage Events</h1><p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{events.length} events total</p></div>
          <button onClick={openNew} className="btn btn-primary"><Plus size={18}/> Add Event</button>
        </div>

        {loading ? <div className="loading-page"><div className="spinner"/></div> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'18px' }}>
            {events.map(ev => (
              <div key={ev._id} className="card" style={{ padding:'18px' }}>
                <div style={{ height:'120px', background:'linear-gradient(135deg,#800020,#FF6B00)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', marginBottom:'14px', overflow:'hidden' }}>
                  {ev.image && <img src={`${apiBase}${ev.image}`} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>}
                  {ev.isFeatured && <span style={{ position:'absolute', top:8, right:8, background:'#FFD700', color:'#1A0A00', fontSize:'0.7rem', fontWeight:700, padding:'2px 8px', borderRadius:'12px' }}>⭐ Featured</span>}
                </div>
                <span className={`badge badge-${ev.category}`} style={{ marginBottom:'8px' }}>{ev.category}</span>
                <h3 style={{ fontSize:'0.97rem', marginBottom:'6px' }}>{ev.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'4px' }}>📅 {new Date(ev.date).toLocaleDateString('en-IN')} · {ev.time}</p>
                <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:'14px' }}>📍 {ev.location}</p>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={() => openEdit(ev)} className="btn btn-outline btn-sm" style={{ flex:1, justifyContent:'center' }}><Edit2 size={14}/> Edit</button>
                  <button onClick={() => del(ev._id)} className="btn btn-sm" style={{ background:'rgba(200,0,0,0.08)', color:'#c00', border:'1px solid rgba(200,0,0,0.2)', borderRadius:'25px', padding:'8px 14px', cursor:'pointer' }}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
              <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9,y:20}} style={{ background:'var(--bg-card)', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'620px', maxHeight:'90vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                  <h2 style={{ fontSize:'1.2rem' }}>{editing ? 'Edit Event' : 'Add New Event'}</h2>
                  <button onClick={()=>setModal(false)} style={{ background:'var(--bg-secondary)', border:'none', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'var(--text-muted)' }}><X size={18}/></button>
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom:'20px' }}>
                  <label style={{ display:'block', fontWeight:500, marginBottom:'8px', fontSize:'0.88rem', color:'var(--text-muted)' }}>Event Image</label>
                  <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', height:'140px', border:'2px dashed var(--border)', borderRadius:'12px', cursor:'pointer', background:'var(--bg-secondary)', overflow:'hidden', position:'relative' }}>
                    {preview ? <img src={preview} alt="preview" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/> : <><Upload size={28} style={{ color:'var(--text-muted)' }}/><span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Click to upload image</span></>}
                    <input type="file" accept="image/*" onChange={onFile} style={{ display:'none' }} />
                  </label>
                </div>

                <form onSubmit={onSubmit}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label>Event Title *</label>
                      <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="form-control" required placeholder="Enter event title"/>
                    </div>
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label>Description *</label>
                      <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="form-control" rows={3} required placeholder="Event description"/>
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="form-control">
                        {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="form-control" required/>
                    </div>
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} className="form-control" placeholder="e.g. 6:00 AM" required/>
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} className="form-control" placeholder="e.g. 9:00 AM"/>
                    </div>
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label>Location *</label>
                      <input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} className="form-control" required placeholder="Venue/location"/>
                    </div>
                    <div className="form-group">
                      <label>Organizer</label>
                      <input value={form.organizer} onChange={e=>setForm(f=>({...f,organizer:e.target.value}))} className="form-control"/>
                    </div>
                    <div className="form-group">
                      <label>Tags (comma separated)</label>
                      <input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} className="form-control" placeholder="puja, temple, opening"/>
                    </div>
                    <div className="form-group">
                      <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                        <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm(f=>({...f,isFeatured:e.target.checked}))}/>
                        Featured Event
                      </label>
                    </div>
                    <div className="form-group">
                      <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                        <input type="checkbox" checked={form.registrationRequired} onChange={e=>setForm(f=>({...f,registrationRequired:e.target.checked}))}/>
                        Registration Required
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:'8px' }} disabled={saving}>
                    {saving ? 'Saving...' : editing ? '💾 Update Event' : '✅ Create Event'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
export default AdminEvents;
