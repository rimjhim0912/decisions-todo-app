function formatDate(value) {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function TodoItem({ todo, isBusy, isBeingEdited, onToggleComplete, onEdit, onDelete }) {
  const itemClassName = [
    'todo-item',
    todo.isCompleted ? 'is-completed' : '',
    isBeingEdited ? 'is-editing' : '',
  ].join(' ')

  return (
    <li className={itemClassName}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.isCompleted}
        onChange={() => onToggleComplete(todo)}
        disabled={isBusy}
        aria-label={todo.isCompleted ? `Mark "${todo.title}" as not completed` : `Mark "${todo.title}" as completed`}
      />

      <div className="todo-content">
        <div className="todo-header">
          <h3 className="todo-title">{todo.title}</h3>
          <span className={`badge priority-${todo.priority.toLowerCase()}`}>{todo.priority}</span>
          <span className="badge category">{todo.category}</span>
        </div>

        {todo.description && <p className="todo-description">{todo.description}</p>}

        <p className="todo-meta">
          <span className={todo.isCompleted ? 'status status-done' : 'status'}>
            {todo.isCompleted ? 'Completed' : 'Open'}
          </span>
          <span>Created {formatDate(todo.createdAt)}</span>
          {todo.updatedAt !== todo.createdAt && <span>Updated {formatDate(todo.updatedAt)}</span>}
        </p>
      </div>

      <div className="todo-actions">
        <button type="button" className="button" onClick={() => onEdit(todo)} disabled={isBusy}>
          Edit
        </button>
        <button type="button" className="button button-danger" onClick={() => onDelete(todo)} disabled={isBusy}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TodoItem
