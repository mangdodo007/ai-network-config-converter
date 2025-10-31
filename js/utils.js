// Utility functions for text manipulation and UI helpers
export class Utils {
    static cleanApiResponse(text) {
        const codeBlockRegex = /^```(?:[a-zA-Z]*\n)?([\s\S]*?)\n```$/;
        const match = text.trim().match(codeBlockRegex);
        if (match) {
            return match[1].trim();
        }
        let cleanedText = text.trim();
        if (cleanedText.startsWith("```") && cleanedText.endsWith("```")) {
            return cleanedText.slice(3, -3).trim();
        }
        return cleanedText;
    }

    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}