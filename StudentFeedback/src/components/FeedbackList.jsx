import React from 'react'


export const FeedbackList = ({
  feedbacks,
  selectedSubject,
  subjects,
  onFilterChange,
  averageRating,
  loading,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onLogout
}) => {
  return (
    <section className="panel list-panel">
      <div className="list-header">
        <h2>Feedback List</h2>
        <div className="list-controls">
          <select value={selectedSubject} onChange={(e) => onFilterChange(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout Admin
          </button>
        </div>
      </div>

      {selectedSubject && averageRating !== null ? (
        <p className="average-box">
          Average rating for <strong>{selectedSubject}</strong>: {averageRating.toFixed(2)}
        </p>
      ) : null}

      {loading ? <p>Loading feedbacks...</p> : null}
      {!loading && feedbacks.length === 0 ? <p>No feedback available.</p> : null}

      <div className="card-grid">
        {feedbacks.map((item) => (
          <article className="feedback-card" key={item._id}>
            <h3>{item.subject}</h3>
            <p><strong>Student:</strong> {item.name}</p>
            <p><strong>Rating:</strong> {item.rating}/5</p>
            <p><strong>Comments:</strong> {item.comments || 'No comments provided.'}</p>
          </article>
        ))}
      </div>

      <div className="pagination">
        <button type="button" onClick={onPrevPage} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button type="button" onClick={onNextPage} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </section>
  )
}

