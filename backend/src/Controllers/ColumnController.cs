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
            if (tableId <= 0)
            {
                return BadRequest("TableId must be greater than zero.");
            }

            var columns = await _context.Column.Include(x => x.Tasks).ThenInclude(x => x.Subtasks).Where(x => x.TableId == tableId).ToListAsync();

            if (columns == null || columns.Count == 0)
            {
                return NoContent();
            }
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };

            return Ok(JsonSerializer.Serialize(columns, options));
        }

        // GET: api/Column/5
        [HttpGet("{tableId}/{columnId}")]
        public async Task<ActionResult<Column>> GetColumn(int tableId, int columnId)
        {
            if (tableId <= 0)
            {
                return BadRequest("TableId must be greater than zero.");
            }

            if (columnId <= 0)
            {
                return BadRequest("ColumnId must be greater than zero.");
            }

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
            if (column == null)
            {
                return BadRequest("Column is null");
            }

            if (string.IsNullOrWhiteSpace(column.Name))
            {
                return BadRequest("Column name cannot be empty");
            }

            if (column.TableId <= 0)
            {
                return BadRequest("TableId must be greater than zero.");
            }

            var tableExists = await _context.Table.AnyAsync(t => t.Id == column.TableId);

            if (!tableExists)
            {
                return BadRequest("Table does not exists");
            }

            _context.Column.Add(column);
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction(nameof(GetColumn), new { id = column.Id }, column));
        }

        // PUT: api/Column/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutColumn(int id, Column column)
        {
            if (column == null)
            {
                return BadRequest("Column is null");
            }

            if (id != column.Id)
            {
                return BadRequest("Column id does not match the one in the request.");
            }

            if (column.TableId <= 0)
            {
                return BadRequest("TableId must be greater than zero.");
            }

            if (string.IsNullOrWhiteSpace(column.Name))
            {
                return BadRequest("Column name cannot be empty");
            }

            var tableExists = await _context.Table.AnyAsync(t => t.Id == column.TableId);

            if (!tableExists)
            {
                return BadRequest("Table does not exists");
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
            if (id <= 0)
            {
                return BadRequest("ColumnId must be greater than zero.");
            }

            var column = await _context.Column.FindAsync(id);
            if (column == null)
            {
                return NotFound();
            }

            _context.Column.Remove(column);

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
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ColumnExists(int id)
        {
            return _context.Column.Any(e => e.Id == id);
        }
    }
}
