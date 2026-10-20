export const PRIORITIES = ['High', 'Medium', 'Low']

export const CATEGORIES = ['Work', 'Personal']

export const TITLE_MAX_LENGTH = 200

export const DESCRIPTION_MAX_LENGTH = 1000

export const SEARCH_MAX_LENGTH = 200

export const EMPTY_TODO = {
  title: '',
  description: '',
  isCompleted: false,
  priority: 'Medium',
  category: 'Personal',
}

export function toTodoRequest(todo) {
  return {
    title: todo.title.trim(),
    description: todo.description?.trim() || null,
    isCompleted: todo.isCompleted,
    priority: todo.priority,
    category: todo.category,
  }
}
