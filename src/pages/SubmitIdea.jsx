import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Upload, X, FileText, ArrowRight, ArrowLeft, HelpCircle, Info } from 'lucide-react'

const CATEGORIES = ['AI / ML', 'SaaS', 'FinTech', 'EdTech', 'HealthTech', 'Sustainability', 'Productivity', 'Other']
const STAGES = ['Concept', 'Prototype', 'MVP', 'Working Product']

const TERMS = [
  { title: 'Participation', text: 'PMRG Solution may conduct internal ideathons, innovation challenges, prototype contests, or founder-led brainstorming initiatives.' },
  { title: 'Rewards', text: 'Selected ideas may receive monetary benefits, innovation rewards, incubation support, productization assistance, or founder mentoring.' },
  { title: 'Future Opportunities', text: 'Exceptional ideas with strong commercial potential may be considered for co-founder, founding member, or equity-linked contributor opportunities.' },
  { title: 'No Automatic Rights', text: 'Participation does not create any automatic claim over equity, ownership, compensation, employment, co-founder status, or intellectual property.' },
  { title: 'Separate Evaluation', text: 'Any equity or co-founder opportunity will require due diligence, management approval, legal review, and separate written agreements.' },
]

const HELP = {
  target_audience: 'Who will use or benefit from your solution? Be specific — e.g. "small business owners aged 25–45 who manage inventory manually" rather than just "businesses".',
  market_opportunity: 'How large is the problem you are solving? Mention the estimated number of people affected, industry size, or any data that shows there is real demand.',
  competitive_advantage: 'What makes your idea better or different from existing solutions? Think about unique features, cost, speed, technology, or access.',
  scalability: 'Can this idea grow beyond its initial scope? Explain how it could serve more users, expand to new markets, or increase revenue without proportional increases in cost.',
  business_impact: 'What measurable value will this create for PMRG or its clients? Think in terms of revenue, cost savings, efficiency gains, or user growth.',
  tech_requirements: 'What technologies, tools, platforms, or infrastructure will be needed to build this? E.g. "React frontend, Python backend, OpenAI API, cloud hosting".',
  problem_statement: 'Describe the specific pain point or gap that exists today. Who faces this problem and how does it affect them?',
  proposed_solution: 'Explain clearly how your idea solves the problem described above. What will it do and how will it work?',
}

const MAX_LENGTH = {
  title: 1200,
  problem_statement: 6000,
  proposed_solution: 30000,
  target_audience: 3000,
  market_opportunity: 3000,
  competitive_advantage: 3000,
  business_impact: 3000,
  scalability: 3000,
}

const MIN_LENGTH = {
  title: 10,
  problem_statement: 80,
  proposed_solution: 80,
  target_audience: 30,
  market_opportunity: 50,
  competitive_advantage: 50,
  scalability: 50,
  business_impact: 50,
  tech_requirements: 30,
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 4px', color: open ? 'var(--gold)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}
        aria-label="Help"
      >
        <HelpCircle size={13} />
      </button>
      {open && (
        <>
          <span onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 48 }} />
          <span style={{
            position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 49,
            background: '#1a1535', color: '#f0ede8', fontSize: 13, lineHeight: 1.65,
            padding: '14px 16px', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8f6ee8', marginBottom: 6 }}>What we expect</span>
            {text}
          </span>
        </>
      )}
    </>
  )
}

