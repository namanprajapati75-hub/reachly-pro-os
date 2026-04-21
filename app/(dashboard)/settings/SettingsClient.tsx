"use client";

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Moon, 
  Shield, 
  Smartphone, 
  Globe, 
  Palette,
  Check,
  ChevronRight,
  Monitor,
  Lock,
  Loader2,
  Webhook,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/app/components/ui/ToastProvider';
import { updateSettings } from '@/app/actions/settings';

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState(initialSettings || {
    fullName: "Reachly Administrator",
    email: "admin@reachly.pro",
    bio: "Elite digital marketing agency focused on AI-driven growth systems."
  });

  const tabs = [
    { id: 'profile', icon: <User size={18} />, label: 'Profile' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance' },
    { id: 'api', icon: <Webhook size={18} />, label: 'Integrations & API' },
    { id: 'billing', icon: <Zap size={18} />, label: 'Pricing & Plans' },
    { id: 'security', icon: <Shield size={18} />, label: 'Security' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateSettings(formData);
      if (res.success) {
        setIsSaved(true);
        addToast("Settings successfully saved.", "success");
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        addToast("Failed to save settings.", "error");
      }
    } catch {
      addToast("Failed to save settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      // Send mock webhook payload
      const mockLead = {
        name: `Automated Lead ${Math.floor(Math.random() * 1000)}`,
        email: `webhook-${Date.now()}@test.com`,
        phone: "555-0199",
        company: "Zapier Inc",
        source: "Zapier Webhook"
      };

      const res = await fetch('/api/webhooks/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockLead)
      });
      
      const data = await res.json();
      if (data.success) {
        addToast("Webhook successful! Lead captured via API.", "success");
      } else {
        addToast(`Webhook failed: ${data.error}`, "error");
      }
    } catch (e: any) {
      addToast(`Webhook Error: ${e.message}`, "error");
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      <header>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Preferences</h2>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>Workspace Settings</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }}>
        {/* Navigation Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="glass btn-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '14px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '0.925rem' }}>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-settings-dot"
                  style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}
                />
              )}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="glass" style={{ padding: '3rem', borderRadius: '32px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Profile Information</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Update your personal details and branding preference.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(202, 138, 4, 0.2)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={48} color="var(--primary)" />
                  </div>
                  <div>
                    <button className="glass btn-hover" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 700 }}>
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>
                    <input className="glass" type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', outline: 'none', color: '#fff' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                    <input className="glass" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', outline: 'none', color: '#fff' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bio / Agency Description</label>
                  <textarea className="glass" rows={4} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', outline: 'none', resize: 'none', color: '#fff' }} />
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Appearance Settings</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Customize how Reachly Pro looks on your screen.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                   {[
                     { id: 'dark', label: 'Deep Obsidian', icon: <Moon size={20} />, active: true },
                     { id: 'glass', label: 'Glassmorphic', icon: <Monitor size={20} />, active: false },
                     { id: 'system', label: 'System Sync', icon: <Smartphone size={20} />, active: false }
                   ].map(mode => (
                     <div key={mode.id} className="glass card-hover" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: mode.active ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: mode.active ? 'rgba(250, 204, 21, 0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: mode.active ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {mode.icon}
                        </div>
                        <div style={{ fontWeight: 800 }}>{mode.label}</div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'api' && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Integrations & API</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Manage inbound webhooks for Zapier, Meta, and custom forms.</p>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Webhook size={20} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>Lead Capture Webhook</div>
                       <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>POST requests sent to this URL will automatically create actionable leads inside the CRM.</p>
                       
                       <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                         <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', color: 'var(--primary)', flex: 1 }}>
                           https://yourdomain.com/api/webhooks/leads
                         </code>
                         <button onClick={handleTestWebhook} disabled={isTestingWebhook} className="btn-hover" style={{ padding: '0.75rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           {isTestingWebhook ? <Loader2 size={16} className="spinner"/> : <Zap size={16}/>}
                           Test Flow
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Reachly OS Pricing</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Upgrade your plan to unlock more AI-driven growth features.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', alignItems: 'stretch' }}>
                  {/* STARTER */}
                  <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
                     <div style={{ padding: '4px 12px', background: 'rgba(34, 211, 163, 0.1)', color: 'var(--accent-green)', borderRadius: '100px', fontSize: '0.625rem', fontWeight: 900, alignSelf: 'flex-start', letterSpacing: '0.05em' }}>STARTER</div>
                     <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-outfit)', lineHeight: 1 }}>₹7,000<span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Perfect for businesses starting online lead generation.</p>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Main Features</div>
                        {[
                          'Landing Page', 'WhatsApp Setup', 'Lead Form Integration', 'Monthly Performance Report', 
                          'Basic AI Auto-Reply (FAQ)', 'Up to 100 Leads / Month', 'Basic Follow-Up Templates'
                        ].map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                            <Check size={14} color="var(--accent-green)" /> {f}
                          </div>
                        ))}
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Not Included</div>
                        {[
                          'Full AI Booking Bot', 'Instagram DM Automation', 'Advanced Analytics', 'Unlimited Leads'
                        ].map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                            <ChevronRight size={12} /> {f}
                          </div>
                        ))}
                     </div>
                     <button className="glass btn-hover" style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 800, border: '1px solid var(--border)' }}>SELECT PLAN</button>
                  </div>

                  {/* GROWTH */}
                  <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--primary)', background: 'rgba(250, 204, 21, 0.05)' }}>
                     <div style={{ position: 'absolute', top: '1rem', right: '-1.5rem', background: 'var(--primary)', color: '#000', padding: '4px 30px', transform: 'rotate(45deg)', fontSize: '0.625rem', fontWeight: 900 }}>POPULAR</div>
                     <div style={{ padding: '4px 12px', background: 'rgba(79, 142, 247, 0.1)', color: 'var(--accent-blue)', borderRadius: '100px', fontSize: '0.625rem', fontWeight: 900, alignSelf: 'flex-start', letterSpacing: '0.05em' }}>GROWTH</div>
                     <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-outfit)', lineHeight: 1 }}>₹15,000<span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span></div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Automate enquiries, convert more leads, grow faster.</p>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Everything in Starter, plus:</div>
                        {[
                          'Full WhatsApp Automation', 'Instagram DM Automation', 'AI Lead Scoring', 'Smart Follow-Up Sequences',
                          'Weekly Reports', '5–7 Reels / Month', 'Up to 500 Leads / Month', 'Priority Support', 'Monthly Optimization Calls'
                        ].map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                            <Check size={14} color="var(--primary)" /> {f}
                          </div>
                        ))}
                     </div>
                     <button className="btn-hover" style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 900, border: 'none', background: 'var(--primary)', color: '#000' }}>UPGRADE NOW</button>
                  </div>

                  {/* CUSTOM */}
                  <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)' }}>
                     <div style={{ padding: '4px 12px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', borderRadius: '100px', fontSize: '0.625rem', fontWeight: 900, alignSelf: 'flex-start', letterSpacing: '0.05em' }}>ENTERPRISE</div>
                     <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-outfit)', lineHeight: 1 }}>Custom</div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>Tailored growth systems built for scale.</p>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bespoke Solutions</div>
                        {[
                          'Everything in Growth', 'Custom Funnels', 'Ads Integration', 'Custom Dashboards',
                          'API Integrations', 'Unlimited / Negotiated Leads', 'White-Glove Onboarding', '15 Reels / Month'
                        ].map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                            <Check size={14} color="#fff" /> {f}
                          </div>
                        ))}
                     </div>
                     <button className="glass btn-hover" style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 800, border: '1px solid var(--border)' }}>TALK TO US</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Security & Privacy</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Manage your account password and authentication factors.</p>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Lock size={24} color="#22c55e" />
                  </div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 800 }}>Two-Factor Authentication</div>
                     <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Significantly increase account security with an MFA code.</p>
                  </div>
                  <button className="glass btn-hover" style={{ padding: '0.625rem 1.25rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ENABLE
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '2rem' }}>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: isSaved ? '#22c55e' : 'var(--primary)',
                color: '#000',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '0.925rem',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease',
                opacity: isSaving ? 0.7 : 1
              }}
            >
              {isSaving ? <Loader2 size={20} className="spinner" /> : (isSaved ? <Check size={20} /> : null)}
              {isSaving ? 'SAVING...' : (isSaved ? 'SETTINGS SAVED' : 'SAVE CHANGES')}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
