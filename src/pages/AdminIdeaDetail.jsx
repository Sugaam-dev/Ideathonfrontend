import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ArrowLeft, FileText, ExternalLink, Star } from 'lucide-react'

const STATUS_CLASS = {
  'Under Review': 'badge-review', 'Shortlisted': 'badge-shortlisted',
  'Selected': 'badge-selected', 'Interview Scheduled': 'badge-interview',
  'Incubation Phase': 'badge-incubation', 'Closed': 'badge-closed', 'Submitted': 'badge-submitted'
}
const STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Incubation Phase', 'Closed']

const Row = ({ k, v }) => v ? (
  <div className="detail-row"><span className="detail-key">{k}</span><span className="detail-val">{v}</span></div>
) : null

function ScoreSlider({ label, value, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{label} (25%)</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--gold)' }}>{value}/100</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--gold)' }} />
      <div className="score-bar"><div className="score-fill" style={{ width: `${value}%` }} /></div>
    </div>
  )
}

export default function AdminIdeaDetail() {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [scores, setScores] = useState({ innovation: 50, feasibility: 50, market: 50, scalability: 50 })
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [evalSaving, setEvalSaving] = useState(false)

  useEffect(() => {
    api.get(`/admin/ideas/${id}`).then(r => {
      setIdea(r.data)
      setNewStatus(r.data.status)
    }).finally(() => setLoading(false))
  }, [id])

  const updateStatus = async () => {
    setSaving(true)
    try {
      await api.put(`/admin/ideas/${id}/status`, { status: newStatus })
      setIdea(p => ({ ...p, status: newStatus }))
      toast.success('Status updated')
    } catch { toast.error('Failed to update status') }
    finally { setSaving(false) }
  }

  const submitEval = async () => {
    setEvalSaving(true)
    try {
      const res = await api.post(`/admin/ideas/${id}/evaluate`, {
        innovation_score: scores.innovation, feasibility_score: scores.feasibility,
        market_score: scores.market, scalability_score: scores.scalability, comments
      })
      setIdea(p => ({ ...p, evaluation_score: res.data.average_score, reviewer_notes: comments }))
      toast.success(`Evaluation saved · Average: ${res.data.average_score.toFixed(1)}`)
    } catch { toast.error('Failed to save evaluation') }
    finally { setEvalSaving(false) }
  }

  if (loading) return <><Navbar /><div className="page-loading"><div className="spinner" /></div></>
  if (!idea) return <><Navbar /><div className="page"><div className="container"><p>Not found.</p></div></div></>

  const avg = (scores.innovation + scores.feasibility + scores.market + scores.scalability) / 4

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <Link to="/admin" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
              <ArrowLeft size={14} /> Back to Admin
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{idea.submission_id}</div>
                <h1 className="page-title" style={{ fontSize: 28 }}>{idea.title}</h1>
              </div>
              <span className={`badge ${STATUS_CLASS[idea.status] || 'badge-review'}`} style={{ padding: '8px 16px', fontSize: 12 }}>{idea.status}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 24, alignItems: 'start' }} className="admin-detail-grid">
            {/* Main */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Participant */}
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Participant</h3>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</div><div>{idea.submitter_name}</div></div>
                  <div><div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</div><div>{idea.submitter_email}</div></div>
                  {idea.submitter_phone && <div><div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</div><div>{idea.submitter_phone}</div></div>}
                  {idea.organization && <div><div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Org</div><div>{idea.organization}</div></div>}
                  {idea.department && <div><div style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dept</div><div>{idea.department}</div></div>}
                  {idea.linkedin && <div><a href={idea.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontSize: 13 }}>LinkedIn ↗</a></div>}
                </div>
              </div>

              {/* Idea Content */}
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Idea Details</h3>
                <Row k="Category" v={idea.category} />
                <Row k="Current Stage" v={idea.current_stage} />
                <Row k="Problem Statement" v={idea.problem_statement} />
                <Row k="Proposed Solution" v={idea.proposed_solution} />
                <Row k="Idea Summary" v={idea.idea_summary} />
                <Row k="Target Audience" v={idea.target_audience} />
                <Row k="Market Opportunity" v={idea.market_opportunity} />
                <Row k="Competitive Advantage" v={idea.competitive_advantage} />
                <Row k="Revenue Model" v={idea.revenue_model} />
                <Row k="Business Impact" v={idea.business_impact} />
                <Row k="Scalability" v={idea.scalability} />
                <Row k="Tech Requirements" v={idea.tech_requirements} />
              </div>

              {/* Previous Evaluations */}
              {idea.evaluations?.length > 0 && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Evaluation History</h3>
                  {idea.evaluations.map(e => (
                    <div key={e.id} style={{ padding: '12px', background: 'var(--bg3)', borderRadius: 8, marginBottom: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
                        {[['Innovation', e.innovation_score], ['Feasibility', e.feasibility_score], ['Market', e.market_score], ['Scale', e.scalability_score]].map(([l, v]) => (
                          <div key={l}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{l}</div>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, color: 'var(--gold)' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      {e.comments && <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{e.comments}</div>}
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{new Date(e.evaluated_at).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Status Control */}
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Update Status</h3>
                <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ marginBottom: 12 }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={updateStatus} disabled={saving}>
                  {saving ? 'Saving…' : 'Update Status'}
                </button>
              </div>

              {/* Evaluation */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Star size={16} color="var(--gold)" />
                  <h3 style={{ fontWeight: 600 }}>Evaluation</h3>
                  <div style={{ marginLeft: 'auto', fontFamily: "'DM Mono', monospace", fontSize: 18, color: 'var(--gold)' }}>{avg.toFixed(1)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                  <ScoreSlider label="Innovation" value={scores.innovation} onChange={v => setScores(s => ({ ...s, innovation: v }))} />
                  <ScoreSlider label="Feasibility" value={scores.feasibility} onChange={v => setScores(s => ({ ...s, feasibility: v }))} />
                  <ScoreSlider label="Market Potential" value={scores.market} onChange={v => setScores(s => ({ ...s, market: v }))} />
                  <ScoreSlider label="Scalability" value={scores.scalability} onChange={v => setScores(s => ({ ...s, scalability: v }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Reviewer Notes</label>
                  <textarea className="form-textarea" value={comments} onChange={e => setComments(e.target.value)} placeholder="Add feedback for the participant…" rows={3} />
                </div>
                <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={submitEval} disabled={evalSaving}>
                  {evalSaving ? 'Saving…' : 'Save Evaluation'}
                </button>
              </div>

              {/* Links */}
              {(idea.figma_link || idea.github_link || idea.drive_link || idea.demo_url) && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Links</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[['Figma', idea.figma_link], ['GitHub', idea.github_link], ['Drive', idea.drive_link], ['Demo', idea.demo_url]].filter(([, v]) => v).map(([label, url]) => (
                      <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gold)', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                        <ExternalLink size={13} /> {label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {idea.attachments?.length > 0 && (
                <div className="card">
                  <h3 style={{ fontWeight: 600, marginBottom: 14 }}>Attachments ({idea.attachments.length})</h3>
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
    </>
  )
}