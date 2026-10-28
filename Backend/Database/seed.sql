-- ====================================================================
-- Shree Abhi Electricals & Engineering Pvt. Ltd.
-- Seed Data for PostgreSQL / Supabase
-- ====================================================================

-- 1. Engineers
INSERT INTO engineers (id, name, phone, email, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Arun Kumar', '+91 98401 23456', 'arun.k@shreeabhi.com', true),
('22222222-2222-2222-2222-222222222222', 'Karthik Raja', '+91 98402 34567', 'karthik.r@shreeabhi.com', true),
('33333333-3333-3333-3333-333333333333', 'Vigneshwaran S', '+91 98403 45678', 'vignesh.s@shreeabhi.com', true),
('44444444-4444-4444-4444-444444444444', 'Praveen Sundaram', '+91 98404 56789', 'praveen.s@shreeabhi.com', true),
('55555555-5555-5555-5555-555555555555', 'Manikandan R', '+91 98405 67890', 'mani.r@shreeabhi.com', true),
('66666666-6666-6666-6666-666666666666', 'Dinesh Babu', '+91 98406 78901', 'dinesh.b@shreeabhi.com', true),
('77777777-7777-7777-7777-777777777777', 'Suresh K', '+91 98407 89012', 'suresh.k@shreeabhi.com', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clients
INSERT INTO clients (id, client_name, site_name, site_address, plant_capacity_kw, modules_make, modules_wp, total_modules, inverter_make, inverter_capacity, total_inverters, contact_name, contact_phone, contact_email, installation_date, amc_status, amc_start_date, amc_end_date, is_active) VALUES
('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Apex Polymers Pvt Ltd', 'Ambattur Plant 1 Rooftop', 'Plot 42, Sidco Industrial Estate, Ambattur, Chennai - 600058', 50.00, 'Vikram Solar SOMERA', 540, 92, 'Sungrow', '50 kW', 1, 'R. Senthil Nathan (Plant Head)', '+91 98410 11223', 'senthil@apexpolymers.in', '2026-01-15', 'FREE_YEAR1', NULL, NULL, true),
('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Southern Auto Components', 'Sriperumbudur Factory Unit A', 'SIPCOT Industrial Complex, Sriperumbudur, Kanchipuram - 602105', 100.00, 'Waaree Bi-54', 535, 188, 'Growatt MID 50KTL3-X', '50 kW x 2', 2, 'M. Balachandar (Facility Mgr)', '+91 98411 22334', 'bala.c@southernauto.co.in', '2024-06-10', 'AMC', '2025-06-10', '2027-06-09', true),
('c3333333-cccc-cccc-cccc-cccccccccccc', 'Chennai Cold Storage Facility', 'Madhavaram Main Warehouse', 'NH5 Ring Road, Madhavaram, Chennai - 600060', 75.00, 'Adani Solar Elan', 540, 140, 'Delta M25A', '25 kW x 3', 3, 'K. Srinivasan', '+91 98412 33445', 'operations@chennaicold.com', '2026-03-20', 'FREE_YEAR1', NULL, NULL, true),
('d4444444-dddd-dddd-dddd-dddddddddddd', 'Velammal Educational Trust', 'Mogappair Campus Rooftop', 'Surapet Main Road, Mogappair West, Chennai - 600037', 150.00, 'Tata Power Solar', 545, 275, 'Sungrow SG100CX / SG50CX', '100 kW + 50 kW', 2, 'Prof. R. Narayanan (Admin Officer)', '+91 98413 44556', 'solar.admin@velammal.edu.in', '2023-11-05', 'AMC', '2024-11-05', '2026-11-04', true),
('e5555555-eeee-eeee-eeee-eeeeeeeeeeee', 'GreenLeaf Agro Exports', 'Guindy Processing Unit', 'Olympia Tech Park Road, Guindy, Chennai - 600032', 40.00, 'RenewSys DESERV', 535, 75, 'Solis 40K-5G', '40 kW', 1, 'T. Annamalai', '+91 98414 55667', 'annamalai@greenleafagro.com', '2026-02-18', 'FREE_YEAR1', NULL, NULL, true),
('f6666666-ffff-ffff-ffff-ffffffffffff', 'Lakshmi Spinners Mill', 'Kanchipuram Weaving Division', 'Bangalore Highway, Near Toll Plaza, Kanchipuram - 631502', 200.00, 'Goldi Solar HELOC Plus', 550, 364, 'Huawei SUN2000-100KTL', '100 kW x 2', 2, 'S. Murugan (GM Maintenance)', '+91 98415 66778', 'murugan@lakshmispinners.com', '2024-02-01', 'AMC', '2025-02-01', '2027-01-31', true),
('a7777777-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Horizon IT Park', 'OMR Tech Tower B', 'Rajiv Gandhi Salai (OMR), Navalur, Chennai - 603103', 120.00, 'Vikram Solar SOMERA', 545, 220, 'Growatt MID 60KTL3-X', '60 kW x 2', 2, 'P. Rajesh (Estate Mgr)', '+91 98416 77889', 'facilities@horizonitpark.com', '2026-04-10', 'FREE_YEAR1', NULL, NULL, true),
('b8888888-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sri Balaji Hospitals', 'Chromepet Speciality Block', 'GST Road, Chromepet, Chennai - 600044', 60.00, 'Waaree Bi-54', 540, 112, 'Sungrow SG60CX', '60 kW', 1, 'Dr. Chandrasekharan (Admin)', '+91 98417 88990', 'admin@sribalajihospitals.com', '2023-08-20', 'AMC', '2024-08-20', '2026-08-19', true)
ON CONFLICT (id) DO NOTHING;
