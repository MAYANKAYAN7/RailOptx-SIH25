@echo off
echo 🚆 Starting RailOptiX - Intelligent Railway Traffic Optimizer
echo.

echo [1/2] Starting Backend Server...
start "RailOptiX Backend" cmd /k "cd backend && python app.py"

timeout /t 3 /nobreak

echo [2/2] Starting Frontend Dashboard...
start "RailOptiX Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ RailOptiX system is starting up!
echo.
echo 📡 Backend API: http://localhost:5000
echo 🌐 Frontend Dashboard: http://localhost:3000
echo.
echo Press any key to exit...
pause
