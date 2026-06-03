import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Shield, Menu, X, User } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Brand — logo only, no text */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img
            src="/pmrg-logo.png"
            alt="PMRG"
            style={{ height: 40, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" style={navLink}>
                  <Shield size={13} /> Admin
                </Link>
              )}
              <Link to="/dashboard" style={navLink}>
                <LayoutDashboard size={13} /> Dashboard
              </Link>
              <Link to="/account" style={{ ...navLink, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <User size={13} /> My Account
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={navLink}>Sign In</Link>
              <Link to="/register" style={{ ...navLink, background: 'var(--gold)', color: '#fff', fontWeight: 600 }}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="nav-hamburger"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text)', display: 'none' }}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 52, left: 0, right: 0, zIndex: 99,
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '12px 20px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {user.is_admin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={mobileLink}>
                  <Shield size={15} /> Admin Panel
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={mobileLink}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/account" onClick={() => setMenuOpen(false)} style={mobileLink}>
                <User size={15} /> My Account
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={mobileLink}>Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ ...mobileLink, background: 'var(--gold)', color: '#fff', borderRadius: 8, justifyContent: 'center' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

const navLink = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 11px', borderRadius: 6, fontSize: 13, fontWeight: 500,
  color: 'var(--text-dim)', background: 'none', textDecoration: 'none',
  transition: 'all 0.15s', whiteSpace: 'nowrap',
}

const mobileLink = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
  color: 'var(--text)', background: 'var(--bg2)', textDecoration: 'none',
}