// ── Step Bar ──────────────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = ['Idea Details', 'Files & Links', 'Review & Submit']
  const visual = step - 1
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? '1' : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, flexShrink: 0,
              border: `1.5px solid ${i < visual ? '#0f0f0f' : i === visual ? '#0f0f0f' : 'var(--border)'}`,
              background: i < visual ? '#0f0f0f' : '#fff',
              color: i < visual ? '#fff' : i === visual ? '#0f0f0f' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}>
              {i < visual ? '✓' : i + 1}
            </div>
            <span style={{
              fontSize: 10, whiteSpace: 'nowrap', letterSpacing: '0.03em',
              color: i === visual ? '#0f0f0f' : 'var(--text-muted)',
              fontWeight: i === visual ? 600 : 400,
            }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < visual ? '#0f0f0f' : 'var(--border)', marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Field with optional help + char counter ───────────────────────────────────
function Field({ label, required, helpKey, children, value, minLen, maxLen }) {
  const len = (value || '').length
  const trimLen = (value || '').trim().length
  const min = minLen || MIN_LENGTH[helpKey] || 0
  const max = maxLen || MAX_LENGTH[helpKey] || 0
  const short = min > 0 && trimLen > 0 && trimLen < min
  const over = max > 0 && len > max
  return (
    <div className="form-group">
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {label}
        {required && <span className="req">*</span>}
        {helpKey && HELP[helpKey] && <Tooltip text={HELP[helpKey]} />}
      </label>
      {children}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: 11, color: short ? '#cc3333' : over ? '#cc3333' : 'var(--text-muted)' }}>
          {short ? `Minimum ${min} characters required` : over ? `Exceeds maximum of ${max} characters` : ''}
        </span>
        {max > 0 && (
          <span style={{ fontSize: 11, color: over ? '#cc3333' : len >= min ? 'var(--text-muted)' : '#cc3333' }}>
            {len}/{max}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Terms Step ────────────────────────────────────────────────────────────────
function TermsStep({ onAccept, onBack }) {
  const [checked, setChecked] = useState(false)
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>Terms & Conditions</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 24 }}>Please read and accept the following before submitting your idea.</p>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24,
          maxHeight: 320, overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }} className="terms-scroll">
          {TERMS.map(t => (
            <div key={t.title} style={{ padding: '12px 14px', background: 'var(--bg2)', borderRadius: 8, borderLeft: '3px solid #0f0f0f' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{t.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{t.text}</div>
            </div>
          ))}
        </div>
        <label className="check-row" style={{ marginBottom: 20 }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
          <span className="check-row-text">I have read and agree to all the Ideathon Terms and Conditions.</span>
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={onBack}><ArrowLeft size={15} /> Back</button>
          <button className="btn btn-gold" onClick={onAccept} disabled={!checked}>Continue <ArrowRight size={15} /></button>
        </div>
      </div>
    </div>
  )
}

// ── Idea Form ─────────────────────────────────────────────────────────────────
function IdeaForm({ data, setData, onNext, onBack }) {
  const set = k => e => {
    const max = MAX_LENGTH[k]
    if (max && e.target.value.length > max) return
    setData(d => ({ ...d, [k]: e.target.value }))
  }

  const validate = () => {
    const required = ['title', 'problem_statement', 'proposed_solution', 'category', 'target_audience', 'current_stage']
    for (const k of required) {
      if (!data[k] || !data[k].trim()) { toast.error('Please fill in all required fields'); return false }
    }
    for (const [k, min] of Object.entries(MIN_LENGTH)) {
      if (data[k] && data[k].trim().length < min) {
        toast.error(`"${k.replace(/_/g, ' ')}" needs at least ${min} characters`)
        return false
      }
    }
    return true
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>Idea Details</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 24 }}>Tell us about your innovation.</p>

      <p className="section-title">Basic Information</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Idea Title" required helpKey="title" value={data.title} minLen={MIN_LENGTH.title} maxLen={MAX_LENGTH.title}>
            <input className="form-input" value={data.title} onChange={set('title')} placeholder="A compelling name for your idea" />
          </Field>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Problem Statement" required helpKey="problem_statement" value={data.problem_statement} minLen={MIN_LENGTH.problem_statement} maxLen={MAX_LENGTH.problem_statement}>
            <textarea className="form-textarea" value={data.problem_statement} onChange={set('problem_statement')} placeholder="What specific problem does this solve?" rows={4} />
          </Field>
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Proposed Solution" required helpKey="proposed_solution" value={data.proposed_solution} minLen={MIN_LENGTH.proposed_solution} maxLen={MAX_LENGTH.proposed_solution}>
            <textarea className="form-textarea" value={data.proposed_solution} onChange={set('proposed_solution')} placeholder="How does your idea solve the problem?" rows={6} />
          </Field>
        </div>
        <div>
          <Field label="Innovation Category" required>
            <select className="form-select" value={data.category} onChange={set('category')}>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div>
          <Field label="Current Stage" required>
            <select className="form-select" value={data.current_stage} onChange={set('current_stage')}>
              <option value="">Select stage…</option>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="divider" />
      <p className="section-title">Detailed Description</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Target Audience" required helpKey="target_audience" value={data.target_audience} minLen={MIN_LENGTH.target_audience} maxLen={MAX_LENGTH.target_audience}>
            <textarea className="form-textarea" value={data.target_audience} onChange={set('target_audience')} placeholder="Who will use or benefit from this?" rows={3} />
          </Field>
          <Field label="Market Opportunity" helpKey="market_opportunity" value={data.market_opportunity} minLen={MIN_LENGTH.market_opportunity} maxLen={MAX_LENGTH.market_opportunity}>
            <textarea className="form-textarea" value={data.market_opportunity} onChange={set('market_opportunity')} placeholder="Market size, growth potential…" rows={3} />
          </Field>
          <Field label="Competitive Advantage" helpKey="competitive_advantage" value={data.competitive_advantage} minLen={MIN_LENGTH.competitive_advantage} maxLen={MAX_LENGTH.competitive_advantage}>
            <textarea className="form-textarea" value={data.competitive_advantage} onChange={set('competitive_advantage')} placeholder="Why better than existing solutions?" rows={3} />
          </Field>
        </div>
      </div>

      <div className="divider" />
      <p className="section-title">Impact Assessment</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Expected Business Impact" helpKey="business_impact" value={data.business_impact} minLen={MIN_LENGTH.business_impact} maxLen={MAX_LENGTH.business_impact}>
          <textarea className="form-textarea" value={data.business_impact} onChange={set('business_impact')} placeholder="Revenue, cost savings, efficiency gains…" rows={3} />
        </Field>
        <Field label="Scalability Potential" helpKey="scalability" value={data.scalability} minLen={MIN_LENGTH.scalability} maxLen={MAX_LENGTH.scalability}>
          <textarea className="form-textarea" value={data.scalability} onChange={set('scalability')} placeholder="How can this grow?" rows={3} />
        </Field>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Technology Requirements" helpKey="tech_requirements" value={data.tech_requirements} minLen={MIN_LENGTH.tech_requirements}>
            <input className="form-input" value={data.tech_requirements} onChange={set('tech_requirements')} placeholder="e.g. React, Python, OpenAI API, cloud hosting" />
          </Field>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-gold" onClick={() => validate() && onNext()}>Next → Files & Links</button>
      </div>
    </div>
  )
}

