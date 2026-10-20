using System.ComponentModel.DataAnnotations;
using TodoApi.Models;

namespace TodoApi.Dtos;

public class TodoRequest
{
    [Required]
    [StringLength(TodoItem.TitleMaxLength)]
    public string Title { get; set; } = string.Empty;

    [StringLength(TodoItem.DescriptionMaxLength)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    [Required]
    [EnumDataType(typeof(Priority))]
    public Priority? Priority { get; set; }

    [Required]
    [EnumDataType(typeof(Category))]
    public Category? Category { get; set; }
}
