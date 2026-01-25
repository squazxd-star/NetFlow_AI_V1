import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Native fetch (Node 18+)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runStressTest() {
    // 1. Get Key
    const envPath = path.resolve(process.cwd(), '.env');
    let apiKey = "";
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const match = content.match(/VITE_OPENAI_API_KEY=(.*)/);
        if (match) apiKey = match[1].trim();
    }

    if (!apiKey) {
        console.error("❌ Could not find VITE_OPENAI_API_KEY in .env");
        return;
    }

    console.log("🔥 STARTING OPENAI STRESS TEST (10 Rounds)");
    console.log(`🔑 Key: ${apiKey.substring(0, 8)}...`);
    console.log(`🧠 Model: gpt-4o-mini`);
    console.log("---------------------------------------------------");

    let success = 0;
    let fail = 0;
    let totalTime = 0;

    for (let i = 1; i <= 10; i++) {
        const prompt = `Write a catchy 5-word slogan for Product #${i}`;
        const start = Date.now();

        process.stdout.write(`Round ${i}/10 : `);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || response.statusText);
            }

            const json = await response.json();
            const text = json.choices[0].message.content.trim();
            const time = Date.now() - start;

            totalTime += time;
            success++;

            console.log(`✅ PASS (${time}ms) | "${text}"`);
        } catch (e) {
            fail++;
            console.log(`❌ FAIL (${e.message})`);
        }

        // Slight delay
        await new Promise(r => setTimeout(r, 200));
    }

    console.log("---------------------------------------------------");
    console.log(`🎯 REPORT:`);
    console.log(`   - Success: ${success}/10`);
    console.log(`   - Failed:  ${fail}/10`);
    console.log(`   - Avg Latency: ${success > 0 ? Math.round(totalTime / success) : 0}ms`);

    if (success === 10) console.log("🏆 RESULT: PERFECT SCORE! System is stable.");
    else if (success > 7) console.log("⚠️ RESULT: USABLE but unstable.");
    else console.log("💀 RESULT: CRITICAL ISSUES detected.");
}

runStressTest();
