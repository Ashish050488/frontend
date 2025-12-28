import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import RejectedJobs from './pages/RejectedJobs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddJob />} />
          <Route path="rejected" element={<RejectedJobs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}