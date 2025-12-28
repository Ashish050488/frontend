
import React, { useState, } from 'react';
import type { FormEvent } from 'react';

const API_URL = `/api/jobs`;

export default function AddJob() {
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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, GermanRequired: false }) 
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setMessage({ type: 'success', text: 'Success! Job added.' });
      setFormData({
        JobTitle: '', ApplicationURL: '', Company: '', Location: 'Germany',
        Department: '', ContractType: 'Full-time', ExperienceLevel: '',
        PostedDate: '', Description: ''
      });
    } catch (err) {
      setMessage({ type: 'error', text: `Error: ${(err as Error).message}` });
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manual Job Entry (English-Only)</h2>
      </div>

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

      <div className="md:col-span-2">
        <label htmlFor="Description" className={labelStyle}>Full Description</label>
        <textarea name="Description" id="Description" value={formData.Description} onChange={handleChange} rows={4} className={inputStyle}></textarea>
      </div>

      <div className="md:col-span-2 flex items-center justify-end pt-4">
        <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-lg text-base font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Job
        </button>
      </div>

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