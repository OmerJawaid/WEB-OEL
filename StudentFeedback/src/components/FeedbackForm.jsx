import React from 'react'
import { useForm } from 'react-hook-form'

export const FeedbackForm = ({ onSubmitFeedback, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      subject: '',
      rating: '',
      comments: ''
    }
  })

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      rating: Number(formData.rating)
    }

    const ok = await onSubmitFeedback(payload)
    if (ok) {
      reset()
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit(onSubmit)}>
      <h2>Submit Feedback</h2>

      <label htmlFor="name">Student Name</label>
      <input
        id="name"
        type="text"
        placeholder="Enter your name"
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' }
        })}
      />
      {errors.name ? <p className="field-error">{errors.name.message}</p> : null}

      <label htmlFor="subject">Subject</label>
      <input
        id="subject"
        type="text"
        placeholder="e.g. Data Structures"
        {...register('subject', {
          required: 'Subject is required',
          minLength: { value: 2, message: 'Subject must be at least 2 characters' }
        })}
      />
      {errors.subject ? <p className="field-error">{errors.subject.message}</p> : null}

      <label htmlFor="rating">Rating (1 to 5)</label>
      <input
        id="rating"
        type="number"
        min="1"
        max="5"
        step="1"
        placeholder="1 - 5"
        {...register('rating', {
          required: 'Rating is required',
          min: { value: 1, message: 'Rating must be at least 1' },
          max: { value: 5, message: 'Rating cannot exceed 5' }
        })}
      />
      {errors.rating ? <p className="field-error">{errors.rating.message}</p> : null}

      <label htmlFor="comments">Comments (Optional)</label>
      <textarea
        id="comments"
        rows="4"
        placeholder="Share details about your experience"
        {...register('comments', {
          maxLength: { value: 300, message: 'Comments cannot exceed 300 characters' }
        })}
      />
      {errors.comments ? <p className="field-error">{errors.comments.message}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  )
}
