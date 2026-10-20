using System.ComponentModel.DataAnnotations;
using TodoApi.Models;

namespace TodoApi.Dtos;

public class TodoQuery
{
    [StringLength(TodoItem.TitleMaxLength)]
    public string? Search { get; set; }

    [EnumDataType(typeof(Category))]
    public Category? Category { get; set; }

    [EnumDataType(typeof(Priority))]
    public Priority? Priority { get; set; }
}
