using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public TableController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet("tables/{userId}")]
        public async Task<ActionResult<IEnumerable<Table>>> GetTablesByUserId(int userId)
        {
            var tables = await _context.Table.Where(t => t.UserId == userId).ToListAsync();

            if (!tables.Any())
            {
                return NotFound();
            }

            return tables;
        } 

        [HttpPost]
        public async Task<ActionResult<Table>> CreateTable(Table table)
        {
            if (table == null)
            {
                return BadRequest("Table is null");
            }

            if (string.IsNullOrEmpty(table.Name))
            {
                return BadRequest("Table name is required");
            }

            if (table.UserId == 0)
            {
                return BadRequest("UserId is required");
            }

            if (await _context.Table.AnyAsync(t => t.Name == table.Name && t.UserId == table.UserId))
            {
                return BadRequest("Table with the same name already exists for the user");
            }

            _context.Table.Add(table);
            await _context.SaveChangesAsync();

            return Ok(table);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(int id, Table table)
        {
            if (table == null)
            {
                return BadRequest("Table is null");
            }

            if (table.Name == null)
            {
                return BadRequest("Table name is required");
            }

            if (id != table.Id)
            {
                return BadRequest("Table id does not match the one in the request");
            }

            var tableToUpdate = await _context.Table.FindAsync(id);
            if (tableToUpdate == null)
            {
                return NotFound();
            }

            var tableNameExists = _context.Table.Any(t => t.Name == table.Name && t.Id != id);
            if (tableNameExists)
            if (tableToUpdate == null || tableNameExists)
            {
                return BadRequest("Table with the same name already exists");
            }

            tableToUpdate.Name = table.Name;
            _context.Entry(tableToUpdate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id))
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
        public async Task<IActionResult> DeleteTable(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid id");
            }

            var table = await _context.Table.FindAsync(id);
            if (table == null)
            {
                return NotFound();
            }

            _context.Table.Remove(table);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id))
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

        private bool TableExists(int id)
        {
            return _context.Table.Any(e => e.Id == id);
        }
    }
}
