using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend.Data
{
    public class TokenGenerator
    {
        private readonly SymmetricSecurityKey securityKey;

        public TokenGenerator()
        {
            // the security key is used to sign the token
            var secret = "keq2k213kdaqwkoeq2oekqpoead43rw5643345";
            securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        }

        internal static bool ValidateToken(string token, ApplicationContext contextData)
        {
            throw new NotImplementedException();
        }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Name),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
