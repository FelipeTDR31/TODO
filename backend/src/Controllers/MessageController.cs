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

        
        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage(Message message)
        {
            _context.Message.Add(message);
            await _context.SaveChangesAsync();

            return Ok(message);
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

            return messages;
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