import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Briefcase, LogOut, User, ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import { BRAND } from '../theme/brand';
import Footer from './Footer';
import { Button, Badge } from './ui';

export default function Layout() {
  const loc = useLocation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { mode, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const active = (path: string) => loc.pathname === path;
  const navLink = (path: string, label: string) => (
    <Link
      to={path}
      onClick={() => setOpen(false)}
      className={`nav-tab marker-hover${active(path) ? ' active' : ''}`}
      style={{
        color: active(path) ? 'var(--ink)' : 'var(--muted-ink)',
      }}
      onMouseEnter={e => !active(path) && ((e.target as HTMLElement).style.color = 'var(--ink)')}
      onMouseLeave={e => !active(path) && ((e.target as HTMLElement).style.color = 'var(--muted-ink)')}
    >
      {label}
    </Link>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAV */}
      <nav className="nav-blur sketch-surface" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1.25px solid var(--ink-border, var(--border))' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to={isAdmin ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: isAdmin ? 'var(--danger-soft)' : 'var(--primary-soft)',
              border: `1.25px solid ${isAdmin ? 'var(--danger)' : 'var(--primary)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isAdmin ? <ShieldCheck size={14} color="var(--danger)" /> : <Briefcase size={14} color="var(--primary)" />}
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              {BRAND.appName.replace('Jobs', '')}<span className="font-sketch" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Jobs</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
            {isAdmin ? (
              <>{navLink('/dashboard', 'Dashboard')}{navLink('/review', 'Review')}{navLink('/admin/companies', 'Directory')}{navLink('/add', 'Add Job')}{navLink('/rejected', 'Trash')}</>
            ) : (
              <>{navLink('/directory', 'Companies')}{navLink('/jobs', 'Browse Jobs')}</>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="sketch-ink"
              style={{
                width: 34, height: 34, borderRadius: 8, border: '1.25px solid var(--ink-border, var(--border))',
                background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted-ink)', transition: 'all 0.22s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ink-border, var(--border))'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted-ink)'; }}
              title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted-ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={13} /> {user?.name}
                  {isAdmin && <Badge variant="red" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>ADMIN</Badge>}
                </span>
                <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-ink)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s', fontFamily: 'inherit', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-ink)')}>
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
                <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
                <Link to="/signup"><Button size="sm">Get alerts</Button></Link>
              </div>
            )}

            <button className="md:hidden sketch-ink" onClick={() => setOpen(!open)} style={{ background: 'none', border: '1.25px solid var(--ink-border, var(--border))', borderRadius: 7, padding: 6, cursor: 'pointer', color: 'var(--ink)', display: 'flex', alignItems: 'center' }}>
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: '1.25px solid var(--ink-border, var(--border))', background: 'var(--surface-solid)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isAdmin
              ? ['/dashboard', '/review', '/admin/companies', '/add', '/rejected'].map(p => navLink(p, p.split('/').filter(Boolean).pop()!))
              : [navLink('/directory', 'Companies'), navLink('/jobs', 'Browse Jobs')]}
            <div style={{ borderTop: '1.25px solid var(--ink-border, var(--border))', paddingTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              {isAuthenticated
                ? <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.88rem', fontFamily: 'inherit', fontWeight: 600 }}>Logout</button>
                : <><Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" size="sm">Log in</Button></Link><Link to="/signup" onClick={() => setOpen(false)}><Button size="sm">Sign up</Button></Link></>
              }
            </div>
          </div>
        )}
      </nav>

      <main style={{ flex: 1 }}><Outlet /></main>
      <Footer />
    </div>
  );
}
