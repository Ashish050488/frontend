import { useState, useEffect } from 'react';
import type { IJob } from '../types';
import JobCard from '../components/JobCard';
import { Trash2, RefreshCw } from 'lucide-react';
import { Container, PageHeader, Button, EmptyState } from '../components/ui';

export default function RejectedJobs() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchRejected(); }, []);

  const fetchRejected = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const r = await fetch('/api/jobs/rejected', { headers: { 'Authorization': `Bearer ${token}` } });
      const d = await r.json(); setJobs(Array.isArray(d) ? d : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleRestore = async (id: string) => {
    setJobs(p => p.filter(j => j._id !== id));
    const token = localStorage.getItem('token');
    await fetch(`/api/jobs/${id}/feedback`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status: null }) });
  };

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface-solid)', borderBottom: '1.25px solid var(--border)', padding: '32px 0' }}>
        <Container size="lg">
          <PageHeader label="Admin" title={<span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Trash2 size={22} color="var(--danger)" />Rejected Jobs</span>}
            subtitle={`${jobs.length} jobs in trash`}
            actions={<Button variant="ghost" size="sm" onClick={fetchRejected} loading={loading}><RefreshCw size={13} />Refresh</Button>} />
        </Container>
      </div>
      <Container size="lg" style={{ padding: '32px 24px' }}>
        {loading
          ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 148 }} />)}</div>
          : jobs.length === 0
            ? <EmptyState icon={<Trash2 size={32} />} title="Trash is empty" body="All good — no rejected jobs here." />
            : <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {jobs.map(j => <JobCard key={j._id} job={j} isRejectedView onRestore={handleRestore} />)}
            </div>}
      </Container>
    </div>
  );
}
