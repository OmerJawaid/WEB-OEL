import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { FeedbackList } from './components/FeedbackList'
import { FeedbackForm } from './components/FeedbackForm'

const API_BASE = 'http://localhost:3000'
const PAGE_SIZE = 5
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

function App() {
  const [feedbacks, setFeedbacks] = useState([])
  const [allFeedbacks, setAllFeedbacks] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [averageRating, setAverageRating] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const subjects = useMemo(
    () => [...new Set(allFeedbacks.map((item) => item.subject))].sort(),
    [allFeedbacks]
  )

  const totalPages = useMemo(() => {
    const pages = Math.ceil(feedbacks.length / PAGE_SIZE)
    return pages > 0 ? pages : 1
  }, [feedbacks])

  const paginatedFeedbacks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return feedbacks.slice(start, start + PAGE_SIZE)
  }, [feedbacks, page])

  const fetchAllFeedbacks = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/feedbacks`)
      if (!res.ok) {
        throw new Error('Failed to fetch feedbacks')
      }

      const data = await res.json()
      const list = data.feedbacks || []
      setAllFeedbacks(list)
      setFeedbacks(list)
      setAverageRating(null)
      setPage(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedbacksBySubject = async (subject) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/feedbacks/${encodeURIComponent(subject)}`)
      if (!res.ok) {
        throw new Error('Failed to fetch feedbacks by subject')
      }

      const data = await res.json()
      setFeedbacks(data.feedbacks || [])
      setAverageRating(typeof data.averageRating === 'number' ? data.averageRating : null)
      setPage(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllFeedbacks()
  }, [])

  const handleSubmitFeedback = async (payload) => {
    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setMessage('Feedback submitted successfully.')
      await fetchAllFeedbacks()
      if (selectedSubject) {
        await fetchFeedbacksBySubject(selectedSubject)
      }
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFilterChange = async (subject) => {
    setSelectedSubject(subject)
    setMessage('')
    setPage(1)

    if (!subject) {
      await fetchAllFeedbacks()
      return
    }

    await fetchFeedbacksBySubject(subject)
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    setAuthError('')

    if (adminUsername === ADMIN_USERNAME && adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setAdminPassword('')
      return
    }

    setAuthError('Invalid admin credentials')
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    setAdminUsername('')
    setAdminPassword('')
    setAuthError('')
  }

  const goToPrevPage = () => {
    setPage((current) => Math.max(1, current - 1))
  }

  const goToNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1))
  }

  return (
    <main className="app-shell">
      <header className="hero-strip">
        <h1>Student Feedback Management System</h1>
        <p className="subtitle">Submit feedback and view all responses.</p>
      </header>

      {message ? <p className="message success">{message}</p> : null}
      {error ? <p className="message error">{error}</p> : null}

      <section className="grid-layout">
        <FeedbackForm onSubmitFeedback={handleSubmitFeedback} isSubmitting={isSubmitting} />
        {isAdmin ? (
          <FeedbackList
            feedbacks={paginatedFeedbacks}
            selectedSubject={selectedSubject}
            subjects={subjects}
            onFilterChange={handleFilterChange}
            averageRating={averageRating}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            onLogout={handleAdminLogout}
          />
        ) : (
          <section className="panel auth-panel">
            <h2>Admin Login</h2>
            <p className="small-note">Use username: <strong>admin</strong> and password: <strong>admin123</strong></p>
            <form onSubmit={handleAdminLogin}>
              <label htmlFor="adminUsername">Username</label>
              <input
                id="adminUsername"
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />

              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />

              {authError ? <p className="field-error">{authError}</p> : null}

              <button type="submit" className="login-btn">Login as Admin</button>
            </form>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
