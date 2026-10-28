namespace SolarMaintenance.Api.DTOs;

public class AdminAuthRequest
{
    public string Password { get; set; } = string.Empty;
}

public class AdminAuthResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
}

public class DashboardStatsDto
{
    public int TotalVisitsThisMonth { get; set; }
    public int DefectsFoundThisMonth { get; set; }
    public int PendingDrafts { get; set; }
    public int UpcomingVisitsNext30Days { get; set; }
    public int FreeYear1ClientsCount { get; set; }
    public int AmcClientsCount { get; set; }
}

public class ClientUpsertDto
{
    public string ClientName { get; set; } = string.Empty;
    public string SiteName { get; set; } = string.Empty;
    public string SiteAddress { get; set; } = string.Empty;
    public decimal PlantCapacityKw { get; set; }
    public string ModulesMake { get; set; } = string.Empty;
    public int ModulesWp { get; set; }
    public int TotalModules { get; set; }
    public string InverterMake { get; set; } = string.Empty;
    public string InverterCapacity { get; set; } = string.Empty;
    public int TotalInverters { get; set; }
    public string ContactName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public DateTime? InstallationDate { get; set; }
    public string AmcStatus { get; set; } = "FREE_YEAR1";
    public DateTime? AmcStartDate { get; set; }
    public DateTime? AmcEndDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public class EngineerUpsertDto
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class MaintenanceReportSaveDto
{
    public Guid? Id { get; set; }
    public Guid ClientId { get; set; }
    public Guid EngineerId { get; set; }
    public DateTime VisitDate { get; set; } = DateTime.UtcNow.Date;
    public DateTime? PrevMaintenanceDate { get; set; }
    public int NoOfTechnicians { get; set; } = 1;
    public string Status { get; set; } = "draft"; // "draft" or "submitted"

    // Section 1
    public string ModCleaning { get; set; } = "YES";
    public string ModBroken { get; set; } = "NO";
    public string ModMountingStructure { get; set; } = "GOOD";
    public string ModNutBoltTightness { get; set; } = "GOOD";
    public string ModPhotosTaken { get; set; } = "YES";
    public string? ModRemarks { get; set; }

    // Section 2
    public string DcCables { get; set; } = "GOOD";
    public string DcMc4Connectors { get; set; } = "GOOD";
    public string DcJunctionBox { get; set; } = "GOOD";
    public string DcStringVoltage { get; set; } = "GOOD";
    public string DcCableInsulation { get; set; } = "GOOD";
    public string? DcRemarks { get; set; }

    // Section 3
    public string InvWorking { get; set; } = "GOOD";
    public string InvCoolingFans { get; set; } = "GOOD";
    public string InvAcOutput { get; set; } = "GOOD";
    public string InvOtherIssues { get; set; } = "GOOD";
    public string? InvRemarks { get; set; }

    // Section 4
    public string AcCables { get; set; } = "GOOD";
    public string AcDistributionBoard { get; set; } = "GOOD";
    public string AcMcbMccb { get; set; } = "GOOD";
    public string? AcRemarks { get; set; }

    // Section 5
    public string EarthEquipment { get; set; } = "GOOD";
    public string EarthLightningArrester { get; set; } = "GOOD";
    public string EarthSpd { get; set; } = "GOOD";
    public string EarthPit { get; set; } = "GOOD";
    public string? EarthRemarks { get; set; }

    // Section 6
    public decimal? GenTotalThisMonth { get; set; }
    public decimal? GenAvgDaily { get; set; }
    public decimal? GenExpected { get; set; }
    public string GenPerformance { get; set; } = "GOOD";
    public string? GenRemarks { get; set; }

    // Section 7
    public decimal? MeterImportUnits { get; set; }
    public decimal? MeterExportUnits { get; set; }
    public string MeterCondition { get; set; } = "GOOD";
    public string? MeterRemarks { get; set; }

    // Section 8
    public string? Observations { get; set; }
    public string? ActionRequired { get; set; }
    public DateTime? NextVisitDate { get; set; }

    // Signatures
    public string? SigEngineer { get; set; }
    public string? SigClient { get; set; }
}

public class AlertTriggerResponse
{
    public int ProcessedCount { get; set; }
    public int SentCount { get; set; }
    public string Message { get; set; } = string.Empty;
}
