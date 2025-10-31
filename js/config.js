// Configuration and constants
export const config = {
    API_KEY: 'AIzaSyDSOwAGCX6ufWBdx0_ptTrhCY9aW1wmArM', // Add your API key here
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