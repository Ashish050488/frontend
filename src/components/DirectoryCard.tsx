import { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface CompanyStats {
  companyName: string;
  domain: string;
  cities: string[];
  source: 'scraped' | 'manual';
}

interface Props {
  company: CompanyStats;
}

export default function DirectoryCard({ company }: Props) {
  const [imageError, setImageError] = useState(false);

  // Logo URL
  const logoUrl = `https://logo.clearbit.com/${company.domain}?size=128`;

  // External Link Logic
  const handleVisit = () => {
  let url = (company.domain || '').trim();

  // If it's missing http/https, add https://
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  window.open(url, '_blank');
};

  return (
    <div 
      onClick={handleVisit}
      className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group h-full"
    >
      {/* Logo Container */}
      <div className="h-16 w-full flex items-center justify-center mb-4">
        {!imageError ? (
          <img 
            src={logoUrl} 
            alt={company.companyName}
            className="max-h-12 max-w-[140px] object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
            onError={() => setImageError(true)} 
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg font-bold border border-slate-200">
            {company.companyName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Company Name */}
      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {company.companyName}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <MapPin className="w-3 h-3 text-slate-400" />
        <span className="truncate max-w-[150px]">
            {company.cities.length > 0 ? company.cities.slice(0, 2).join(", ") : "Germany"}
        </span>
      </div>

      {/* Subtle "External" Hint (Only visible on hover) */}
      <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-blue-600 flex items-center gap-1">
        Visit Career Page <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}