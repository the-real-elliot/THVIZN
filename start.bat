@echo off
title THVIZN - Development Server
color 0A
cls
echo ========================================================
echo         THVIZN - LOCAL DEVELOPMENT SERVER
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Checking if port 3000 is occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [!] Port 3000 is currently in use by PID %%a. Freeing port...
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo [2/3] Opening browser at http://localhost:3000...
start http://localhost:3000

echo [3/3] Starting Next.js Dev Server on port 3000...
echo.
echo --------------------------------------------------------
echo Server is running! Press Ctrl+C in this window to stop,
echo or double-click stop.bat anytime.
echo --------------------------------------------------------
echo.
call npm run dev -- -p 3000
pause
