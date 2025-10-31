#!/usr/bin/env python3
"""
AI Network Configuration Translator - Python Flask Server
Alternative server option with CORS support and better error handling
"""

from flask import Flask, send_from_directory, jsonify
import os
import webbrowser
import threading
import time

app = Flask(__name__)

# Configuration
PORT = 8000
HOST = '0.0.0.0'

@app.route('/')
def serve_index():
    """Serve the main application"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS, etc.)"""
    if os.path.exists(path):
        return send_from_directory('.', path)
    else:
        return jsonify({'error': 'File not found'}), 404

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'port': PORT})

def open_browser():
    """Open browser after a short delay"""
    time.sleep(2)
    webbrowser.open(f'http://localhost:{PORT}')

def main():
    """Main server function"""
    print("AI Network Configuration Translator")
    print("=" * 50)
    print(f"Starting server on http://localhost:{PORT}")
    print("Flask server with CORS support")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)

    # Open browser in a separate thread
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()

    try:
        # Run the Flask app
        app.run(host=HOST, port=PORT, debug=False)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}")
        print("Make sure port {} is available".format(PORT))

if __name__ == '__main__':
    main()