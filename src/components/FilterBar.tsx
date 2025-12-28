
interface Props {
  companies: string[];
  selectedCompany: string;
  onSelectCompany: (company: string) => void;
  totalJobs: number;
}

export default function FilterBar({ companies, selectedCompany, onSelectCompany, totalJobs }: Props) {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Job Feed</h2>
        <p className="text-sm text-gray-500">{totalJobs} Active Jobs Available</p>
      </div>

      <div className="w-full md:w-64">
        <label htmlFor="companyFilter" className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          Filter by Company
        </label>
        <div className="relative">
          <select
            id="companyFilter"
            value={selectedCompany}
            onChange={(e) => onSelectCompany(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
          >
            <option value="">All Companies</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}