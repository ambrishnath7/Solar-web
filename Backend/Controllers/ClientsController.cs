using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Data;
using SolarMaintenance.Api.DTOs;
using SolarMaintenance.Api.Models;

namespace SolarMaintenance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly SolarDbContext _context;

    public ClientsController(SolarDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Client>>> GetClients([FromQuery] bool? activeOnly = null, [FromQuery] string? search = null)
    {
        var query = _context.Clients.AsQueryable();

        if (activeOnly.HasValue && activeOnly.Value)
        {
            query = query.Where(c => c.IsActive);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(c => c.ClientName.ToLower().Contains(s) || 
                                     c.SiteName.ToLower().Contains(s) || 
                                     c.SiteAddress.ToLower().Contains(s));
        }

        var clients = await query.OrderBy(c => c.ClientName).ToListAsync();
        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Client>> GetClient(Guid id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null) return NotFound();
        return Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<Client>> CreateClient([FromBody] ClientUpsertDto dto)
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            ClientName = dto.ClientName,
            SiteName = dto.SiteName,
            SiteAddress = dto.SiteAddress,
            PlantCapacityKw = dto.PlantCapacityKw,
            ModulesMake = dto.ModulesMake,
            ModulesWp = dto.ModulesWp,
            TotalModules = dto.TotalModules,
            InverterMake = dto.InverterMake,
            InverterCapacity = dto.InverterCapacity,
            TotalInverters = dto.TotalInverters,
            ContactName = dto.ContactName,
            ContactPhone = dto.ContactPhone,
            ContactEmail = dto.ContactEmail,
            InstallationDate = dto.InstallationDate.HasValue ? DateTime.SpecifyKind(dto.InstallationDate.Value, DateTimeKind.Utc) : null,
            AmcStatus = string.IsNullOrWhiteSpace(dto.AmcStatus) ? "FREE_YEAR1" : dto.AmcStatus,
            AmcStartDate = dto.AmcStartDate.HasValue ? DateTime.SpecifyKind(dto.AmcStartDate.Value, DateTimeKind.Utc) : null,
            AmcEndDate = dto.AmcEndDate.HasValue ? DateTime.SpecifyKind(dto.AmcEndDate.Value, DateTimeKind.Utc) : null,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] ClientUpsertDto dto)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null) return NotFound();

        client.ClientName = dto.ClientName;
        client.SiteName = dto.SiteName;
        client.SiteAddress = dto.SiteAddress;
        client.PlantCapacityKw = dto.PlantCapacityKw;
        client.ModulesMake = dto.ModulesMake;
        client.ModulesWp = dto.ModulesWp;
        client.TotalModules = dto.TotalModules;
        client.InverterMake = dto.InverterMake;
        client.InverterCapacity = dto.InverterCapacity;
        client.TotalInverters = dto.TotalInverters;
        client.ContactName = dto.ContactName;
        client.ContactPhone = dto.ContactPhone;
        client.ContactEmail = dto.ContactEmail;
        client.InstallationDate = dto.InstallationDate.HasValue ? DateTime.SpecifyKind(dto.InstallationDate.Value, DateTimeKind.Utc) : null;
        client.AmcStatus = string.IsNullOrWhiteSpace(dto.AmcStatus) ? "FREE_YEAR1" : dto.AmcStatus;
        client.AmcStartDate = dto.AmcStartDate.HasValue ? DateTime.SpecifyKind(dto.AmcStartDate.Value, DateTimeKind.Utc) : null;
        client.AmcEndDate = dto.AmcEndDate.HasValue ? DateTime.SpecifyKind(dto.AmcEndDate.Value, DateTimeKind.Utc) : null;
        client.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(client);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> ToggleClientActive(Guid id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client == null) return NotFound();

        client.IsActive = !client.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Client status updated to {(client.IsActive ? "active" : "inactive")}" });
    }
}
