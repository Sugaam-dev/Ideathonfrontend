import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ArrowLeft, FileText, ExternalLink, Pencil, Lock } from 'lucide-react'

const STATUS_CLASS = {
  'Submitted': 'badge-submitted',
  'Under Review': 'badge-review', 'Shortlisted': 'badge-shortlisted',
  'Selected': 'badge-selected', 'Interview Scheduled': 'badge-interview',
  'Incubation Phase': 'badge-incubation', 'Closed': 'badge-closed',
}

// Only "Submitted" allows editing
const EDITABLE_STATUSES = ['Submitted']

const Row = ({ k, v }) => v ? (
  <div className="detail-row">
    <span className="detail-key">{k}</span>
    <span className="detail-val">{v}</span>
  </div>
) : null

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

function EditModal({ idea, onClose, onSave }) {
  const [form, setForm] = useState({
    title: idea.title || '',
    problem_statement: idea.problem_statement || '',
    proposed_solution: idea.proposed_solution || '',
    target_audience: idea.target_audience || '',
    market_opportunity: idea.market_opportunity || '',
    competitive_advantage: idea.competitive_advantage || '',
    business_impact: idea.business_impact || '',
    scalability: idea.scalability || '',
    tech_requirements: idea.tech_requirements || '',
    figma_link: idea.figma_link || '',
    github_link: idea.github_link || '',
    drive_link: idea.drive_link || '',
    demo_url: idea.demo_url || '',
  })
  const [saving, setSaving] = useState(false)

  const set = k => e => {
    const max = MAX_LENGTH[k]
    if (max && e.target.value.length > max) return
    setForm(f => ({ ...f, [k]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.problem_statement.trim() || !form.proposed_solution.trim()) {
      toast.error('Title, Problem Statement and Proposed Solution are required')
      return
    }
    setSaving(true)
    try {
      await api.put(`/ideas/${idea.id}`, form)
      toast.success('Idea updated successfully')
      onSave(form)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update idea')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '20px 16px', overflowY: 'auto',
      }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div style={{
          background: '#fff', borderRadius: 14, padding: '28px 28px 24px',
          width: '100%', maxWidth: 680, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          margin: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Edit Idea</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Idea Title <span className="req">*</span></label>
              <input className="form-input" value={form.title} onChange={set('title')} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.title.length}/{MAX_LENGTH.title}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Problem Statement <span className="req">*</span></label>
              <textarea className="form-textarea" rows={4} value={form.problem_statement} onChange={set('problem_statement')} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.problem_statement.length}/{MAX_LENGTH.problem_statement}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Proposed Solution <span className="req">*</span></label>
              <textarea className="form-textarea" rows={5} value={form.proposed_solution} onChange={set('proposed_solution')} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.proposed_solution.length}/{MAX_LENGTH.proposed_solution}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <textarea className="form-textarea" rows={2} value={form.target_audience} onChange={set('target_audience')} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.target_audience.length}/{MAX_LENGTH.target_audience}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Market Opportunity</label>
                <textarea className="form-textarea" rows={2} value={form.market_opportunity} onChange={set('market_opportunity')} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.market_opportunity.length}/{MAX_LENGTH.market_opportunity}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Competitive Advantage</label>
                <textarea className="form-textarea" rows={2} value={form.competitive_advantage} onChange={set('competitive_advantage')} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.competitive_advantage.length}/{MAX_LENGTH.competitive_advantage}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Business Impact</label>
                <textarea className="form-textarea" rows={2} value={form.business_impact} onChange={set('business_impact')} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.business_impact.length}/{MAX_LENGTH.business_impact}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Scalability</label>
                <textarea className="form-textarea" rows={2} value={form.scalability} onChange={set('scalability')} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{form.scalability.length}/{MAX_LENGTH.scalability}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Tech Requirements</label>
                <input className="form-input" value={form.tech_requirements} onChange={set('tech_requirements')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['Figma Link', 'figma_link'], ['GitHub Link', 'github_link'], ['Drive Link', 'drive_link'], ['Demo URL', 'demo_url']].map(([label, key]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" value={form[key]} onChange={set(key)} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function IdeaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    api.get(`/ideas/${id}`).then(r => setIdea(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <><Navbar /><div className="page-loading"><div className="spinner" /></div></>
  if (!idea) return <><Navbar /><div className="page"><div className="container"><p>Not found.</p></div></div></>

  const canEdit = EDITABLE_STATUSES.includes(idea.status)

  const handleSave = (updated) => {
    setIdea(prev => ({ ...prev, ...updated }))
    setEditing(false)
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{idea.submission_id}</div>
                <h1 className="page-title" style={{ fontSize: 28 }}>{idea.title}</h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${STATUS_CLASS[idea.status] || 'badge-review'}`} style={{ padding: '8px 16px', fontSize: 12 }}>{idea.status}</span>
                {canEdit ? (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditing(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', padding: '5px 10px', background: 'var(--bg2)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <Lock size={12} /> Locked
                  </div>
                )}
              </div>
            </div>

            {/* Edit status notice */}
            {canEdit ? (
              <div style={{ marginTop: 10, padding: '8px 14px', background: 'rgba(29,138,90,0.08)', border: '1px solid rgba(29,138,90,0.2)', borderRadius: 8, fontSize: 12, color: '#1d8a5a' }}>
                ✏️ Your idea is editable. Once moved to <strong>Under Review</strong> by our team, editing will be locked.
              </div>
            ) : (
              <div style={{ marginTop: 10, padding: '8px 14px', background: 'rgba(214,63,90,0.06)', border: '1px solid rgba(214,63,90,0.15)', borderRadius: 8, fontSize: 12, color: 'var(--red)' }}>
                🔒 This idea is under review and can no longer be edited.
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Core Details</h3>
                <Row k="Category" v={idea.category} />
                <Row k="Current Stage" v={idea.current_stage} />
                <Row k="Problem Statement" v={idea.problem_statement} />
                <Row k="Proposed Solution" v={idea.proposed_solution} />
                {/* Idea Summary removed */}
                <Row k="Target Audience" v={idea.target_audience} />
              </div>

              {(idea.market_opportunity || idea.competitive_advantage || idea.revenue_model) && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Business Details</h3>
                  <Row k="Market Opportunity" v={idea.market_opportunity} />
                  <Row k="Competitive Advantage" v={idea.competitive_advantage} />
                  <Row k="Revenue Model" v={idea.revenue_model} />
                </div>
              )}

              {(idea.business_impact || idea.scalability || idea.tech_requirements) && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Impact Assessment</h3>
                  <Row k="Business Impact" v={idea.business_impact} />
                  <Row k="Scalability" v={idea.scalability} />
                  <Row k="Tech Requirements" v={idea.tech_requirements} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Submission Info</h3>
                <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Submitted:</span> {new Date(idea.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  {idea.evaluation_score !== null && idea.evaluation_score !== undefined && (
                    <div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>Evaluation Score</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="score-bar" style={{ flex: 1 }}>
                          <div className="score-fill" style={{ width: `${(idea.evaluation_score / 100) * 100}%` }} />
                        </div>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--gold)' }}>{idea.evaluation_score?.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {idea.reviewer_notes && (
                    <div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Reviewer Notes</div>
                      <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px', lineHeight: 1.6 }}>{idea.reviewer_notes}</div>
                    </div>
                  )}
                </div>
              </div>

              {(idea.figma_link || idea.github_link || idea.drive_link || idea.demo_url) && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Links</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[['Figma', idea.figma_link], ['GitHub', idea.github_link], ['Google Drive', idea.drive_link], ['Demo', idea.demo_url]].filter(([, v]) => v).map(([label, url]) => (
                      <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gold)', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                        <ExternalLink size={13} /> {label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {idea.attachments?.length > 0 && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Attachments ({idea.attachments.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {idea.attachments.map(a => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, fontSize: 13 }}>
                        <FileText size={13} color="var(--gold)" />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.original_name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{(a.file_size / 1024).toFixed(0)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ height: 60 }} />
      </div>

      {editing && <EditModal idea={idea} onClose={() => setEditing(false)} onSave={handleSave} />}

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </>
  )
}