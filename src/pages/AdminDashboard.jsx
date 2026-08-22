import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import { Search, Eye, Users, Lightbulb, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

const STATUS_CLASS = {
  'Under Review': 'badge-review', 'Shortlisted': 'badge-shortlisted',
  'Selected': 'badge-selected', 'Interview Scheduled': 'badge-interview',
  'Incubation Phase': 'badge-incubation', 'Closed': 'badge-closed', 'Submitted': 'badge-submitted'
}

const STATUSES = ['', 'Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Incubation Phase', 'Closed']
const CATEGORIES = ['', 'AI / ML', 'SaaS', 'FinTech', 'EdTech', 'HealthTech', 'Sustainability', 'Productivity', 'Other']
const ROLES = ['', 'PARTICIPANT', 'ADMIN', 'JURY']
const USER_STATUSES = [
  { label: 'All Statuses', value: '' },
  { label: 'Active / Verified', value: 'true' },
  { label: 'Pending OTP Verification', value: 'false' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('ideas') // 'ideas' | 'users'
  const [stats, setStats] = useState(null)

  // Ideas state
  const [ideas, setIdeas] = useState([])
  const [ideasSearch, setIdeasSearch] = useState('')
  const [ideasStatus, setIdeasStatus] = useState('')
  const [ideasCategory, setIdeasCategory] = useState('')
  const [ideasLoading, setIdeasLoading] = useState(true)
  const [ideasPage, setIdeasPage] = useState(1)
  const [ideasLimit] = useState(25)

  // Users state
  const [users, setUsers] = useState([])
  const [usersSearch, setUsersSearch] = useState('')
  const [usersRole, setUsersRole] = useState('')
  const [usersActiveStatus, setUsersActiveStatus] = useState('')
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersPage, setUsersPage] = useState(1)
  const [usersLimit] = useState(25)

  // Fetch KPI Stats
  const loadStats = () => {
    api.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(err => console.error('Failed to load stats', err))
  }

  useEffect(() => {
    loadStats()
  }, [])

  // Fetch Ideas
  useEffect(() => {
    setIdeasLoading(true)
    const params = {
      page: ideasPage,
      limit: ideasLimit,
    }
    if (ideasStatus) params.status = ideasStatus
    if (ideasCategory) params.category = ideasCategory
    if (ideasSearch) params.search = ideasSearch

    api.get('/admin/ideas', { params })
      .then(r => {
        setIdeas(Array.isArray(r.data) ? r.data : [])
      })
      .catch(err => {
        console.error('Failed to fetch ideas', err)
        setIdeas([])
      })
      .finally(() => setIdeasLoading(false))
  }, [ideasStatus, ideasCategory, ideasSearch, ideasPage, ideasLimit])

  // Fetch Users
  useEffect(() => {
    setUsersLoading(true)
    const params = {
      page: usersPage,
      limit: usersLimit,
    }
    if (usersRole) params.role = usersRole
    if (usersActiveStatus !== '') params.is_active = usersActiveStatus === 'true'
    if (usersSearch) params.search = usersSearch

    api.get('/admin/users', { params })
      .then(r => {
        setUsers(Array.isArray(r.data) ? r.data : [])
      })
      .catch(err => {
        console.error('Failed to fetch users', err)
        setUsers([])
      })
      .finally(() => setUsersLoading(false))
  }, [usersRole, usersActiveStatus, usersSearch, usersPage, usersLimit])

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <p className="section-title">Administration</p>
            <h1 className="page-title">Ideathon Admin</h1>
            <p className="page-subtitle">Manage submissions, evaluate ideas, audit user accounts, and track progress.</p>
          </div>

          {/* Stats KPI Cards */}
          {stats && (
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[
                { label: 'Total Accounts', value: stats.total_all_accounts || stats.total_participants, color: 'var(--text)' },
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

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`btn ${activeTab === 'ideas' ? 'btn-gold' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px' }}
            >
              <Lightbulb size={16} />
              Submissions ({ideas.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`btn ${activeTab === 'users' ? 'btn-gold' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px' }}
            >
              <Users size={16} />
              Registered Accounts ({users.length})
            </button>
          </div>

          {/* TAB 1: IDEAS / SUBMISSIONS */}
          {activeTab === 'ideas' && (
            <>
              {/* Ideas Filters */}
              <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      style={{ paddingLeft: 34 }}
                      placeholder="Search by title, participant name, email, ID…"
                      value={ideasSearch}
                      onChange={e => { setIdeasSearch(e.target.value); setIdeasPage(1); }}
                    />
                  </div>
                  <select
                    className="form-select"
                    style={{ width: 160 }}
                    value={ideasStatus}
                    onChange={e => { setIdeasStatus(e.target.value); setIdeasPage(1); }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
                  </select>
                  <select
                    className="form-select"
                    style={{ width: 160 }}
                    value={ideasCategory}
                    onChange={e => { setIdeasCategory(e.target.value); setIdeasPage(1); }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
                  </select>
                </div>
              </div>

              {/* Ideas Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600 }}>Submissions List ({ideas.length})</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={ideasPage <= 1}
                      onClick={() => setIdeasPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Page {ideasPage}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={ideas.length < ideasLimit}
                      onClick={() => setIdeasPage(p => p + 1)}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {ideasLoading ? (
                  <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                ) : ideas.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-dim)' }}>No submissions found matching criteria.</div>
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
                            <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{idea.id ? idea.id.slice(0, 8) : '—'}</td>
                            <td style={{ fontWeight: 500, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.title}</td>
                            <td>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{idea.submitter_name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{idea.submitter_email}</div>
                            </td>
                            <td style={{ fontSize: 12, color: 'var(--text-dim)' }} className="admin-table-hide">{idea.category}</td>
                            <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: idea.evaluation_score ? 'var(--gold)' : 'var(--text-muted)' }} className="admin-table-hide">
                              {idea.evaluation_score ? idea.evaluation_score.toFixed(1) : '—'}
                            </td>
                            <td><span className={`badge ${STATUS_CLASS[idea.status] || 'badge-review'}`}>{idea.status}</span></td>
                            <td style={{ fontSize: 11, color: 'var(--text-muted)' }} className="admin-table-hide">
                              {idea.submitted_at ? new Date(idea.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
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
            </>
          )}

          {/* TAB 2: REGISTERED ACCOUNTS */}
          {activeTab === 'users' && (
            <>
              {/* Users Filters */}
              <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      className="form-input"
                      style={{ paddingLeft: 34 }}
                      placeholder="Search accounts by name, email, phone, organization…"
                      value={usersSearch}
                      onChange={e => { setUsersSearch(e.target.value); setUsersPage(1); }}
                    />
                  </div>
                  <select
                    className="form-select"
                    style={{ width: 160 }}
                    value={usersRole}
                    onChange={e => { setUsersRole(e.target.value); setUsersPage(1); }}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r ? `Role: ${r}` : 'All Roles'}</option>)}
                  </select>
                  <select
                    className="form-select"
                    style={{ width: 200 }}
                    value={usersActiveStatus}
                    onChange={e => { setUsersActiveStatus(e.target.value); setUsersPage(1); }}
                  >
                    {USER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600 }}>Registered User Accounts ({users.length})</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={usersPage <= 1}
                      onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Page {usersPage}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={users.length < usersLimit}
                      onClick={() => setUsersPage(p => p + 1)}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {usersLoading ? (
                  <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                ) : users.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-dim)' }}>No registered user accounts found.</div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>User Profile</th>
                          <th>Contact & Org</th>
                          <th>Role</th>
                          <th>Verification Status</th>
                          <th>Ideas Submitted</th>
                          <th>Registered Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>{u.email}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: 12 }}>{u.organization || '—'}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{u.phone || 'No phone'}</div>
                            </td>
                            <td>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                background: u.role === 'ADMIN' ? '#fdf0f2' : u.role === 'JURY' ? '#eff6ff' : 'var(--bg2)',
                                color: u.role === 'ADMIN' ? 'var(--red)' : u.role === 'JURY' ? 'var(--blue)' : 'var(--text-dim)',
                                border: '1px solid var(--border)'
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              {u.is_active ? (
                                <span className="badge badge-shortlisted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <CheckCircle2 size={12} /> Active / Verified
                                </span>
                              ) : (
                                <span className="badge badge-closed" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}>
                                  <AlertCircle size={12} /> Pending OTP
                                </span>
                              )}
                            </td>
                            <td>
                              <span style={{
                                fontFamily: "'DM Mono', monospace",
                                fontWeight: 600,
                                fontSize: 12,
                                padding: '2px 8px',
                                borderRadius: 12,
                                background: u.ideas_count > 0 ? '#ede9fb' : 'var(--bg2)',
                                color: u.ideas_count > 0 ? 'var(--gold)' : 'var(--text-muted)'
                              }}>
                                {u.ideas_count} {u.ideas_count === 1 ? 'idea' : 'ideas'}
                              </span>
                            </td>
                            <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div style={{ height: 60 }} />
      </div>
      <Footer />
    </>
  )
}