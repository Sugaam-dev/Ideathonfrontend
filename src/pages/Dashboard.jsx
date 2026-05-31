import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { Plus, Eye, Clock } from 'lucide-react'

const STATUS_CLASS = {
  'Under Review': 'badge-review', 'Shortlisted': 'badge-shortlisted',
  'Selected': 'badge-selected', 'Interview Scheduled': 'badge-interview',
  'Incubation Phase': 'badge-incubation', 'Closed': 'badge-closed', 'Submitted': 'badge-submitted'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ideas/my').then(r => setIdeas(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p className="section-title">Welcome back</p>
              <h1 className="page-title">{user?.name}</h1>
              <p className="page-subtitle">{user?.email} {user?.organization ? `· ${user.organization}` : ''}</p>
            </div>
            <Link to="/submit" className="btn btn-gold">
              <Plus size={16} /> Submit Idea
            </Link>
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: 32 }}>
            {[
              { label: 'Total Submitted', value: ideas.length, color: 'var(--text)' },
              { label: 'Under Review', value: ideas.filter(i => i.status === 'Under Review').length, color: 'var(--blue)' },
              { label: 'Shortlisted', value: ideas.filter(i => i.status === 'Shortlisted').length, color: 'var(--green)' },
              { label: 'Selected', value: ideas.filter(i => i.status === 'Selected').length, color: 'var(--gold)' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value" style={{ color: s.color, fontSize: 28 }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Ideas Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>My Submissions</h2>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
            ) : ideas.length === 0 ? (
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💡</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No ideas yet</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 20 }}>Submit your first idea and start your innovation journey.</div>
                <Link to="/submit" className="btn btn-gold btn-sm"><Plus size={14} /> Submit Idea</Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Stage</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ideas.map(idea => (
                      <tr key={idea.id}>
                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>{idea.submission_id}</td>
                        <td style={{ fontWeight: 500 }}>{idea.title}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-dim)' }}>{idea.category}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-dim)' }}>{idea.current_stage}</td>
                        <td><span className={`badge ${STATUS_CLASS[idea.status] || 'badge-review'}`}>{idea.status}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                          {new Date(idea.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <Link to={`/ideas/${idea.id}`} className="btn btn-ghost btn-sm">
                            <Eye size={13} /> View
                          </Link>
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
    </>
  )
}
