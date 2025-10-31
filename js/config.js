// Configuration and constants
export const config = {
    API_KEY: 'AIzaSyDSOwAGCX6ufWBdx0_ptTrhCY9aW1wmArM', // Add your API key here
    // Available models configuration
    MODELS: {
        'gemini-1.5-pro': {
            name: 'Gemini 1.5 Pro',
            description: 'Most capable model for complex translations and analysis',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'
        },
        'gemini-1.5-pro-002': {
            name: 'Gemini 1.5 Pro (002)',
            description: 'Latest stable version of Gemini 1.5 Pro',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent'
        },
        'gemini-1.5-pro-experimental': {
            name: 'Gemini 1.5 Pro (Experimental)',
            description: 'Experimental features with Gemini 1.5 Pro',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-experimental:generateContent'
        },
        'gemini-1.5-flash': {
            name: 'Gemini 1.5 Flash',
            description: 'Fast and efficient model for quick translations',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
        },
        'gemini-1.5-flash-002': {
            name: 'Gemini 1.5 Flash (002)',
            description: 'Latest stable version of Gemini 1.5 Flash',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent'
        },
        'gemini-1.5-flash-8b': {
            name: 'Gemini 1.5 Flash (8B)',
            description: 'Ultra-fast lightweight model for quick translations',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent'
        },
        'gemini-exp-1206': {
            name: 'Gemini Experimental (1206)',
            description: 'Latest experimental model with cutting-edge features',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1206:generateContent'
        },
        'gemini-exp-1121': {
            name: 'Gemini Experimental (1121)',
            description: 'Recent experimental model with improved capabilities',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1121:generateContent'
        }
    },
    // Default model
    DEFAULT_MODEL: 'gemini-1.5-flash-002'
};