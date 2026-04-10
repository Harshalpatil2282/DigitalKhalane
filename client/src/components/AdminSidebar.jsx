/**
 * AdminSidebar - Admin panel navigation sidebar
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Bell, Image,
  Users, HeartHandshake, FileText, LogOut,
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const links = [
  { to: '/admin/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/events',        icon: Calendar,        label: 'Events' },
  { to: '/admin/announcements', icon: Bell,            label: 'Announcements' },
  { to: '/admin/gallery',       icon: Image,           label: 'Gallery' },
  { to: '/admin/registrations', icon: Users,           label: 'Registrations' },
  { to: '/admin/donations',     icon: HeartHandshake,  label: 'Donations' },
  { to: '/admin/content',       icon: FileText,        label: 'Content' },
];

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3 }}
      style={sidebar}
    >
      {/* Logo */}
      <div style={logoRow}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={logoText}>DigitalKhalane</div>
            <div style={logoSub}>Admin Panel</div>
          </motion.div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={collapseBtn}>
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={userBox}>
          <div style={avatar}>{user?.name?.[0] || 'A'}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#FFF8F0' }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,248,240,0.5)', textTransform: 'uppercase' }}>{user?.role}</div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav style={{ marginTop: '8px', flex: 1 }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({ ...navLink, ...(isActive ? activeLink : {}) })}>
            <Icon size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{label}</motion.span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={logoutBtn}>
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </motion.aside>
  );
};

const sidebar = {
  background: 'linear-gradient(180deg, #1A0A00 0%, #2D0A00 100%)',
  minHeight: '100vh', display: 'flex', flexDirection: 'column',
  borderRight: '1px solid rgba(255,107,0,0.15)',
  overflow: 'hidden', flexShrink: 0,
};
const logoRow = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '20px 16px', borderBottom: '1px solid rgba(255,107,0,0.15)',
};
const logoText = {
  fontWeight: 800, fontSize: '1rem',
  background: 'linear-gradient(135deg, #FF6B00, #FFD700)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
};
const logoSub = { fontSize: '0.65rem', color: 'rgba(255,248,240,0.4)', textTransform: 'uppercase', letterSpacing: '1px' };
const collapseBtn = {
  background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.2)',
  color: '#FF6B00', borderRadius: '8px',
  width: '30px', height: '30px', display: 'flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};
const userBox = {
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '14px 16px', borderBottom: '1px solid rgba(255,107,0,0.1)',
};
const avatar = {
  width: '34px', height: '34px',
  background: 'linear-gradient(135deg, #FF6B00, #FFD700)',
  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, color: '#1A0A00', fontSize: '0.9rem', flexShrink: 0,
};
const navLink = {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '12px 16px', color: 'rgba(255,248,240,0.65)',
  textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500,
  borderLeft: '3px solid transparent', transition: 'all 0.2s',
  whiteSpace: 'nowrap', overflow: 'hidden',
};
const activeLink = {
  color: '#FF6B00', background: 'rgba(255,107,0,0.08)',
  borderLeft: '3px solid #FF6B00',
};
const logoutBtn = {
  display: 'flex', alignItems: 'center', gap: '12px',
  padding: '14px 16px', color: 'rgba(255,100,100,0.8)',
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: '0.88rem', fontWeight: 500, width: '100%',
  borderTop: '1px solid rgba(255,107,0,0.1)',
  whiteSpace: 'nowrap', overflow: 'hidden',
};

export default AdminSidebar;
