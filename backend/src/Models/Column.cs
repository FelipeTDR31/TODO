namespace backend.Models

{
    public class Column
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TableId { get; set; }
        public required Table Table { get; set; }
        public ICollection<Task>? Tasks { get; set; }
    }
}