using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Data;
using SolarMaintenance.Api.DTOs;
using SolarMaintenance.Api.Models;

namespace SolarMaintenance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EngineersController : ControllerBase
{
    private readonly SolarDbContext _context;

    public EngineersController(SolarDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Engineer>>> GetEngineers([FromQuery] bool? activeOnly = null)
    {
        var query = _context.Engineers.AsQueryable();

        if (activeOnly.HasValue && activeOnly.Value)
        {
            query = query.Where(e => e.IsActive);
        }

        var list = await query.OrderBy(e => e.Name).ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Engineer>> GetEngineer(Guid id)
    {
        var engineer = await _context.Engineers.FindAsync(id);
        if (engineer == null) return NotFound();
        return Ok(engineer);
    }

    [HttpPost]
    public async Task<ActionResult<Engineer>> CreateEngineer([FromBody] EngineerUpsertDto dto)
    {
        var engineer = new Engineer
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            IsActive = dto.IsActive
        };

        _context.Engineers.Add(engineer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEngineer), new { id = engineer.Id }, engineer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEngineer(Guid id, [FromBody] EngineerUpsertDto dto)
    {
        var engineer = await _context.Engineers.FindAsync(id);
        if (engineer == null) return NotFound();

        engineer.Name = dto.Name;
        engineer.Phone = dto.Phone;
        engineer.Email = dto.Email;
        engineer.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(engineer);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> ToggleEngineerActive(Guid id)
    {
        var engineer = await _context.Engineers.FindAsync(id);
        if (engineer == null) return NotFound();

        engineer.IsActive = !engineer.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Engineer status updated to {(engineer.IsActive ? "active" : "inactive")}" });
    }
}
