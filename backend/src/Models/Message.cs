namespace backend.Models

{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; } = String.Empty;
        public int ReceiverId { get; set; }
        public User? Receiver { get; set; }
        public int SenderId { get; set; }
        public User? Sender { get; set; }
        public int TeamId { get; set; }
        public Team? Team { get; set; }
    }
}