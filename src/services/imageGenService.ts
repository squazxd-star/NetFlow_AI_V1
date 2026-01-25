import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "./storageService";

/**
 * Service for "Nano Banana" (Gemini/Imagen) Image Generation
 */

export const generateNanoImage = async (prompt: string, referenceImageBase64?: string): Promise<string | null> => {
    try {
        console.log("Generating Nano Banana Image (Real Mode: Imagen 4.0)...", { prompt });

        const apiKey = await getApiKey();
        if (!apiKey) throw new Error("API Key missing");

        const modelName = "imagen-4.0-ultra-generate-001";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`;

        // Payload for Imagen
        const payload = {
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                sampleCount: 1,
                // "9:16" is standard for TikTok, can be parameterized later
                aspectRatio: "9:16"
            }
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`Imagen API Error: ${JSON.stringify(errData)}`);
        }

        const data = await response.json();

        // Parse predictions
        // Structure usually: { predictions: [ { bytesBase64Encoded: "..." } ] }
        if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
            console.log("✅ Imagen 4.0 Generation Success!");
            return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        }

        // Try alternate structure if predictions/mimeType present
        if (data.predictions && data.predictions[0]?.mimeType && data.predictions[0]?.bytesBase64Encoded) {
            console.log("✅ Imagen 4.0 Generation Success (Type B)!");
            return `data:${data.predictions[0].mimeType};base64,${data.predictions[0].bytesBase64Encoded}`;
        }

        throw new Error("Invalid response format from Imagen API");

    } catch (error: any) {
        console.error("Nano Banana Image Gen Error (Real Mode Failed):", error);

        // Fallback to Unsplash Mock so flow doesn't break
        console.warn("Falling back to Mock Image...");
        const keywords = prompt.split(' ').slice(0, 2).join(',');
        return `https://source.unsplash.com/random/1024x1792/?${keywords}`;
    }
};
