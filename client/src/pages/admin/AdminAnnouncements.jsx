/**
 * Admin Announcements - CRUD management
 */
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Pin } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const TYPES = ['info','success','warning','urgent'];
const TYPE_COLORS = { info:'#0064C8', success:'#16a34a', warning:'#CA8A04', urgent:'#DC2626' };
const empty = { title:'', content:'', type:'info', isActive:true, isPinned:false };

const AdminAnnouncements = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(empty);
  const [saving,  setSaving]  = useState(false);

  const load = () => { setLoading(true); API.get('/announcements/all').then(r=>setItems(r.data.announcements||[])).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[]);

  const openNew  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = a  => { setEditing(a); setForm({ title:a.title, content:a.content, type:a.type, isActive:a.isActive, isPinned:a.isPinned }); setModal(true); };

  const onSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await API.put(`/announcements/${editing._id}`, form); toast.success('Updated!'); }
      else { await API.post('/announcements', form); toast.success('Created!'); }
      setModal(false); load();
    } catch { toast.error('Error'); } finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete?')) return;
    await API.delete(`/announcements/${id}`); toast.success('Deleted'); load();
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-primary)' }}>
      <AdminSidebar/>
      <main style={{ flex:1, padding:'28px', overflow:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
          <div><h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>Announcements</h1><p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{items.length} total</p></div>
          <button onClick={openNew} className="btn btn-primary"><Plus size={18}/> Add</button>
        </div>

        {loading ? <div className="loading-page"><div className="spinner"/></div> : (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {items.map(a => (
              <div key={a._id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'14px', padding:'18px 20px', display:'flex', alignItems:'flex-start', gap:'16px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:`${TYPE_COLORS[a.type]}18`, border:`1px solid ${TYPE_COLORS[a.type]}33`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:'20px' }}>{ a.type==='info'?'ℹ️':a.type==='success'?'✅':a.type==='warning'?'⚠️':'🚨' }</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', marginBottom:'6px' }}>
                    <h3 style={{ fontSize:'0.97rem' }}>{a.title}</h3>
                    {a.isPinned && <span style={{ display:'flex', alignItems:'center', gap:'3px', background:'rgba(255,215,0,0.15)', color:'#B8860B', fontSize:'0.72rem', fontWeight:700, padding:'2px 8px', borderRadius:'10px' }}><Pin size={10}/>Pinned</span>}
                    {!a.isActive && <span style={{ background:'rgba(200,0,0,0.1)', color:'#c00', fontSize:'0.72rem', fontWeight:700, padding:'2px 8px', borderRadius:'10px' }}>Inactive</span>}
                  </div>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1.7 }}>{a.content}</p>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.75rem', marginTop:'8px' }}>{new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                </div>
                <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
                  <button onClick={()=>openEdit(a)} style={iconBtn}><Edit2 size={15}/></button>
                  <button onClick={()=>del(a._id)} style={{ ...iconBtn, color:'#c00', background:'rgba(200,0,0,0.07)' }}><Trash2 size={15}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {modal && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
              <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} style={{ background:'var(--bg-card)', borderRadius:'20px', padding:'30px', width:'100%', maxWidth:'520px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
                  <h2 style={{ fontSize:'1.2rem' }}>{editing?'Edit':'New'} Announcement</h2>
                  <button onClick={()=>setModal(false)} style={iconBtn}><X size={18}/></button>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <label>Title *</label>
                    <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="form-control" required placeholder="Announcement title"/>
                  </div>
                  <div className="form-group">
                    <label>Content *</label>
                    <textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} className="form-control" rows={4} required placeholder="Announcement content..."/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                    <div className="form-group">
                      <label>Type</label>
                      <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="form-control">
                        {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:'10px' }}>
                      <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontWeight:500 }}>
                        <input type="checkbox" checked={form.isPinned} onChange={e=>setForm(f=>({...f,isPinned:e.target.checked}))}/> Pin to Top
                      </label>
                      <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontWeight:500 }}>
                        <input type="checkbox" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))}/> Active
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:'8px' }} disabled={saving}>
                    {saving?'Saving...': editing?'Update':'Create'}
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
const iconBtn = { background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px', padding:'7px', cursor:'pointer', color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center' };
export default AdminAnnouncements;
