@echo off
title QuanityUIAngular
cd /d "%~dp0"
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Install Node.js from https://nodejs.org then try again.
    pause
    exit /b 1
  )
)
echo Starting dev server...
echo If the browser does not open, go to: http://127.0.0.1:4200
echo Press Ctrl+C in this window to stop the server.
call npm start
