#!/bin/bash

# AI Network Configuration Translator - Linux/macOS Startup Script
# This script starts a local web server and opens the application in your default browser

PORT=8000
APP_URL="http://localhost:$PORT"

echo "Starting AI Network Configuration Translator..."
echo "Server will run on: $APP_URL"

# Check if Python 3 is installed
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
    echo "Python 3 found: $PYTHON_VERSION"
    SERVER_CMD="python3 -m http.server $PORT"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1 | cut -d' ' -f2)
    echo "Python found: $PYTHON_VERSION"
    SERVER_CMD="python -m http.server $PORT"
else
    echo "Python 3 is not installed. Please install Python 3.6 or higher:"
    echo "  Ubuntu/Debian: sudo apt update && sudo apt install python3"
    echo "  CentOS/RHEL: sudo yum install python3"
    echo "  macOS: brew install python3"
    echo "  Download from: https://www.python.org/downloads/"
    exit 1
fi

# Check if Flask is available (optional)
if python3 -c "import flask" 2>/dev/null; then
    echo "Flask available - you can use 'python3 server.py' for advanced features"
else
    echo "Flask not found - using basic HTTP server (install with: pip3 install flask)"
fi

# Check if the port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $PORT is already in use. Trying to find an available port..."
    for alt_port in {8001..8010}; do
        if ! lsof -Pi :$alt_port -sTCP:LISTEN -t >/dev/null 2>&1; then
            PORT=$alt_port
            APP_URL="http://localhost:$PORT"
            echo "Found available port: $PORT"
            SERVER_CMD="python3 -m http.server $PORT"
            break
        fi
    done
fi

echo "Starting server on port $PORT..."
echo "Press Ctrl+C to stop the server"
echo "Opening browser at $APP_URL"
echo ""

# Start the server in the background
$SERVER_CMD &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 2

# Open the browser
if command -v xdg-open &> /dev/null; then
    xdg-open "$APP_URL" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "$APP_URL" 2>/dev/null &
elif command -v start &> /dev/null; then
    start "$APP_URL" 2>/dev/null &
else
    echo "Please open your browser and navigate to: $APP_URL"
fi

# Function to clean up on exit
cleanup() {
    echo ""
    echo "Stopping server..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for the server process
wait $SERVER_PID