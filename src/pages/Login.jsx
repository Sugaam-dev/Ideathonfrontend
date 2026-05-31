import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate(res.data.user.is_admin ? '/admin' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="page" style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <div className="container-sm" style={{ width: '100%' }}>
          <div className="page-header" style={{ textAlign: 'center' }}>
            <h1 className="page-title">Welcome Back</h1>
            <p className="page-subtitle">Sign in to your PMRG Ideathon account.</p>
          </div>

          <div className="card fade-up" style={{ maxWidth: 440, margin: '0 auto' }}>
            <form onSubmit={submit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" required value={form.password} onChange={set('password')} placeholder="Your password" />
                </div>
              </div>

              <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-dim)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--gold)' }}>Register</Link>
              </div>
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                Admin: admin@pmrg.com / admin123
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
