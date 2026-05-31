import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react'

const STATUS_CLASS = {
  'Under Review': 'badge-review', 'Shortlisted': 'badge-shortlisted',
  'Selected': 'badge-selected', 'Interview Scheduled': 'badge-interview',
  'Incubation Phase': 'badge-incubation', 'Closed': 'badge-closed', 'Submitted': 'badge-submitted'
}

const Row = ({ k, v }) => v ? (
  <div className="detail-row">
    <span className="detail-key">{k}</span>
    <span className="detail-val">{v}</span>
  </div>
) : null

export default function IdeaDetail() {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/ideas/${id}`).then(r => setIdea(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <><Navbar /><div className="page-loading"><div className="spinner" /></div></>
  if (!idea) return <><Navbar /><div className="page"><div className="container"><p>Not found.</p></div></div></>

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
              <span className={`badge ${STATUS_CLASS[idea.status] || 'badge-review'}`} style={{ padding: '8px 16px', fontSize: 12 }}>{idea.status}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Core Details</h3>
                <Row k="Category" v={idea.category} />
                <Row k="Current Stage" v={idea.current_stage} />
                <Row k="Problem Statement" v={idea.problem_statement} />
                <Row k="Proposed Solution" v={idea.proposed_solution} />
                <Row k="Idea Summary" v={idea.idea_summary} />
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
    </>
  )
}
