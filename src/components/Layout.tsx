import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, User, ShieldCheck, Menu, X, Sun, Moon, Zap } from 'lucide-react';
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
      style={{
        fontSize: '0.82rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: active(path) ? 'var(--text-primary)' : 'var(--text-secondary)',
        textDecoration: 'none',
        padding: '5px 0',
        position: 'relative',
        transition: 'color 0.18s',
      }}
      onMouseEnter={e => !active(path) && ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
      onMouseLeave={e => !active(path) && ((e.target as HTMLElement).style.color = 'var(--text-secondary)')}
    >
      {label}
      {active(path) && (
        <span
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 2,
            background: 'var(--acid)',
            borderRadius: 2,
          }}
        />
      )}
    </Link>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav
        className="nav-blur"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to={isAdmin ? '/dashboard' : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: isAdmin ? 'var(--danger-dim)' : 'var(--acid-dim)',
                border: `1px solid ${isAdmin ? 'var(--danger)' : 'var(--acid-mid)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAdmin ? <ShieldCheck size={14} color="var(--danger)" /> : <Zap size={14} color="var(--acid)" />}
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {BRAND.appName.replace('Jobs', '')}
              <span style={{ color: 'var(--acid)' }}>Jobs</span>
            </span>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
            {isAdmin ? (
              <>
                {navLink('/dashboard', 'Dashboard')}
                {navLink('/review', 'Review')}
                {navLink('/test-logs', 'Test Logs')}
                {navLink('/admin/companies', 'Directory')}
                {navLink('/add', 'Add Job')}
                {navLink('/rejected', 'Trash')}
              </>
            ) : (
              <>
                {navLink('/directory', 'Companies')}
                {navLink('/jobs', 'Browse Jobs')}
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={toggle}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: '1px solid var(--border-mid)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--acid)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--acid)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-mid)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }}
              title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <User size={13} /> {user?.name}
                  {isAdmin && (
                    <Badge variant="red" style={{ fontSize: '0.58rem', padding: '2px 6px' }}>
                      ADMIN
                    </Badge>
                  )}
                </span>
                <button
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    transition: 'color 0.2s',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => ((e.currentTarget.style.color = 'var(--danger)'))}
                  onMouseLeave={e => ((e.currentTarget.style.color = 'var(--text-muted)'))}
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get alerts</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 7,
                padding: 6,
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {isAdmin
              ? ['/dashboard', '/review', '/test-logs', '/admin/companies', '/add', '/rejected'].map(p =>
                  navLink(p, p.split('/').filter(Boolean).pop()!)
                )
              : [navLink('/directory', 'Companies'), navLink('/jobs', 'Browse Jobs')]}
            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: 12,
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--danger)',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                  }}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
