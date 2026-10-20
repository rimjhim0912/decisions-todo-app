import { useState } from 'react'
import {
  CATEGORIES,
  DESCRIPTION_MAX_LENGTH,
  EMPTY_TODO,
  PRIORITIES,
  TITLE_MAX_LENGTH,
} from '../todoOptions'

function validate(values) {
  const errors = {}
  const title = values.title.trim()

  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }

  if (values.description.trim().length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }

  return errors
}

function TodoForm({ todo, onSubmit, onCancel }) {
  const isEditing = Boolean(todo)
  const [values, setValues] = useState(() =>
    todo ? { ...todo, description: todo.description ?? '' } : EMPTY_TODO,
  )
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setIsSaving(true)
    setSubmitError('')

    try {
      await onSubmit(values)
      if (!isEditing) setValues(EMPTY_TODO)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="panel todo-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Edit todo' : 'Add a todo'}</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="What needs to be done?"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">
          Description <span className="optional">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={values.description}
          onChange={handleChange}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder="Add more details"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="field-error">
            {errors.description}
          </p>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={values.priority} onChange={handleChange}>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={values.category} onChange={handleChange}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          name="isCompleted"
          checked={values.isCompleted}
          onChange={handleChange}
        />
        Completed
      </label>

      {submitError && (
        <p className="alert alert-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={isSaving}>
          {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Add todo'}
        </button>
        {isEditing && (
          <button type="button" className="button" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TodoForm
