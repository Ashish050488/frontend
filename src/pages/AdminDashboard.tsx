import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Database, Cpu, ClipboardList, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Container, PageHeader, Button, StatCard } from '../components/ui';

interface DailyStats { connectedSources: number; jobsScraped: number; jobsSentToAI: number; jobsPendingReview: number; jobsPublished: number; }

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/analytics/daily', { headers: { 'Authorization': `Bearer ${token}` } });
      const d = await r.json(); setStats(d);
    } catch (e) { console.error('Failed to fetch analytics:', e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, [token]);

  const STATS = [
    { icon: <Server size={18} />, value: stats?.connectedSources ?? 0, label: 'Career Pages', accent: false },
    { icon: <Database size={18} />, value: stats?.jobsScraped ?? 0, label: 'Raw Data (24h)', accent: false },
    { icon: <Cpu size={18} />, value: stats?.jobsSentToAI ?? 0, label: 'AI Processed', accent: false },
    { icon: <ClipboardList size={18} />, value: stats?.jobsPendingReview ?? 0, label: 'Needs Review', accent: true },
    { icon: <CheckCircle size={18} />, value: stats?.jobsPublished ?? 0, label: 'Live Jobs', accent: false },
  ];

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface-solid)', borderBottom: '1.25px solid var(--border)', padding: '32px 0' }}>
        <Container>
          <PageHeader label="System Analytics" title="Daily Overview"
            subtitle={`Metrics for ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            actions={
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="ghost" size="sm" onClick={fetchStats} loading={loading}><RefreshCw size={13} />Refresh</Button>
                <Link to="/review"><Button size="sm">Review Queue <ArrowRight size={13} /></Button></Link>
              </div>
            } />
        </Container>
      </div>
      <Container style={{ padding: '32px 24px' }}>
        {loading
          ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>{[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: 140 }} />)}</div>
          : <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
            {STATS.map(s => <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} accent={s.accent} />)}
          </div>}
        <div style={{ marginTop: 24, padding: '24px', background: 'var(--surface-solid)', border: '1.25px solid var(--border)', borderRadius: 14 }}>
          <p className="font-sketch" style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: 10 }}>System Status</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted-ink)', lineHeight: 1.7 }}>
            The scraper runs automatically. Metrics reset daily at 00:00 UTC. Data shown is for <strong style={{ color: 'var(--ink)' }}>{new Date().toLocaleDateString()}</strong>.
          </p>
        </div>
      </Container>
    </div>
  );
}
