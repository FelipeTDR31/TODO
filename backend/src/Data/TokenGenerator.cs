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
        private static SymmetricSecurityKey? securityKey;

        public TokenGenerator()
        {
            // the security key is used to sign the token
            var secret = "keq2k213kdaqwkoeq2oekqpoead43rw5643345";
            securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        }

        internal static bool ValidateToken(string token, ApplicationContext contextData)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token).ToString();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = securityKey,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    LifetimeValidator = (notBefore, expires, securityToken, validationParameters) =>
                    {
                        if (expires != null)
                        {
                            return expires > DateTime.UtcNow;
                        }
                        return false;
                    }
                };

                var principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out var validatedToken);
                if (principal.Identity!=null && principal.Identity.IsAuthenticated)
                {
                    return true;
                }
            }
            catch (Exception)
            {
                // do nothing
            }

            return false;
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
