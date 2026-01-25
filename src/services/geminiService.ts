import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!API_KEY) {
    console.warn("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Interface for script generation input
export interface ScriptRequest {
    productName: string;
    style: string;
    tone: string;
    language: string;
}

// Interface for the result
export interface ScriptResult {
    script: string;
    audioUrl?: string; // Optional: Result from TTS
    videoUrl?: string; // Optional: Result from Veo
}

/**
 * Generates a viral TikTok script using Google Gemini
 */
export const generateVideoScript = async (
    data: ScriptRequest
): Promise<string> => {
    try {
        // Model: Using gemini-2.0-flash if available, otherwise fallback to gemini-1.5-flash
        // You can change this to "gemini-1.5-flash" if 2.0 is not active for your key yet.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Generate a viral TikTok video script for a product named '${data.productName}'.
      Style: ${data.style}
      Tone: ${data.tone}
      Language: ${data.language}
      
      Output ONLY the script text, no metadata, no scene descriptions unless necessary for the script dialogue.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error generating script with Gemini:", error);
        throw error;
    }
};

/**
 * Synthesizes text to speech using Google Cloud TTS API (REST)
 * Note: Requires an API Key with Cloud Text-to-Speech API enabled.
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

        const requestBody = {
            input: { text: text },
            voice: { languageCode: "th-TH", name: "th-TH-Neural2-C" }, // Defaulting to Thai
            audioConfig: { audioEncoding: "MP3" },
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const err = await response.json();
            console.warn("TTS API Error:", err);
            return null;
        }

        const data = await response.json();
        // API returns audioContent as base64 string
        // Convert to playable Blob URL
        if (data.audioContent) {
            return `data:audio/mp3;base64,${data.audioContent}`;
        }
        return null;

    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};

/**
 * Placeholder for Veo/Vertex AI Video Generation
 * Note: Vertex AI usually requires Service Account (OAuth), not just API Key.
 * For client-side usage, this part is complex and recommended to move to a proper backend proxy.
 */
export const generateVideo = async (script: string): Promise<string | null> => {
    // TODO: Implement Vertex AI call via Backend Proxy
    console.log("Video generation requires backend implementation via Vertex AI");
    return null;
};

// Orchestrator function to run the full flow
export const runFullWorkflow = async (data: ScriptRequest): Promise<ScriptResult> => {
    console.log("Starting Workflow...");

    // 1. Generate Script
    const script = await generateVideoScript(data);
    console.log("Script generated:", script);

    // 2. Generate Audio (Parallel to video if possible, but sequential here)
    const audioUrl = (await generateSpeech(script)) || undefined;

    // 3. Video (Placeholder)
    const videoUrl = undefined;

    return {
        script,
        audioUrl,
        videoUrl
    };
}
