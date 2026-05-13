@echo off
echo.
echo  =====================================
echo    Emotional Flower - Frontend Setup
echo  =====================================
echo.
cd /d "%~dp0frontend"
echo [1/2] Installing dependencies...
call npm install
echo.
echo [2/2] Starting dev server...
echo.
call npm run dev
pause
