using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public UserController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<User>> GetUser(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Name is required");
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.Name == name);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        public class updateRequest
        {
            public string? email { get; set; }
            public string? oldPassword { get; set; }
            public string? newPassword { get; set; }
        }
        [HttpPut("{id}/change")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] updateRequest request)
        {
            var foundUser = await _context.User.FindAsync(id);
            if (foundUser == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(request.oldPassword) && !SecurityHandler.VerifyPassword(request.oldPassword, foundUser.Password))
            {
                return BadRequest("Invalid old password");
            }

            if (!string.IsNullOrEmpty(request.newPassword))
            {
                foundUser.Password = SecurityHandler.HashPassword(request.newPassword);
            }

            if (!string.IsNullOrEmpty(request.email))
            {
                foundUser.Email = request.email;
            }

            _context.Entry(foundUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login(User user)
        {
            var foundUser = await _context.User.FirstAsync(u => u.Email == user.Email);
            if (foundUser == null)
            {
                return BadRequest("Invalid email or password");
            }

            if (!SecurityHandler.VerifyPassword(user.Password, foundUser.Password))
            {
                return BadRequest("Invalid email or password");
            }

            var tokenGenerator = new SecurityHandler();
            var token = tokenGenerator.GenerateToken(foundUser);

            return Ok(new { token, foundUser });
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (_context.User.Any(u => u.Name == user.Name))
            {
                return Conflict();
            }

            var newUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                Password = SecurityHandler.HashPassword(user.Password)
            };

            _context.User.Add(newUser);
            await _context.SaveChangesAsync();

            var tokenGenerator = new SecurityHandler().GenerateToken;
            var token = tokenGenerator(newUser);

            return Ok(new { newUser, token });
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }
    }
}
