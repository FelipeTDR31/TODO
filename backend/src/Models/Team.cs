namespace backend.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public virtual User? Owner { get; set; }
        public ICollection<User>? Users { get; set; }
        public ICollection<Table>? Tables { get; set; }
    }
}