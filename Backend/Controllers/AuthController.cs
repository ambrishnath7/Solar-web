using Microsoft.AspNetCore.Mvc;
using SolarMaintenance.Api.DTOs;

namespace SolarMaintenance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("admin-login")]
    public IActionResult AdminLogin([FromBody] AdminAuthRequest request)
    {
        var configuredPassword = _configuration["AdminSettings:Password"] ?? "ShreeAbhi2024";

        if (string.Equals(request.Password?.Trim(), configuredPassword, StringComparison.Ordinal))
        {
            // Simple robust session/bearer token for the internal admin dashboard
            var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"admin:{DateTime.UtcNow.Ticks}:{configuredPassword}"));
            return Ok(new AdminAuthResponse
            {
                Success = true,
                Message = "Authentication successful",
                Token = token
            });
        }

        return Unauthorized(new AdminAuthResponse
        {
            Success = false,
            Message = "Invalid admin password"
        });
    }
}
