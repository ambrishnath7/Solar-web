using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SolarMaintenance.Api.Models;

[Table("maintenance_reports")]
public class MaintenanceReport
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("report_ref")]
    public string ReportRef { get; set; } = string.Empty; // e.g. PMC-2026-0042

    [Required]
    [Column("client_id")]
    public Guid ClientId { get; set; }

    [ForeignKey(nameof(ClientId))]
    public Client? Client { get; set; }

    [Required]
    [Column("engineer_id")]
    public Guid EngineerId { get; set; }

    [ForeignKey(nameof(EngineerId))]
    public Engineer? Engineer { get; set; }

    [Column("visit_date")]
    public DateTime VisitDate { get; set; } = DateTime.UtcNow.Date;

    [Column("prev_maintenance_date")]
    public DateTime? PrevMaintenanceDate { get; set; }

    [Column("no_of_technicians")]
    public int NoOfTechnicians { get; set; } = 1;

    [Column("status")]
    public string Status { get; set; } = "draft"; // 'draft' or 'submitted'

    // Section 1: Solar Modules
    [Column("mod_cleaning")]
    public string ModCleaning { get; set; } = "YES"; // YES / NO

    [Column("mod_broken")]
    public string ModBroken { get; set; } = "NO"; // YES / NO

    [Column("mod_mounting_structure")]
    public string ModMountingStructure { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("mod_nut_bolt_tightness")]
    public string ModNutBoltTightness { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("mod_photos_taken")]
    public string ModPhotosTaken { get; set; } = "YES"; // YES / NO

    [Column("mod_remarks")]
    public string? ModRemarks { get; set; }

    // Section 2: DC System
    [Column("dc_cables")]
    public string DcCables { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("dc_mc4_connectors")]
    public string DcMc4Connectors { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("dc_junction_box")]
    public string DcJunctionBox { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("dc_string_voltage")]
    public string DcStringVoltage { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("dc_cable_insulation")]
    public string DcCableInsulation { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("dc_remarks")]
    public string? DcRemarks { get; set; }

    // Section 3: Inverter
    [Column("inv_working")]
    public string InvWorking { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("inv_cooling_fans")]
    public string InvCoolingFans { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("inv_ac_output")]
    public string InvAcOutput { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("inv_other_issues")]
    public string InvOtherIssues { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("inv_remarks")]
    public string? InvRemarks { get; set; }

    // Section 4: AC System
    [Column("ac_cables")]
    public string AcCables { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("ac_distribution_board")]
    public string AcDistributionBoard { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("ac_mcb_mccb")]
    public string AcMcbMccb { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("ac_remarks")]
    public string? AcRemarks { get; set; }

    // Section 5: Earthing & Safety
    [Column("earth_equipment")]
    public string EarthEquipment { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("earth_lightning_arrester")]
    public string EarthLightningArrester { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("earth_spd")]
    public string EarthSpd { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("earth_pit")]
    public string EarthPit { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("earth_remarks")]
    public string? EarthRemarks { get; set; }

    // Section 6: Generation
    [Column("gen_total_this_month")]
    public decimal? GenTotalThisMonth { get; set; }

    [Column("gen_avg_daily")]
    public decimal? GenAvgDaily { get; set; }

    [Column("gen_expected")]
    public decimal? GenExpected { get; set; }

    [Column("gen_performance")]
    public string GenPerformance { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("gen_remarks")]
    public string? GenRemarks { get; set; }

    // Section 7: Net Meter
    [Column("meter_import_units")]
    public decimal? MeterImportUnits { get; set; }

    [Column("meter_export_units")]
    public decimal? MeterExportUnits { get; set; }

    [Column("meter_condition")]
    public string MeterCondition { get; set; } = "GOOD"; // GOOD / DEFECT

    [Column("meter_remarks")]
    public string? MeterRemarks { get; set; }

    // Section 8: Observations
    [Column("observations")]
    public string? Observations { get; set; }

    [Column("action_required")]
    public string? ActionRequired { get; set; }

    [Column("next_visit_date")]
    public DateTime? NextVisitDate { get; set; }

    // Signatures (Base64 PNG string)
    [Column("sig_engineer")]
    public string? SigEngineer { get; set; }

    [Column("sig_client")]
    public string? SigClient { get; set; }

    [Column("submitted_at")]
    public DateTime? SubmittedAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
