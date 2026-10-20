using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class TodoItem
{
    public const int TitleMaxLength = 200;
    public const int DescriptionMaxLength = 1000;

    public int Id { get; set; }

    [Required]
    [MaxLength(TitleMaxLength)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(DescriptionMaxLength)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    [EnumDataType(typeof(Priority))]
    public Priority Priority { get; set; } = Priority.Medium;

    [EnumDataType(typeof(Category))]
    public Category Category { get; set; } = Category.Personal;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
