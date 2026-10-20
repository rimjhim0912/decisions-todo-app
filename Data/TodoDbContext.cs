using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TodoApi.Models;

namespace TodoApi.Data;

public class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    private const int EnumColumnMaxLength = 20;

    private static readonly ValueConverter<DateTime, DateTime> UtcDateTimeConverter = new(
        value => value,
        value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var todoItem = modelBuilder.Entity<TodoItem>();

        todoItem.Property(item => item.Priority)
            .HasConversion<string>()
            .HasMaxLength(EnumColumnMaxLength);

        todoItem.Property(item => item.Category)
            .HasConversion<string>()
            .HasMaxLength(EnumColumnMaxLength);

        todoItem.Property(item => item.CreatedAt).HasConversion(UtcDateTimeConverter);
        todoItem.Property(item => item.UpdatedAt).HasConversion(UtcDateTimeConverter);

        todoItem.HasIndex(item => item.Priority);
        todoItem.HasIndex(item => item.Category);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SetTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        SetTimestamps();
        return base.SaveChanges();
    }

    private void SetTimestamps()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<TodoItem>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(item => item.CreatedAt).IsModified = false;
                entry.Entity.UpdatedAt = now;
            }
        }
    }
}
