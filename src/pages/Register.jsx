import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', internship_id: '', department: '', linkedin: '', password: '', confirm: '' })
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
      toast.success('Account created successfully!')
      navigate('/submit')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="page" style={{ background: 'var(--bg)' }}>
        <div className="container-sm">
          <div className="page-header">
            <p className="section-title">Step 1 of 3</p>
            <h1 className="page-title">Create Account</h1>
            <p className="page-subtitle">Participant information for the Ideathon Portal.</p>
          </div>

          <div className="card fade-up">
            <form onSubmit={submit}>
              <div style={{ marginBottom: 28 }}>
                <p className="section-title">Personal Details</p>
                <div className="grid-2" style={{ gap: 16 }}>
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
                    <label className="form-label">Internship ID</label>
                    <input className="form-input" value={form.internship_id} onChange={set('internship_id')} placeholder="If applicable" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department / Domain</label>
                    <input className="form-input" value={form.department} onChange={set('department')} placeholder="e.g. Computer Science" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">LinkedIn Profile</label>
                    <input className="form-input" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div style={{ marginBottom: 28 }}>
                <p className="section-title">Security</p>
                <div className="grid-2" style={{ gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Password <span className="req">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input className="form-input" type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Min. 6 characters" style={{ paddingRight: 40 }} />
                      <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="req">*</span></label>
                    <input className="form-input" type={showPw ? 'text' : 'password'} required value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                  Already have an account? <Link to="/login" style={{ color: 'var(--gold)' }}>Sign In</Link>
                </div>
                <button className="btn btn-gold" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Next →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
