/**
 * Admin Gallery - Upload and manage photos/videos
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Upload, Image, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const AdminGallery = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({ title:'', caption:'', year: new Date().getFullYear() });
  const [file,    setFile]    = useState(null);
  const [preview, setPreview] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [filter,  setFilter]  = useState('all');
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api','');

  const load = () => { setLoading(true); API.get('/gallery/all').then(r=>setItems(r.data.items||[])).finally(()=>setLoading(false)); };
  useEffect(()=>{ load(); },[]);

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('caption', form.caption);
      fd.append('year', form.year);
      await API.post('/gallery', fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      toast.success('Uploaded!');
      setModal(false); setFile(null); setPreview(''); setForm({ title:'', caption:'', year: new Date().getFullYear() });
      load();
    } catch { toast.error('Upload failed'); } finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm('Delete?')) return;
    await API.delete(`/gallery/${id}`); toast.success('Deleted'); load();
  };

  const filtered = filter === 'all' ? items : items.filter(i=>i.type===filter);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-primary)' }}>
      <AdminSidebar/>
      <main style={{ flex:1, padding:'28px', overflow:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <div><h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>Gallery</h1><p style={{ color:'var(--text-muted)', fontSize:'0.88rem' }}>{items.length} items</p></div>
          <button onClick={()=>setModal(true)} className="btn btn-primary"><Plus size={18}/> Upload</button>
        </div>

        {/* Filter */}
        <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
          {['all','photo','video'].map(v=>(
            <button key={v} onClick={()=>setFilter(v)}
              style={{ padding:'8px 16px', borderRadius:'20px', border: filter===v?'1.5px solid #FF6B00':'1.5px solid var(--border)', background: filter===v?'rgba(255,107,0,0.1)':'var(--bg-card)', color: filter===v?'#FF6B00':'var(--text-secondary)', fontWeight:500, cursor:'pointer', fontSize:'0.85rem' }}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <div className="loading-page"><div className="spinner"/></div> : (
          filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', color:'var(--text-muted)' }}>
              <Image size={48} style={{ margin:'0 auto 14px', opacity:0.4 }}/><p>No items yet. Upload some!</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:'14px' }}>
              {filtered.map((item,i) => (
                <motion.div key={item._id} initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} transition={{delay:i*0.04}}
                  style={{ borderRadius:'12px', overflow:'hidden', position:'relative', aspectRatio:'1', background:'var(--bg-secondary)' }}>
                  {item.type==='video'
                    ? <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#2D0A00,#800020)', display:'flex', alignItems:'center', justifyContent:'center' }}><Video size={36} style={{ color:'white' }}/></div>
                    : item.url && <img src={`${apiBase}${item.url}`} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  }
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.8))', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'10px' }}>
                    <p style={{ color:'white', fontSize:'0.8rem', fontWeight:600, marginBottom:'6px' }}>{item.title}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ background:'rgba(0,0,0,0.5)', color:'white', fontSize:'0.7rem', padding:'2px 8px', borderRadius:'8px' }}>{item.type} · {item.year}</span>
                      <button onClick={()=>del(item._id)} style={{ background:'rgba(200,0,0,0.8)', border:'none', borderRadius:'6px', padding:'4px 8px', cursor:'pointer', color:'white' }}><Trash2 size={13}/></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {modal && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
              <motion.div initial={{scale:0.9,y:20}} animate={{scale:1,y:0}} exit={{scale:0.9}} style={{ background:'var(--bg-card)', borderRadius:'20px', padding:'30px', width:'100%', maxWidth:'460px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'22px' }}>
                  <h2 style={{ fontSize:'1.2rem' }}>Upload to Gallery</h2>
                  <button onClick={()=>{ setModal(false); setFile(null); setPreview(''); }} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px', cursor:'pointer' }}><X size={18}/></button>
                </div>
                <form onSubmit={onSubmit}>
                  {/* File Drop Zone */}
                  <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', height:'160px', border:'2px dashed var(--border)', borderRadius:'14px', cursor:'pointer', marginBottom:'18px', background:'var(--bg-secondary)', overflow:'hidden', position:'relative' }}>
                    {preview
                      ? file?.type.startsWith('video')
                        ? <video src={preview} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
                        : <img src={preview} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
                      : <><Upload size={32} style={{ color:'#FF6B00' }}/><p style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>Click to select Image or Video</p><p style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>JPG, PNG, MP4, MOV (max 50MB)</p></>
                    }
                    <input type="file" accept="image/*,video/*" onChange={onFile} style={{ display:'none' }}/>
                  </label>
                  <div className="form-group">
                    <label>Title *</label>
                    <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="form-control" required placeholder="Photo/video title"/>
                  </div>
                  <div className="form-group">
                    <label>Caption</label>
                    <input value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} className="form-control" placeholder="Optional caption"/>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} className="form-control" min="2000" max="2100"/>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} disabled={saving}>
                    {saving?'Uploading...':'⬆️ Upload'}
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
export default AdminGallery;
