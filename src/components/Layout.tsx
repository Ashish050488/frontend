import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  const activeClass = "bg-indigo-600 text-white shadow-md px-5 py-2 rounded-lg font-semibold transition-colors";
  const inactiveClass = "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-5 py-2 rounded-lg font-medium transition-colors";
  const dangerLinkClass = "text-gray-400 hover:text-red-600 hover:bg-red-50 px-5 py-2 rounded-lg font-medium transition-colors ml-auto";

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Job Data Hub</h1>
          <p className="text-gray-500 mt-1">Manage Curated and Scraped Jobs</p>
        </header>
        
        <nav className="mb-8 bg-white shadow-lg rounded-xl p-3 flex flex-wrap gap-2 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            Dashboard
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            Add New Job
          </NavLink>
          
          <div className="grow"></div>
          
          <NavLink to="/rejected" className={dangerLinkClass}>
             ⚠️ Rejected Jobs
          </NavLink>
        </nav>

        <main className="bg-white shadow-2xl rounded-xl min-h-[500px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}