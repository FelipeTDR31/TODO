using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubtaskController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public SubtaskController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet("{taskId}")]
        public async Task<ActionResult<IEnumerable<Subtask>>> GetSubtasks(int taskId)
        {
            return await _context.Subtask.Where(t => t.TaskId == taskId).ToListAsync();
        }

        [HttpGet("{taskId}/{subtaskId}")]
        public async Task<ActionResult<Subtask>> GetSubtask(int taskId, int subtaskId)
        {
            var subtask = await _context.Subtask.Where(t => t.TaskId == taskId && t.Id == subtaskId).FirstOrDefaultAsync();

            if (subtask == null)
            {
                return NotFound();
            }

            return subtask;
        }

        [HttpPost]
        public async Task<ActionResult<Subtask>> PostSubtask(Subtask subtask)
        {
            _context.Subtask.Add(subtask);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubtask), new { id = subtask.Id }, subtask);
        }

        
        [HttpPost("many")]
        public async Task<ActionResult<List<Subtask>>> PostManySubtask(IEnumerable<Subtask> subtasks)
        {
            _context.Subtask.AddRange(subtasks);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubtask), new { id = subtasks.First().Id }, subtasks);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubtask(int id, Subtask subtask)
        {
            var subtaskToUpdate = await _context.Subtask.FindAsync(id);
            if (subtaskToUpdate == null)
            {
                return BadRequest();
            }else{
                subtaskToUpdate.IsDone = subtask.IsDone;
            }

            _context.Entry(subtaskToUpdate).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubtaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubtask(int id)
        {
            var subtask = await _context.Subtask.FindAsync(id);
            if (subtask == null)
            {
                return NotFound();
            }

            _context.Subtask.Remove(subtask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubtaskExists(int id)
        {
            return _context.Subtask.Any(e => e.Id == id);
        }
    }
}
