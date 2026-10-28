using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SolarMaintenance.Api.Models;

[Table("alerts")]
public class Alert
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("client_id")]
    public Guid ClientId { get; set; }

    [ForeignKey(nameof(ClientId))]
    public Client? Client { get; set; }

    [Column("report_id")]
    public Guid? ReportId { get; set; }

    [ForeignKey(nameof(ReportId))]
    public MaintenanceReport? Report { get; set; }

    [Column("due_date")]
    public DateTime DueDate { get; set; }

    [Column("alert_sent_at")]
    public DateTime? AlertSentAt { get; set; }

    [Column("alert_type")]
    public string AlertType { get; set; } = "email"; // 'email' or 'whatsapp'

    [Column("status")]
    public string Status { get; set; } = "pending"; // 'pending' / 'sent' / 'acknowledged'

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
