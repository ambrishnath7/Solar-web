using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Models;

namespace SolarMaintenance.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(SolarDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Engineers.AnyAsync())
        {
            return; // DB already seeded
        }

        // 1. Seed Engineers
        var engineers = new List<Engineer>
        {
            new() { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Arun Kumar", Phone = "+91 98401 23456", Email = "arun.k@shreeabhi.com", IsActive = true },
            new() { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Karthik Raja", Phone = "+91 98402 34567", Email = "karthik.r@shreeabhi.com", IsActive = true },
            new() { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Vigneshwaran S", Phone = "+91 98403 45678", Email = "vignesh.s@shreeabhi.com", IsActive = true },
            new() { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Praveen Sundaram", Phone = "+91 98404 56789", Email = "praveen.s@shreeabhi.com", IsActive = true },
            new() { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Manikandan R", Phone = "+91 98405 67890", Email = "mani.r@shreeabhi.com", IsActive = true },
            new() { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "Dinesh Babu", Phone = "+91 98406 78901", Email = "dinesh.b@shreeabhi.com", IsActive = true },
            new() { Id = Guid.Parse("77777777-7777-7777-7777-777777777777"), Name = "Suresh K", Phone = "+91 98407 89012", Email = "suresh.k@shreeabhi.com", IsActive = true }
        };
        await context.Engineers.AddRangeAsync(engineers);

        // 2. Seed Clients
        var clients = new List<Client>
        {
            new()
            {
                Id = Guid.Parse("a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                ClientName = "Apex Polymers Pvt Ltd",
                SiteName = "Ambattur Plant 1 Rooftop",
                SiteAddress = "Plot 42, Sidco Industrial Estate, Ambattur, Chennai - 600058",
                PlantCapacityKw = 50.0m,
                ModulesMake = "Vikram Solar SOMERA",
                ModulesWp = 540,
                TotalModules = 92,
                InverterMake = "Sungrow",
                InverterCapacity = "50 kW",
                TotalInverters = 1,
                ContactName = "R. Senthil Nathan (Plant Head)",
                ContactPhone = "+91 98410 11223",
                ContactEmail = "senthil@apexpolymers.in",
                InstallationDate = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "FREE_YEAR1",
                AmcStartDate = null,
                AmcEndDate = null,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-9)
            },
            new()
            {
                Id = Guid.Parse("b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                ClientName = "Southern Auto Components",
                SiteName = "Sriperumbudur Factory Unit A",
                SiteAddress = "SIPCOT Industrial Complex, Sriperumbudur, Kanchipuram - 602105",
                PlantCapacityKw = 100.0m,
                ModulesMake = "Waaree Bi-54",
                ModulesWp = 535,
                TotalModules = 188,
                InverterMake = "Growatt MID 50KTL3-X",
                InverterCapacity = "50 kW x 2",
                TotalInverters = 2,
                ContactName = "M. Balachandar (Facility Mgr)",
                ContactPhone = "+91 98411 22334",
                ContactEmail = "bala.c@southernauto.co.in",
                InstallationDate = new DateTime(2024, 6, 10, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "AMC",
                AmcStartDate = new DateTime(2025, 6, 10, 0, 0, 0, DateTimeKind.Utc),
                AmcEndDate = new DateTime(2027, 6, 9, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-16)
            },
            new()
            {
                Id = Guid.Parse("c3333333-cccc-cccc-cccc-cccccccccccc"),
                ClientName = "Chennai Cold Storage Facility",
                SiteName = "Madhavaram Main Warehouse",
                SiteAddress = "NH5 Ring Road, Madhavaram, Chennai - 600060",
                PlantCapacityKw = 75.0m,
                ModulesMake = "Adani Solar Elan",
                ModulesWp = 540,
                TotalModules = 140,
                InverterMake = "Delta M25A",
                InverterCapacity = "25 kW x 3",
                TotalInverters = 3,
                ContactName = "K. Srinivasan",
                ContactPhone = "+91 98412 33445",
                ContactEmail = "operations@chennaicold.com",
                InstallationDate = new DateTime(2026, 3, 20, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "FREE_YEAR1",
                AmcStartDate = null,
                AmcEndDate = null,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-7)
            },
            new()
            {
                Id = Guid.Parse("d4444444-dddd-dddd-dddd-dddddddddddd"),
                ClientName = "Velammal Educational Trust",
                SiteName = "Mogappair Campus Rooftop",
                SiteAddress = "Surapet Main Road, Mogappair West, Chennai - 600037",
                PlantCapacityKw = 150.0m,
                ModulesMake = "Tata Power Solar",
                ModulesWp = 545,
                TotalModules = 275,
                InverterMake = "Sungrow SG100CX / SG50CX",
                InverterCapacity = "100 kW + 50 kW",
                TotalInverters = 2,
                ContactName = "Prof. R. Narayanan (Admin Officer)",
                ContactPhone = "+91 98413 44556",
                ContactEmail = "solar.admin@velammal.edu.in",
                InstallationDate = new DateTime(2023, 11, 5, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "AMC",
                AmcStartDate = new DateTime(2024, 11, 5, 0, 0, 0, DateTimeKind.Utc),
                AmcEndDate = new DateTime(2026, 11, 4, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-24)
            },
            new()
            {
                Id = Guid.Parse("e5555555-eeee-eeee-eeee-eeeeeeeeeeee"),
                ClientName = "GreenLeaf Agro Exports",
                SiteName = "Guindy Processing Unit",
                SiteAddress = "Olympia Tech Park Road, Guindy, Chennai - 600032",
                PlantCapacityKw = 40.0m,
                ModulesMake = "RenewSys DESERV",
                ModulesWp = 535,
                TotalModules = 75,
                InverterMake = "Solis 40K-5G",
                InverterCapacity = "40 kW",
                TotalInverters = 1,
                ContactName = "T. Annamalai",
                ContactPhone = "+91 98414 55667",
                ContactEmail = "annamalai@greenleafagro.com",
                InstallationDate = new DateTime(2026, 2, 18, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "FREE_YEAR1",
                AmcStartDate = null,
                AmcEndDate = null,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-8)
            },
            new()
            {
                Id = Guid.Parse("f6666666-ffff-ffff-ffff-ffffffffffff"),
                ClientName = "Lakshmi Spinners Mill",
                SiteName = "Kanchipuram Weaving Division",
                SiteAddress = "Bangalore Highway, Near Toll Plaza, Kanchipuram - 631502",
                PlantCapacityKw = 200.0m,
                ModulesMake = "Goldi Solar HELOC Plus",
                ModulesWp = 550,
                TotalModules = 364,
                InverterMake = "Huawei SUN2000-100KTL",
                InverterCapacity = "100 kW x 2",
                TotalInverters = 2,
                ContactName = "S. Murugan (GM Maintenance)",
                ContactPhone = "+91 98415 66778",
                ContactEmail = "murugan@lakshmispinners.com",
                InstallationDate = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "AMC",
                AmcStartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc),
                AmcEndDate = new DateTime(2027, 1, 31, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-20)
            },
            new()
            {
                Id = Guid.Parse("a7777777-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                ClientName = "Horizon IT Park",
                SiteName = "OMR Tech Tower B",
                SiteAddress = "Rajiv Gandhi Salai (OMR), Navalur, Chennai - 603103",
                PlantCapacityKw = 120.0m,
                ModulesMake = "Vikram Solar SOMERA",
                ModulesWp = 545,
                TotalModules = 220,
                InverterMake = "Growatt MID 60KTL3-X",
                InverterCapacity = "60 kW x 2",
                TotalInverters = 2,
                ContactName = "P. Rajesh (Estate Mgr)",
                ContactPhone = "+91 98416 77889",
                ContactEmail = "facilities@horizonitpark.com",
                InstallationDate = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "FREE_YEAR1",
                AmcStartDate = null,
                AmcEndDate = null,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new()
            {
                Id = Guid.Parse("b8888888-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                ClientName = "Sri Balaji Hospitals",
                SiteName = "Chromepet Speciality Block",
                SiteAddress = "GST Road, Chromepet, Chennai - 600044",
                PlantCapacityKw = 60.0m,
                ModulesMake = "Waaree Bi-54",
                ModulesWp = 540,
                TotalModules = 112,
                InverterMake = "Sungrow SG60CX",
                InverterCapacity = "60 kW",
                TotalInverters = 1,
                ContactName = "Dr. Chandrasekharan (Admin)",
                ContactPhone = "+91 98417 88990",
                ContactEmail = "admin@sribalajihospitals.com",
                InstallationDate = new DateTime(2023, 8, 20, 0, 0, 0, DateTimeKind.Utc),
                AmcStatus = "AMC",
                AmcStartDate = new DateTime(2024, 8, 20, 0, 0, 0, DateTimeKind.Utc),
                AmcEndDate = new DateTime(2026, 8, 19, 0, 0, 0, DateTimeKind.Utc),
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddMonths(-26)
            }
        };
        await context.Clients.AddRangeAsync(clients);

        // 3. Seed Maintenance Reports (One recent submitted, one draft)
        var sampleReport1 = new MaintenanceReport
        {
            Id = Guid.Parse("c1111111-cccc-cccc-cccc-cccccccccccc"),
            ReportRef = "PMC-2026-0041",
            ClientId = clients[0].Id, // Apex Polymers
            EngineerId = engineers[0].Id, // Arun Kumar
            VisitDate = DateTime.UtcNow.AddDays(-20).Date,
            PrevMaintenanceDate = DateTime.UtcNow.AddDays(-110).Date,
            NoOfTechnicians = 2,
            Status = "submitted",
            ModCleaning = "YES",
            ModBroken = "NO",
            ModMountingStructure = "GOOD",
            ModNutBoltTightness = "GOOD",
            ModPhotosTaken = "YES",
            ModRemarks = "All modules washed with DM water. Light bird droppings cleaned thoroughly.",
            DcCables = "GOOD",
            DcMc4Connectors = "GOOD",
            DcJunctionBox = "GOOD",
            DcStringVoltage = "GOOD",
            DcCableInsulation = "GOOD",
            DcRemarks = "String voltages checked between 680V - 695V DC. Connectors snug.",
            InvWorking = "GOOD",
            InvCoolingFans = "GOOD",
            InvAcOutput = "GOOD",
            InvOtherIssues = "GOOD",
            InvRemarks = "Heat sink cleaned. Fan RPM normal. No error codes logged.",
            AcCables = "GOOD",
            AcDistributionBoard = "GOOD",
            AcMcbMccb = "GOOD",
            AcRemarks = "AC terminal torque verified. Breakers tested OK.",
            EarthEquipment = "GOOD",
            EarthLightningArrester = "GOOD",
            EarthSpd = "GOOD",
            EarthPit = "GOOD",
            EarthRemarks = "Earth resistance measured at 1.8 Ohms. Water poured into pit.",
            GenTotalThisMonth = 6250.00m,
            GenAvgDaily = 208.30m,
            GenExpected = 6000.00m,
            GenPerformance = "GOOD",
            GenRemarks = "System performing 4.1% above projected PR.",
            MeterImportUnits = 1420.00m,
            MeterExportUnits = 5890.00m,
            MeterCondition = "GOOD",
            MeterRemarks = "Bi-directional meter working as per TANGEDCO specs.",
            Observations = "Plant is in excellent working condition. Roof access walkway clear.",
            ActionRequired = "Next visit scheduled for quarterly module thermal scan.",
            NextVisitDate = DateTime.UtcNow.AddDays(70).Date,
            SigEngineer = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='60'><path d='M10 40 Q 50 10 90 35 T 150 20' stroke='%23059669' stroke-width='2' fill='none'/><text x='15' y='55' font-size='10' fill='%23666'>Arun Kumar</text></svg>",
            SigClient = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='60'><path d='M15 35 Q 60 50 100 20 T 145 40' stroke='%232563eb' stroke-width='2' fill='none'/><text x='15' y='55' font-size='10' fill='%23666'>R. Senthil Nathan</text></svg>",
            SubmittedAt = DateTime.UtcNow.AddDays(-20),
            CreatedAt = DateTime.UtcNow.AddDays(-20)
        };

        var sampleReport2 = new MaintenanceReport
        {
            Id = Guid.Parse("d2222222-dddd-dddd-dddd-dddddddddddd"),
            ReportRef = "PMC-2026-0042",
            ClientId = clients[1].Id, // Southern Auto
            EngineerId = engineers[1].Id, // Karthik Raja
            VisitDate = DateTime.UtcNow.AddDays(-2).Date,
            PrevMaintenanceDate = DateTime.UtcNow.AddDays(-92).Date,
            NoOfTechnicians = 3,
            Status = "draft",
            ModCleaning = "YES",
            ModBroken = "NO",
            ModMountingStructure = "GOOD",
            ModNutBoltTightness = "DEFECT",
            ModPhotosTaken = "YES",
            ModRemarks = "Row 4 module fasteners loose due to wind vibrations. Tightened on spot.",
            DcCables = "GOOD",
            DcMc4Connectors = "GOOD",
            DcJunctionBox = "DEFECT",
            DcStringVoltage = "GOOD",
            DcCableInsulation = "GOOD",
            DcRemarks = "String 3 fuse holder clip loose in DCDB-2. Replacement recommended.",
            InvWorking = "GOOD",
            InvCoolingFans = "GOOD",
            InvAcOutput = "GOOD",
            InvOtherIssues = "GOOD",
            InvRemarks = "Both 50kW inverters operating stably.",
            AcCables = "GOOD",
            AcDistributionBoard = "GOOD",
            AcMcbMccb = "GOOD",
            AcRemarks = "AC cables clamped securely.",
            EarthEquipment = "GOOD",
            EarthLightningArrester = "GOOD",
            EarthSpd = "GOOD",
            EarthPit = "GOOD",
            EarthRemarks = "Earth pit pit-3 resistance 2.4 Ohms.",
            GenTotalThisMonth = 12400.00m,
            GenAvgDaily = 413.30m,
            GenExpected = 13000.00m,
            GenPerformance = "GOOD",
            GenRemarks = "Minor dip due to recent monsoon overcast days.",
            MeterImportUnits = 3100.00m,
            MeterExportUnits = 11200.00m,
            MeterCondition = "GOOD",
            MeterRemarks = "Meter reading synchronized.",
            Observations = "Module row 4 fasteners and DCDB-2 fuse clip need signoff.",
            ActionRequired = "Replace fuse holder in DCDB-2 during next scheduled check.",
            NextVisitDate = DateTime.UtcNow.AddDays(88).Date,
            SigEngineer = null,
            SigClient = null,
            SubmittedAt = null,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        await context.MaintenanceReports.AddRangeAsync(sampleReport1, sampleReport2);

        // 4. Seed Alerts
        var sampleAlert1 = new Alert
        {
            Id = Guid.Parse("e1111111-eeee-eeee-eeee-eeeeeeeeeeee"),
            ClientId = clients[2].Id, // Chennai Cold Storage Facility
            ReportId = null,
            DueDate = DateTime.UtcNow.AddDays(5).Date, // Due in 5 days! (Upcoming alert)
            AlertSentAt = null,
            AlertType = "email",
            Status = "pending",
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        };

        var sampleAlert2 = new Alert
        {
            Id = Guid.Parse("e2222222-eeee-eeee-eeee-eeeeeeeeeeee"),
            ClientId = clients[0].Id,
            ReportId = sampleReport1.Id,
            DueDate = sampleReport1.NextVisitDate!.Value.AddDays(-7).Date,
            AlertSentAt = null,
            AlertType = "email",
            Status = "pending",
            CreatedAt = sampleReport1.CreatedAt
        };

        var sampleAlert3 = new Alert
        {
            Id = Guid.Parse("e3333333-eeee-eeee-eeee-eeeeeeeeeeee"),
            ClientId = clients[3].Id, // Velammal
            ReportId = null,
            DueDate = DateTime.UtcNow.AddDays(-2).Date,
            AlertSentAt = DateTime.UtcNow.AddDays(-2),
            AlertType = "email",
            Status = "sent",
            CreatedAt = DateTime.UtcNow.AddDays(-40)
        };

        await context.Alerts.AddRangeAsync(sampleAlert1, sampleAlert2, sampleAlert3);

        await context.SaveChangesAsync();
    }
}
