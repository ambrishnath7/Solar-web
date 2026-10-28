using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Data;
using SolarMaintenance.Api.DTOs;
using SolarMaintenance.Api.Models;

namespace SolarMaintenance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly SolarDbContext _context;

    public ReportsController(SolarDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetReports(
        [FromQuery] Guid? clientId = null,
        [FromQuery] Guid? engineerId = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? search = null)
    {
        var query = _context.MaintenanceReports
            .Include(r => r.Client)
            .Include(r => r.Engineer)
            .AsQueryable();

        if (clientId.HasValue)
        {
            query = query.Where(r => r.ClientId == clientId.Value);
        }

        if (engineerId.HasValue)
        {
            query = query.Where(r => r.EngineerId == engineerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(r => r.Status.ToLower() == status.Trim().ToLower());
        }

        if (startDate.HasValue)
        {
            var sUtc = DateTime.SpecifyKind(startDate.Value.Date, DateTimeKind.Utc);
            query = query.Where(r => r.VisitDate >= sUtc);
        }

        if (endDate.HasValue)
        {
            var eUtc = DateTime.SpecifyKind(endDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);
            query = query.Where(r => r.VisitDate <= eUtc);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(r => r.ReportRef.ToLower().Contains(s) ||
                                     (r.Client != null && r.Client.ClientName.ToLower().Contains(s)) ||
                                     (r.Engineer != null && r.Engineer.Name.ToLower().Contains(s)));
        }

        var reports = await query
            .OrderByDescending(r => r.VisitDate)
            .ThenByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(reports);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaintenanceReport>> GetReport(Guid id)
    {
        var report = await _context.MaintenanceReports
            .Include(r => r.Client)
            .Include(r => r.Engineer)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (report == null) return NotFound();
        return Ok(report);
    }

    [HttpGet("client/{clientId}/latest")]
    public async Task<ActionResult<object>> GetLatestReportForClient(Guid clientId)
    {
        var report = await _context.MaintenanceReports
            .Where(r => r.ClientId == clientId && r.Status == "submitted")
            .OrderByDescending(r => r.VisitDate)
            .FirstOrDefaultAsync();

        if (report == null)
        {
            return Ok(new { prevVisitDate = (DateTime?)null, reportRef = (string?)null });
        }

        return Ok(new { prevVisitDate = report.VisitDate, reportRef = report.ReportRef });
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var endOfMonth = startOfMonth.AddMonths(1).AddTicks(-1);

        var thisMonthReports = await _context.MaintenanceReports
            .Where(r => r.Status == "submitted" && r.VisitDate >= startOfMonth && r.VisitDate <= endOfMonth)
            .ToListAsync();

        var totalVisitsThisMonth = thisMonthReports.Count;

        // Check for any defect flagged in the report
        var defectsFoundThisMonth = thisMonthReports.Count(r =>
            r.ModBroken == "YES" ||
            r.ModMountingStructure == "DEFECT" ||
            r.ModNutBoltTightness == "DEFECT" ||
            r.DcCables == "DEFECT" ||
            r.DcMc4Connectors == "DEFECT" ||
            r.DcJunctionBox == "DEFECT" ||
            r.DcStringVoltage == "DEFECT" ||
            r.DcCableInsulation == "DEFECT" ||
            r.InvWorking == "DEFECT" ||
            r.InvCoolingFans == "DEFECT" ||
            r.InvAcOutput == "DEFECT" ||
            r.InvOtherIssues == "DEFECT" ||
            r.AcCables == "DEFECT" ||
            r.AcDistributionBoard == "DEFECT" ||
            r.AcMcbMccb == "DEFECT" ||
            r.EarthEquipment == "DEFECT" ||
            r.EarthLightningArrester == "DEFECT" ||
            r.EarthSpd == "DEFECT" ||
            r.EarthPit == "DEFECT" ||
            r.GenPerformance == "DEFECT" ||
            r.MeterCondition == "DEFECT"
        );

        var pendingDrafts = await _context.MaintenanceReports.CountAsync(r => r.Status == "draft");

        var in30Days = now.AddDays(30);
        var upcomingVisitsNext30Days = await _context.MaintenanceReports
            .CountAsync(r => r.NextVisitDate != null && r.NextVisitDate >= now.Date && r.NextVisitDate <= in30Days.Date);

        var freeYear1ClientsCount = await _context.Clients.CountAsync(c => c.IsActive && c.AmcStatus == "FREE_YEAR1");
        var amcClientsCount = await _context.Clients.CountAsync(c => c.IsActive && c.AmcStatus == "AMC");

        return Ok(new DashboardStatsDto
        {
            TotalVisitsThisMonth = totalVisitsThisMonth,
            DefectsFoundThisMonth = defectsFoundThisMonth,
            PendingDrafts = pendingDrafts,
            UpcomingVisitsNext30Days = upcomingVisitsNext30Days,
            FreeYear1ClientsCount = freeYear1ClientsCount,
            AmcClientsCount = amcClientsCount
        });
    }

    [HttpPost("save-draft")]
    public async Task<ActionResult<MaintenanceReport>> SaveDraft([FromBody] MaintenanceReportSaveDto dto)
    {
        MaintenanceReport? report = null;

        if (dto.Id.HasValue && dto.Id.Value != Guid.Empty)
        {
            report = await _context.MaintenanceReports.FindAsync(dto.Id.Value);
        }

        if (report == null)
        {
            report = new MaintenanceReport
            {
                Id = dto.Id.HasValue && dto.Id.Value != Guid.Empty ? dto.Id.Value : Guid.NewGuid(),
                ReportRef = await GenerateReportRefAsync(),
                CreatedAt = DateTime.UtcNow
            };
            _context.MaintenanceReports.Add(report);
        }

        ApplyDtoToReport(report, dto);
        report.Status = "draft";

        await _context.SaveChangesAsync();

        var result = await _context.MaintenanceReports
            .Include(r => r.Client)
            .Include(r => r.Engineer)
            .FirstOrDefaultAsync(r => r.Id == report.Id);

        return Ok(result);
    }

    [HttpPost("submit-final")]
    public async Task<ActionResult<MaintenanceReport>> SubmitFinal([FromBody] MaintenanceReportSaveDto dto)
    {
        MaintenanceReport? report = null;

        if (dto.Id.HasValue && dto.Id.Value != Guid.Empty)
        {
            report = await _context.MaintenanceReports.FindAsync(dto.Id.Value);
        }

        if (report == null)
        {
            report = new MaintenanceReport
            {
                Id = dto.Id.HasValue && dto.Id.Value != Guid.Empty ? dto.Id.Value : Guid.NewGuid(),
                ReportRef = await GenerateReportRefAsync(),
                CreatedAt = DateTime.UtcNow
            };
            _context.MaintenanceReports.Add(report);
        }

        ApplyDtoToReport(report, dto);
        report.Status = "submitted";
        report.SubmittedAt = DateTime.UtcNow;

        // Auto next_visit_date = visit_date + 90 days if not explicitly set
        if (!report.NextVisitDate.HasValue)
        {
            report.NextVisitDate = report.VisitDate.AddDays(90).Date;
        }

        // Automatic Alert Generation (Section 5: next_visit_date - 7 days)
        var alertDueDate = report.NextVisitDate.Value.AddDays(-7).Date;
        var existingAlert = await _context.Alerts
            .FirstOrDefaultAsync(a => a.ReportId == report.Id);

        if (existingAlert == null)
        {
            var alert = new Alert
            {
                Id = Guid.NewGuid(),
                ClientId = report.ClientId,
                ReportId = report.Id,
                DueDate = alertDueDate,
                AlertSentAt = null,
                AlertType = "email",
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            };
            _context.Alerts.Add(alert);
        }
        else
        {
            existingAlert.DueDate = alertDueDate;
            existingAlert.Status = "pending";
        }

        await _context.SaveChangesAsync();

        var result = await _context.MaintenanceReports
            .Include(r => r.Client)
            .Include(r => r.Engineer)
            .FirstOrDefaultAsync(r => r.Id == report.Id);

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MaintenanceReport>> UpdateReport(Guid id, [FromBody] MaintenanceReportSaveDto dto)
    {
        var report = await _context.MaintenanceReports.FindAsync(id);
        if (report == null) return NotFound();

        ApplyDtoToReport(report, dto);
        if (!string.IsNullOrWhiteSpace(dto.Status))
        {
            report.Status = dto.Status;
        }

        await _context.SaveChangesAsync();

        var result = await _context.MaintenanceReports
            .Include(r => r.Client)
            .Include(r => r.Engineer)
            .FirstOrDefaultAsync(r => r.Id == report.Id);

        return Ok(result);
    }

    private void ApplyDtoToReport(MaintenanceReport report, MaintenanceReportSaveDto dto)
    {
        report.ClientId = dto.ClientId;
        report.EngineerId = dto.EngineerId;
        report.VisitDate = DateTime.SpecifyKind(dto.VisitDate.Date, DateTimeKind.Utc);
        report.PrevMaintenanceDate = dto.PrevMaintenanceDate.HasValue 
            ? DateTime.SpecifyKind(dto.PrevMaintenanceDate.Value.Date, DateTimeKind.Utc) 
            : null;
        report.NoOfTechnicians = dto.NoOfTechnicians > 0 ? dto.NoOfTechnicians : 1;

        // Section 1
        report.ModCleaning = dto.ModCleaning ?? "YES";
        report.ModBroken = dto.ModBroken ?? "NO";
        report.ModMountingStructure = dto.ModMountingStructure ?? "GOOD";
        report.ModNutBoltTightness = dto.ModNutBoltTightness ?? "GOOD";
        report.ModPhotosTaken = dto.ModPhotosTaken ?? "YES";
        report.ModRemarks = dto.ModRemarks;

        // Section 2
        report.DcCables = dto.DcCables ?? "GOOD";
        report.DcMc4Connectors = dto.DcMc4Connectors ?? "GOOD";
        report.DcJunctionBox = dto.DcJunctionBox ?? "GOOD";
        report.DcStringVoltage = dto.DcStringVoltage ?? "GOOD";
        report.DcCableInsulation = dto.DcCableInsulation ?? "GOOD";
        report.DcRemarks = dto.DcRemarks;

        // Section 3
        report.InvWorking = dto.InvWorking ?? "GOOD";
        report.InvCoolingFans = dto.InvCoolingFans ?? "GOOD";
        report.InvAcOutput = dto.InvAcOutput ?? "GOOD";
        report.InvOtherIssues = dto.InvOtherIssues ?? "GOOD";
        report.InvRemarks = dto.InvRemarks;

        // Section 4
        report.AcCables = dto.AcCables ?? "GOOD";
        report.AcDistributionBoard = dto.AcDistributionBoard ?? "GOOD";
        report.AcMcbMccb = dto.AcMcbMccb ?? "GOOD";
        report.AcRemarks = dto.AcRemarks;

        // Section 5
        report.EarthEquipment = dto.EarthEquipment ?? "GOOD";
        report.EarthLightningArrester = dto.EarthLightningArrester ?? "GOOD";
        report.EarthSpd = dto.EarthSpd ?? "GOOD";
        report.EarthPit = dto.EarthPit ?? "GOOD";
        report.EarthRemarks = dto.EarthRemarks;

        // Section 6
        report.GenTotalThisMonth = dto.GenTotalThisMonth;
        report.GenAvgDaily = dto.GenAvgDaily;
        report.GenExpected = dto.GenExpected;
        report.GenPerformance = dto.GenPerformance ?? "GOOD";
        report.GenRemarks = dto.GenRemarks;

        // Section 7
        report.MeterImportUnits = dto.MeterImportUnits;
        report.MeterExportUnits = dto.MeterExportUnits;
        report.MeterCondition = dto.MeterCondition ?? "GOOD";
        report.MeterRemarks = dto.MeterRemarks;

        // Section 8
        report.Observations = dto.Observations;
        report.ActionRequired = dto.ActionRequired;
        report.NextVisitDate = dto.NextVisitDate.HasValue 
            ? DateTime.SpecifyKind(dto.NextVisitDate.Value.Date, DateTimeKind.Utc) 
            : null;

        // Signatures
        if (!string.IsNullOrWhiteSpace(dto.SigEngineer))
            report.SigEngineer = dto.SigEngineer;
        if (!string.IsNullOrWhiteSpace(dto.SigClient))
            report.SigClient = dto.SigClient;
    }

    private async Task<string> GenerateReportRefAsync()
    {
        var year = DateTime.UtcNow.Year;
        var prefix = $"PMC-{year}-";

        var latest = await _context.MaintenanceReports
            .Where(r => r.ReportRef.StartsWith(prefix))
            .OrderByDescending(r => r.ReportRef)
            .Select(r => r.ReportRef)
            .FirstOrDefaultAsync();

        var seq = 1;
        if (!string.IsNullOrEmpty(latest))
        {
            var parts = latest.Split('-');
            if (parts.Length == 3 && int.TryParse(parts[2], out var num))
            {
                seq = num + 1;
            }
        }
        else
        {
            // Seed starting from PMC-2026-0043 if no reports in DB
            seq = 43;
        }

        return $"{prefix}{seq:D4}";
    }
}
