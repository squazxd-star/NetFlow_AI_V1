import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const API_KEY = process.env.VITE_GEMINI_API_KEY || "AIzaSyCAzdiXX1k9duFzg1Kvshf4N_lBlrp6oss";
// User uploaded file path from metadata
const IMAGE_PATH = "C:/Users/MSI/.gemini/antigravity/brain/e1edda2f-96de-42ae-810d-cede9bf34a77/uploaded_media_1769338076733.png";

async function testImageInput() {
    console.log("1. Reading Image File...");
    if (!fs.existsSync(IMAGE_PATH)) {
        console.error("Image file not found at:", IMAGE_PATH);
        return;
    }

    // Read file as base64
    const fileBuffer = fs.readFileSync(IMAGE_PATH);
    const base64Image = fileBuffer.toString("base64");

    console.log("2. Initializing Gemini Client...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use gemini-1.5-flash which supports images (multimodal), fallback to pro-vision if needed logic is inside library usually
    // But since flash failed earlier, let's try gemini-1.5-pro or gemini-pro-vision if accessible.
    // Let's stick to the model we know 'might' work or fail gracefully.
    // Note: 'gemini-pro' (original) is text-only. 'gemini-pro-vision' is for images.
    // 'gemini-1.5-flash' is multimodal.

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Describe this cyberpunk character in detail. What is he wearing?";

    console.log("3. Sending Image for Analysis...");

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: "image/png",
        },
    };

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("4. Success! AI Analysis:", text);
    } catch (error) {
        console.error("4. Failed with 1.5-flash:", error.message);
        // Retry logic could go here, but for this test script we just want to see if it works or not.
    }
}

testImageInput();
