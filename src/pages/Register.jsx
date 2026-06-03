import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowLeft, Check, X, KeyRound, Mail } from 'lucide-react'

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

  if (!password) return null

  return (
    <div style={{ marginTop: 8, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password strength</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: strengthColor }}>{strength}</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(passed / 5) * 100}%`, background: strengthColor, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
      </div>
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

  // OTP step
  const [step, setStep] = useState('form') // 'form' | 'otp'
  const [otp, setOtp] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const { login } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const startCooldown = () => {
    setCooldown(60)
    const t = setInterval(() => setCooldown(v => { if (v <= 1) { clearInterval(t); return 0 } return v - 1 }), 1000)
  }

  // Step 1: submit form details → backend sends OTP
  const submitForm = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await api.post('/auth/register/initiate', {
        name: form.name, email: form.email, phone: form.phone,
        organization: form.organization, department: form.department,
        linkedin: form.linkedin, password: form.password,
      })
      toast.success('OTP sent to your email!')
      setStep('otp')
      startCooldown()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    if (cooldown > 0) return
    setLoading(true)
    try {
      await api.post('/auth/register/initiate', {
        name: form.name, email: form.email, phone: form.phone,
        organization: form.organization, department: form.department,
        linkedin: form.linkedin, password: form.password,
      })
      toast.success('OTP resent!')
      startCooldown()
    } catch {
      toast.error('Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: verify OTP → backend creates account
  const verifyOtp = async e => {
    e.preventDefault()
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register/verify', {
        email: form.email, otp, purpose: 'register'
      })
      login(res.data.token, res.data.user)
      toast.success('Account created! Welcome.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container-sm">

          {/* ── Step: Registration Form ── */}
          {step === 'form' && (
            <>
              <div className="page-header">
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
                <form onSubmit={submitForm}>
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
                          required value={form.password} onChange={set('password')}
                          placeholder="Min. 6 characters"
                          style={{ paddingRight: 38 }}
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}>
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
                        required value={form.confirm} onChange={set('confirm')}
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
                      {loading ? 'Sending OTP…' : 'Continue →'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* ── Step: OTP Verification ── */}
          {step === 'otp' && (
            <>
              <div className="page-header">
                <button onClick={() => setStep('form')}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, marginBottom: 16, padding: 0, fontFamily: 'inherit' }}>
                  <ArrowLeft size={15} /> Edit Details
                </button>
                <h1 className="page-title">Verify Your Email</h1>
                <p className="page-subtitle">We sent a 6-digit OTP to verify your email address.</p>
              </div>

              <div className="card fade-up">
                {/* Email display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 8, marginBottom: 20, border: '1px solid var(--border)' }}>
                  <Mail size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>OTP sent to</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{form.email}</div>
                  </div>
                </div>

                <form onSubmit={verifyOtp}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                    <div className="form-group">
                      <label className="form-label">One-Time Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input"
                          type="text" inputMode="numeric" pattern="[0-9]*"
                          maxLength={6} required autoFocus
                          value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit OTP"
                          style={{ paddingLeft: 36, letterSpacing: '0.2em', fontSize: 18, fontFamily: "'DM Mono', monospace" }}
                        />
                        <KeyRound size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <span>OTP expires in 10 minutes</span>
                        <button type="button" onClick={resendOtp} disabled={cooldown > 0 || loading}
                          style={{ background: 'none', border: 'none', cursor: cooldown > 0 ? 'default' : 'pointer', color: cooldown > 0 ? 'var(--text-muted)' : 'var(--gold)', fontWeight: 600, fontSize: 12, padding: 0 }}>
                          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-gold" type="submit"
                    disabled={loading || otp.length !== 6}
                    style={{ width: '100%', justifyContent: 'center' }}>
                    {loading ? 'Verifying…' : 'Verify & Create Account'}
                  </button>
                </form>
              </div>
            </>
          )}

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