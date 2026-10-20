import TodoItem from './TodoItem'

function TodoList({ todos, isLoading, error, hasFilters, busyTodoId, editingTodoId, onRetry, onToggleComplete, onEdit, onDelete }) {
  if (error) {
    return (
      <div className="state state-error" role="alert">
        <p>{error}</p>
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  if (isLoading && todos.length === 0) {
    return <p className="state">Loading todos…</p>
  }

  if (todos.length === 0) {
    return (
      <p className="state">
        {hasFilters ? 'No todos match your search or filters.' : 'No todos yet. Add your first one to get started.'}
      </p>
    )
  }

  return (
    <ul className={isLoading ? 'todo-list is-refreshing' : 'todo-list'} aria-busy={isLoading}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isBusy={busyTodoId === todo.id}
          isBeingEdited={editingTodoId === todo.id}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
