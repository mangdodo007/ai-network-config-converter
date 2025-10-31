# AI Network Configuration Translator

A powerful web-based tool that translates network device configurations between different vendors using AI technology. Created by Lindo Prasetyo, this application supports translation between Cisco, Juniper, Huawei, Aruba, and Arista network devices with intelligent vendor-specific OS filtering.

## Features

- **Multi-Vendor Support**: Translate configurations between Cisco (IOS/IOS-XE/IOS-XR/NX-OS), Juniper (Junos), Huawei (VRP), Aruba (AOS-CX/AOS), and Arista (EOS)
- **Intelligent OS Filtering**: OS type options automatically filter based on selected vendor for accurate translations
- **AI-Powered Analysis**: Get configuration explanations and generate test plans using Google's Gemini AI models
- **Advanced Settings**: Choose between Gemini 2.5 Flash (fast) and Gemini 2.5 Pro (capable) models
- **Custom Prompts**: Add documentation links and translation examples for enhanced accuracy
- **Update Management**: Built-in GitHub update checking with simple manual update instructions
- **Clean Interface**: Simple 3-step workflow with responsive design
- **Code Formatting**: Preserves network configuration indentation and formatting

## Quick Start

### Prerequisites

1. **Google Gemini API Key**: Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Modern Web Browser**: Chrome, Firefox, Safari, or Edge
3. **Python 3.6+**: Required for the built-in web server (Python 3.7+ recommended)
   - Windows: Download from [python.org](https://www.python.org/downloads/)
   - macOS: `brew install python3` or download from python.org
   - Linux: `sudo apt install python3` (Ubuntu/Debian) or `sudo dnf install python3` (Fedora/CentOS)
4. **Local Web Server**: Required for CORS compliance (scripts provided)

### Installation

1. Clone or download this repository
2. Install Python dependencies (optional - only needed for Flask server):
   ```bash
   # Install Flask for advanced server features
   pip install -r requirements.txt
   ```
3. Configure your API key:
   ```bash
   # Edit js/config.js and replace with your API key
   nano js/config.js
   ```
4. Run the application using one of the provided scripts

### Running the Application

#### Windows
```bash
# Double-click or run from command prompt
run.bat
```

#### Linux/macOS
```bash
# Make executable and run
chmod +x run.sh
./run.sh
```

#### Advanced Flask Server (optional)
```bash
# Requires Flask installation: pip install -r requirements.txt
python3 server.py
```

#### Manual Python Server (basic)
```bash
python3 -m http.server 8000
```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Usage Guide

### Step 1: Source Configuration
1. Select the **Source Vendor** from the dropdown menu
2. Optionally select the **Source OS Type** for better accuracy
3. Enter your network configuration in the text area

### Step 2: Target Translation
1. Select the **Target Vendor** where you want to deploy the configuration
2. Choose the **Target OS Type** (filtered by vendor selection)
3. Click **Translate Configuration** to start the AI translation

### Step 3: Review Results
- View the translated configuration in the output area
- Use **Explain** to get AI-powered explanations of the configuration
- Use **Test Plan** to generate verification commands and testing procedures

## Supported Vendors and OS Types

| Vendor | Supported OS Types |
|--------|-------------------|
| Cisco | IOS, IOS-XE, IOS-XR, NX-OS |
| Juniper | Junos |
| Huawei | VRP |
| Aruba | AOS-CX, AOS |
| Arista | EOS |

## Configuration

### API Setup
Edit `js/config.js` to configure your Gemini API settings:

```javascript
export const config = {
    API_KEY: 'your-api-key-here', // Replace with your Gemini API key
    // Available models configuration
    MODELS: {
        'gemini-2.5-pro': {
            name: 'Gemini 2.5 Pro',
            description: 'Most capable model for complex network translations and analysis',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent'
        },
        'gemini-2.5-flash': {
            name: 'Gemini 2.5 Flash',
            description: 'Fast and efficient model for quick network translations',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
        }
    },
    // Default model
    DEFAULT_MODEL: 'gemini-2.5-flash'
};
```

### Advanced Settings

#### Model Selection
- **Gemini 2.5 Flash**: Fast and efficient for standard translations
- **Gemini 2.5 Pro**: Most capable for complex configurations and analysis

#### Custom Prompts
Enhance translation accuracy by adding:
- Documentation links and reference materials
- Example translations and command mappings
- Specific vendor formatting requirements
- Special instructions for your environment

### Update Configuration
The application checks for updates from the GitHub repository:
- **Current Version**: v1.1.0
- **Update Check**: Manual checking with release notes display
- **Update Process**: Simple 4-step manual instructions
- **Public Repository**: Easy access without authentication needed

### Server Configuration
The application runs on port 8000 by default. You can modify this in the server scripts:

- `run.sh`: Change `PORT=8000`
- `run.bat`: Change `set PORT=8000`
- `server.py`: Change `app.run(port=8000)`

## Project Structure

```
network-config-converter/
├── index.html              # Main application interface
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── app.js              # Main application logic
│   ├── config.js           # API configuration
│   ├── gemini-service.js   # Gemini API service
│   ├── update-service.js   # GitHub update service
│   ├── modal.js            # Modal dialog functionality
│   ├── utils.js            # Utility functions
│   └── main.js             # Application entry point
├── server.py               # Python Flask server (optional)
├── requirements.txt        # Python dependencies (optional)
├── run.sh                  # Linux/mac startup script
├── run.bat                 # Windows startup script
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## Troubleshooting

### Common Issues

**403 API Error**
- Ensure your Gemini API key is valid and properly configured in `js/config.js`
- Check that your API key has the necessary permissions

**CORS Errors**
- Always run the application through a local web server (don't open index.html directly)
- Use one of the provided scripts to start the server

**Vendor OS Filtering Not Working**
- Refresh the page after making vendor selections
- Check browser console for any JavaScript errors

**Python 3 Not Found**
- Ensure Python 3.6+ is installed and accessible in your PATH
- Test with: `python3 --version` or `python --version`
- Windows: Add Python to PATH during installation
- macOS/Linux: Update PATH in shell profile if needed

**Flask Not Installed** (when using server.py)
- Install dependencies: `pip install -r requirements.txt`
- Or install Flask directly: `pip install Flask`

**Port Already in Use**
- The scripts automatically detect and use alternative ports (8001-8010)
- You can also manually stop other services using port 8000

**Translation Quality Issues**
- Provide specific OS types for better accuracy
- Include complete configuration sections for best results
- Use the Explain feature to understand translation decisions

### Getting Help

1. Check the browser console for error messages
2. Verify your API key configuration
3. Ensure you're running the application through a local server
4. Test with a simple configuration first

## API Usage and Limits

- This application uses Google's Gemini 2.5 Flash model
- API usage is subject to Google's terms of service and rate limits
- Monitor your API usage through the [Google AI Studio](https://aistudio.google.com)

## Security Considerations

- API keys are stored in client-side JavaScript - keep this repository private
- Consider using environment variables for production deployments
- Network configurations are processed by Google's AI services - review their privacy policy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is provided as-is for educational and professional use. Please respect the terms of service of all third-party services used.

## Changelog

### v1.1.0 - Current Version
- ✨ **New Features**:
  - Added model selection between Gemini 2.5 Flash and Pro models
  - Implemented custom prompt system for enhanced translation accuracy
  - Built-in GitHub update checking with manual update guidance
  - Added creator attribution in header
  - Improved UI/UX with compact update section at bottom
- 🔧 **Enhancements**:
  - Better prompt hierarchy - custom prompts enhance base instructions
  - Simplified 4-step manual update process
  - Cleaner interface without confusing status messages
  - Improved error handling and user feedback

### v1.0.0
- Initial release with multi-vendor support
- Vendor-specific OS filtering
- AI-powered explanations and test plan generation
- Responsive web interface
- Cross-platform startup scripts