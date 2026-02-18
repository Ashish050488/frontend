import { useState, useEffect } from 'react';
import { FileText, RefreshCw, Search, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Container, PageHeader, Button, Input, Badge, Card, EmptyState } from '../components/ui';

interface Evidence {
  location_reason: string;
  english_reason: string;
  german_reason: string;
}

interface JobLog {
  _id: string;
  JobID: string;
  JobTitle: string;
  Company: string;
  GermanRequired: boolean;
  EnglishSpeaking: boolean;
  ConfidenceScore: number;
  LocationClassification: string;
  Status: string;
  FinalDecision: string;
  scrapedAt: string;
  Description: string;
  Evidence?: Evidence;
}

export default function JobTestLogs() {
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDecision, setFilterDecision] = useState<'all' | 'accepted' | 'rejected'>('all');
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({});

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs/test-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Fetched logs:', data); // Debug
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) { 
      console.error('Error fetching logs:', e);
    }
    finally { setLoading(false); }
  };

  const filtered = logs.filter(log => {
    const matchesSearch = log.JobTitle?.toLowerCase().includes(search.toLowerCase()) ||
                         log.Company?.toLowerCase().includes(search.toLowerCase()) ||
                         log.JobID?.includes(search);
    const matchesDecision = filterDecision === 'all' || log.FinalDecision === filterDecision;
    return matchesSearch && matchesDecision;
  });

  const toggleDesc = (id: string) => {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const StatusBadge = ({ decision }: { decision: string }) => {
    return <Badge variant={decision === 'accepted' ? 'green' : 'red'}>
      {decision === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
    </Badge>;
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <Container>
          <PageHeader
            label="Admin Diagnostics"
            title={<span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={22} color="var(--acid)" />AI Test Logs</span>}
            subtitle={`${filtered.length} jobs analyzed (accepted + rejected with AI evidence)`}
            actions={<Button variant="ghost" size="sm" onClick={fetchLogs} loading={loading}><RefreshCw size={13} />Refresh</Button>}
          />
        </Container>
      </div>

      <Container style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <Input
              placeholder="Search by title, company, JobID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all', 'accepted', 'rejected'] as const).map(decision => (
              <button
                key={decision}
                onClick={() => setFilterDecision(decision)}
                style={{
                  padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border)',
                  background: filterDecision === decision ? 'var(--acid-dim)' : 'transparent',
                  color: filterDecision === decision ? 'var(--acid)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                  transition: 'all 0.15s', fontFamily: 'inherit', textTransform: 'capitalize'
                }}
              >
                {decision}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FileText size={32} />} title="No logs found" body={logs.length === 0 ? "No test logs in database yet. Run the scraper first." : "Try adjusting your filters."} />
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(log => (
              <Card key={log._id} style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                      {log.JobTitle}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {log.Company} · JobID: <code style={{ background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem' }}>{log.JobID}</code>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <StatusBadge decision={log.FinalDecision} />
                    <Badge variant={log.ConfidenceScore >= 0.9 ? 'green' : log.ConfidenceScore >= 0.7 ? 'neutral' : 'red'}>
                      {Math.round(log.ConfidenceScore * 100)}% confidence
                    </Badge>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16, padding: '14px', background: 'var(--bg-surface-2)', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>English Speaking</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {log.EnglishSpeaking ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: log.EnglishSpeaking ? 'var(--success)' : 'var(--danger)' }}>
                        {log.EnglishSpeaking ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>German Required</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {log.GermanRequired ? <AlertCircle size={16} color="var(--danger)" /> : <CheckCircle size={16} color="var(--success)" />}
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: log.GermanRequired ? 'var(--danger)' : 'var(--success)' }}>
                        {log.GermanRequired ? 'Yes (BLOCKED)' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Location</p>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{log.LocationClassification}</span>
                  </div>
                </div>

                {log.Evidence && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>AI Evidence & Reasoning</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        ['📍 Location', log.Evidence.location_reason],
                        ['🇬🇧 English', log.Evidence.english_reason],
                        ['🇩🇪 German', log.Evidence.german_reason]
                      ].map(([label, reason]) => (
                        <div key={label as string} style={{ padding: '10px 14px', background: 'var(--bg-surface-2)', borderLeft: '3px solid var(--acid)', borderRadius: '0 8px 8px 0' }}>
                          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                            {reason || 'No evidence provided'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Description */}
                {log.Description && (
                  <div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      maxHeight: expandedDesc[log._id] ? 'none' : '100px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'max-height 0.3s ease',
                      background: 'var(--bg-surface-2)',
                      padding: '12px',
                      borderRadius: 8,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {log.Description}
                      {!expandedDesc[log._id] && log.Description.length > 400 && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 40,
                          background: 'linear-gradient(to bottom, transparent, var(--bg-surface-2))'
                        }} />
                      )}
                    </div>
                    {log.Description.length > 400 && (
                      <button
                        onClick={() => toggleDesc(log._id)}
                        style={{
                          marginTop: 8,
                          background: 'none',
                          border: 'none',
                          color: 'var(--acid)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: 0,
                          fontFamily: 'inherit',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={e => ((e.currentTarget.style.opacity = '0.7'))}
                        onMouseLeave={e => ((e.currentTarget.style.opacity = '1'))}
                      >
                        {expandedDesc[log._id] ? (
                          <>Show less <ChevronUp size={14} /></>
                        ) : (
                          <>View full description <ChevronDown size={14} /></>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}