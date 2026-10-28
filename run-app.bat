@echo off
echo ========================================================
echo Starting Shree Abhi Solar Maintenance Application
echo ========================================================

echo 1. Starting .NET 10 Backend API on port 5000...
start "Solar Maintenance Backend API" cmd /k "cd /d %~dp0Backend 2>nul || cd /d %~dp0backend && dotnet run"

timeout /t 3 /nobreak > nul

echo 2. Starting React + Vite Frontend on port 5173...
start "Solar Maintenance Frontend" cmd /k "cd /d %~dp0Frontend 2>nul || cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo App URLs:
echo   - Web App (Browser / Mobile): http://localhost:5173
echo   - Backend API: http://localhost:5000/api/health
echo   - Admin Password: ShreeAbhi2024
echo ========================================================
pause
