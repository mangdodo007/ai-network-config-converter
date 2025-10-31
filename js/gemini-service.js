// API service to handle all Gemini API interactions
import { config } from './config.js';

export class GeminiService {
    static async generateContent(systemPrompt, userQuery, modelId = config.DEFAULT_MODEL) {
        const modelConfig = config.MODELS[modelId];
        if (!modelConfig) {
            throw new Error(`Invalid model ID: ${modelId}`);
        }

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            const response = await fetch(`${modelConfig.url}?key=${config.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }

            const result = await response.json();

            if (result.candidates?.[0]?.content?.parts?.[0]) {
                return result.candidates[0].content.parts[0].text;
            }
            if (result.candidates?.[0]?.finishReason) {
                throw new Error(`API call finished with reason: ${result.candidates[0].finishReason}. The prompt may have been blocked.`);
            }

            throw new Error("Invalid response structure from API.");
        } catch (error) {
            console.error('Error in GeminiService.generateContent:', error);
            throw error;
        }
    }

    static getAvailableModels() {
        const models = Object.entries(config.MODELS).map(([id, model]) => ({
            id,
            name: model.name,
            description: model.description
        }));

        console.log('Available models from config:', models);
        return models;
    }

    static async testModelAvailability(modelId) {
        const modelConfig = config.MODELS[modelId];
        if (!modelConfig) {
            console.error(`Model ${modelId} not found in configuration`);
            return false;
        }

        try {
            const testPayload = {
                contents: [{ parts: [{ text: "test" }] }],
                systemInstruction: {
                    parts: [{ text: "test" }]
                },
            };

            const response = await fetch(`${modelConfig.url}?key=${config.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testPayload),
            });

            if (!response.ok) {
                console.error(`Model ${modelId} not available:`, response.status, response.statusText);
                return false;
            }

            const result = await response.json();
            return !!result.candidates?.[0]?.content;
        } catch (error) {
            console.error(`Error testing model ${modelId}:`, error);
            return false;
        }
    }
}