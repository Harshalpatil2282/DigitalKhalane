/**
 * Admin Content Manager - Edit homepage CMS content
 */
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../services/api';

const AdminContent = () => {
  const [form, setForm] = useState({
    festivalDate: '', festivalYear: '', heroTitle: '', heroSubtitle: '',
    historyTitle: '', historyContent: '', contactEmail: '', contactPhone: '',
    contactAddress: '', bankName: '', accountNumber: '', ifscCode: '', upiId: '',
    facebookUrl: '', instagramUrl: '', youtubeUrl: '', whatsappNumber: '', mapEmbedUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/content').then(r => {
      const c = r.data.content;
      setForm({
        festivalDate: c.festivalDate ? c.festivalDate.slice(0, 10) : '',
        festivalYear: c.festivalYear || '',
        heroTitle: c.heroTitle || '',
        heroSubtitle: c.heroSubtitle || '',
        historyTitle: c.historyTitle || '',
        historyContent: c.historyContent || '',
        contactEmail: c.contactEmail || '',
        contactPhone: c.contactPhone || '',
        contactAddress: c.contactAddress || '',
        bankName: c.bankName || '',
        accountNumber: c.accountNumber || '',
        ifscCode: c.ifscCode || '',
        upiId: c.upiId || '',
        facebookUrl: c.facebookUrl || '',
        instagramUrl: c.instagramUrl || '',
        youtubeUrl: c.youtubeUrl || '',
        whatsappNumber: c.whatsappNumber || '',
        mapEmbedUrl: c.mapEmbedUrl || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      await API.put('/content', form);
      toast.success('Content updated successfully!');
    } catch { toast.error('Update failed'); } finally { setSaving(false); }
  };

  const Section = ({ title, children }) => (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px', color: '#FF6B00', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Content Manager</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Edit homepage and festival settings</p>
          </div>
        </div>
        {loading ? <div className="loading-page"><div className="spinner" /></div> : (
          <form onSubmit={onSubmit} style={{ maxWidth: '800px' }}>
            <Section title="🎉 Festival Settings">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Festival Date</label>
                  <input name="festivalDate" type="date" value={form.festivalDate} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Festival Year</label>
                  <input name="festivalYear" type="number" value={form.festivalYear} onChange={onChange} className="form-control" />
                </div>
              </div>
            </Section>

            <Section title="🦸 Hero Section">
              <div className="form-group">
                <label>Hero Title (Hindi/English)</label>
                <input name="heroTitle" value={form.heroTitle} onChange={onChange} className="form-control" placeholder="खलाने यात्रा उत्सव" />
              </div>
              <div className="form-group">
                <label>Hero Subtitle</label>
                <input name="heroSubtitle" value={form.heroSubtitle} onChange={onChange} className="form-control" />
              </div>
            </Section>

            <Section title="🛕 History / About Section">
              <div className="form-group">
                <label>History Title</label>
                <input name="historyTitle" value={form.historyTitle} onChange={onChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>History Content (use blank lines for paragraphs)</label>
                <textarea name="historyContent" value={form.historyContent} onChange={onChange} className="form-control" rows={8} />
              </div>
            </Section>

            <Section title="📞 Contact Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Email</label>
                  <input name="contactEmail" value={form.contactEmail} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="contactPhone" value={form.contactPhone} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Address</label>
                  <input name="contactAddress" value={form.contactAddress} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Google Map Embed URL</label>
                  <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={onChange} className="form-control" placeholder="https://www.google.com/maps/embed?..." />
                </div>
              </div>
            </Section>

            <Section title="🏦 Donation / Bank Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input name="bankName" value={form.bankName} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input name="accountNumber" value={form.accountNumber} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>IFSC Code</label>
                  <input name="ifscCode" value={form.ifscCode} onChange={onChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>UPI ID</label>
                  <input name="upiId" value={form.upiId} onChange={onChange} className="form-control" />
                </div>
              </div>
            </Section>

            <Section title="📱 Social Media Links">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[['facebookUrl','Facebook URL'],['instagramUrl','Instagram URL'],['youtubeUrl','YouTube URL'],['whatsappNumber','WhatsApp Number']].map(([name, label]) => (
                  <div key={name} className="form-group">
                    <label>{label}</label>
                    <input name={name} value={form[name]} onChange={onChange} className="form-control" placeholder={`https://...`} />
                  </div>
                ))}
              </div>
            </Section>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={saving}>
              {saving ? 'Saving...' : <><Save size={18} /> Save All Changes</>}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};
export default AdminContent;
