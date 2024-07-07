namespace backend.Models

{
    public class Table
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UserId { get; set; }
        public required User User { get; set; }
        public ICollection<Column>? Columns { get; set; }
        
    }
}