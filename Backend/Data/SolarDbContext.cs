using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Models;

namespace SolarMaintenance.Api.Data;

public class SolarDbContext : DbContext
{
    public SolarDbContext(DbContextOptions<SolarDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Engineer> Engineers => Set<Engineer>();
    public DbSet<MaintenanceReport> MaintenanceReports => Set<MaintenanceReport>();
    public DbSet<Alert> Alerts => Set<Alert>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PlantCapacityKw).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Engineer>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<MaintenanceReport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ReportRef).IsUnique();
            entity.Property(e => e.GenTotalThisMonth).HasPrecision(12, 2);
            entity.Property(e => e.GenAvgDaily).HasPrecision(10, 2);
            entity.Property(e => e.GenExpected).HasPrecision(12, 2);
            entity.Property(e => e.MeterImportUnits).HasPrecision(12, 2);
            entity.Property(e => e.MeterExportUnits).HasPrecision(12, 2);

            entity.HasOne(e => e.Client)
                .WithMany()
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Engineer)
                .WithMany()
                .HasForeignKey(e => e.EngineerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Alert>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Client)
                .WithMany()
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Report)
                .WithMany()
                .HasForeignKey(e => e.ReportId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
