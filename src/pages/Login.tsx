import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { Button, Input, FormField, Alert } from '../components/ui';
import { BRAND } from '../theme/brand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Login failed');
      login(d.token, d.user); nav(d.user.role === 'admin' ? '/review' : '/');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const TRUST = [
    { icon: <CheckCircle size={14} />, text: 'No German required — verified listings' },
    { icon: <Lock size={14} />, text: 'Secure login with encrypted credentials' },
    { icon: <Briefcase size={14} />, text: 'Admin access to manage the job board' },
  ];

  return (
    <div style={{ minHeight: '90vh', display: 'flex', background: 'var(--paper)' }}>
      {/* Brand panel (desktop only) */}
      <div className="hidden md:flex" style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px', background: 'var(--paper2)', borderRight: '1.25px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 360, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, background: 'var(--primary-soft)', border: '1.25px solid var(--primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 24px' }}>
            <Briefcase size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 12 }}>Welcome back</h2>
          <p style={{ color: 'var(--muted-ink)', marginBottom: 36, lineHeight: 1.65, fontSize: '0.95rem' }}>{BRAND.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
            {TRUST.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-ink)', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--primary)', flexShrink: 0 }}>{t.icon}</span>{t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="anim-scale" style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile brand header */}
          <div className="md:hidden" style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 46, height: 46, background: 'var(--primary-soft)', border: '1.25px solid var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 14px' }}><Briefcase size={20} /></div>
          </div>

          <div style={{ background: 'var(--surface-solid)', border: '1.25px solid var(--border)', borderRadius: 18, padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 6 }}>Sign in</h2>
              <p style={{ color: 'var(--subtle-ink)', fontSize: '0.9rem' }}>Access your {BRAND.appName} account</p>
            </div>
            {error && <div style={{ marginBottom: 18 }}><Alert type="error">{error}</Alert></div>}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <FormField label="Email"><Input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></FormField>
              <FormField label="Password"><Input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></FormField>
              <Button loading={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '13px' }}>Sign In <ArrowRight size={14} /></Button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.875rem', color: 'var(--subtle-ink)' }}>
              No account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
