import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/Layout';
import Home from './pages/Home';
import CompanyDirectory from './pages/CompanyDirectory';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup'; // ✅ This is now the Talent Pool page
import Legal from './pages/Legal';

// Admin Pages
import ReviewQueue from './pages/ReviewQueue';
import AdminCompanies from './pages/AdminCompanies';
import AddJob from './pages/AddJob';
import RejectedJobs from './pages/RejectedJobs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            
            {/* --- PUBLIC ROUTES --- */}
            <Route index element={<Home />} />
            <Route path="directory" element={<CompanyDirectory />} />
            <Route path="jobs" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} /> {/* Public Talent Pool */}
            <Route path="legal" element={<Legal />} />

            {/* --- ADMIN ONLY ROUTES --- */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="review" element={<ReviewQueue />} />
                <Route path="admin/companies" element={<AdminCompanies />} />
                <Route path="add" element={<AddJob />} />
                <Route path="rejected" element={<RejectedJobs />} />
            </Route>

          </Route>
          
          {/* Catch-all for 404s */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}