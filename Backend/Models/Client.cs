using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SolarMaintenance.Api.Models;

[Table("clients")]
public class Client
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("client_name")]
    public string ClientName { get; set; } = string.Empty;

    [Required]
    [Column("site_name")]
    public string SiteName { get; set; } = string.Empty;

    [Column("site_address")]
    public string SiteAddress { get; set; } = string.Empty;

    [Column("plant_capacity_kw")]
    public decimal PlantCapacityKw { get; set; }

    [Column("modules_make")]
    public string ModulesMake { get; set; } = string.Empty;

    [Column("modules_wp")]
    public int ModulesWp { get; set; }

    [Column("total_modules")]
    public int TotalModules { get; set; }

    [Column("inverter_make")]
    public string InverterMake { get; set; } = string.Empty;

    [Column("inverter_capacity")]
    public string InverterCapacity { get; set; } = string.Empty;

    [Column("total_inverters")]
    public int TotalInverters { get; set; }

    [Column("contact_name")]
    public string ContactName { get; set; } = string.Empty;

    [Column("contact_phone")]
    public string ContactPhone { get; set; } = string.Empty;

    [Column("contact_email")]
    public string ContactEmail { get; set; } = string.Empty;

    [Column("installation_date")]
    public DateTime? InstallationDate { get; set; }

    [Column("amc_status")]
    public string AmcStatus { get; set; } = "FREE_YEAR1"; // 'FREE_YEAR1' or 'AMC'

    [Column("amc_start_date")]
    public DateTime? AmcStartDate { get; set; }

    [Column("amc_end_date")]
    public DateTime? AmcEndDate { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
