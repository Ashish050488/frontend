import type { IJob } from '../types';

interface Props {
  job: IJob;
  onFeedback?: (id: string, status: 'up' | 'down') => void;
  isRejectedView?: boolean; // Changes button behavior for the rejected page
  onRestore?: (id: string) => void;
}

export default function JobCard({ job, onFeedback, isRejectedView, onRestore }: Props) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <div className={`bg-white p-6 border rounded-xl shadow-lg hover:shadow-xl transition duration-300 relative ${job.thumbStatus === 'up' ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
      <div className="md:flex justify-between items-start">
        {/* Left Side: Info */}
        <div className="flex-1 mb-4 md:mb-0 space-y-1">
          <a href={job.ApplicationURL} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-gray-900 hover:text-indigo-600 block">
            {job.JobTitle}
          </a>
          <div className="text-sm text-gray-700">
            <span className="font-medium">{job.Company}</span> • {job.sourceSite}
          </div>
          <div className="text-sm text-gray-500">
             {job.Location} | {job.Department}
          </div>
          <div className="text-xs text-gray-400 pt-1">ID: {job.JobID}</div>
        </div>

        {/* Right Side: Feedback & Badges */}
        <div className="shrink-0 md:w-1/3 md:text-right space-y-2">
          
          {/* ACTION BUTTONS */}
          <div className="flex items-center md:justify-end space-x-2 mb-2">
            {isRejectedView ? (
               <button 
                 onClick={() => onRestore && onRestore(job._id)}
                 className="text-sm text-indigo-600 font-bold hover:underline"
               >
                 Restore Job ↩️
               </button>
            ) : (
               <>
                 <button 
                    onClick={() => onFeedback && onFeedback(job._id, 'up')}
                    className={`p-2 rounded-full transition ${job.thumbStatus === 'up' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'}`}
                    title="Thumbs Up"
                 >
                    👍
                 </button>
                 <button 
                    onClick={() => onFeedback && onFeedback(job._id, 'down')}
                    className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition"
                    title="Thumbs Down (Hide)"
                 >
                    👎
                 </button>
               </>
            )}
          </div>

          <div className="flex items-center md:justify-end space-x-2">
             <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.GermanRequired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
               {job.GermanRequired ? 'GERMAN' : 'ENGLISH'}
             </span>
             <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
               {job.ContractType || 'N/A'}
             </span>
          </div>

          <div className="text-xs text-gray-500 pt-1">
            Posted: {formatDate(job.PostedDate)}
          </div>
        </div>
      </div>
    </div>
  );
}