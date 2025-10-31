// API service to handle all Gemini API interactions
import { config } from './config.js';

export class GeminiService {
    static async generateContent(systemPrompt, userQuery) {
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        try {
            const response = await fetch(`${config.API_URL}?key=${config.API_KEY}`, {
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
}