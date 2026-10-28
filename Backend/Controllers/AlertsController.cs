using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Data;
using SolarMaintenance.Api.DTOs;
using SolarMaintenance.Api.Models;

namespace SolarMaintenance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly SolarDbContext _context;
    private readonly ILogger<AlertsController> _logger;

    public AlertsController(SolarDbContext context, ILogger<AlertsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAlerts([FromQuery] string? status = null)
    {
        var query = _context.Alerts
            .Include(a => a.Client)
            .Include(a => a.Report)
                .ThenInclude(r => r!.Engineer)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(a => a.Status.ToLower() == status.Trim().ToLower());
        }

        var alerts = await query
            .OrderBy(a => a.DueDate)
            .ToListAsync();

        return Ok(alerts);
    }

    [HttpPost("{id}/send")]
    public async Task<IActionResult> SendAlert(Guid id)
    {
        var alert = await _context.Alerts
            .Include(a => a.Client)
            .Include(a => a.Report)
                .ThenInclude(r => r!.Engineer)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (alert == null) return NotFound();

        // Simulate sending email according to section 5 specifications
        var clientName = alert.Client?.ClientName ?? "Valued Client";
        var siteAddress = alert.Client?.SiteAddress ?? "Client Site";
        var capacity = alert.Client?.PlantCapacityKw ?? 0;
        var engineerName = alert.Report?.Engineer?.Name ?? "Assigned Engineer";
        var lastDone = alert.Report?.VisitDate.ToString("dd-MMM-yyyy") ?? "N/A";

        var emailSubject = $"🔔 Maintenance Due in 7 Days — {clientName}";
        var emailBody = $@"Client   : {clientName}
Site     : {siteAddress}
Capacity : {capacity} kW
Due Date : {alert.DueDate:dd-MMM-yyyy}
Last Done: {lastDone} by {engineerName}

Please schedule the next PMC visit before the due date.
— Shree Abhi Solar Maintenance System";

        _logger.LogInformation("Sending Alert Email:\nSubject: {Subject}\nBody:\n{Body}", emailSubject, emailBody);

        alert.Status = "sent";
        alert.AlertSentAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Alert sent successfully for {clientName}",
            alert,
            emailSubject,
            emailBody
        });
    }

    [HttpPost("{id}/acknowledge")]
    public async Task<IActionResult> AcknowledgeAlert(Guid id)
    {
        var alert = await _context.Alerts.FindAsync(id);
        if (alert == null) return NotFound();

        alert.Status = "acknowledged";
        await _context.SaveChangesAsync();

        return Ok(new { message = "Alert acknowledged", alert });
    }

    [HttpPost("check-and-send")]
    public async Task<ActionResult<AlertTriggerResponse>> CheckAndSendDailyAlerts()
    {
        var today = DateTime.UtcNow.Date;
        var pendingAlerts = await _context.Alerts
            .Include(a => a.Client)
            .Include(a => a.Report)
                .ThenInclude(r => r!.Engineer)
            .Where(a => a.Status == "pending" && a.DueDate <= today)
            .ToListAsync();

        var sentCount = 0;
        foreach (var alert in pendingAlerts)
        {
            alert.Status = "sent";
            alert.AlertSentAt = DateTime.UtcNow;
            sentCount++;
            _logger.LogInformation("Daily Cron: Sent scheduled alert for client: {ClientName}, DueDate: {DueDate}", 
                alert.Client?.ClientName, alert.DueDate.ToShortDateString());
        }

        if (sentCount > 0)
        {
            await _context.SaveChangesAsync();
        }

        return Ok(new AlertTriggerResponse
        {
            ProcessedCount = pendingAlerts.Count,
            SentCount = sentCount,
            Message = sentCount > 0 
                ? $"Successfully processed and sent {sentCount} due alerts." 
                : "No pending alerts due today."
        });
    }
}
