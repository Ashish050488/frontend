import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Database, Cpu, ClipboardList, CheckCircle, RefreshCw } from 'lucide-react';

interface DailyStats {
  connectedSources: number;
  jobsScraped: number;
  jobsSentToAI: number;
  jobsPendingReview: number;
  jobsPublished: number;
}

export default function AdminDashboard() {
  const { token } = useAuth(); // Ensure you have token for auth
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch from our new independent route
      const res = await fetch('/api/analytics/daily', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900">System Analytics</h1>
                <p className="text-slate-500 mt-1">Real-time metrics for today's scraper run.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={fetchStats} className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <Link to="/review" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Go to Review Queue
                </Link>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* 1. Connected Sources */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
                    <Server className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">
                    {stats?.connectedSources || 0}
                </h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Career Pages</p>
            </div>

            {/* 2. Jobs Scraped */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl mb-4">
                    <Database className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">
                    {stats?.jobsScraped || 0}
                </h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Raw Data (24h)</p>
            </div>

            {/* 3. Sent to AI */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mb-4">
                    <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">
                    {stats?.jobsSentToAI || 0}
                </h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI Processed</p>
            </div>

            {/* 4. Pending Review */}
            <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl mb-4">
                    <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">
                    {stats?.jobsPendingReview || 0}
                </h3>
                <p className="text-sm font-bold text-orange-400 uppercase tracking-wider">Manual Review</p>
            </div>

            {/* 5. Published */}
            <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <div className="p-3 bg-green-50 text-green-600 rounded-xl mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-1">
                    {stats?.jobsPublished || 0}
                </h3>
                <p className="text-sm font-bold text-green-400 uppercase tracking-wider">Live Jobs</p>
            </div>

        </div>

        {/* Additional Info / Charts placeholder */}
        <div className="mt-10 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">System Status</h3>
            <p className="text-slate-500">
                The scraper runs automatically. Metrics reset daily at 00:00 UTC. 
                Data shown is for <strong>{new Date().toLocaleDateString()}</strong>.
            </p>
        </div>
        
      </div>
    </div>
  );
}