@echo off
REM AI Network Configuration Translator - Windows Startup Script
REM This script starts a local web server and opens the application in your default browser

set PORT=8000
set APP_URL=http://localhost:%PORT%

echo Starting AI Network Configuration Translator...
echo Server will run on: %APP_URL%

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python 3 is not installed. Please install Python 3.6 or higher:
    echo   1. Download from: https://www.python.org/downloads/
    echo   2. During installation, check "Add Python to PATH"
    echo   3. Restart command prompt after installation
    pause
    exit /b 1
)

echo Python found:
python --version

REM Check if Flask is available (optional)
python -c "import flask" >nul 2>&1
if %errorlevel% equ 0 (
    echo Flask available - you can use 'python server.py' for advanced features
) else (
    echo Flask not found - using basic HTTP server
    echo Install Flask with: pip install flask
)

REM Check if the port is already in use
netstat -an | findstr ":%PORT% " >nul 2>&1
if %errorlevel% equ 0 (
    echo Port %PORT% is already in use. Trying to find an available port...
    for /l %%i in (1,1,10) do (
        set /a ALT_PORT=%PORT%+%%i
        netstat -an | findstr ":%ALT_PORT% " >nul 2>&1
        if %errorlevel% neq 0 (
            set PORT=%ALT_PORT%
            set APP_URL=http://localhost:%PORT%
            echo Found available port: %PORT%
            goto start_server
        )
    )
)

:start_server
echo Starting server on port %PORT%...
echo Press Ctrl+C to stop the server
echo Opening browser at %APP_URL%
echo.

REM Start the server
start /B python -m http.server %PORT%

REM Wait a moment for the server to start
timeout /t 2 /nobreak >nul

REM Open the browser
start "" "%APP_URL%"

echo Application started successfully!
echo If browser didn't open automatically, navigate to: %APP_URL%
echo.
echo Press any key to stop the server...
pause >nul

REM Stop the server
taskkill /f /im python.exe >nul 2>&1
echo Server stopped.
timeout /t 2 /nobreak >nul