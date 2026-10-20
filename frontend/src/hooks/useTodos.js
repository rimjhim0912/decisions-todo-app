import { useCallback, useEffect, useState } from 'react'
import { getTodos } from '../api/todoApi'

export function useTodos({ search, category, priority }) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState({ requestKey: null, todos: [], error: '' })

  const requestKey = [search, category, priority, version].join('|')

  useEffect(() => {
    const controller = new AbortController()

    getTodos({ search, category, priority }, controller.signal)
      .then((todos) => setResult({ requestKey, todos, error: '' }))
      .catch((error) => {
        if (controller.signal.aborted) return
        setResult({ requestKey, todos: [], error: error.message })
      })

    return () => controller.abort()
  }, [search, category, priority, requestKey])

  const reload = useCallback(() => setVersion((current) => current + 1), [])

  return {
    todos: result.todos,
    error: result.error,
    isLoading: result.requestKey !== requestKey,
    reload,
  }
}
