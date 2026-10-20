using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Dtos;
using TodoApi.Models;

namespace TodoApi.Services;

public class TodoService(TodoDbContext dbContext)
{
    public async Task<List<TodoResponse>> GetAllAsync(TodoQuery query, CancellationToken cancellationToken)
    {
        var todos = dbContext.TodoItems.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            todos = todos.Where(todo =>
                todo.Title.Contains(search) ||
                (todo.Description != null && todo.Description.Contains(search)));
        }

        if (query.Category is Category category)
        {
            todos = todos.Where(todo => todo.Category == category);
        }

        if (query.Priority is Priority priority)
        {
            todos = todos.Where(todo => todo.Priority == priority);
        }

        var results = await todos
            .OrderByDescending(todo => todo.CreatedAt)
            .ThenByDescending(todo => todo.Id)
            .ToListAsync(cancellationToken);

        return results.Select(TodoResponse.FromEntity).ToList();
    }

    public async Task<TodoResponse?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var todo = await dbContext.TodoItems
            .AsNoTracking()
            .FirstOrDefaultAsync(todo => todo.Id == id, cancellationToken);

        return todo is null ? null : TodoResponse.FromEntity(todo);
    }

    public async Task<TodoResponse> CreateAsync(TodoRequest request, CancellationToken cancellationToken)
    {
        var todo = new TodoItem();
        ApplyRequest(todo, request);

        dbContext.TodoItems.Add(todo);
        await dbContext.SaveChangesAsync(cancellationToken);

        return TodoResponse.FromEntity(todo);
    }

    public async Task<TodoResponse?> UpdateAsync(int id, TodoRequest request, CancellationToken cancellationToken)
    {
        var todo = await dbContext.TodoItems.FindAsync([id], cancellationToken);
        if (todo is null)
        {
            return null;
        }

        ApplyRequest(todo, request);
        await dbContext.SaveChangesAsync(cancellationToken);

        return TodoResponse.FromEntity(todo);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var deletedCount = await dbContext.TodoItems
            .Where(todo => todo.Id == id)
            .ExecuteDeleteAsync(cancellationToken);

        return deletedCount > 0;
    }

    private static void ApplyRequest(TodoItem todo, TodoRequest request)
    {
        todo.Title = request.Title.Trim();
        todo.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        todo.IsCompleted = request.IsCompleted;
        todo.Priority = request.Priority!.Value;
        todo.Category = request.Category!.Value;
    }
}
