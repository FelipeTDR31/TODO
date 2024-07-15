using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data

{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> User { get; set; }
        public DbSet<Table> Table { get; set; }
        public DbSet<Column> Column { get; set; }
        public DbSet<Models.Task> Task { get; set; }
        public DbSet<Subtask> Subtask { get; set; }
        
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}