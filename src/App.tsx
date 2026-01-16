import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; 
import CompanyDirectory from './pages/CompanyDirectory'; 
import AddJob from './pages/AddJob';
import RejectedJobs from './pages/RejectedJobs';
import ReviewQueue from './pages/ReviewQueue'; // ✅ Import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Entry is now Directory */}
          <Route index element={<CompanyDirectory />} /> 
          
          {/* Detailed Job List */}
          <Route path="jobs" element={<Dashboard />} />
          
          <Route path="add" element={<AddJob />} />
          
          {/* ✅ NEW: Review Route */}
          <Route path="review" element={<ReviewQueue />} />

          <Route path="rejected" element={<RejectedJobs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}