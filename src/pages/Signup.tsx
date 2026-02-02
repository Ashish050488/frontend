import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle, Briefcase, Globe } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', domain: 'Tech', location: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const countries = [
    // --- Priority Markets ---
    "Germany", "India", "United Kingdom", "United States", "Canada", "Australia",
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (DRC)", "Congo (Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent selecting the separator
    if (formData.location.startsWith("---")) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/talent-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setStatus('success');
      
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to join. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-slate-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-blue-100 w-full max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Thanks for signing up! 🎉</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                You’re now on our <strong>early access list</strong> for English-speaking jobs in Germany. 
                We’re currently setting up our email alerts. As soon as we go live, you’ll be among the first to hear from us.
            </p>
            <Link to="/" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                Back to Jobs
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-slate-50 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-blue-50 rounded-xl mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Join the Talent Pool</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Get notified about "No German Required" jobs that match your profile.
          </p>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. Alex Smith"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Domain Selection */}
          <div>
            <label className=" text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Job Interest
            </label>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    type="button"
                    onClick={() => setFormData({...formData, domain: 'Tech'})}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                        formData.domain === 'Tech' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                    }`}
                >
                    Tech / IT
                </button>
                <button 
                    type="button"
                    onClick={() => setFormData({...formData, domain: 'Non-Tech'})}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                        formData.domain === 'Non-Tech' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                    }`}
                >
                    Business / Other
                </button>
            </div>
          </div>

          {/* Location Dropdown (Full World List) */}
          <div>
            <label className=" text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" /> Current Location
            </label>
            <div className="relative">
                <select
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-white text-slate-700"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                >
                    <option value="" disabled>Select your country</option>
                    {countries.map(country => (
                        <option 
                            key={country} 
                            value={country} 
                            disabled={country.startsWith("---")} // Disable separator
                            className={country.startsWith("---") ? "text-slate-400 font-bold bg-slate-50" : ""}
                        >
                            {country}
                        </option>
                    ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-70 mt-2"
          >
            {status === 'loading' ? 'Joining...' : 'Join Early Access List'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-500">
           Admin user?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}