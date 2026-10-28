-- ====================================================================
-- Shree Abhi Electricals & Engineering Pvt. Ltd.
-- Solar Maintenance Web App (PMC System)
-- Microsoft SQL Server (T-SQL) Schema Version
-- ====================================================================

-- 1. Table: clients
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'clients')
BEGIN
    CREATE TABLE clients (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        client_name NVARCHAR(255) NOT NULL,
        site_name NVARCHAR(255) NOT NULL,
        site_address NVARCHAR(MAX) NULL,
        plant_capacity_kw DECIMAL(10,2) NOT NULL DEFAULT 0,
        modules_make NVARCHAR(255) NULL,
        modules_wp INT NOT NULL DEFAULT 0,
        total_modules INT NOT NULL DEFAULT 0,
        inverter_make NVARCHAR(255) NULL,
        inverter_capacity NVARCHAR(255) NULL,
        total_inverters INT NOT NULL DEFAULT 0,
        contact_name NVARCHAR(255) NULL,
        contact_phone NVARCHAR(50) NULL,
        contact_email NVARCHAR(255) NULL,
        installation_date DATE NULL,
        amc_status NVARCHAR(50) NOT NULL DEFAULT 'FREE_YEAR1', -- 'FREE_YEAR1' or 'AMC'
        amc_start_date DATE NULL,
        amc_end_date DATE NULL,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
    );
END
GO

-- 2. Table: engineers
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'engineers')
BEGIN
    CREATE TABLE engineers (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(255) NOT NULL,
        phone NVARCHAR(50) NULL,
        email NVARCHAR(255) NULL,
        is_active BIT NOT NULL DEFAULT 1
    );
END
GO

-- 3. Table: maintenance_reports
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'maintenance_reports')
BEGIN
    CREATE TABLE maintenance_reports (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        report_ref NVARCHAR(50) NOT NULL UNIQUE,
        client_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES clients(id),
        engineer_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES engineers(id),
        visit_date DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
        prev_maintenance_date DATE NULL,
        no_of_technicians INT NOT NULL DEFAULT 1,
        status NVARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft' or 'submitted'

        -- Section 1: Solar Modules
        mod_cleaning NVARCHAR(10) NOT NULL DEFAULT 'YES',
        mod_broken NVARCHAR(10) NOT NULL DEFAULT 'NO',
        mod_mounting_structure NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        mod_nut_bolt_tightness NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        mod_photos_taken NVARCHAR(10) NOT NULL DEFAULT 'YES',
        mod_remarks NVARCHAR(MAX) NULL,

        -- Section 2: DC System
        dc_cables NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        dc_mc4_connectors NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        dc_junction_box NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        dc_string_voltage NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        dc_cable_insulation NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        dc_remarks NVARCHAR(MAX) NULL,

        -- Section 3: Inverter
        inv_working NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        inv_cooling_fans NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        inv_ac_output NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        inv_other_issues NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        inv_remarks NVARCHAR(MAX) NULL,

        -- Section 4: AC System
        ac_cables NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        ac_distribution_board NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        ac_mcb_mccb NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        ac_remarks NVARCHAR(MAX) NULL,

        -- Section 5: Earthing & Safety
        earth_equipment NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        earth_lightning_arrester NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        earth_spd NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        earth_pit NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        earth_remarks NVARCHAR(MAX) NULL,

        -- Section 6: Generation Performance
        gen_total_this_month DECIMAL(12,2) NULL,
        gen_avg_daily DECIMAL(10,2) NULL,
        gen_expected DECIMAL(12,2) NULL,
        gen_performance NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        gen_remarks NVARCHAR(MAX) NULL,

        -- Section 7: Net Meter / EB Check
        meter_import_units DECIMAL(12,2) NULL,
        meter_export_units DECIMAL(12,2) NULL,
        meter_condition NVARCHAR(20) NOT NULL DEFAULT 'GOOD',
        meter_remarks NVARCHAR(MAX) NULL,

        -- Section 8: Observations / Issues Found
        observations NVARCHAR(MAX) NULL,
        action_required NVARCHAR(MAX) NULL,
        next_visit_date DATE NULL,

        -- Signatures
        sig_engineer NVARCHAR(MAX) NULL,
        sig_client NVARCHAR(MAX) NULL,
        submitted_at DATETIMEOFFSET NULL,
        created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
    );
END
GO

-- 4. Table: alerts
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'alerts')
BEGIN
    CREATE TABLE alerts (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        client_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES clients(id) ON DELETE CASCADE,
        report_id UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES maintenance_reports(id) ON DELETE SET NULL,
        due_date DATE NOT NULL,
        alert_sent_at DATETIMEOFFSET NULL,
        alert_type NVARCHAR(50) NOT NULL DEFAULT 'email',
        status NVARCHAR(50) NOT NULL DEFAULT 'pending',
        created_at DATETIMEOFFSET DEFAULT SYSDATETIMEOFFSET()
    );
END
GO
