import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'

// Reuse password strength from Register
import { Eye as _E } from 'lucide-react'
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
  const color = passed <= 1 ? '#d63f5a' : passed <= 3 ? '#f59e0b' : passed === 4 ? '#2563eb' : '#1d8a5a'
  if (!password) return null
  return (
    <div style={{ marginTop: 8, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password strength</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{strength}</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(passed / 5) * 100}%`, background: color, borderRadius: 2, transition: 'width 0.3s, background 0.3s' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
            <span style={{ color: c.pass ? '#1d8a5a' : 'var(--text-muted)', display: 'flex', flexShrink: 0 }}>
              {c.pass ? '✓' : '✗'}
            </span>
            <span style={{ color: c.pass ? 'var(--text)' : 'var(--text-muted)' }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  // step: 'email' | 'otp' | 'reset' | 'done'
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const startCooldown = () => {
    setCooldown(60)
    const t = setInterval(() => setCooldown(v => { if (v <= 1) { clearInterval(t); return 0 } return v - 1 }), 1000)
  }

  const sendOtp = async (e) => {
    e?.preventDefault()
    if (!email.trim()) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email, purpose: 'reset' })
      toast.success('OTP sent! Check your inbox.')
      setStep('otp')
      startCooldown()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    if (cooldown > 0) return
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email, purpose: 'reset' })
      toast.success('OTP resent!')
      startCooldown()
    } catch {
      toast.error('Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return }
    // We don't verify OTP here — we verify it together with the new password in reset step
    setStep('reset')
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, otp, new_password: newPassword })
      setStep('done')
      toast.success('Password reset successful!')
    } catch (err) {
      const detail = err.response?.data?.detail || 'Reset failed'
      toast.error(detail)
      if (detail.toLowerCase().includes('otp') || detail.toLowerCase().includes('expired')) {
        setStep('otp')
        setOtp('')
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

            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-dim)', fontSize: 13, marginBottom: 20, textDecoration: 'none' }}>
              <ArrowLeft size={15} /> Back to Sign In
            </Link>

            {/* ── Step: Email ── */}
            {step === 'email' && (
              <>
                <h1 className="page-title" style={{ marginBottom: 4 }}>Forgot Password</h1>
                <p className="page-subtitle" style={{ marginBottom: 24 }}>Enter your registered email and we'll send you a one-time password.</p>
                <div className="card fade-up">
                  <form onSubmit={sendOtp}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            className="form-input"
                            type="email" required autoFocus
                            value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={{ paddingLeft: 36 }}
                          />
                          <Mail size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-gold" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                      {loading ? 'Sending…' : 'Generate OTP'}
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* ── Step: OTP ── */}
            {step === 'otp' && (
              <>
                <h1 className="page-title" style={{ marginBottom: 4 }}>Enter OTP</h1>
                <p className="page-subtitle" style={{ marginBottom: 24 }}>
                  We sent a 6-digit OTP to <strong>{email}</strong>. It expires in 10 minutes.
                </p>
                <div className="card fade-up">
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
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Didn't receive it?</span>
                        <button type="button" onClick={resendOtp} disabled={cooldown > 0 || loading}
                          style={{ background: 'none', border: 'none', cursor: cooldown > 0 ? 'default' : 'pointer', color: cooldown > 0 ? 'var(--text-muted)' : 'var(--gold)', fontWeight: 600, fontSize: 12, padding: 0 }}>
                          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-gold" type="submit" disabled={otp.length !== 6} style={{ width: '100%', justifyContent: 'center' }}>
                      Verify OTP
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* ── Step: New Password ── */}
            {step === 'reset' && (
              <>
                <h1 className="page-title" style={{ marginBottom: 4 }}>New Password</h1>
                <p className="page-subtitle" style={{ marginBottom: 24 }}>Choose a strong password for your account.</p>
                <div className="card fade-up">
                  <form onSubmit={resetPassword}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            className="form-input"
                            type={showPw ? 'text' : 'password'}
                            required autoFocus
                            value={newPassword} onChange={e => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            style={{ paddingRight: 38 }}
                          />
                          <button type="button" onClick={() => setShowPw(v => !v)}
                            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}>
                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        <PasswordStrength password={newPassword} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                          className="form-input"
                          type={showPw ? 'text' : 'password'}
                          required
                          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                        />
                        {confirmPassword && newPassword && confirmPassword !== newPassword && (
                          <span style={{ fontSize: 12, color: 'var(--red)', marginTop: 3 }}>Passwords do not match</span>
                        )}
                        {confirmPassword && newPassword && confirmPassword === newPassword && (
                          <span style={{ fontSize: 12, color: '#1d8a5a', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>✓ Passwords match</span>
                        )}
                      </div>
                    </div>
                    <button className="btn btn-gold" type="submit" disabled={loading || newPassword !== confirmPassword}
                      style={{ width: '100%', justifyContent: 'center' }}>
                      {loading ? 'Resetting…' : 'Reset Password'}
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* ── Step: Done ── */}
            {step === 'done' && (
              <div className="card fade-up" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <CheckCircle size={48} color="#1d8a5a" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Password Reset!</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: 24, fontSize: 14 }}>Your password has been updated. You can now sign in with your new password.</p>
                <button className="btn btn-gold" onClick={() => navigate('/login')} style={{ justifyContent: 'center' }}>
                  Go to Sign In
                </button>
              </div>
            )}

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
              {['email', 'otp', 'reset', 'done'].map(s => (
                <div key={s} style={{
                  width: s === step ? 20 : 6, height: 6, borderRadius: 3,
                  background: s === step ? 'var(--gold)' : 'var(--border)',
                  transition: 'all 0.3s'
                }} />
              ))}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}