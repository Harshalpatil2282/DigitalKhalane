/**
 * Admin Registrations - View and export as CSV
 */
import React, { useState, useEffect } from 'react';
import { Download, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  const load = () => {
    setLoading(true);
    const params = eventFilter ? `?event=${eventFilter}` : '';
    Promise.all([API.get(`/registrations${params}`), API.get('/events')])
      .then(([r, e]) => { setRegistrations(r.data.registrations || []); setEvents(e.data.events || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [eventFilter]);

  const del = async id => {
    if (!window.confirm('Delete?')) return;
    await API.delete(`/registrations/${id}`); toast.success('Deleted'); load();
  };

  const exportCSV = async () => {
    try {
      const res = await API.get('/registrations/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = 'registrations.csv'; a.click();
      URL.revokeObjectURL(url); toast.success('CSV downloaded!');
    } catch { toast.error('Export failed'); }
  };

  const filtered = registrations.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) || r.phone?.includes(search)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Registrations</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{registrations.length} total participants</p>
          </div>
          <button onClick={exportCSV} className="btn btn-gold"><Download size={18} /> Export CSV</button>
        </div>
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '10px 14px', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone..." style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }} />
          </div>
          <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} className="form-control" style={{ maxWidth: '240px' }}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
        </div>
        {loading ? <div className="loading-page"><div className="spinner" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Name','Phone','Email','Village','Event','Registered','Status',''].map(h => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No registrations found</td></tr>
                  : filtered.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{r.name}</td>
                      <td style={{ padding: '12px 14px' }}>{r.phone}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{r.email}</td>
                      <td style={{ padding: '12px 14px' }}>{r.village || '-'}</td>
                      <td style={{ padding: '12px 14px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.event?.title || '-'}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: r.status === 'confirmed' ? 'rgba(34,197,94,0.12)' : 'rgba(200,150,0,0.12)', color: r.status === 'confirmed' ? '#16a34a' : '#CA8A04', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{r.status}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button onClick={() => del(r._id)} style={{ background: 'rgba(200,0,0,0.08)', border: '1px solid rgba(200,0,0,0.2)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: '#c00' }}><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
export default AdminRegistrations;
