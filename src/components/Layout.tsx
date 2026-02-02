import { Link, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer'; // ✅ Import the new Footer

export default function Layout() {
  const location = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  
  const activeClass = "text-slate-900 font-bold border-b-2 border-slate-900 pb-0.5";
  const inactiveClass = "text-slate-500 hover:text-slate-900 font-medium transition-colors";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col"> 
      {/* Added flex-col to keep footer at bottom */}
      
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          
          {/* LOGO SECTION: Redirects based on Role */}
          {/* ✅ UPDATED: Admin logo now goes to /dashboard */}
          <Link to={isAdmin ? "/dashboard" : "/"} className="flex items-center gap-2 group">
             <div className={`${isAdmin ? 'bg-red-600' : 'bg-blue-600'} text-white p-1.5 rounded-lg transition-colors`}>
                {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
             </div>
             <span className="text-xl font-bold text-slate-900 tracking-tight">
                {isAdmin ? "Admin Panel" : "English Jobs"}
             </span>
          </Link>
          
          <div className="flex gap-6 text-sm items-center">
            
            {/* NAVIGATION LINKS */}
            {isAdmin ? (
                // 🔒 ADMIN MENU (Only visible to Admins)
                <div className="flex gap-6 mr-4">
                    {/* ✅ ADDED: Dashboard Link */}
                    <Link to="/dashboard" className={location.pathname === '/dashboard' ? activeClass : inactiveClass}>
                        Dashboard
                    </Link>
                    <Link to="/review" className={location.pathname === '/review' ? activeClass : inactiveClass}>
                        Review
                    </Link>
                    <Link to="/admin/companies" className={location.pathname === '/admin/companies' ? activeClass : inactiveClass}>
                        Directory
                    </Link>
                    <Link to="/add" className={location.pathname === '/add' ? activeClass : inactiveClass}>
                        Add Job
                    </Link>
                    <Link to="/rejected" className={location.pathname === '/rejected' ? activeClass : inactiveClass}>
                        Trash
                    </Link>
                </div>
            ) : (
                // 🌍 PUBLIC MENU (Visible to Users/Guests)
                <div className="flex gap-6 mr-4">
                    <Link to="/directory" className={location.pathname === '/directory' ? activeClass : inactiveClass}>
                        Companies
                    </Link>
                    <Link to="/jobs" className={location.pathname === '/jobs' ? activeClass : inactiveClass}>
                        Jobs
                    </Link>
                </div>
            )}
            
            {/* AUTH STATUS SECTION */}
            {isAuthenticated ? (
                <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                        <User className="w-4 h-4" /> {user?.name}
                        {isAdmin && (
                            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 font-bold uppercase tracking-wider">
                                Admin
                            </span>
                        )}
                    </span>
                    <button 
                        onClick={logout} 
                        className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1 transition-colors" 
                        title="Log Out"
                    >
                        <LogOut className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                        Log in
                    </Link>
                    <Link to="/signup" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm">
                        Sign up
                    </Link>
                </div>
            )}
          </div>
        </div>
      </nav>

      <main className="grow">
        <Outlet />
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}