import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setFieldError('')
  }

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setFieldError('')
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      toast.success(`Welcome, ${res.data.user.name}!`)
      const from = location.state?.from
      if (from && from !== '/login' && from !== '/register') {
        navigate(from, { replace: true })
      } else {
        navigate(res.data.user.is_admin ? '/admin' : '/dashboard', { replace: true })
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed'
      if (err.response?.status === 401 || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('email') || msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('incorrect')) {
        setFieldError('Incorrect email or password. Please try again.')
      } else {
        setFieldError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="page" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="container-sm" style={{ width: '100%' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            {/* Back button — hidden on mobile */}
            <button
              onClick={() => navigate(-1)}
              className="back-btn-desktop"
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, marginBottom: 20, padding: 0, fontFamily: 'inherit' }}
            >
              <ArrowLeft size={15} /> Back
            </button>

            <h1 className="page-title" style={{ marginBottom: 4 }}>Sign In</h1>
            {/* Slogan instead of email greeting */}
            <p className="page-subtitle" style={{ marginBottom: 24 }}>
              Turn your ideas into impact — log in to the PMRG Ideathon.
            </p>

            <div className="card fade-up">
              <form onSubmit={submit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className={`form-input${fieldError ? ' input-error' : ''}`}
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="you@example.com"
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className={`form-input${fieldError ? ' input-error' : ''}`}
                      type="password"
                      required
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Your password"
                    />
                  </div>

                  {/* Inline error message for wrong credentials */}
                  {fieldError && (
                    <div className="inline-error">
                      <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{fieldError}</span>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-gold"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-dim)' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @media (max-width: 600px) {
          .back-btn-desktop { display: none !important; }
        }
        .input-error {
          border-color: var(--red) !important;
          box-shadow: 0 0 0 3px rgba(214,63,90,0.1) !important;
        }
        .inline-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          background: #fdf0f2;
          border: 1px solid #f5c5cd;
          border-radius: var(--radius);
          color: var(--red);
          font-size: 13px;
          line-height: 1.5;
        }
      `}</style>
    </>
  )
}