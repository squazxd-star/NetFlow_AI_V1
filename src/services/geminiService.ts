import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateNanoImage } from "./imageGenService";
import { stitchVideos } from "./videoProcessingService";
import { AdvancedVideoRequest } from "../types/netflow";

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
    // Helper to try generation with a specific model
    const tryGenerate = async (modelName: string) => {
        console.log(`Attempting script generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
            Generate a viral TikTok video script for a product named '${data.productName}'.
            Style: ${data.style}
            Tone: ${data.tone}
            Language: ${data.language}
            
            Output ONLY the script text, no metadata, no scene descriptions unless necessary for the script dialogue.
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    };

    try {
        // Try preferred model first
        // Note: Your key seems to support gemini-pro better than flash versions currently
        return await tryGenerate("gemini-1.5-flash");
    } catch (error: any) {
        console.warn("gemini-1.5-flash failed, trying fallback to gemini-pro...", error.message);
        try {
            // Fallback to older stable model
            return await tryGenerate("gemini-pro");
        } catch (fallbackError) {
            console.error("All API models failed. Returning mock script for simulation.", fallbackError);

            // Final Fallback: Mock Script (for testing without valid API key)
            return `(Simulated Script for ${data.productName})
            [Opening Shot: ${data.productName} appearing with neon effects]
            Host: "ทุกคน! ใครยังไม่ลอง ${data.productName} คือพลาดมาก!"
            [Cut to: Close up of product texture]
            Host: "ดูความฉ่ำนี่สิ เป็น ${data.style} ที่สุด!"
            [Cut to: Before/After comparison]
            Host: "เปลี่ยนจากหน้าพัง เป็นหน้าปังใน 3 วิ!"
            [Closing: Call to Action]
            Host: "กดตะกร้าเลยตอนนี้ ของหมดไวมากแม่!"`;
        }
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
export const runFullWorkflow = async (data: ScriptRequest | AdvancedVideoRequest): Promise<ScriptResult> => {
    console.log("Starting Workflow...", data);

    try {
        let script = "";
        let audioUrl: string | undefined = undefined;
        let videoUrl: string | undefined = undefined;

        // 1. Script & Audio Generation (Common Step)
        if ('productName' in data) {
            script = await generateVideoScript(data as ScriptRequest);
            console.log("Script generated:", script);
            audioUrl = (await generateSpeech(script)) || undefined;
        }

        // 2. Advanced Video Pipeline (Nano Banana + Veo + Stitching)
        if ('userImage' in data && (data as AdvancedVideoRequest).userImage) {
            const advData = data as AdvancedVideoRequest;
            console.log("Entering Advanced Video Pipeline...");

            // Step 2.1: Nano Banana Image Generation
            // If user provided an image, we use it as reference to generate a styled image.
            // If prompt is provided, we use it.
            const generatedImage = await generateNanoImage(advData.prompt, advData.userImage);

            if (generatedImage) {
                console.log("Nano Image Generated:", generatedImage);
                // Step 2.2: Loop Video Generation (Veo)
                // Since Veo API is placeholder, we simulate generating multiple clips
                const clipUrls: string[] = [];
                const loopCount = advData.loopCount || 1;

                for (let i = 0; i < loopCount; i++) {
                    console.log(`Generating Video Clip ${i + 1}/${loopCount}...`);
                    // In real implementation: await generateVeoVideo(generatedImage, script);
                    // For now, we mock it or return null. 
                    // To verify stitching, we would need actual video URLs.
                    // Let's assume we get a placeholder video if in dev mode
                    // Using a Google sample video that is CORS friendly
                    const mockVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
                    if (mockVideoUrl) clipUrls.push(mockVideoUrl);
                }

                // Step 2.3: Stitching
                if (clipUrls.length > 1 && advData.concatenate) {
                    console.log("Stitching videos...", clipUrls.length);
                    const stitchedUrl = await stitchVideos(clipUrls);
                    if (stitchedUrl) videoUrl = stitchedUrl;
                } else if (clipUrls.length > 0) {
                    videoUrl = clipUrls[0];
                }
            }
        }

        return {
            script,
            audioUrl,
            videoUrl
        };

    } catch (e) {
        console.error("Workflow Failed:", e);
        throw e;
    }
}
