@echo off
echo.
echo  ====================================
echo    Emotional Flower - Backend Setup
echo  ====================================
echo.
cd /d "%~dp0backend"
echo [1/2] Installing dependencies...
call npm install
echo.
echo [2/2] Starting server...
echo.
call npm run dev
pause
