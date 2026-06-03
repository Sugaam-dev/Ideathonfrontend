import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import { Search, Eye } from 'lucide-react'

const STATUS_CLASS = {
  'Under Review': 'badge-review', 'Shortlisted': 'badge-shortlisted',
  'Selected': 'badge-selected', 'Interview Scheduled': 'badge-interview',
  'Incubation Phase': 'badge-incubation', 'Closed': 'badge-closed', 'Submitted': 'badge-submitted'
}

const STATUSES = ['', 'Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Incubation Phase', 'Closed']
const CATEGORIES = ['', 'AI / ML', 'SaaS', 'FinTech', 'EdTech', 'HealthTech', 'Sustainability', 'Productivity', 'Other']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)) }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (status) params.status = status
    if (category) params.category = category
    if (search) params.search = search
    api.get('/admin/ideas', { params }).then(r => setIdeas(r.data)).finally(() => setLoading(false))
  }, [status, category, search])

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <p className="section-title">Administration</p>
            <h1 className="page-title">Ideathon Admin</h1>
            <p className="page-subtitle">Manage submissions, evaluate ideas, and track progress.</p>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[
                { label: 'Total Participants', value: stats.total_participants, color: 'var(--text)' },
                { label: 'Total Ideas', value: stats.total_ideas, color: 'var(--blue)' },
                { label: 'Shortlisted', value: stats.shortlisted, color: 'var(--green)' },
                { label: 'Selected', value: stats.selected, color: 'var(--gold)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: 34 }} placeholder="Search by title, name, ID…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: 160 }} value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
              </select>
              <select className="form-select" style={{ width: 160 }} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
              </select>
            </div>
          </div>

          {/* Ideas Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>Submissions ({ideas.length})</h2>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : ideas.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-dim)' }}>No submissions found.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Participant</th>
                      <th className="admin-table-hide">Category</th>
                      <th className="admin-table-hide">Score</th>
                      <th>Status</th>
                      <th className="admin-table-hide">Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map(idea => (
                      <tr key={idea.id}>
                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{idea.submission_id}</td>
                        <td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.title}</td>
                        <td>
                          <div style={{ fontSize: 13 }}>{idea.submitter_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{idea.submitter_email}</div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-dim)' }} className="admin-table-hide">{idea.category}</td>
                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: idea.evaluation_score ? 'var(--gold)' : 'var(--text-muted)' }} className="admin-table-hide">
                          {idea.evaluation_score ? idea.evaluation_score.toFixed(1) : '—'}
                        </td>
                        <td><span className={`badge ${STATUS_CLASS[idea.status] || 'badge-review'}`}>{idea.status}</span></td>
                        <td style={{ fontSize: 11, color: 'var(--text-muted)' }} className="admin-table-hide">
                          {new Date(idea.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                        <td>
                          <Link to={`/admin/ideas/${idea.id}`} className="btn btn-ghost btn-sm"><Eye size={13} /> Review</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 60 }} />
      </div>
      <Footer />
    </>
  )
}