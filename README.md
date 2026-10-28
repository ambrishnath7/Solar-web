# Shree Abhi Solar Maintenance Web App (PMC System)
**Shree Abhi Electricals & Engineering Pvt. Ltd.**  
*MNRE-Registered Solar EPC & RESCO Company, Chennai*

---

## ☀️ Project Overview

A mobile-first preventive maintenance (PMC) web application built for field engineers and management of **Shree Abhi Electricals & Engineering Pvt. Ltd.** to conduct, record, and track quarterly preventive maintenance of rooftop solar installations at client sites across Chennai and Tamil Nadu.

### Key Capabilities
- **Engineer Login:** One-tap selection from active field engineers (no password friction in sunlight).
- **Client & Site Auto-Fill:** Searchable client directory with automatic loading of plant capacity (kW), panel specs (brand, Wp, count), inverters (make, capacity, count), and last maintenance visit date.
- **Physical PMC Sheet Parity (All 8 Sections):**
  - Section 1: Solar Module Inspection (Cleaning YES/NO, Broken module YES/NO, Mounting structure GOOD/DEFECT, Nut-bolt tightness GOOD/DEFECT, Before/After photos YES/NO, Remarks)
  - Section 2: DC System Inspection (DC cables, MC4 connectors, DC junction box, String voltage, Cable insulation, Remarks)
  - Section 3: Inverter Inspection (Working condition, Cooling fans, AC output voltage, Other issues, Remarks)
  - Section 4: AC System Inspection (AC cables / connections, AC distribution board, MCB/MCCB, Remarks)
  - Section 5: Earthing & Safety Check (Equipment earthing, Lightning arrester, SPD, Earthing pit resistance, Remarks)
  - Section 6: Generation Performance (Monthly generation kWh, Daily average kWh, Expected generation, Performance status, Remarks)
  - Section 7: Net Meter / EB Check (Import units, Export units, Net meter condition, Remarks)
  - Section 8: Observations & Issues (General observations, Action required, Auto-calculated next visit date: `visit date + 90 days`)
- **Dual Touchscreen Signatures:** High-resolution touch/mouse signature pads for both Field Engineer / Supervisor and Client Representative.
- **Draft & Final Submission:**
  - **Save Draft:** Stores incomplete inspections with reference tracking (`PMC-YYYY-NNNN`).
  - **Submit Final:** Locks inspection data, stamps completion timestamp, and automatically schedules the next 7-day maintenance reminder alert.
- **Formatted PDF Report Generation:** Produces official branded PDF report with company logo, client site specifications, 2-column inspection check tables with colored status badges (GOOD green, DEFECT red), generation figures, observations, and digital signatures.
- **One-Tap WhatsApp & Email Sharing:** Pre-fills client message with inspection summary and triggers direct PDF download and chat dispatch.
- **Admin Dashboard (Password Protected: `ShreeAbhi2024`):**
  - KPI Metrics (Monthly visits, Defects flagged, Pending drafts, Free Year 1 vs Paid AMC count)
  - Full report explorer with search & multi-attribute filters (by Client, Engineer, Status, Date)
  - Report viewer modal & editor for submitted/draft reports
  - Client Master Management (Add/Edit plants, capacities, contact details, AMC status)
  - Engineer Master Management (Add/Edit engineers, toggle active status)
  - 7-Day Alert Reminder Center with manual triggers and automated background processing.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | Tailwind CSS v4, Lucide Icons, Canvas Touch Signature Pads |
| **PDF Engine** | jsPDF + jsPDF-AutoTable | Client-side & server-compatible report generator |
| **Backend API** | ASP.NET Core (.NET 10 Web API) | C# Controllers, RESTful API, CORS, JSON serialization |
| **Database ORM** | Entity Framework Core + Npgsql | Auto-migration, relational foreign keys, UTC timestamps |
| **Database** | PostgreSQL 18 | Running locally on port `2818` (or Supabase Cloud PostgreSQL) |

---

## 🗄️ Database Schema

The database consists of 4 relational tables:
1. `clients`: Stores plant capacity, module wattage, inverter specs, contact details, installation date, and AMC status (`FREE_YEAR1` vs `AMC`).
2. `engineers`: Names, phone numbers, and active flags for field technicians.
3. `maintenance_reports`: All 8 PMC inspection sections, readings, observations, signatures (Base64 PNG), reference numbers (`PMC-YYYY-NNNN`), and status (`draft` / `submitted`).
4. `alerts`: Auto-generated reminders scheduled for `next_visit_date - 7 days` with statuses (`pending`, `sent`, `acknowledged`).

*Direct SQL DDL scripts are provided in `backend/Database/schema.sql` and `backend/Database/seed.sql`.*

---

## 🚀 Running the Application Locally

### 1. Prerequisites
- **.NET SDK 10** (or .NET 8+)
- **Node.js** (v18+) & **npm**
- **PostgreSQL 18** (Listening on `localhost:2818` or configured in `backend/appsettings.json`)

### 2. Start Backend API (.NET)
```powershell
cd "d:\Solar Maintanance Pjt\backend"
dotnet run
```
- API will start at: `http://localhost:5000`
- On startup, Entity Framework Core automatically creates the database and populates seed data (Engineers, Clients, Sample Reports, and Alerts).

### 3. Start Frontend (React + TypeScript)
```powershell
cd "d:\Solar Maintanance Pjt\frontend"
npm install
npm run dev
```
- Web App will be live at: `http://localhost:5173`
- Network access for mobile phones on local Wi-Fi (e.g. `http://192.168.1.52:5173/`).

---

## 🔐 Credentials & Defaults

- **Admin Password:** `ShreeAbhi2024`
- **PostgreSQL User:** `postgres`
- **PostgreSQL Database:** `solar_maintenance`
- **PostgreSQL Port:** `2818`
- **Company Contact:** `bnsimhan@gmail.com` | `+91 98401 23456`
- **Website:** `shreeabhisolar.com`

---

## 📱 Mobile Field Usage Guide

1. Open `http://localhost:5173` (or network IP) on an Android Chrome or iPhone Safari browser.
2. Select your name from the **Field Engineer** dropdown.
3. Select the registered **Client / Site**. Plant capacity and previous visit dates are automatically loaded.
4. Step through **Sections 1 through 8** tapping the large, sunlight-friendly `GOOD / DEFECT` or `YES / NO` buttons.
5. In **Section 8 & Signatures**, sign with your finger on the touch pad and obtain the client representative's signature.
6. Tap **Submit Final** — the report is finalized, locked, and next quarterly visit reminder is scheduled.
7. Tap **WhatsApp Share** to send the summary and PDF report directly to the client's phone.
