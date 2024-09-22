using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data

{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> User { get; set; }
        public DbSet<Table> Table { get; set; }
        public DbSet<Team> Team { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<Column> Column { get; set; }
        public DbSet<Models.Task> Task { get; set; }
        public DbSet<Subtask> Subtask { get; set; }
        
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
            .HasMany(u => u.OwnedTeams)
            .WithOne(t => t.Owner)
            .HasForeignKey(t => t.OwnerId);

            modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId);

            modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany(u => u.ReceivedMessages)
            .HasForeignKey(m => m.ReceiverId);
        }
    }
}