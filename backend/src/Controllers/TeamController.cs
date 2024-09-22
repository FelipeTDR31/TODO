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
            _context.Team.Add(newTeam);
            await _context.SaveChangesAsync();
            return Ok(newTeam);
        }

        [HttpGet("{id}/ownedteams")]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeamsOwnedByUser(int id)
        {
            var user = await _context.User
                .Include(u => u.OwnedTeams)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            return user.OwnedTeams!.ToList();
        }

        
        [HttpGet("{id}/teams")]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeamsOfUser(int id)
        {
            var user = await _context.User
                .Include(u => u.Teams)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            return user.Teams!.ToList();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await _context.Team
                .Include(t => t.Users)
                .Include(t => t.Owner)
                .FirstOrDefaultAsync(t => t.Id == id);
            if (team == null)
            {
                return NotFound();
            }
            return team;
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