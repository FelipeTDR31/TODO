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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.User.ToListAsync();
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest("Invalid ID");
            }

            // Validate the user
            if (string.IsNullOrEmpty(user.Name))
            {
                return BadRequest("Name is required");
            }

            if (string.IsNullOrEmpty(user.Email))
            {
                return BadRequest("Email is required");
            }

            if (string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Password is required");
            }

            _context.Entry(user).State = EntityState.Modified;

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
            var foundUser = await _context.User.FirstAsync(u => u.Email == user.Email && u.Password == user.Password);
            if (foundUser == null)
            {
                return BadRequest("Invalid username or password");
            }

            if (!SecurityHandler.VerifyPassword(user.Password, foundUser.Password))
            {
                return BadRequest("Invalid username or password");
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
