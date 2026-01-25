import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runStressTest() {
    // 1. Get Key
    const envPath = path.resolve(process.cwd(), '.env');
    let apiKey = "";
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const match = content.match(/VITE_GEMINI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
    }

    if (!apiKey) {
        console.error("❌ Could not find VITE_GEMINI_API_KEY in .env");
        return;
    }

    console.log("🔥 STARTING GEMINI STRESS TEST (10 Rounds)");
    console.log(`🔑 Key: ${apiKey.substring(0, 8)}...`);
    console.log(`🧠 Model: gemini-2.0-flash`);
    console.log("---------------------------------------------------");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let success = 0;
    let fail = 0;
    let totalTime = 0;

    for (let i = 1; i <= 10; i++) {
        const prompt = `Write a catchy 5-word slogan for Product #${i}`;
        const start = Date.now();

        process.stdout.write(`Round ${i}/10 : `);

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();
            const time = Date.now() - start;

            totalTime += time;
            success++;

            console.log(`✅ PASS (${time}ms) | "${text}"`);
        } catch (e) {
            fail++;
            console.log(`❌ FAIL (${e.message})`);
        }

        // Slight delay to be nice to the API
        await new Promise(r => setTimeout(r, 500));
    }

    console.log("---------------------------------------------------");
    console.log(`🎯 REPORT:`);
    console.log(`   - Success: ${success}/10`);
    console.log(`   - Failed:  ${fail}/10`);
    console.log(`   - Avg Latency: ${Math.round(totalTime / success)}ms`);

    if (success === 10) console.log("🏆 RESULT: PERFECT SCORE! System is stable.");
    else if (success > 7) console.log("⚠️ RESULT: USABLE but unstable.");
    else console.log("💀 RESULT: CRITICAL ISSUES detected.");
}

runStressTest();
