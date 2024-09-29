using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public TeamController(ApplicationContext context)
        {
            _context = context;
        }

        
        [HttpPost("{ownerId}")]
        public async Task<ActionResult<Team>> CreateTeamForUser(int ownerId, Team team)
        {
            var user = await _context.User.FindAsync(ownerId);
            if (user == null)
            {
                return NotFound();
            }
            if (team == null)
            {
                return BadRequest();
            }

            var newTeam = new Team
            {
                Name = team.Name,
                Description = team.Description,
                OwnerId = ownerId
            };

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };

            var json = JsonSerializer.Serialize(newTeam, options);
            _context.Team.Add(newTeam);
            await _context.SaveChangesAsync();
            return Ok(json);
        }
        
        [HttpGet("{userId}/teams")]
        public async Task<ActionResult<IEnumerable<(string, bool)>>> GetUserTeams(int userId)
        {
           var teams = await _context.Team
            .Where(t => t.OwnerId == userId || t.Users!.Any(u => u.Id == userId))
            .Select(t => new {t.Name, IsOwner = t.OwnerId == userId})
            .ToListAsync();
            return Ok(teams);
        }

        
        [HttpGet("{uniqueName}")]
        public async Task<ActionResult<Team>> GetTeam(string uniqueName)
        {
            var team = await _context.Team
                .Include(t => t.Users)
                .Include(t => t.Owner)
                .FirstOrDefaultAsync(t => t.UniqueName == uniqueName);
            if (team == null)
            {
                return NotFound();
            }
            return Ok(team);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Team>> UpdateTeam(int id, Team team)
        {
            var teamToUpdate = await _context.Team.FindAsync(id);
            if (teamToUpdate == null)
            {
                return NotFound();
            }
            teamToUpdate.Name = team.Name;
            teamToUpdate.Description = team.Description;
            await _context.SaveChangesAsync();
            return teamToUpdate;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTeam(int id)
        {
            var team = await _context.Team
                .Include(t => t.Users)
                .FirstOrDefaultAsync(t => t.Id == id);
            if (team == null)
            {
                return NotFound();
            }
            _context.Team.Remove(team);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}