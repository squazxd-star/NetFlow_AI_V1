// Native fetch is available in Node 18+
import fs from 'fs';
import path from 'path';

// Read API Key from .env file
const envPath = path.resolve(process.cwd(), '.env');
let API_KEY = "";
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/VITE_OPENAI_API_KEY=(.*)/);
    if (match) API_KEY = match[1].trim();
}

if (!API_KEY) {
    console.error("❌ Could not find VITE_OPENAI_API_KEY in .env");
    process.exit(1);
}
async function verifyOpenAI() {
    console.log("🤖 Verifying OpenAI API Key...");
    try {
        const response = await fetch("https://api.openai.com/v1/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }
        });

        if (response.ok) {
            console.log("✅ API Key is VALID!");
            const data = await response.json();
            // Check for gpt-4 availability
            const hasGPT4 = data.data.some(model => model.id.includes("gpt-4"));
            const hasGPT35 = data.data.some(model => model.id.includes("gpt-3.5"));

            console.log(`- GPT-4 Access: ${hasGPT4 ? "YES" : "NO"}`);
            console.log(`- GPT-3.5 Access: ${hasGPT35 ? "YES" : "NO"}`);
        } else {
            console.log(`❌ API Key is INVALID. Status: ${response.status}`);
            const err = await response.json();
            console.log("Error:", err);
        }
    } catch (e) {
        console.log(`❌ Network Error: ${e.message}`);
    }
}

verifyOpenAI();
