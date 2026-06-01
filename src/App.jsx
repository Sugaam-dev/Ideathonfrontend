import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import SubmitIdea from './pages/SubmitIdea'
import Dashboard from './pages/Dashboard'
import IdeaDetail from './pages/IdeaDetail'
import AdminDashboard from './pages/AdminDashboard'
import AdminIdeaDetail from './pages/AdminIdeaDetail'
import './index.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading"><div className="spinner" /></div>
  // not logged in → go to login, but remember where they wanted to go
  if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (!user.is_admin) return <Navigate to="/dashboard" replace />
  return children
}

// Redirect logged-in users away from login/register
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loading"><div className="spinner" /></div>
  if (user) return <Navigate to={user.is_admin ? '/admin' : '/dashboard'} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1535', color: '#f0ede8', border: '1px solid #2a2040', borderRadius: '8px' },
          success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
          error: { iconTheme: { primary: '#e05c5c', secondary: '#fff' } }
        }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

          {/* Protected */}
          <Route path="/submit" element={<ProtectedRoute><SubmitIdea /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ideas/:id" element={<ProtectedRoute><IdeaDetail /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/ideas/:id" element={<AdminRoute><AdminIdeaDetail /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}