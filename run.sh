#!/bin/bash

# AI Network Configuration Translator v1.1.0 - Linux/macOS Startup Script
# Created by Lindo Prasetyo
# This script starts a local web server and opens the application in your default browser
# Features: Multi-vendor network config translation with AI-powered analysis

PORT=8000
APP_URL="http://localhost:$PORT"
APP_VERSION="v1.1.0"

echo "============================================"
echo "   AI Network Configuration Translator"
echo "           Version $APP_VERSION"
echo "         Created by Lindo Prasetyo"
echo "============================================"
echo ""
echo "Starting server..."
echo "Application will be available at: $APP_URL"

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

# Check if Flask is available (optional for advanced features)
if python3 -c "import flask" 2>/dev/null; then
    echo "Flask available - you can use 'python3 server.py' for advanced features"
    echo "Advanced features include: custom prompts, model selection, update checking"
else
    echo "Flask not found - using basic HTTP server"
    echo "To enable advanced features, install Flask: pip3 install flask"
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

echo "============================================"
echo "  Application started successfully!"
echo ""
echo "Features Available:"
echo "- Multi-vendor network translation (Cisco, Juniper, Huawei, Aruba, Arista)"
echo "- AI-powered configuration analysis and explanations"
echo "- Custom prompts and model selection (Gemini 2.5 Flash/Pro)"
echo "- Built-in update checking and release notes"
echo ""
echo "If browser didn't open automatically, navigate to: $APP_URL"
echo ""

# Wait for the server process
wait $SERVER_PID

echo ""
echo "Server stopped. Thank you for using AI Network Configuration Translator!"