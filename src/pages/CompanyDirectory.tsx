import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import type { ICompany } from '../types';

export default function CompanyDirectory() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. UPDATE BROWSER TAB TITLE
    document.title = "English-Speaking Employers in Germany | Company Directory";

    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/jobs/directory');
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load directory", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            English-Speaking Employers in Germany
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            This directory highlights companies in Germany that regularly hire for English-speaking roles. These companies often operate in international teams where English is the primary working language.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Search companies..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Grid */}
        {loading ? (
           <div className="text-center py-20 text-slate-500">Loading directory...</div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div key={company.companyName} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-xl font-bold text-slate-400 border border-slate-200 shrink-0">
                            {company.companyName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">{company.companyName}</h3>
                            {/* 🗑️ Removed Active Roles Badge here */}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                        <div className="flex items-start gap-2">
                             <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                             <span>
                                {company.cities.length > 0 ? company.cities.join(', ') : 'Germany (Various)'}
                             </span>
                        </div>
                    </div>

                    {company.source === 'scraped' && company.domain && (
                        <a 
                            href={`https://${company.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full text-center py-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:text-blue-600 font-medium transition-colors text-sm"
                        >
                            Visit Career Page
                        </a>
                    )}
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}