using backend.Models;

public class Table
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public virtual int? UserId { get; set; }
    public virtual User? User { get; set; }
    public virtual int? TeamId { get; set; }
    public virtual Team? Team { get; set; }
    public ICollection<Column>? Columns { get; set; }
}
