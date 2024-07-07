using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data

{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Column> Columns { get; set; }
        public DbSet<Models.Task> Tasks { get; set; }
        public DbSet<Subtask> Subtasks { get; set; }
        
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}