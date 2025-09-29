@echo off
echo 🚆 Creating RailOptiX Project Backup...
echo.

set BACKUP_DIR=%USERPROFILE%\Desktop\RailOptiX_Backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%
echo Creating backup directory: %BACKUP_DIR%
mkdir "%BACKUP_DIR%" 2>nul

echo.
echo Copying project files...

:: Copy main files
copy "README.md" "%BACKUP_DIR%\" >nul
copy "SETUP.md" "%BACKUP_DIR%\" >nul
copy "DEMO_SHOWCASE.md" "%BACKUP_DIR%\" >nul
copy "FILE_INVENTORY.md" "%BACKUP_DIR%\" >nul
copy "start_railoptix.bat" "%BACKUP_DIR%\" >nul

:: Copy backend
echo Copying backend files...
mkdir "%BACKUP_DIR%\backend" 2>nul
copy "backend\*.py" "%BACKUP_DIR%\backend\" >nul
copy "backend\requirements.txt" "%BACKUP_DIR%\backend\" >nul

:: Copy frontend source (excluding node_modules)
echo Copying frontend source...
mkdir "%BACKUP_DIR%\frontend" 2>nul
mkdir "%BACKUP_DIR%\frontend\src" 2>nul
mkdir "%BACKUP_DIR%\frontend\src\components" 2>nul
mkdir "%BACKUP_DIR%\frontend\src\types" 2>nul
mkdir "%BACKUP_DIR%\frontend\public" 2>nul

copy "frontend\package.json" "%BACKUP_DIR%\frontend\" >nul
copy "frontend\src\*.tsx" "%BACKUP_DIR%\frontend\src\" >nul
copy "frontend\src\*.css" "%BACKUP_DIR%\frontend\src\" >nul
copy "frontend\src\components\*.tsx" "%BACKUP_DIR%\frontend\src\components\" >nul
copy "frontend\src\types\*.ts" "%BACKUP_DIR%\frontend\src\types\" >nul
xcopy "frontend\public\*" "%BACKUP_DIR%\frontend\public\" /E /I >nul 2>&1

echo.
echo ✅ Backup created successfully!
echo 📁 Location: %BACKUP_DIR%
echo.
echo 📋 Backup contains:
echo    - All source code (backend + frontend)
echo    - Documentation and demo guides
echo    - Setup scripts
echo    - Ready to run on any Windows machine
echo.
echo 💡 To use the backup:
echo    1. Copy the backup folder to any location
echo    2. Run start_railoptix.bat
echo    3. Access dashboard at http://localhost:3000
echo.

explorer "%BACKUP_DIR%"
pause
