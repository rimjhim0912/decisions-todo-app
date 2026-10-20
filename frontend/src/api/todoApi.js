export const API_BASE_URL = 'http://localhost:5295'

const TODOS_URL = `${API_BASE_URL}/api/todos`

export function getTodos({ search, category, priority }, signal) {
  const params = new URLSearchParams()

  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (priority) params.set('priority', priority)

  const queryString = params.toString()
  const url = queryString ? `${TODOS_URL}?${queryString}` : TODOS_URL

  return sendRequest(url, { signal })
}

export function createTodo(todo) {
  return sendRequest(TODOS_URL, { method: 'POST', body: todo })
}

export function updateTodo(id, todo) {
  return sendRequest(`${TODOS_URL}/${id}`, { method: 'PUT', body: todo })
}

export function deleteTodo(id) {
  return sendRequest(`${TODOS_URL}/${id}`, { method: 'DELETE' })
}

async function sendRequest(url, { method = 'GET', body, signal } = {}) {
  const options = { method, signal }

  if (body) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }

  let response

  try {
    response = await fetch(url, options)
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error(`Could not reach the Todo API at ${API_BASE_URL}. Make sure the backend is running.`, {
      cause: error,
    })
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function readErrorMessage(response) {
  const fallbackMessage = `Request failed with status ${response.status}.`

  try {
    const problem = await response.json()

    if (problem.errors) {
      return Object.values(problem.errors).flat().join(' ')
    }

    return problem.detail ?? problem.title ?? fallbackMessage
  } catch {
    return fallbackMessage
  }
}
