import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      // Go to where they came from, or admin/dashboard
      const from = location.state?.from
      if (from && from !== '/login' && from !== '/register') {
        navigate(from, { replace: true })
      } else {
        navigate(res.data.user.is_admin ? '/admin' : '/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="page" style={{ display:'flex', alignItems:'center' }}>
        <div className="container-sm" style={{ width:'100%' }}>
          <div style={{ maxWidth:420, margin:'0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'var(--text-dim)', fontSize:13, marginBottom:20, padding:0, fontFamily:'inherit' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="page-title" style={{ marginBottom:4 }}>Welcome Back</h1>
            <p className="page-subtitle" style={{ marginBottom:24 }}>Sign in to your PMRG Ideathon account.</p>

            <div className="card fade-up">
              <form onSubmit={submit}>
                <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" autoFocus />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" required value={form.password} onChange={set('password')} placeholder="Your password" />
                  </div>
                </div>
                <button className="btn btn-gold" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
                <div style={{ textAlign:'center', marginTop:14, fontSize:13, color:'var(--text-dim)' }}>
                  Don't have an account? <Link to="/register" style={{ color:'var(--gold)', fontWeight:600 }}>Register</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}