using TodoApi.Models;

namespace TodoApi.Dtos;

public record TodoResponse(
    int Id,
    string Title,
    string? Description,
    bool IsCompleted,
    Priority Priority,
    Category Category,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    public static TodoResponse FromEntity(TodoItem todo) => new(
        todo.Id,
        todo.Title,
        todo.Description,
        todo.IsCompleted,
        todo.Priority,
        todo.Category,
        todo.CreatedAt,
        todo.UpdatedAt);
}
