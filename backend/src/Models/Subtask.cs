namespace backend.Models

{
    public class Subtask
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int TaskId { get; set; }
        public required Task Task { get; set; }
    }
}