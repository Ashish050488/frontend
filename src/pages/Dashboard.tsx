import React, { useState, useEffect } from 'react';
import type { IJob } from '../types';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar'; // Import the new component

const API_URL = `/api/jobs`;

export default function Dashboard() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [selectedCompany, setSelectedCompany] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Build Query with Pagination and Filters
      let url = `${API_URL}?page=${currentPage}&limit=50`;
      
      // If a company is selected, append it to the URL
      if (selectedCompany) {
        url += `&company=${encodeURIComponent(selectedCompany)}`;
      }

      console.log("Fetching:", url); // Debugging log

      const response = await fetch(url);
      
      // Check if response is JSON (Avoiding the <doctype> error)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received HTML instead of JSON. Check Vite Proxy settings.");
      }

      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setTotalPages(data.totalPages);
      
      // Load companies list (only if not already filtering)
      if (!selectedCompany) {
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page or filter changes
  useEffect(() => {
    fetchJobs();
  }, [currentPage, selectedCompany]);

  // Handle Thumbs Up/Down
  const handleFeedback = async (id: string, status: 'up' | 'down') => {
    // 1. Optimistic UI update
    if (status === 'down') {
        // If thumbs down, remove from view immediately
        setJobs(prev => prev.filter(j => j._id !== id));
    } else {
        // If thumbs up, mark it green
        setJobs(prev => prev.map(j => j._id === id ? { ...j, thumbStatus: status } : j));
    }

    // 2. Send to Backend
    try {
        await fetch(`${API_URL}/${id}/feedback`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (error) {
        console.error("Feedback failed", error);
        fetchJobs(); // Revert on error
    }
  };

  const handleCompanySelect = (company: string) => {
      setSelectedCompany(company);
      setCurrentPage(1); // Reset to page 1 when filter changes
  };

  if (loading) return <div className="text-center p-12 text-indigo-600 font-medium">Loading jobs...</div>;

  return (
    <div className="p-6 md:p-8">
      {/* Use the new FilterBar Component */}
      <FilterBar 
        companies={companies} 
        selectedCompany={selectedCompany} 
        onSelectCompany={handleCompanySelect}
        totalJobs={totalJobs}
      />

      {/* JOB LIST */}
      {jobs.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-lg font-medium">No jobs found matching your criteria.</p>
          <button onClick={() => setSelectedCompany('')} className="mt-2 text-indigo-600 hover:underline">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} onFeedback={handleFeedback} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-colors ${currentPage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
          >
            Previous
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-colors ${currentPage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}