// ── Files Step ────────────────────────────────────────────────────────────────
function FilesStep({ data, setData, files, setFiles, onNext, onBack }) {
  const fileRef = useRef()
  const set = k => e => setData(d => ({ ...d, [k]: e.target.value }))

  const handleFiles = e => {
    const newFiles = Array.from(e.target.files)
    const totalSize = [...files, ...newFiles].reduce((s, f) => s + f.size, 0)
    if (totalSize > 25 * 1024 * 1024) { toast.error('Total file size exceeds 25 MB'); return }
    setFiles(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>Files & Links</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 24 }}>Attach supporting documents and links. All optional.</p>

      <p className="section-title">File Attachments</p>
      <div
        className="upload-zone"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]) }}
        style={{ marginBottom: 12 }}
      >
        <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}><Upload size={24} /></div>
        <div className="upload-zone-text"><span>Click to upload</span> or drag files here</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>PDF, PPT, DOC, ZIP, Images · Max 25 MB total</div>
      </div>
      <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={handleFiles}
        accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.png,.jpg,.jpeg,.gif" />
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {files.map((f, i) => (
            <div key={i} className="file-tag">
              <FileText size={11} />
              <span>{f.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>({(f.size / 1024).toFixed(0)} KB)</span>
              <button type="button" onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}><X size={11} /></button>
            </div>
          ))}
        </div>
      )}

      <div className="divider" />
      <p className="section-title">Additional Links</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Field label="Figma / Design Link">
          <input className="form-input" value={data.figma_link} onChange={set('figma_link')} placeholder="https://figma.com/..." />
        </Field>
        <Field label="GitHub Repository">
          <input className="form-input" value={data.github_link} onChange={set('github_link')} placeholder="https://github.com/..." />
        </Field>
        <Field label="Google Drive Link">
          <input className="form-input" value={data.drive_link} onChange={set('drive_link')} placeholder="https://drive.google.com/..." />
        </Field>
        <Field label="Demo URL">
          <input className="form-input" value={data.demo_url} onChange={set('demo_url')} placeholder="https://yourdemo.com" />
        </Field>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-gold" onClick={onNext}>Next → Review</button>
      </div>
    </div>
  )
}

