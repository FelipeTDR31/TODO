using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public TaskController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet("{columnId}")]
        public async Task<ActionResult<IEnumerable<Models.Task>>> GetTasks(int columnId)
        {
            var tasks = await _context.Task
                .Include(t => t.Subtasks)
                .Where(t => t.ColumnId == columnId)
                .ToListAsync();
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };
            return Ok(JsonSerializer.Serialize(tasks, options));
        }

        [HttpGet("{columnId}/{taskId}")]
        public async Task<ActionResult<Models.Task>> GetTask(int taskId, int columnId)
        {
            var task = await _context.Task.Where(t => t.Id == taskId && t.ColumnId == columnId).FirstOrDefaultAsync();

            if (task == null)
            {
                return NotFound();
            }

            return task;
        }

        [HttpPost]
        public async Task<ActionResult<Models.Task>> PostTask(Models.Task task)
        {
            _context.Task.Add(task);
            await _context.SaveChangesAsync();
            var returnedTask = CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };
            return Ok(JsonSerializer.Serialize(returnedTask, options));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, Models.Task task)
        {
            var taskToUpdate = await _context.Task.FindAsync(id);
            if (taskToUpdate == null)
            {
                return BadRequest();
            }

            taskToUpdate.ColumnId = task.ColumnId;
            taskToUpdate.Name = task.Name;
            taskToUpdate.Description = task.Description;

            _context.Entry(taskToUpdate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
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
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Task.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Task.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskExists(int id)
        {
            return _context.Task.Any(e => e.Id == id);
        }
    }
}
