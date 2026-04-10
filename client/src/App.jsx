/**
 * Main App Component
 * Defines all routes for user and admin sides
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import WelcomeModal from './components/WelcomeModal';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home          from './pages/user/Home';
import Events        from './pages/user/Events';
import EventDetail   from './pages/user/EventDetail';
import Schedule      from './pages/user/Schedule';
import Gallery       from './pages/user/Gallery';
import Announcements from './pages/user/Announcements';
import Registration  from './pages/user/Registration';
import Donation      from './pages/user/Donation';
import Contact       from './pages/user/Contact';

// Admin Pages
import AdminLogin         from './pages/admin/AdminLogin';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminEvents        from './pages/admin/AdminEvents';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminGallery       from './pages/admin/AdminGallery';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminDonations     from './pages/admin/AdminDonations';
import AdminContent       from './pages/admin/AdminContent';

// User-facing layout wrapper
const UserLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <LanguageProvider>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Welcome modal shown once per session */}
          <WelcomeModal />

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontFamily: 'Poppins, sans-serif',
              },
            }}
          />

          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<UserLayout><Home /></UserLayout>} />
            <Route path="/events" element={<UserLayout><Events /></UserLayout>} />
            <Route path="/events/:id" element={<UserLayout><EventDetail /></UserLayout>} />
            <Route path="/schedule" element={<UserLayout><Schedule /></UserLayout>} />
            <Route path="/gallery" element={<UserLayout><Gallery /></UserLayout>} />
            <Route path="/announcements" element={<UserLayout><Announcements /></UserLayout>} />
            <Route path="/register" element={<UserLayout><Registration /></UserLayout>} />
            <Route path="/donate" element={<UserLayout><Donation /></UserLayout>} />
            <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />

            {/* ── Admin Routes ── */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard"     element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/events"        element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
            <Route path="/admin/announcements" element={<ProtectedRoute><AdminAnnouncements /></ProtectedRoute>} />
            <Route path="/admin/gallery"       element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
            <Route path="/admin/registrations" element={<ProtectedRoute><AdminRegistrations /></ProtectedRoute>} />
            <Route path="/admin/donations"     element={<ProtectedRoute><AdminDonations /></ProtectedRoute>} />
            <Route path="/admin/content"       element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
