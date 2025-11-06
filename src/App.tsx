import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom';

// --- Types ---
interface IJob {
  _id: string;
  JobID: string;
  JobTitle: string;
  ApplicationURL: string;
  Company: string;
  Location: string;
  Department: string;
  GermanRequired: boolean;
  PostedDate: string | null;
  ContractType: string;
  ExperienceLevel: string;
  Compensation: string; 
  sourceSite: string;
}


const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`;



/**
 * Main Application Component
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<JobViewer />} />
          <Route path="add" element={<JobEntryForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Main Layout Component (for consistent header and navigation)
 */
function Layout() {
  const activeClass = "bg-indigo-600 text-white shadow-md px-5 py-2 rounded-lg font-semibold transition-colors";
  const inactiveClass = "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-lg font-medium transition-colors";

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Job Data Hub</h1>
          <p className="text-gray-500 mt-1">Manage Curated and Scraped Jobs</p>
        </header>
        
        <nav className="mb-8 bg-white shadow-lg rounded-xl p-3">
          <div className="flex space-x-3">
            <NavLink 
              to="/"
              className={({ isActive }: { isActive: boolean }) => isActive ? activeClass : inactiveClass}
            >
              View All Jobs
            </NavLink>
            <NavLink 
              to="/add"
              className={({ isActive }: { isActive: boolean }) => isActive ? activeClass : inactiveClass}
            >
              Add New Job
            </NavLink>
          </div>
        </nav>

        <main className="bg-white shadow-2xl rounded-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


/**
 * Component to View Jobs (The Dashboard)
 * ✅ NOW WITH PAGINATION
 */
function JobViewer() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [totalJobs, setTotalJobs] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ ADDED: State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ UPDATED: fetchJobs now takes a page number
  const fetchJobs = async (pageToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      // Append the page query parameter
      const response = await fetch(`${API_URL}?page=${pageToFetch}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setTotalPages(data.totalPages); // Store total pages from API
      setCurrentPage(data.currentPage); // Ensure state is in sync
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: useEffect now re-fetches when currentPage changes
  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]); // Re-run this effect when currentPage changes

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // ✅ ADDED: Pagination handler functions
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // ✅ ADDED: Button styles for pagination
  const pageButtonClass = "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors";
  const disabledButtonClass = "px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed";

  if (loading) return <div className="text-center p-12 text-indigo-600 font-medium">Loading jobs...</div>;
  if (error) return <div className="text-center p-12 text-red-600">Error fetching data: {error}</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">
          {/* ✅ UPDATED: Show page count in heading */}
          Showing Page {currentPage} of {totalPages}
        </h2>
        <p className="text-sm text-gray-500">{totalJobs} Total Jobs Found</p>
      </div>

      {jobs.length === 0 ? (
        <p className="p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          No jobs found. Start scraping or add one manually!
        </p>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job._id} className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="md:flex justify-between items-start">
                {/* Left Side: Title & Primary Info */}
                <div className="flex-1 mb-4 md:mb-0 space-y-1">
                  <a 
                    href={job.ApplicationURL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors block"
                  >
                    {job.JobTitle}
                  </a>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{job.sourceSite}</span> - {job.Location}
                  </div>
                   <div className="text-sm text-gray-500">
                    Department: {job.Department || 'N/A'}
                  </div>
                   <div className="text-sm text-gray-500">
                    Experience: {job.ExperienceLevel || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400 pt-1">
                    Job ID: <span className="font-mono text-gray-600">{job.JobID}</span>
                  </div>
                </div>
                
                {/* Right Side: Details & Badges */}
                <div className="shrink-0 md:w-1/3 md:text-right space-y-2">
                  
                  <div className="flex items-center md:justify-end space-x-2 text-sm text-gray-800">
                     <span className="font-medium text-gray-900 px-3 py-1 bg-yellow-100 rounded-full">
                        {job.Compensation && job.Compensation !== 'N/A' ? job.Compensation : 'Compensation N/A'}
                    </span>
                  </div>

                  <div className="flex items-center md:justify-end space-x-2 pt-1">
                    <span className="px-3 py-1 text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {job.ContractType || 'Contract N/A'}
                    </span>
                    <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${job.GermanRequired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {job.GermanRequired ? 'GERMAN' : 'ENGLISH'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 pt-1">
                    Posted: {formatDate(job.PostedDate)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ ADDED: Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className={currentPage <= 1 ? disabledButtonClass : pageButtonClass}
          >
            Previous
          </button>
          
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? disabledButtonClass : pageButtonClass}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Component for the Job Entry Form (Manual Curation)
 */
function JobEntryForm() {
  // ✅ REMOVED: GermanRequired from initial state
  const [formData, setFormData] = useState({
    JobTitle: '', ApplicationURL: '', Company: '', Location: 'Germany',
    Department: '', ContractType: 'Full-time', ExperienceLevel: '',
    PostedDate: '', Description: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      // ✅ UPDATED: Hardcode GermanRequired: false in the request body
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, GermanRequired: false }) // Enforce English-only
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setMessage({ type: 'success', text: 'Success! Job added.' });
      // ✅ UPDATED: Reset form
      setFormData({
        JobTitle: '', ApplicationURL: '', Company: '', Location: 'Germany',
        Department: '', ContractType: 'Full-time', ExperienceLevel: '',
        PostedDate: '', Description: ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: `Error: ${(err as Error).message}` });
    }
  };

  // Styles for the form elements
  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manual Job Entry (English-Only)</h2>
      </div>

      {/* Primary Fields */}
      <div className="md:col-span-2">
        <label htmlFor="JobTitle" className={labelStyle}>Job Title *</label>
        <input type="text" name="JobTitle" id="JobTitle" value={formData.JobTitle} onChange={handleChange} required className={inputStyle} />
      </div>
      
      <div className="md:col-span-2">
        <label htmlFor="ApplicationURL" className={labelStyle}>Application URL *</label>
        <input type="url" name="ApplicationURL" id="ApplicationURL" value={formData.ApplicationURL} onChange={handleChange} required className={inputStyle} />
      </div>

      <div>
        <label htmlFor="Company" className={labelStyle}>Company *</label>
        <input type="text" name="Company" id="Company" value={formData.Company} onChange={handleChange} required className={inputStyle} />
      </div>

      <div>
        <label htmlFor="Location" className={labelStyle}>Location</label>
        <input type="text" name="Location" id="Location" value={formData.Location} onChange={handleChange} className={inputStyle} />
      </div>

      {/* Metadata Fields */}
      <div>
        <label htmlFor="Department" className={labelStyle}>Department</label>
        <input type="text" name="Department" id="Department" value={formData.Department} onChange={handleChange} className={inputStyle} />
      </div>
      
      <div>
        <label htmlFor="ContractType" className={labelStyle}>Contract Type</label>
        <input type="text" name="ContractType" id="ContractType" value={formData.ContractType} onChange={handleChange} className={inputStyle} />
      </div>

      <div>
        <label htmlFor="ExperienceLevel" className={labelStyle}>Experience Level</label>
        <input type="text" name="ExperienceLevel" id="ExperienceLevel" value={formData.ExperienceLevel} onChange={handleChange} className={inputStyle} />
      </div>

      <div>
        <label htmlFor="PostedDate" className={labelStyle}>Posted Date</label>
        <input type="date" name="PostedDate" id="PostedDate" value={formData.PostedDate} onChange={handleChange} className={inputStyle} />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label htmlFor="Description" className={labelStyle}>Full Description</label>
        <textarea name="Description" id="Description" value={formData.Description} onChange={handleChange} rows={4} className={inputStyle}></textarea>
      </div>

      {/* Checkbox and Submit */}
      <div className="md:col-span-2 flex items-center justify-end pt-4">
        {/* ✅ REMOVED: The "German Required" checkbox is gone */}
        
        <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-lg text-base font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Job
        </button>
      </div>

      {/* Message */}
      <div className="md:col-span-2">
        {message && (
          <p className={`mt-4 text-sm font-medium p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}