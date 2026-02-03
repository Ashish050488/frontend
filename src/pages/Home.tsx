import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import JobCard from '../components/JobCard';
import DirectoryCard from '../components/DirectoryCard';
import type { IJob, ICompany } from '../types';

export default function Home() {
   
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState(true);

  // --- NEWSLETTER STATE ---
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subMessage, setSubMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
 useEffect(() => {
    document.title = "English-Speaking Jobs in Germany | No German Required";
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Latest Jobs (limit 9)
        const jobRes = await fetch('/api/jobs?limit=9');
        const jobData = await jobRes.json();
        setJobs(jobData.jobs || []);

        // 2. Fetch Companies (Show top 8 for the showcase)
        const dirRes = await fetch('/api/jobs/directory');
        const dirData = await dirRes.json();
        if (Array.isArray(dirData)) {
            setCompanies(dirData.slice(0, 8)); 
        }
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // --- NEWSLETTER HANDLER ---
  const handleSubscribe = async (e: FormEvent) => {
      e.preventDefault();
      if(!email) return;
      setSubmitting(true);
      setSubMessage(null);

      try {
          const res = await fetch('/api/users/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, categories: ['Tech', 'Business'], frequency: 'weekly' })
          });
          
          if(res.ok) {
              setSubMessage({ type: 'success', text: "Success! You're on the list." });
              setEmail('');
          } else {
               setSubMessage({ type: 'error', text: "Something went wrong. Please try again." });
          }
      } catch (err) {
           setSubMessage({ type: 'error', text: "Network error. Please try again later." });
      } finally {
          setSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <div className="bg-[#0f172a] text-white py-24 px-6 text-center border-b border-slate-800">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            English Speaking Jobs in  <span className="text-[#3b82f6]">Germany</span>
        </h1>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Curated english friendly roles from real company carrer pages. <br/> No recruiters, No <span className="text-[#3b82f6]">German</span> requied
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/directory" className="bg-[#1c54b2] hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
                Browse Companies
            </Link>
            <Link to="/jobs" className="bg-white text-slate-900 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-bold transition-all">
                View Latest Jobs
            </Link>
        </div>
      </div>

      {/* 2. COMPANY SHOWCASE */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Trusted companies hiring English-speaking roles in Germany
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {companies.map(c => (
                    <DirectoryCard key={c.companyName} company={c} />
                ))}
            </div>

            <div className="text-center">
                <Link to="/directory" className="inline-flex items-center text-[#1c54b2] font-bold hover:underline transition-colors text-sm">
                    See full directory <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </div>
      </div>

      {/* 3. ✅ UPDATED NEWSLETTER SECTION (Better UI) */}
      <div className="bg-[#1c54b2] text-white py-20 relative overflow-hidden">
        {/* Background Pattern Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex p-4 bg-white/10 rounded-full mb-6 ring-1 ring-white/20 backdrop-blur-sm">
                <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Never miss an English job drop.
            </h2>
            <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                Join 2,000+ professionals. We send a curated list of new "No German Required" jobs to your inbox every week. Zero spam.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-lg mx-auto">
                <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                    className="w-full px-6 py-4 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium shadow-xl border-0"
                />
                <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 bg-[#0f172a] hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-xl whitespace-nowrap disabled:opacity-70 shrink-0"
                >
                    {submitting ? 'Joining...' : 'Subscribe'}
                </button>
            </form>

            {/* Messages */}
            {subMessage && (
                <div className={`mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-sm animate-fade-in-up ${
                    subMessage.type === 'success' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                    {subMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {subMessage.text}
                </div>
            )}
            
            <p className="text-xs text-blue-200/80 mt-8">
                Unsubscribe at any time. We respect your inbox.
            </p>
        </div>
      </div>

      {/* 4. LATEST JOBS FEED */}
      <div className="max-w-5xl mx-auto px-6 py-24 bg-slate-50">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Fresh Opportunities</h2>
                <p className="text-slate-500 mt-2">Latest verified English-speaking roles.</p>
            </div>
            <Link to="/jobs" className="hidden md:flex items-center font-bold text-[#1c54b2] hover:text-blue-800 transition-colors">
                View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 gap-4">
                {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"></div>)}
            </div>
        ) : (
            <div className="space-y-4">
                {jobs.map(job => (
                    <JobCard key={job._id} job={job} />
                ))}
            </div>
        )}

        <div className="mt-12 text-center">
            <Link to="/jobs" className="inline-block bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-bold transition-all shadow-sm hover:shadow-md">
                Load More Jobs
            </Link>
        </div>
      </div>

    </div>
  );
}