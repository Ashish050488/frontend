import React, { useState } from 'react';
import type { IJob } from '../types';
import JobCard from '../components/JobCard';

export default function ReviewQueue() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { 
        setIsAuthenticated(true);
        fetchReviewQueue();
    } else {
        alert("Incorrect Password");
    }
  };

  const fetchReviewQueue = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/jobs/admin/review');
        const data = await res.json();
        // The API returns { jobs: [], totalJobs: ... }
        setJobs(data.jobs || []);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleDecision = async (id: string, decision: 'accept' | 'reject') => {
      // 1. Optimistic UI update: Remove from list immediately
      setJobs(prev => prev.filter(j => j._id !== id));
      
      // 2. Send to API
      try {
          await fetch(`/api/jobs/admin/decision/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ decision })
          });
      } catch (error) {
          console.error("Failed to submit decision", error);
          alert("Error submitting decision. Refresh page.");
      }
  };

  // --- Login Screen (Reused style from RejectedJobs) ---
  if (!isAuthenticated) {
      return (
          <div className="flex flex-col justify-center items-center h-[60vh]">
              <div className="bg-white p-8 rounded-xl shadow-2xl border w-96">
                  <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Admin Login</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Enter Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Access Review Queue
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  // --- Main Content ---
  return (
    <div className="p-6 md:p-8">
        <div className="mb-6 pb-4 border-b border-indigo-100 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-semibold text-indigo-800">📋 Job Review Queue</h2>
                <p className="text-sm text-gray-500">{jobs.length} jobs waiting for your approval.</p>
            </div>
            <button 
                onClick={fetchReviewQueue}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
                Refresh List ⟳
            </button>
        </div>

        {loading ? (
            <div className="text-center py-12 text-gray-500">Loading queue...</div>
        ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-green-50 rounded-xl border border-green-200">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-green-800">All caught up!</h3>
                <p className="text-green-600">No pending jobs to review right now.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {jobs.map(job => (
                    <JobCard 
                        key={job._id} 
                        job={job} 
                        isReviewMode={true} 
                        onDecision={handleDecision} 
                    />
                ))}
            </div>
        )}
    </div>
  );
}