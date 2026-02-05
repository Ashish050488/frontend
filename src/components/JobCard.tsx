import { useState } from 'react';
import { MapPin, Calendar, Building2, ExternalLink, Check, X, Undo, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { IJob } from '../types';

interface Props {
  job: IJob;
  isReviewMode?: boolean;
  isRejectedView?: boolean;
  onDecision?: (id: string, decision: 'accept' | 'reject') => void;
  onRestore?: (id: string) => void;
  onFeedback?: (id: string, status: 'up' | 'down') => void;
}

export default function JobCard({ job, isReviewMode, isRejectedView, onDecision, onRestore, onFeedback }: Props) {
  const [imageError, setImageError] = useState(false);

  // ✅ UPDATED: Returns null if date is missing (so we can hide the badge)
  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return null; // Hide badge
    
    const posted = new Date(dateString);
    if (isNaN(posted.getTime())) return null; // Hide badge if invalid date

    const now = new Date();
    const diffTime = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Added today";
    if (diffDays === 1) return "Added 1 day ago";
    return `Added ${diffDays} days ago`;
  };

  // Calculate time once to use in JSX
  const relativeTime = getRelativeTime(job.PostedDate);

  // Helper to get domain for logo
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return 'google.com'; // fallback
    }
  };

  return (
    <div className={`bg-white border rounded-xl p-5 transition-all hover:shadow-md ${
        isReviewMode ? 'border-blue-200 ring-1 ring-blue-50' : 
        isRejectedView ? 'border-red-100 bg-red-50/10' : 'border-slate-200'
    }`}>
      
      <div className="flex gap-4 items-start">
        {/* Logo */}
        <div className="h-12 w-12 shrink-0 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-1">
          {!imageError ? (
            <img 
              src={`https://logo.clearbit.com/${getDomain(job.ApplicationURL)}`} 
              alt={job.Company}
              className="max-h-full max-w-full object-contain"
              onError={() => setImageError(true)} 
            />
          ) : (
            <div className="font-bold text-slate-400 text-lg">
                {job.Company.charAt(0)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <div>
                    <a 
                        href={job.ApplicationURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                        title="Open Job Link"
                    >
                        {job.JobTitle}
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </a>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" /> {job.Company}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.Location}
                        </span>
                        
                        {/* ✅ CONDITIONAL RENDER: Only show if we have a valid time string */}
                        {relativeTime && (
                            <span className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                <Calendar className="w-3.5 h-3.5" /> {relativeTime}
                            </span>
                        )}
                    </div>
                </div>

                {/* Confidence Score (Admin Only) */}
                {isReviewMode && (
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                        job.ConfidenceScore > 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        {job.ConfidenceScore} Match
                    </div>
                )}
            </div>

            <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                {job.Description.substring(0, 180)}...
            </p>

            <div className="flex gap-2 mt-3">
                {job.GermanRequired === false && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        English Only
                    </span>
                )}
                {job.ContractType && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {job.ContractType}
                    </span>
                )}
            </div>
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        
        {isReviewMode && onDecision ? (
            <div className="flex gap-3 w-full">
                <button 
                    onClick={() => onDecision(job._id, 'reject')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-medium text-sm transition-colors"
                >
                    <X className="w-4 h-4" /> Reject
                </button>
                <button 
                    onClick={() => onDecision(job._id, 'accept')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium text-sm transition-colors shadow-sm"
                >
                    <Check className="w-4 h-4" /> Approve
                </button>
            </div>
        ) : isRejectedView && onRestore ? (
            <div className="w-full">
                <button 
                    onClick={() => onRestore(job._id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 font-medium text-sm transition-all"
                >
                    <Undo className="w-4 h-4" /> Restore to Queue
                </button>
            </div>
        ) : (
            <div className="flex w-full justify-between items-center">
                 <a 
                    href={job.ApplicationURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    View Job <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex gap-2">
                    <button 
                        onClick={() => onFeedback && onFeedback(job._id, 'down')}
                        className={`p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors ${job.thumbStatus === 'down' ? 'text-red-500 bg-red-50' : ''}`}
                        title="Report issue"
                    >
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onFeedback && onFeedback(job._id, 'up')}
                        className={`p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-green-500 transition-colors ${job.thumbStatus === 'up' ? 'text-green-500 bg-green-50' : ''}`}
                        title="Good match"
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}