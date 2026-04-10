/**
 * Admin Dashboard - Overview stats and recent activity
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Bell, Image, HeartHandshake, Mail, TrendingUp } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{value ?? <div className="spinner spinner-sm" />}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>{label}</div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/stats').then(r => setStats(r.data.stats)).catch(() => {});
  }, []);

  return (
    <div style={layout}>
      <AdminSidebar />
      <main style={main}>
        <div style={header}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back! Here's what's happening.</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '18px', marginBottom: '32px' }}>
          <StatCard icon={<Calendar size={24} color="white" />} label="Active Events" value={stats?.totalEvents} color="linear-gradient(135deg,#FF6B00,#D45500)" delay={0.05} />
          <StatCard icon={<Users size={24} color="white" />} label="Registrations" value={stats?.totalRegistrations} color="linear-gradient(135deg,#800020,#5A0015)" delay={0.1} />
          <StatCard icon={<Bell size={24} color="white" />} label="Announcements" value={stats?.totalAnnouncements} color="linear-gradient(135deg,#2D0080,#5000A0)" delay={0.15} />
          <StatCard icon={<Image size={24} color="white" />} label="Gallery Items" value={stats?.totalGallery} color="linear-gradient(135deg,#006400,#1A5200)" delay={0.2} />
          <StatCard icon={<HeartHandshake size={24} color="white" />} label="Donations Collected" value={stats?.totalDonationAmount != null ? `₹${stats.totalDonationAmount.toLocaleString()}` : null} color="linear-gradient(135deg,#804000,#C06000)" delay={0.25} />
          <StatCard icon={<Mail size={24} color="white" />} label="Unread Messages" value={stats?.unreadContacts} color="linear-gradient(135deg,#005080,#0080C0)" delay={0.3} />
        </div>

        {/* Recent Registrations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} style={{ color: '#FF6B00' }} /> Recent Registrations</h3>
            {stats?.recentRegistrations?.length ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Event', 'Status'].map(h => <th key={h} style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {stats.recentRegistrations.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 6px', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '10px 6px', color: 'var(--text-muted)' }}>{r.event?.title || '-'}</td>
                      <td style={{ padding: '10px 6px' }}><span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', padding: '2px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 600 }}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No registrations yet</p>}
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><HeartHandshake size={18} style={{ color: '#FF6B00' }} /> Recent Donations</h3>
            {stats?.recentDonations?.length ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Name', 'Amount', 'Method'].map(h => <th key={h} style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {stats.recentDonations.map(d => (
                    <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 6px', fontWeight: 500 }}>{d.name}</td>
                      <td style={{ padding: '10px 6px', color: '#FF6B00', fontWeight: 700 }}>₹{d.amount.toLocaleString()}</td>
                      <td style={{ padding: '10px 6px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{d.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No donations yet</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

const layout = { display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' };
const main   = { flex: 1, padding: '28px', overflow: 'auto' };
const header = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' };

export default AdminDashboard;
