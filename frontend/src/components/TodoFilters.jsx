import { CATEGORIES, PRIORITIES, SEARCH_MAX_LENGTH } from '../todoOptions'

function TodoFilters({ searchText, category, priority, onSearchTextChange, onCategoryChange, onPriorityChange, onClear }) {
  const hasFilters = Boolean(searchText || category || priority)

  return (
    <div className="filters">
      <div className="field search-field">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          maxLength={SEARCH_MAX_LENGTH}
          placeholder="Search title or description"
        />
      </div>

      <div className="field">
        <label htmlFor="category-filter">Category</label>
        <select id="category-filter" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="priority-filter">Priority</label>
        <select id="priority-filter" value={priority} onChange={(event) => onPriorityChange(event.target.value)}>
          <option value="">All priorities</option>
          {PRIORITIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="button clear-button" onClick={onClear} disabled={!hasFilters}>
        Clear
      </button>
    </div>
  )
}

export default TodoFilters
