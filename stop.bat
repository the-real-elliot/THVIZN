@echo off
title THVIZN - Stop Development Server
color 0C
cls
echo ========================================================
echo         THVIZN - STOPPING SERVER
echo ========================================================
echo.

set FOUND=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [*] Found process on port 3000 (PID %%a). Terminating...
    taskkill /F /PID %%a >nul 2>&1
    set FOUND=1
)

if %FOUND%==1 (
    echo.
    echo [OK] THVIZN Dev Server on port 3000 has been stopped successfully.
) else (
    echo.
    echo [i] No active server was detected on port 3000.
)

echo.
echo ========================================================
echo Port 3000 is now free.
echo ========================================================
echo.
pause
