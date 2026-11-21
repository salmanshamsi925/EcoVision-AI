@echo off
title Stop EcoVision-AI
echo Stopping EcoVision-AI servers...
taskkill /F /IM uvicorn.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
echo All EcoVision-AI servers stopped successfully.
pause

