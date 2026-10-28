-- ====================================================================
-- Shree Abhi Electricals & Engineering Pvt. Ltd.
-- Solar Maintenance Web App (PMC System)
-- Database Schema for PostgreSQL / Supabase
-- ====================================================================

-- Enable pgcrypto extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    site_name TEXT NOT NULL,
    site_address TEXT,
    plant_capacity_kw NUMERIC(10,2) NOT NULL DEFAULT 0,
    modules_make TEXT,
    modules_wp INTEGER NOT NULL DEFAULT 0,
    total_modules INTEGER NOT NULL DEFAULT 0,
    inverter_make TEXT,
    inverter_capacity TEXT,
    total_inverters INTEGER NOT NULL DEFAULT 0,
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    installation_date DATE,
    amc_status TEXT NOT NULL DEFAULT 'FREE_YEAR1', -- 'FREE_YEAR1' or 'AMC'
    amc_start_date DATE,
    amc_end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table: engineers
CREATE TABLE IF NOT EXISTS engineers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Table: maintenance_reports
CREATE TABLE IF NOT EXISTS maintenance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_ref TEXT NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    engineer_id UUID NOT NULL REFERENCES engineers(id) ON DELETE RESTRICT,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    prev_maintenance_date DATE,
    no_of_technicians INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'submitted'

    -- Section 1: Solar Modules
    mod_cleaning TEXT NOT NULL DEFAULT 'YES',
    mod_broken TEXT NOT NULL DEFAULT 'NO',
    mod_mounting_structure TEXT NOT NULL DEFAULT 'GOOD',
    mod_nut_bolt_tightness TEXT NOT NULL DEFAULT 'GOOD',
    mod_photos_taken TEXT NOT NULL DEFAULT 'YES',
    mod_remarks TEXT,

    -- Section 2: DC System
    dc_cables TEXT NOT NULL DEFAULT 'GOOD',
    dc_mc4_connectors TEXT NOT NULL DEFAULT 'GOOD',
    dc_junction_box TEXT NOT NULL DEFAULT 'GOOD',
    dc_string_voltage TEXT NOT NULL DEFAULT 'GOOD',
    dc_cable_insulation TEXT NOT NULL DEFAULT 'GOOD',
    dc_remarks TEXT,

    -- Section 3: Inverter
    inv_working TEXT NOT NULL DEFAULT 'GOOD',
    inv_cooling_fans TEXT NOT NULL DEFAULT 'GOOD',
    inv_ac_output TEXT NOT NULL DEFAULT 'GOOD',
    inv_other_issues TEXT NOT NULL DEFAULT 'GOOD',
    inv_remarks TEXT,

    -- Section 4: AC System
    ac_cables TEXT NOT NULL DEFAULT 'GOOD',
    ac_distribution_board TEXT NOT NULL DEFAULT 'GOOD',
    ac_mcb_mccb TEXT NOT NULL DEFAULT 'GOOD',
    ac_remarks TEXT,

    -- Section 5: Earthing & Safety
    earth_equipment TEXT NOT NULL DEFAULT 'GOOD',
    earth_lightning_arrester TEXT NOT NULL DEFAULT 'GOOD',
    earth_spd TEXT NOT NULL DEFAULT 'GOOD',
    earth_pit TEXT NOT NULL DEFAULT 'GOOD',
    earth_remarks TEXT,

    -- Section 6: Generation Performance
    gen_total_this_month NUMERIC(12,2),
    gen_avg_daily NUMERIC(10,2),
    gen_expected NUMERIC(12,2),
    gen_performance TEXT NOT NULL DEFAULT 'GOOD',
    gen_remarks TEXT,

    -- Section 7: Net Meter / EB Check
    meter_import_units NUMERIC(12,2),
    meter_export_units NUMERIC(12,2),
    meter_condition TEXT NOT NULL DEFAULT 'GOOD',
    meter_remarks TEXT,

    -- Section 8: Observations / Issues Found
    observations TEXT,
    action_required TEXT,
    next_visit_date DATE,

    -- Signatures
    sig_engineer TEXT, -- Base64 PNG signature
    sig_client TEXT,   -- Base64 PNG signature
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Table: alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    report_id UUID REFERENCES maintenance_reports(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    alert_sent_at TIMESTAMP WITH TIME ZONE,
    alert_type TEXT NOT NULL DEFAULT 'email', -- 'email' or 'whatsapp'
    status TEXT NOT NULL DEFAULT 'pending',   -- 'pending' / 'sent' / 'acknowledged'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_client_id ON maintenance_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_reports_engineer_id ON maintenance_reports(engineer_id);
CREATE INDEX IF NOT EXISTS idx_reports_visit_date ON maintenance_reports(visit_date);
CREATE INDEX IF NOT EXISTS idx_reports_status ON maintenance_reports(status);
CREATE INDEX IF NOT EXISTS idx_alerts_due_date ON alerts(due_date);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
