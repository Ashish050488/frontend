import { useState } from 'react';
import { MapPin, Building2, ExternalLink, Check, X, Undo, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import type { IJob } from '../types';
import { Badge, Button } from './ui';

interface Props {
  job: IJob; isReviewMode?: boolean; isRejectedView?: boolean;
  onDecision?: (id: string, d: 'accept' | 'reject') => void;
  onRestore?: (id: string) => void;
  onFeedback?: (id: string, s: 'up' | 'down') => void;
}

export default function JobCard({ job, isReviewMode, isRejectedView, onDecision, onRestore, onFeedback }: Props) {
  const [imgErr, setImgErr] = useState(false);

  const relTime = (d: string | null) => {
    if (!d) return null;
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (isNaN(diff)) return null;
    if (diff <= 0) return 'Today';
    if (diff === 1) return '1d ago';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  const domain = (url: string) => { try { return new URL(url).hostname.replace('www.', ''); } catch { return 'google.com'; } };
  const rt = relTime(job.PostedDate);

  return (
    <div className="job-card anim-up" style={{
      background: 'var(--surface-solid)', border: '1.25px solid var(--border)', borderRadius: 14,
      transition: 'border-color 0.25s,transform 0.25s,box-shadow 0.25s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateX(3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {/* Logo */}
          <div style={{ width: 44, height: 44, flexShrink: 0, background: 'var(--paper2)', border: '1.25px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 6 }}>
            {!imgErr
              ? <img src={`https://logo.clearbit.com/${domain(job.ApplicationURL)}`} alt={job.Company} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={() => setImgErr(true)} />
              : <span className="font-sketch" style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 700 }}>{job.Company.charAt(0)}</span>
            }
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <a href={job.ApplicationURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.22s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}>
                    {job.JobTitle} <ExternalLink size={12} style={{ color: 'var(--subtle-ink)', flexShrink: 0 }} />
                  </h3>
                </a>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px', marginTop: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted-ink)' }}><Building2 size={12} />{job.Company}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted-ink)' }}><MapPin size={12} />{job.Location}</span>
                  {rt && <Badge variant="primary" style={{ fontSize: '0.75rem' }}><Clock size={9} />{rt}</Badge>}
                </div>
              </div>
              {isReviewMode && <Badge variant={job.ConfidenceScore > 80 ? 'green' : 'yellow'}>{job.ConfidenceScore}% match</Badge>}
            </div>

            {job.Description && (
              <p style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--subtle-ink)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {job.Description.substring(0, 200)}…
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {job.GermanRequired === false && <Badge variant="primary">🇬🇧 English Only</Badge>}
              {job.ContractType && job.ContractType !== 'N/A' && <Badge variant="neutral">{job.ContractType}</Badge>}
              {job.Department && job.Department !== 'N/A' && job.Department !== '' && <Badge variant="neutral">{job.Department}</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ padding: '12px 24px', borderTop: '1.25px solid var(--border)', background: 'var(--paper2)', borderRadius: '0 0 14px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isReviewMode && onDecision ? (
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <Button variant="danger" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onDecision(job._id, 'reject')}><X size={13} />Reject</Button>
            <Button variant="success" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onDecision(job._id, 'accept')}><Check size={13} />Approve</Button>
          </div>
        ) : isRejectedView && onRestore ? (
          <Button variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onRestore(job._id)}><Undo size={13} />Restore to Queue</Button>
        ) : (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href={job.ApplicationURL} target="_blank" rel="noopener noreferrer">
              <Button size="sm">Apply Now <ExternalLink size={11} /></Button>
            </a>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['down', 'up'] as const).map(s => (
                <button key={s} onClick={() => onFeedback && onFeedback(job._id, s)}
                  style={{ width: 32, height: 32, borderRadius: 7, border: '1.25px solid var(--border)', background: job.thumbStatus === s ? (s === 'up' ? 'var(--success-soft)' : 'var(--danger-soft)') : 'transparent', color: job.thumbStatus === s ? (s === 'up' ? 'var(--success)' : 'var(--danger)') : 'var(--muted-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.22s' }}>
                  {s === 'up' ? <ThumbsUp size={13} /> : <ThumbsDown size={13} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
