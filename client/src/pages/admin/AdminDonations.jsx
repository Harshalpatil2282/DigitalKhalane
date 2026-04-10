/**
 * Admin Donations - View all donations
 */
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/donations').then(r => { setDonations(r.data.donations || []); setTotal(r.data.total || 0); }).finally(() => setLoading(false));
  }, []);

  const exportCSV = async () => {
    try {
      const res = await API.get('/donations/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a'); a.href = url; a.download = 'donations.csv'; a.click();
      URL.revokeObjectURL(url); toast.success('Exported!');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Donations</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{donations.length} donors · Total: <strong style={{ color: '#FF6B00' }}>₹{total.toLocaleString()}</strong></p>
          </div>
          <button onClick={exportCSV} className="btn btn-gold"><Download size={18} /> Export CSV</button>
        </div>

        {/* Summary Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.08), rgba(255,215,0,0.06))', border: '1.5px solid rgba(255,107,0,0.2)', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '48px' }}>💛</div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FF6B00' }}>₹{total.toLocaleString()}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Total donations received from {donations.length} generous donors</div>
          </div>
        </div>

        {loading ? <div className="loading-page"><div className="spinner" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Name','Email','Phone','Village','Amount','Method','Transaction ID','Date','Status'].map(h => (
                    <th key={h} style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.length === 0
                  ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No donations yet</td></tr>
                  : donations.map(d => (
                    <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600 }}>{d.name}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{d.email}</td>
                      <td style={{ padding: '12px 10px' }}>{d.phone || '-'}</td>
                      <td style={{ padding: '12px 10px' }}>{d.village || '-'}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: '#FF6B00' }}>₹{d.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px', textTransform: 'capitalize' }}>{d.paymentMethod}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{d.transactionId || '-'}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ background: d.status === 'completed' ? 'rgba(34,197,94,0.12)' : 'rgba(200,150,0,0.12)', color: d.status === 'completed' ? '#16a34a' : '#CA8A04', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{d.status}</span>
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
export default AdminDonations;
