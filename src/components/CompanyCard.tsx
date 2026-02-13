import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface CompanyStats {
  companyName: string;
  openRoles: number;
  cities: string[];
  domain: string;
  source: 'scraped' | 'manual';
}

interface Props {
  company: CompanyStats;
}

export default function CompanyCard({ company }: Props) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Logo URL (Clearbit is a free logo API)
  const logoUrl = `https://logo.clearbit.com/${company.domain}?size=128`;

  const handleAction = () => {
    if (company.source === 'scraped') {
        // Internal: Go to our Job Feed filtered by this company
        navigate(`/jobs?company=${encodeURIComponent(company.companyName)}`);
    } else {
        // External: Go to their website
        // We assume domain is clean (e.g., "google.com"), so we add https://
        window.open(`https://${company.domain}`, '_blank');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col h-full hover:shadow-lg hover:border-blue-200 transition-all duration-300 group relative overflow-hidden">
      
      {/* Top Section: Logo & Name */}
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 shrink-0 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center p-2">
            {!imageError ? (
            <img 
                src={logoUrl} 
                alt={`${company.companyName} logo`}
                className="max-h-full max-w-full object-contain"
                onError={() => setImageError(true)} 
            />
            ) : (
            <span className="text-lg font-bold text-slate-400">
                {company.companyName.charAt(0).toUpperCase()}
            </span>
            )}
        </div>
        
        {/* Source Badge (Subtle) */}
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
            company.source === 'scraped' 
            ? 'bg-blue-50 text-blue-600' 
            : 'bg-slate-100 text-slate-500'
        }`}>
            {company.source === 'scraped' ? 'Partner' : 'Verified'}
        </span>
      </div>

      {/* Company Info */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
            {company.companyName}
        </h3>
        
        {/* Locations */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">
                {company.cities.length > 0 ? company.cities.slice(0, 2).join(", ") : "Germany"}
            </span>
        </div>
      </div>

      {/* Footer Action Button */}
      <button 
        onClick={handleAction}
        className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            company.source === 'scraped' 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100' 
            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        {company.source === 'scraped' ? (
            <>View Latest Jobs <ArrowRight className="w-4 h-4" /></>
        ) : (
            <>Visit Careers <ExternalLink className="w-3.5 h-3.5" /></>
        )}
      </button>
    </div>
  );
}