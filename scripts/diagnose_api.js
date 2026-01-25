import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the new key directly to be sure, or read from process.env if loaded correctly
const API_KEY = "AIzaSyCOMeBX4r9sp4cjX0016Rl6nGavDW-7utM";

async function diagnose() {
    console.log("🏥 STARTING SYSTEM DIAGNOSIS (New Key)...");
    console.log("Key being tested:", API_KEY.substring(0, 10) + "...");
    console.log("--------------------------------");

    // 1. Check Text Generation (Basic Gemini)
    console.log("\n1. Testing Text Gen (Gemini 1.5 Flash)...");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test connection.");
        console.log(`✅ Text Gen: WORKING (Response: ${result.response.text()})`);
    } catch (e) {
        console.log(`❌ Text Gen: FAILED (${e.message})`);
    }

    // 2. Check Image Generation (Imagen 4.0 Ultra)
    console.log("\n2. Testing Image Gen (Imagen 4.0 Ultra)...");
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key=${API_KEY}`;
        const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                instances: [{ prompt: "A small red apple" }],
                parameters: { sampleCount: 1, aspectRatio: "1:1" }
            })
        });
        if (resp.ok) {
            console.log("✅ Image Gen (Imagen 4.0): WORKING");
        } else {
            const err = await resp.json();
            // Free tier often gives 403 or 404 for this specific model
            console.log(`❌ Image Gen: FAILED (HTTP ${resp.status}) - ${JSON.stringify(err.error?.message)}`);
        }
    } catch (e) {
        console.log(`❌ Image Gen: NETWORK ERROR (${e.message})`);
    }

    // 2.1 Check Image Gen (Imagen 3.0 - older but maybe available?)
    console.log("\n2.1. Testing Image Gen (Imagen 3.0)...");
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`;
        const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                instances: [{ prompt: "A small red apple" }],
                parameters: { sampleCount: 1 }
            })
        });
        if (resp.ok) console.log("✅ Image Gen (Imagen 3.0): WORKING");
        else {
            const err = await resp.json();
            console.log(`❌ Image Gen (3.0): FAILED (HTTP ${resp.status}) - ${JSON.stringify(err.error?.message)}`);
        }
    } catch (e) { }

    // 3. Check Video Generation (Veo 3.0)
    console.log("\n3. Testing Video Gen (Veo 3.0)...");
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-001:predictLongRunning?key=${API_KEY}`;
        const tinyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

        const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                instances: [{
                    prompt: "A moving circle",
                    image: {
                        bytesBase64Encoded: tinyBase64,
                        mimeType: "image/png" // FIX: API requires this field
                    }
                }]
            })
        });

        if (resp.ok) {
            console.log("✅ Video Gen: WORKING (Operation Started)");
        } else {
            const err = await resp.json();
            console.log(`❌ Video Gen: FAILED (HTTP ${resp.status}) - ${JSON.stringify(err.error?.message)}`);
        }
    } catch (e) {
        console.log(`❌ Video Gen: NETWORK ERROR (${e.message})`);
    }

    console.log("\n--------------------------------");
    console.log("🏥 DIAGNOSIS COMPLETE");
}

diagnose();
