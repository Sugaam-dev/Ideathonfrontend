import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase letter (A–Z)', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a–z)', pass: /[a-z]/.test(password) },
    { label: 'Number (0–9)', pass: /[0-9]/.test(password) },
    { label: 'Special character (!@#$…)', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const passed = checks.filter(c => c.pass).length
  const strength = passed <= 1 ? 'Weak' : passed <= 3 ? 'Fair' : passed === 4 ? 'Good' : 'Strong'
  const strengthColor = passed <= 1 ? '#d63f5a' : passed <= 3 ? '#f59e0b' : passed === 4 ? '#2563eb' : '#1d8a5a'
  const barWidth = `${(passed / 5) * 100}%`

  if (!password) return null

  return (
    <div style={{ marginTop: 8, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      {/* Strength bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password strength</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: strengthColor }}>{strength}</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: barWidth, background: strengthColor, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
      </div>
      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
            <span style={{ color: c.pass ? '#1d8a5a' : 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
              {c.pass ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={2} />}
            </span>
            <span style={{ color: c.pass ? 'var(--text)' : 'var(--text-muted)' }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', organization: '',
    department: '', linkedin: '', password: '', confirm: ''
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.token, res.data.user)
      toast.success('Account created! Welcome.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container-sm">
          <div className="page-header">
            {/* Back button — hidden on mobile */}
            <button
              onClick={() => navigate(-1)}
              className="back-btn-desktop"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, marginBottom: 16, padding: 0, fontFamily: 'inherit' }}
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="page-title">Create Account</h1>
            <p className="page-subtitle">Register to participate in the PMRG Ideathon.</p>
          </div>

          <div className="card fade-up">
            <form onSubmit={submit}>
              <p className="section-title">Personal Details</p>
              <div className="grid-2" style={{ gap: 14, marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="req">*</span></label>
                  <input className="form-input" required value={form.name} onChange={set('name')} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address <span className="req">*</span></label>
                  <input className="form-input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number <span className="req">*</span></label>
                  <input className="form-input" required value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">College / Organization</label>
                  <input className="form-input" value={form.organization} onChange={set('organization')} placeholder="Your institution" />
                </div>
                <div className="form-group">
                  <label className="form-label">Department / Domain</label>
                  <input className="form-input" value={form.department} onChange={set('department')} placeholder="e.g. Computer Science" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">LinkedIn Profile</label>
                  <input className="form-input" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              <div className="divider" />

              <p className="section-title">Security</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Password <span className="req">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="form-input"
                      type={showPw ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min. 6 characters"
                      style={{ paddingRight: 38 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <PasswordStrength password={form.password} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password <span className="req">*</span></label>
                  <input
                    className="form-input"
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Repeat password"
                  />
                  {form.confirm && form.password && form.confirm !== form.password && (
                    <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 3 }}>Passwords do not match</span>
                  )}
                  {form.confirm && form.password && form.confirm === form.password && (
                    <span style={{ fontSize: 12, color: '#1d8a5a', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Check size={12} strokeWidth={3} /> Passwords match
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                  Already registered? <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign In</Link>
                </div>
                <button className="btn btn-gold" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
          <div style={{ height: 48 }} />
        </div>
      </div>
      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .back-btn-desktop { display: none !important; }
        }
      `}</style>
    </>
  )
}