import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { User, Mail, Phone, Building2, Briefcase, Link, LogOut, ArrowLeft } from 'lucide-react'

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '14px 0', borderBottom: '1px solid var(--border)'
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: 'var(--bg2)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: 'var(--gold)'
      }}>
        <Icon size={15} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{value}</div>
      </div>
    </div>
  )
}

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <button
              onClick={() => navigate(-1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, marginBottom: 16, padding: 0, fontFamily: 'inherit' }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="page-title">My Account</h1>
            <p className="page-subtitle">Your profile and personal information.</p>
          </div>

          <div style={{ maxWidth: 560 }}>
            {/* Avatar + Name header */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--gold)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>
                    {user.is_admin ? '🛡️ Admin' : 'Participant'}
                  </div>
                </div>
              </div>

              <p className="section-title">Personal Information</p>
              <div>
                <InfoRow icon={Mail} label="Email Address" value={user.email} />
                <InfoRow icon={Phone} label="Mobile Number" value={user.phone} />
                <InfoRow icon={Building2} label="College / Organization" value={user.organization} />
                <InfoRow icon={Briefcase} label="Department / Domain" value={user.department} />
                {user.linkedin && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: 'var(--gold)'
                    }}>
                      <Link size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 2 }}>LinkedIn</div>
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: 'var(--gold)', lineHeight: 1.5 }}>{user.linkedin}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Logout button at bottom */}
            <div className="card" style={{ borderColor: '#f5c5cd', background: '#fdf8f9' }}>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 14 }}>
                You will be signed out of your account and redirected to the home page.
              </p>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
          <div style={{ height: 60 }} />
        </div>
      </div>
      <Footer />
    </>
  )
}