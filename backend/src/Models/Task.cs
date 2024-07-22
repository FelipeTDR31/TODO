namespace backend.Models

{
    public class Task
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Order { get; set; }
        public int ColumnId { get; set; }
        public virtual Column? Column { get; set; } 
        public ICollection<Subtask>? Substasks { get; set; }
    }
}