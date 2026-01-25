import React, { useState, } from 'react';
import { Trash2, Plus, MapPin } from 'lucide-react';

interface Company {
  _id: string;
  companyName: string;
  openRoles: number;
  cities: string[];
  domain: string;
  source: 'scraped' | 'manual';
}

export default function AdminCompanies() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', domain: '', cities: '' });

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        fetchCompanies();
    } else {
        alert("Wrong password");
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/jobs/directory');
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const res = await fetch('/api/jobs/companies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newCompany)
          });
          if (res.ok) {
              alert("Company Added!");
              setNewCompany({ name: '', domain: '', cities: '' });
              fetchCompanies();
          } else {
              const err = await res.json();
              alert("Error: " + err.error);
          }
      } catch (e) { alert("Network Error"); }
  };

  const handleDelete = async (company: Company) => {
      if(!window.confirm(`Delete ${company.companyName}? This deletes ALL associated jobs.`)) return;

      try {
          let url;
          let method = 'DELETE';

          if (company.source === 'manual') {
              url = `/api/jobs/companies/${company._id}`;
          } else {
              url = `/api/jobs/company?name=${encodeURIComponent(company.companyName)}`;
          }

          const res = await fetch(url, { method });
          if(res.ok) {
              setCompanies(prev => prev.filter(c => c.companyName !== company.companyName));
          } else {
              alert("Error deleting.");
          }
      } catch (err) { alert("Network Error"); }
  };

  if (!isAuthenticated) {
      return (
          <div className="flex justify-center items-center min-h-[50vh]">
              <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-lg border w-80">
                  <h2 className="text-xl font-bold mb-4">Admin Access</h2>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Password"/>
                  <button className="w-full bg-slate-900 text-white py-2 rounded">Login</button>
              </form>
          </div>
      );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Manage Companies</h1>

        {/* --- ADD COMPANY FORM --- */}
        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm mb-10">
            <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add Manual Company
            </h2>
            <form onSubmit={handleAddCompany} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input required placeholder="Name (e.g. SoundCloud)" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} className="border p-2 rounded w-full" />
                <input required placeholder="Domain (e.g. soundcloud.com)" value={newCompany.domain} onChange={e => setNewCompany({...newCompany, domain: e.target.value})} className="border p-2 rounded w-full" />
                <input placeholder="City (e.g. Berlin)" value={newCompany.cities} onChange={e => setNewCompany({...newCompany, cities: e.target.value})} className="border p-2 rounded w-full" />
                <button className="bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 w-full">Add</button>
            </form>
        </div>

        {/* --- COMPANY LIST --- */}
        {loading ? <div>Loading...</div> : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Company</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Source</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Details</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {companies.map((company) => (
                            <tr key={company.companyName} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                    <img src={`https://logo.clearbit.com/${company.domain || ''}`} onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/20?text=' + company.companyName[0]} className="w-8 h-8 object-contain rounded" />
                                    {company.companyName}
                                </td>
                                <td className="px-6 py-4">
                                    {company.source === 'scraped' ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Auto-Scraped</span> : <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Manual Entry</span>}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    <span className={company.openRoles > 0 ? "text-indigo-600 font-bold" : "text-slate-400"}>{company.openRoles} Jobs</span>
                                    <span className="ml-2 text-xs text-slate-400"><MapPin className="w-3 h-3 inline" /> {company.cities.join(", ")}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(company)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
}