// ── Review Step ───────────────────────────────────────────────────────────────
function ReviewStep({ data, files, userName, userOrg, onBack, onSubmit, loading }) {
  const [confirmed, setConfirmed] = useState(false)
  const fields = [
    ['Title', data.title], ['Category', data.category], ['Stage', data.current_stage],
    ['Problem Statement', data.problem_statement], ['Proposed Solution', data.proposed_solution],
    ['Target Audience', data.target_audience],
    ['Market Opportunity', data.market_opportunity], ['Competitive Advantage', data.competitive_advantage],
    ['Business Impact', data.business_impact], ['Scalability', data.scalability],
    ['Tech Requirements', data.tech_requirements],
  ]
  return (
    <div className="card">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.02em' }}>Review & Confirm</h2>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 24 }}>Check everything before final submit.</p>

      <p className="section-title">Participant</p>
      <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{userName || 'You'}</div>
        {userOrg && <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{userOrg}</div>}
      </div>

      <p className="section-title">Idea Summary</p>
      <div style={{ background: 'var(--bg2)', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        {fields.map(([k, v]) => v ? (
          <div key={k} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '150px 1fr', gap: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: 2 }}>{k}</span>
            <span style={{ fontSize: 13, lineHeight: 1.5 }}>{v}</span>
          </div>
        ) : null)}
      </div>

      {files.length > 0 && (
        <>
          <p className="section-title">Files</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {files.map((f, i) => <div key={i} className="file-tag"><FileText size={11} />{f.name}</div>)}
          </div>
        </>
      )}

      {/* Instructions for further proceedings */}
      <div style={{
        background: 'rgba(108,61,224,0.05)', border: '1px solid rgba(108,61,224,0.18)',
        borderRadius: 10, padding: '14px 16px', marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Info size={15} color="var(--gold)" />
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--gold)' }}>What happens after you submit?</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.9 }}>
          <li>Your idea will be marked <strong>Submitted</strong> immediately after submission.</li>
          <li>You can still <strong>edit your idea</strong> while it is in the <em>Submitted</em> state.</li>
          <li>Once moved to <strong>Under Review</strong>, no further edits are allowed.</li>
          <li>The review team typically takes <strong>3–7 working days</strong> to process each submission.</li>
          <li>The deadline for all submissions is <strong>June 30, 2025</strong>. Submit early to allow time for edits.</li>
          <li>You will be notified by email once your idea's status changes.</li>
        </ul>
      </div>

      <label className="check-row" style={{ marginBottom: 20 }}>
        <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
        <span className="check-row-text">I confirm all submitted information is accurate and original.</span>
      </label>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack} disabled={loading}>← Edit</button>
        <button className="btn btn-gold" onClick={onSubmit} disabled={!confirmed || loading}>
          {loading ? 'Submitting…' : '🚀 Final Submit'}
        </button>
      </div>
    </div>
  )
}

