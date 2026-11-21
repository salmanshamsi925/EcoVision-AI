@echo off
title EcoVision-AI Launcher
color 0B
echo ====================================================================
echo             ECOVISION-AI: THE FUTURE IS IN YOUR HANDS
echo ====================================================================
echo.
echo Starting EcoVision-AI Full-Stack Platform...
echo.

cd /d "%~dp0"

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "EcoVision Backend" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://127.0.0.1:5173 ...
start "EcoVision Frontend" cmd /k "cd frontend && npx vite --host 127.0.0.1 --port 5173"

timeout /t 3 /nobreak >nul

echo.
echo Opening EcoVision-AI in your default browser...
start http://127.0.0.1:5173

echo.
echo ====================================================================
echo  Servers are RUNNING!
echo  - Frontend: http://127.0.0.1:5173
echo  - Backend:  http://127.0.0.1:8000 (Also serves the website!)
echo ====================================================================
echo.
pause

