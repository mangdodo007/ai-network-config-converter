// Configuration and constants
export const config = {
    API_KEY: 'AIzaSyDSOwAGCX6ufWBdx0_ptTrhCY9aW1wmArM', // Add your API key here
    // Available models configuration
    MODELS: {
        'gemini-2.0-flash-exp': {
            name: 'Gemini 2.0 Flash (Experimental)',
            description: 'Latest experimental model with enhanced capabilities',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
        },
        'gemini-1.5-pro': {
            name: 'Gemini 1.5 Pro',
            description: 'More capable model for complex translations and analysis',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
        },
        'gemini-1.5-flash': {
            name: 'Gemini 1.5 Flash',
            description: 'Balanced model for good performance and capability',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
        },
        'gemini-1.5-flash-8b': {
            name: 'Gemini 1.5 Flash (8B)',
            description: 'Fast and efficient model for quick translations',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent'
        }
    },
    // Default model
    DEFAULT_MODEL: 'gemini-1.5-flash'
};