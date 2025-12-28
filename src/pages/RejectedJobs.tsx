import React, { useState } from 'react';
import type { IJob } from '../types';
import JobCard from '../components/JobCard';

export default function RejectedJobs() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(false);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check against the env variable
    if (password === ADMIN_PASSWORD) { 
        setIsAuthenticated(true);
        fetchRejectedJobs();
    } else {
        alert("Incorrect Password");
    }
  };

  const fetchRejectedJobs = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/jobs/rejected');
        const data = await res.json();
        setJobs(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
      // 1. Optimistic remove from list
      setJobs(prev => prev.filter(j => j._id !== id));
      
      // 2. API Call
      await fetch(`/api/jobs/${id}/feedback`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: null }) // Reset status to null
      });
  };

  // --- Login Screen ---
  if (!isAuthenticated) {
      return (
          <div className="flex flex-col justify-center items-center h-[60vh]">
              <div className="bg-white p-8 rounded-xl shadow-2xl border w-96">
                  <h2 className="text-2xl font-bold text-red-600 mb-6 text-center">Restricted Area</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Enter Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          Access Rejected Jobs
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  // --- Main Content ---
  return (
    <div className="p-6 md:p-8">
        <div className="mb-6 pb-4 border-b border-red-100">
            <h2 className="text-2xl font-semibold text-red-700">🗑️ Rejected Jobs</h2>
            <p className="text-sm text-gray-500">{jobs.length} jobs hidden from main feed.</p>
        </div>

        {loading ? <p>Loading...</p> : (
            <div className="space-y-4">
                {jobs.map(job => (
                    <JobCard 
                        key={job._id} 
                        job={job} 
                        isRejectedView={true} 
                        onRestore={handleRestore} 
                    />
                ))}
            </div>
        )}
    </div>
  );
}