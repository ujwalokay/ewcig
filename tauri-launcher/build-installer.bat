@echo off
echo ========================================
echo GGCircuit Launcher - Build Installer
echo ========================================
echo.

REM Check for required tools
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

where cargo >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Rust not found. Please install from https://rustup.rs/
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Check for .env file
if not exist ".env" (
    echo Creating .env from template...
    copy .env.example .env
    echo Please edit .env with your terminal configuration before building.
    notepad .env
    pause
)

echo.
echo Building installer...
call npm run tauri build

echo.
echo ========================================
echo Build complete!
echo Installer located at:
echo   src-tauri\target\release\bundle\msi\
echo   src-tauri\target\release\bundle\nsis\
echo ========================================
pause
