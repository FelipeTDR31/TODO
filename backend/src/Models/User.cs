namespace backend.Models

{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
         public ICollection<Table>? Tables { get; set; }
         public ICollection<Team>? Teams{ get; set; }
         public ICollection<Team>? OwnedTeams { get; set; }
        public ICollection<Message>? ReceivedMessages { get; set; }
        public ICollection<Message>? SentMessages { get; set; }
    }
}