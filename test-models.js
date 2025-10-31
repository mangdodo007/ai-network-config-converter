// Simple test to verify model configuration
import { config } from './js/config.js';

console.log('=== Testing Model Configuration ===');
console.log('API Key configured:', config.API_KEY ? 'Yes' : 'No');
console.log('Default model:', config.DEFAULT_MODEL);
console.log('Available models:', Object.keys(config.MODELS));

Object.entries(config.MODELS).forEach(([id, model]) => {
    console.log(`- ${model.name} (${id}): ${model.description}`);
});

console.log('=== End Test ===');