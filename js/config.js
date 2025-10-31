// Configuration and constants
export const config = {
    API_KEY: 'AIzaSyDSOwAGCX6ufWBdx0_ptTrhCY9aW1wmArM', // Add your API key here
    // Available models configuration
    MODELS: {
        'gemini-2.5-flash-preview-09-2025': {
            name: 'Gemini 2.5 Flash',
            description: 'Fast and efficient model for quick translations',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent'
        },
        'gemini-1.5-pro-preview-0514': {
            name: 'Gemini 1.5 Pro',
            description: 'More capable model for complex translations and analysis',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-preview-0514:generateContent'
        },
        'gemini-1.5-flash-preview-0514': {
            name: 'Gemini 1.5 Flash',
            description: 'Balanced model for good performance and capability',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent'
        }
    },
    // Default model
    DEFAULT_MODEL: 'gemini-2.5-flash-preview-09-2025'
};