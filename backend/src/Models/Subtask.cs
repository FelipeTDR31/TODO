namespace backend.Models

{
    public class Subtask
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsDone { get; set; }
        public int TaskId { get; set; }
        public virtual Task? Task { get; set; }
    }
}