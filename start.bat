@echo off
REM WanderWise Startup Script for Windows
REM This script starts both the server and client automatically

echo 🚀 Starting WanderWise...

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Start server in new window
echo 📦 Starting server...
start "WanderWise Server" cmd /k "cd Server && npm start"

REM Wait a bit for server to start
timeout /t 3 /nobreak >nul

REM Start client in new window
echo 🎨 Starting client...
start "WanderWise Client" cmd /k "cd Client && npm run dev"

echo ✅ WanderWise is running!
echo    Server: http://localhost:5002
echo    Client: http://localhost:5173
echo.
echo Close the windows to stop the services.

pause

