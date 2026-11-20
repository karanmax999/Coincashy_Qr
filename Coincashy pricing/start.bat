@echo off
title Coincashy Pricing Desk
echo Starting Coincashy Pricing Desk...
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Error: Node.js is not found in your PATH. Please install Node.js.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
)

echo Launching local server...
start http://localhost:5173
call npm run dev