// ── Success Step ──────────────────────────────────────────────────────────────
function SuccessStep({ result }) {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ width: 56, height: 56, background: 'var(--bg2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>✨</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Idea Submitted!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: 16, fontSize: 14 }}>Your idea has been received and is now in the <strong>Submitted</strong> state.</p>

        <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '16px 20px', marginBottom: 20, display: 'inline-block' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Submission ID</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500 }}>{result?.submission_id}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Status: Submitted</div>
        </div>

        <div style={{
          background: 'rgba(108,61,224,0.05)', border: '1px solid rgba(108,61,224,0.18)',
          borderRadius: 10, padding: '14px 16px', marginBottom: 24, textAlign: 'left'
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gold)', marginBottom: 8 }}>Next Steps</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.9 }}>
            <li>You can <strong>edit your submission</strong> from the Dashboard while it shows <em>Submitted</em>.</li>
            <li>Once our team moves it to <strong>Under Review</strong>, editing is locked.</li>
            <li>Submissions close on <strong>June 30, 2025</strong>.</li>
            <li>Review takes <strong>3–7 working days</strong> — you'll be notified on status change.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/submit')}>Submit Another</button>
          <button className="btn btn-gold" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const emptyIdea = {
  title: '', problem_statement: '', proposed_solution: '', category: '',
  target_audience: '', market_opportunity: '', competitive_advantage: '',
  current_stage: '', business_impact: '', scalability: '', tech_requirements: '',
  figma_link: '', github_link: '', drive_link: '', demo_url: ''
}

export default function SubmitIdea() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [ideaData, setIdeaData] = useState(emptyIdea)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { user } = useAuth()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await api.post('/ideas', ideaData)
      const ideaId = res.data.idea_id
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        await api.post(`/ideas/${ideaId}/attachments`, fd)
      }
      setResult(res.data)
      setStep(4)
      toast.success('Idea submitted successfully!')
    } catch (err) {
      const detail = err.response?.data?.detail
      const errMsg = Array.isArray(detail)
        ? detail.map(e => e.msg || JSON.stringify(e)).join(', ')
        : typeof detail === 'string' ? detail : 'Submission failed. Please check all fields.'
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', paddingTop: 56, background: 'var(--bg2)' }}>
        <div style={{ maxWidth: '100%', padding: '32px 24px 60px' }}>

          <div style={{ maxWidth: 860, margin: '0 auto 24px' }}>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Submit Your Idea</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>PMRG Solution Ideathon & Innovation Challenge</p>
          </div>

          {step >= 1 && step <= 3 && (
            <div style={{ maxWidth: 860, margin: '0 auto 24px' }}>
              <StepBar step={step} />
            </div>
          )}

          <div style={{ maxWidth: step === 0 ? 680 : 860, margin: '0 auto' }}>
            {step === 0 && <TermsStep onAccept={() => setStep(1)} onBack={() => navigate('/dashboard')} />}
            {step === 1 && <IdeaForm data={ideaData} setData={setIdeaData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <FilesStep data={ideaData} setData={setIdeaData} files={files} setFiles={setFiles} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && (
              <ReviewStep
                data={ideaData} files={files}
                userName={user?.name} userOrg={user?.organization}
                onBack={() => setStep(2)} onSubmit={handleSubmit} loading={loading}
              />
            )}
            {step === 4 && <SuccessStep result={result} />}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-input, .form-select, .form-textarea { font-size: 16px !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 150px 1fr"] { grid-template-columns: 1fr !important; }
        }
        .form-select {
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 11px center;
        }
        .form-textarea { -webkit-appearance: none; }
        .btn { -webkit-appearance: none; cursor: pointer; }
        .terms-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <Footer />
    </>
  )
}