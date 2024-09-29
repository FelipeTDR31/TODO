using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public MessageController(ApplicationContext context)
        {
            _context = context;
        }

        public class MessageCreation
        {
            public string content { get; set; } = String.Empty;
            public string senderName { get; set; } = String.Empty;
            public string receiverName { get; set; } = String.Empty;
            public string teamName { get; set; } = String.Empty;
        }
        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage([FromBody] MessageCreation message)
        {
            if (message == null)
            {
                return BadRequest("Message cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(message.content))
            {
                return BadRequest("Message content cannot be empty.");
            }

            if (string.IsNullOrWhiteSpace(message.senderName))
            {
                return BadRequest("Sender name cannot be empty.");
            }

            if (string.IsNullOrWhiteSpace(message.receiverName))
            {
                return BadRequest("Receiver name cannot be empty.");
            }

            if (string.IsNullOrWhiteSpace(message.teamName))
            {
                return BadRequest("Team name cannot be empty.");
            }

            var sender = await _context.User
                .FirstOrDefaultAsync(u => u.Name == message.senderName);
            if (sender == null)
            {
                return NotFound("Sender not found.");
            }

            var receiver = await _context.User
                .FirstOrDefaultAsync(u => u.Name == message.receiverName);
            if (receiver == null)
            {
                return NotFound("Receiver not found.");
            }

            var team = await _context.Team
                .FirstOrDefaultAsync(t => t.Name == message.teamName);
            if (team == null)
            {
                return NotFound("Team not found.");
            }

            var newMessage = new Message
            {
                Content = message.content,
                SenderId = sender.Id,
                ReceiverId = receiver.Id,
                TeamId = team.Id
            };

            _context.Message.Add(newMessage);
            await _context.SaveChangesAsync();
            return Ok("Message sent successfully.");
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessagesByUser(int userId)
        {
            var messages = await _context.Message
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Include(m => m.Team)
                .ToListAsync();

            if (!messages.Any())
            {
                return NotFound();
            }

            var result = messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .Select(m => new
                {
                    content = m.Content,
                    senderName = m.Sender!.Name,
                    receiverName = m.Receiver!.Name,
                    teamName = m.Team!.Name
                });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Message.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Message.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}