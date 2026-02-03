import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Building2, ChevronRight, X } from 'lucide-react';
import type { IJob } from '../types';
import JobCard from '../components/JobCard';

interface CompanyStats {
  companyName: string;
  openRoles: number;
}

const API_URL = `/api/jobs`;

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [activeCompanies, setActiveCompanies] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = "Browse English-Speaking Jobs in Germany";
  }, []);
  // Get currently selected company from URL
  const selectedCompany = searchParams.get('company') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Companies (For Sidebar)
        // We fetch the directory but filter client-side for companies with jobs
        const dirRes = await fetch('/api/jobs/directory');
        const dirData = await dirRes.json();
        
        // Filter: Only show companies that actually have open roles (Scraped ones)
        const hiringCompanies = Array.isArray(dirData) 
            ? dirData.filter((c: any) => c.openRoles > 0) 
            : [];
        
        setActiveCompanies(hiringCompanies);

        // 2. Fetch Jobs
        let url = `${API_URL}?limit=100`;
        if (selectedCompany) {
          url += `&company=${encodeURIComponent(selectedCompany)}`;
        }
        const jobRes = await fetch(url);
        const jobData = await jobRes.json();
        setJobs(jobData.jobs || []);
        
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany]);

  const handleFeedback = async (id: string, status: 'up' | 'down') => {
      if (status === 'down') setJobs(prev => prev.filter(j => j._id !== id));
      else setJobs(prev => prev.map(j => j._id === id ? { ...j, thumbStatus: status } : j));
      
      await fetch(`${API_URL}/${id}/feedback`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR (Company List) --- */}
        <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" /> Hiring Partners
                    </h3>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {/* "All Jobs" Option */}
                    <button
                        onClick={() => setSearchParams({})}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                            selectedCompany === '' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        All Jobs
                        {selectedCompany === '' && <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {/* Company List */}
                    {activeCompanies.map(c => (
                        <button
                            key={c.companyName}
                            onClick={() => setSearchParams({ company: c.companyName })}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                                selectedCompany === c.companyName 
                                ? 'bg-blue-50 text-blue-700' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className="truncate">{c.companyName}</span>
                            <span className="bg-slate-100 text-slate-500 text-xs py-0.5 px-1.5 rounded-full">
                                {c.openRoles}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* --- MAIN FEED --- */}
        <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    {selectedCompany ? `${selectedCompany} Roles` : 'Latest Active Jobs'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {jobs.length} verified English-speaking opportunities available.
                </p>
                
                {/* Clear Filter Badge */}
                {selectedCompany && (
                    <button 
                        onClick={() => setSearchParams({})}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors"
                    >
                        Filter: {selectedCompany} <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
                    <p className="text-slate-500">Try selecting a different company or viewing all jobs.</p>
                    <button 
                        onClick={() => setSearchParams({})}
                        className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <JobCard 
                            key={job._id} 
                            job={job} 
                            onFeedback={handleFeedback} 
                        />
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}