using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColumnController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public ColumnController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/Column
        [HttpGet("{tableId}")]
        public async Task<ActionResult<IEnumerable<Column>>> GetColumns(int tableId)
        {
            return await _context.Column.ToListAsync();
        }

        // GET: api/Column/5
        [HttpGet("{tableId}/{columnId}")]
        public async Task<ActionResult<Column>> GetColumn(int tableId, int columnId)
        {
            var column = await _context.Column.Where(x => x.TableId == tableId && x.Id == columnId).FirstOrDefaultAsync();

            if (column == null)
            {
                return NotFound();
            }

            return column;
        }

        // POST: api/Column
        [HttpPost]
        public async Task<ActionResult<Column>> PostColumn(Column column)
        {
            _context.Column.Add(column);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetColumn), new { id = column.Id }, column);
        }

        // PUT: api/Column/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColumn(int id, Column column)
        {
            if (id != column.Id)
            {
                return BadRequest();
            }

            _context.Entry(column).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ColumnExists(id))
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

        // DELETE: api/Column/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColumn(int id)
        {
            var column = await _context.Column.FindAsync(id);
            if (column == null)
            {
                return NotFound();
            }

            _context.Column.Remove(column);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ColumnExists(int id)
        {
            return _context.Column.Any(e => e.Id == id);
        }
    }
}
