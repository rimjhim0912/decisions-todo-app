import { useEffect, useState } from 'react'
import { createTodo, deleteTodo, updateTodo } from './api/todoApi'
import TodoFilters from './components/TodoFilters'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'
import { toTodoRequest } from './todoOptions'
import './App.css'

const SEARCH_DELAY_MS = 300

function App() {
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [busyTodoId, setBusyTodoId] = useState(null)
  const [actionError, setActionError] = useState('')

  const { todos, isLoading, error, reload } = useTodos({ search, category, priority })

  useEffect(() => {
    const timeoutId = setTimeout(() => setSearch(searchText.trim()), SEARCH_DELAY_MS)
    return () => clearTimeout(timeoutId)
  }, [searchText])

  const completedCount = todos.filter((todo) => todo.isCompleted).length
  const hasFilters = Boolean(search || category || priority)

  async function handleSave(values) {
    const request = toTodoRequest(values)

    if (editingTodo) {
      await updateTodo(editingTodo.id, request)
      setEditingTodo(null)
    } else {
      await createTodo(request)
    }

    setActionError('')
    reload()
  }

  async function handleToggleComplete(todo) {
    setBusyTodoId(todo.id)
    setActionError('')

    try {
      await updateTodo(todo.id, toTodoRequest({ ...todo, isCompleted: !todo.isCompleted }))
      reload()
    } catch (error) {
      setActionError(error.message)
    } finally {
      setBusyTodoId(null)
    }
  }

  async function handleDelete(todo) {
    if (!window.confirm(`Delete "${todo.title}"?`)) return

    setBusyTodoId(todo.id)
    setActionError('')

    try {
      await deleteTodo(todo.id)
      if (editingTodo?.id === todo.id) setEditingTodo(null)
      reload()
    } catch (error) {
      setActionError(error.message)
    } finally {
      setBusyTodoId(null)
    }
  }

  function handleEdit(todo) {
    setEditingTodo(todo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearFilters() {
    setSearchText('')
    setSearch('')
    setCategory('')
    setPriority('')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Decisions Todo</h1>
        <p>Organise your work and personal tasks by priority.</p>
      </header>

      <main className="layout">
        <aside>
          <TodoForm
            key={editingTodo?.id ?? 'new'}
            todo={editingTodo}
            onSubmit={handleSave}
            onCancel={() => setEditingTodo(null)}
          />
        </aside>

        <section className="panel" aria-labelledby="todos-heading">
          <div className="list-header">
            <h2 id="todos-heading">Todos</h2>
            {!error && (
              <span className="summary">
                {isLoading ? 'Loading…' : `${todos.length} shown · ${completedCount} completed`}
              </span>
            )}
          </div>

          <TodoFilters
            searchText={searchText}
            category={category}
            priority={priority}
            onSearchTextChange={setSearchText}
            onCategoryChange={setCategory}
            onPriorityChange={setPriority}
            onClear={handleClearFilters}
          />

          {actionError && (
            <p className="alert alert-error" role="alert">
              {actionError}
            </p>
          )}

          <TodoList
            todos={todos}
            isLoading={isLoading}
            error={error}
            hasFilters={hasFilters}
            busyTodoId={busyTodoId}
            editingTodoId={editingTodo?.id}
            onRetry={reload}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  )
}

export default App
