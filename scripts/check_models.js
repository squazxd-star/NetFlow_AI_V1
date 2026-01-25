import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.VITE_GEMINI_API_KEY || "AIzaSyCAzdiXX1k9duFzg1Kvshf4N_lBlrp6oss";

async function checkAvailableModels() {
    console.log("🔍 Checking available models for this API Key...");
    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        // This is the definitive check - what does the API server say we can use?
        // Note: listModels might not be available on the client SDK wrapper in all versions, 
        // but we can try to infer or just run a generic "get model" for ultra.

        // Actually, the SDK doesn't always expose listModels simply for API Keys (sometimes limited).
        // Let's try to hit the REST endpoint directly for listing models to be sure.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ AVAILABLE MODELS:");
            data.models.forEach(m => {
                // Filter for relevant ones
                if (m.name.includes("gemini") || m.name.includes("veo") || m.name.includes("imagen")) {
                    console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
                }
            });

            // Check specifically for Vision/Video
            const hasVision = data.models.some(m => m.name.includes("vision") || m.name.includes("1.5"));
            const hasVideo = data.models.some(m => m.name.includes("veo"));

            console.log("\n📊 CAPABILITY SUMMARY:");
            console.log(`- Image Analysis (Vision): ${hasVision ? "✅ Yes" : "❌ No"}`);
            console.log(`- Video Generation (Veo): ${hasVideo ? "✅ Yes" : "❌ No"}`);
        } else {
            console.log("❌ Could not list models. Error:", data);
        }

    } catch (error) {
        console.error("❌ Network/Auth Error:", error.message);
    }
}

checkAvailableModels();
