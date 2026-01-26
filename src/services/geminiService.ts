import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateNanoImage } from "./imageGenService";
import { stitchVideos } from "./videoProcessingService";
import { AdvancedVideoRequest, ScriptRequest } from "../types/netflow";
import { getApiKey } from "./storageService";

// Wrapper to get client instance dynamically
const getGenAI = async () => {
    const key = await getApiKey();
    if (!key) throw new Error("API Key not found. Please set it in Settings.");
    return new GoogleGenerativeAI(key);
};

// Interface for the result
export interface ScriptResult {
    script: string;
    audioUrl?: string;
    videoUrl?: string;
    generatedPrompt?: string; // For debugging
    imageUrl?: string; // Fallback image from DALL-E
}

/**
 * Build a comprehensive prompt from all form fields
 */
const buildFullPrompt = (data: ScriptRequest): string => {
    const templateDescriptions: Record<string, string> = {
        "product-review": "รีวิวสินค้าแบบจริงใจ (Honest Review) เน้นผลลัพธ์จริงๆ ไม่ขายฝัน",
        "brainrot-product": "สไตล์ Brainrot: ใช้ศัพท์วัยรุ่น (Gen Z Slang), ตัดไว, กวนประสาท, ตลกหน้าตาย, ไม่เน้นสาระแต่เน้นฮา",
        "unboxing": "แกะกล่องโชว์ของ: ตื่นเต้นกับ Packaging, สัมผัสแรก, ความรู้สึกตอนเห็นของ",
        "comparison": "เปรียบเทียบชัดเจน: เทียบกับของเก่า หรือ แบรนด์อื่น (ไม่ต้องเอ่ยชื่อ) ให้เห็นว่าอันนี้ดีกว่ายังไง",
        "testimonial": "เล่าประสบการณ์ผู้ใช้จริง: เหมือนเพื่อนมาเล่าให้ฟังว่าชีวิตเปลี่ยนไปยังไง",
        "flash-sale": "Flash Sale: เร่งรีบ, ดุดัน, หมดแล้วหมดเลย, ต้องซื้อเดี๋ยวนี้",
        "tutorial": "How-to: สอนใช้แบบ Step-by-step, เข้าใจง่าย, ทำตามได้เลย",
        "lifestyle": "Vlog/Lifestyle: ถ่ายทอดการใช้งานสินค้าในชีวิตประจำวันแบบเนียนๆ",
        "trending": "เกาะกระแส: ใช้เพลงฮิต หรือมุกที่กำลังดังใน TikTok ตอนนี้",
        "mini-drama": "ละครสั้น: มีพล็อตเรื่องหักมุม, ดราม่า, หรือตลกคาเฟ่",
        "before-after": "โชว์ผลลัพธ์ Before/After: ให้เห็นความแตกต่างชัดเจนที่สุด"
    };

    const toneDescriptions: Record<string, string> = {
        "energetic": "High Energy: ตื่นเต้น, เสียงดังฟังชัด, กระตือรือร้นสุดขีด (เหมือนพิธีกรทีวีไดเร็ค)",
        "calm": "ASMR/Calm: เสียงนุ่ม, ทุ้ม, สบายหู, ชวนง่วงแบบผ่อนคลาย",
        "friendly": "Best Friend: เหมือนเพื่อนสนิทคุยกัน, ใช้กู-มึงได้ (ถ้าเหมาะสม), หรือ เธอ-ฉัน",
        "professional": "Expert/Professional: น่าเชื่อถือ, ข้อมูลแน่น, ดูเป็นผู้เชี่ยวชาญ"
    };

    const styleDescriptions: Record<string, string> = {
        "hard": "Hard Sell: ขายตรงๆ ไม่อ้อมค้อม เน้นโปรโมชั่นและความคุ้มค่า",
        "soft": "Soft Sell: ป้ายยาแบบเนียนๆ เล่าเรื่องก่อนแล้วค่อยตบเข้าสินค้าตอนจบ",
        "educational": "Educational: เน้นให้ความรู้ สาระแน่นๆ สินค้าเป็นแค่ตัวประกอบ",
        "storytelling": "Storytelling: เล่าเรื่องราวที่มีจุดเริ่มต้น จุดพีค และจุดจบ (สินค้าคือฮีโร่)"
    };

    let prompt = `
You are an expert TikTok/Reels script writer representing a world-class creative agency.
Your goal is to write a script that feels "Premium", "Authentic", and "High-Class".

## CRITICAL INSTRUCTIONS (MUST FOLLOW)
1. **Language Style**: Use **"Spoken Thai" (ภาษาพูด)**. Avoid formal/academic Thai (ภาษาเขียน).
   - BAD: "มีความสุข", "รับประทาน", "จำหน่าย"
   - GOOD: "ฟิน", "กิน", "ขาย", "จึ้งมาก", "ของมันต้องมี"
   - Use slang naturally (e.g., Fin, Pang, Jeung) to sound viral and relatable.

2. **Visual Description**: When describing scenarios (Proof), focus on **EMOTION & RESULT**.
   - BAD: "In this image..."
   - GOOD: "Look at that face! Pure joy!"

3. **Product Name**: 
   - Use the **EXACT Brand Name** (e.g. "Dior Sauvage", "Whiskas") derived from the input.
   - **MANDATORY**: You MUST mention the Brand Name in the **[HOOK]** and again in the **[CTA]**.
   - Do NOT just say "this perfume" or "this food". Say the NAME.

4. **Structure**: 
   - **HOOk**: Start with a scroll-stopping question or statement + BRAND NAME.
   - **BODY**: Focus on the feeling/benefit.
   - **CLOSING**: Strong Call to Action + BRAND NAME.

## PRODUCT INFORMATION
- Product Name: ${data.productName || "(Extract name from description below)"}
${data.productDescription ? `- Description / Visual Context from AI Brain: ${data.productDescription}` : ""}
${data.mustUseKeywords ? `- Must Include Keywords: ${data.mustUseKeywords}` : ""}
${data.avoidKeywords ? `- Avoid These Words: ${data.avoidKeywords}` : ""}

## SCRIPT SETTINGS
- Template: ${data.template || "product-review"} (${templateDescriptions[data.template || "product-review"] || ""})
- Sales Approach: ${data.style} (${styleDescriptions[data.style] || ""})
- Voice Tone: ${data.tone} (${toneDescriptions[data.tone] || ""})
- Language: ${data.language === "th-central" ? "Thai (Central) - Use modern, natural Thai slang where appropriate" : "English"}

## OUTPUT REQUIREMENTS
Generate a complete TikTok script with:
1. [HOOK]
2. [PROBLEM]
3. [SOLUTION]
4. [PROOF]
5. [CTA]

Output ONLY the script dialogue. No metadata.
`;

    return prompt;
};

/**
 * Uses GPT-4o Vision to analyze the product image (and optional character) to generate a highly detailed prompt
 */
const generateVisualPrompt = async (apiKey: string, imageBase64: string, productName: string, style: string, characterImage?: string): Promise<string> => {
    console.log("👁️ Analyzing Product (and Character) with GPT-4o Vision...");

    try {
        const messagesContent: any[] = [
            {
                type: "text",
                text: `Analyze these images. 
                Image 1: The Product.
                ${characterImage ? "Image 2: The Character/Presenter." : ""}
                
                1. Identify the EXACT Product Name / Brand from the text on the package (if any).
                2. Create a HIGHLY DETAILED, CINEMATIC video generation prompt for a single **8-second continuous shot**.
                   ${characterImage ? "- **INTEGRATION**: Describe the Character (Image 2) interacting with the Product (Image 1) naturally." : ""}
                   - Focus on **CAMERA MOVEMENT** (e.g., "Slow smooth pan", "Rack focus", "Dolly in").
                   - Describe **LIGHTING & ATMOSPHERE** (e.g., "Golden hour", "Neon rim light", "Soft diffusion").
                   - Describe **ACTION** (e.g., "Smoke swirling", "Water droplets falling", "Fabric flowing").
                   - **DO NOT** use "cuts" or "scenes". Write one fluid visual description that lasts 8 seconds.
                   - Style: ${style}.
                
                Output format strictly:
                Name: [Identified Name or "Unknown"]
                Prompt: [Visual Description... (in English)]`
            },
            {
                type: "image_url",
                image_url: { url: imageBase64 }
            }
        ];

        if (characterImage) {
            messagesContent.push({
                type: "image_url",
                image_url: { url: characterImage }
            });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: messagesContent
                    }
                ],
                max_tokens: 350
            })
        });

        const json = await response.json();
        if (json.error || !json.choices) {
            console.warn("Vision API Error:", json.error);
            return `Name: Unknown\nPrompt: Cinematic shot of ${productName || "product"}, ${style} style, professional lighting`;
        }
        return json.choices[0].message.content;

    } catch (e) {
        console.error("Vision Analysis Failed:", e);
        return `Name: Unknown\nPrompt: Cinematic shot of ${productName || "product"}, ${style} style, professional lighting`;
    }
};

/**
 * Helper to generate using OpenAI with full form data (GPT-4o)
 */
const generateWithOpenAI = async (apiKey: string, data: ScriptRequest): Promise<ScriptResult> => {
    console.log("🤖 Generating script with OpenAI (GPT-4o)...");
    const prompt = buildFullPrompt(data);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a professional TikTok script writer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.8
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
    }

    const json = await response.json();
    return {
        script: json.choices[0].message.content || "",
        generatedPrompt: prompt
    };
};

/**
 * Generates a viral TikTok script using the selected AI Provider (OpenAI or Gemini)
 */
export const generateVideoScript = async (
    data: ScriptRequest
): Promise<ScriptResult> => {
    // Check which AI Provider user selected (default: OpenAI)
    const aiProvider = localStorage.getItem("netflow_ai_provider") || "openai";
    console.log(`🤖 Using AI Provider: ${aiProvider.toUpperCase()}`);

    // 1. If OpenAI is selected
    if (aiProvider === "openai") {
        const openaiKey = await getApiKey('openai');
        if (openaiKey) {
            try {
                return await generateWithOpenAI(openaiKey, data);
            } catch (error: any) {
                console.error("❌ OpenAI Generation failed:", error.message);
                throw new Error(`OpenAI Error: ${error.message}`);
            }
        } else {
            // If key not found, fallback to Gemini?? 
            // User wants BEST. If no key, maybe Error is better than mediocre fallback. 
            // But existing behavior was Error.
            throw new Error("OpenAI API Key ไม่พบ! กรุณาใส่ Key ใน Settings");
        }
    }

    // 2. If Gemini is selected
    if (aiProvider === "gemini") {
        const tryGenerate = async (modelName: string): Promise<ScriptResult> => {
            console.log(`🔷 Attempting script generation with Gemini model: ${modelName}`);
            const genAI = await getGenAI();
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = buildFullPrompt(data);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return {
                script: response.text(),
                generatedPrompt: prompt
            };
        };

        try {
            return await tryGenerate("gemini-1.5-flash"); // Use 1.5 Flash (latest fast)
        } catch (error: any) {
            console.warn("Gemini Flash failed, trying Pro...", error.message);
            try {
                return await tryGenerate("gemini-pro");
            } catch (fallbackError: any) {
                console.error("❌ All Gemini models failed:", fallbackError.message);
                throw new Error(`Gemini Error: ${fallbackError.message}`);
            }
        }
    }

    throw new Error("ไม่พบ AI Provider ที่ถูกต้อง");
};

/**
 * Synthesizes text to speech using OpenAI TTS API
 */
const generateOpenAISpeech = async (text: string, apiKey: string): Promise<string | null> => {
    try {
        console.log("🎙️ Generating speech with OpenAI TTS...");
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "tts-1",
                input: text,
                voice: "nova" // "shimmer", "alloy", "echo", "fable", "onyx", "nova"
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.warn("OpenAI TTS Error:", err);
            return null;
        }

        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("OpenAI TTS Failed:", e);
        return null;
    }
};

/**
 * Synthesizes text to speech using Google Cloud TTS API (with OpenAI fallback)
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
    // 1. Try Google Cloud TTS first
    try {
        const googleKey = await getApiKey('gemini');
        if (googleKey) {
            const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`;
            const requestBody = {
                input: { text },
                voice: { languageCode: "th-TH", ssmlGender: "FEMALE" },
                audioConfig: { audioEncoding: "MP3" },
            };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.audioContent) {
                    console.log("✅ Google TTS Success");
                    return `data:audio/mp3;base64,${data.audioContent}`;
                }
            } else {
                console.warn("Google TTS failed, trying OpenAI fallback...");
            }
        }
    } catch (error) {
        console.warn("Google TTS error, trying OpenAI fallback...");
    }

    // 2. Fallback to OpenAI TTS
    const openaiKey = await getApiKey('openai');
    if (openaiKey) {
        return await generateOpenAISpeech(text, openaiKey);
    }

    return null;
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

/**
 * RPA Binding: Triggers the Service Worker to run Google VideoFX automation
 */
const triggerRPAGeneration = (prompt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Check if running as extension
        if (typeof chrome === "undefined" || !chrome.runtime) {
            console.warn("RPA requires Chrome Extension environment. Returning mock.");
            setTimeout(() => resolve("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"), 3000);
            return;
        }

        console.log("🚀 Triggering RPA Flow with prompt:", prompt);

        // 1. Send Start Command
        chrome.runtime.sendMessage({
            type: "START_VIDEO_GENERATION",
            payload: { prompt }
        }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error("Extension Error: " + chrome.runtime.lastError.message));
                return;
            }
            console.log("RPA Started:", response);
        });

        // 2. Listen for Completion (One-time listener)
        const listener = (message: any) => {
            if (message.type === "VIDEO_GENERATION_COMPLETE") {
                console.log("✅ RPA Video Received:", message.videoUrl);
                cleanup();
                resolve(message.videoUrl);
            } else if (message.type === "VIDEO_GENERATION_ERROR") {
                console.error("❌ RPA Error:", message.error);
                cleanup();
                reject(new Error(message.error));
            }
        };

        // Cleanup listener to avoid leaks
        const cleanup = () => {
            chrome.runtime.onMessage.removeListener(listener);
        };

        chrome.runtime.onMessage.addListener(listener);

        // Timeout (5 minutes max)
        setTimeout(() => {
            cleanup();
            reject(new Error("RPA Timeout (5 mins)"));
        }, 5 * 60 * 1000);
    });
};

// Orchestrator function to run the full flow
export const runFullWorkflow = async (data: ScriptRequest | AdvancedVideoRequest): Promise<ScriptResult> => {
    console.log("Starting Workflow...", data);

    try {
        let script = "";
        let audioUrl: string | undefined = undefined;
        let videoUrl: string | undefined = undefined;
        let imageUrl: string | undefined = undefined;
        let generatedPrompt: string | undefined = undefined;

        // Cast to AdvancedVideoRequest safely
        let advData = data as any;

        // 1. Vision Analysis (Brain 🧠)
        if (advData.userImage) {
            console.log("🧠 Starting Smart Vision Analysis (GPT-4o Vision)...");
            // Note: In real extension, we might need a persistent key or proxy. 
            // Here we reuse getApiKey('openai') logic.
            const apiKey = await getApiKey('openai');
            if (apiKey) {
                const visionRes = await generateVisualPrompt(apiKey, advData.userImage, advData.productName, advData.style, advData.characterImage);
                if (visionRes) {
                    // Parse logic: "Name: [xxx]\nPrompt: [yyy]"
                    const nameMatch = visionRes.match(/Name:\s*(.+)/i);
                    const promptMatch = visionRes.match(/Prompt:\s*([\s\S]+)/i);

                    const extractedName = nameMatch ? nameMatch[1].trim() : "Unknown";
                    const extractedPrompt = promptMatch ? promptMatch[1].trim() : visionRes; // Fallback to whole text

                    console.log(`✅ Smart Vision found: Name=[${extractedName}]`);

                    // Update Data
                    if (extractedName && extractedName !== "Unknown" && (!advData.productName || advData.productName === "สินค้าทั่วไป")) {
                        advData.productName = extractedName;
                    }
                    advData.prompt = extractedPrompt;

                    // Inject into Product Description for Script Writer (Context)
                    if (!advData.productDescription) advData.productDescription = "";
                    advData.productDescription += `\n\n[Visual Details]: ${extractedPrompt}`;

                    generatedPrompt = `[Smart Vision]: ${visionRes}`;
                }
            }
        }

        let visualPrompt = advData.prompt || advData.productName;

        // 2. Script & Audio Generation (Brain 🧠)
        // Run if we have a name OR image OR minimal context
        if (advData.productName || advData.userImage || advData.productDescription) {
            console.log("📝 Generating Script for:", advData.productName || "Unknown Product");
            const result = await generateVideoScript(advData);
            script = result.script;
            if (!generatedPrompt) generatedPrompt = result.generatedPrompt;
            else generatedPrompt += `\n\n[Script Prompt]: ${result.generatedPrompt}`;

            console.log("Script generated:", script);
            audioUrl = (await generateSpeech(script)) || undefined;
        }

        // 3. Visual Generation (RPA Automaton 🤖)
        // Only if userImage or Prompt is present
        if (visualPrompt) {
            console.log("🎥 Starting Indirect Video Generation (RPA)...");

            try {
                // Trigger the hidden "Ghost Browser" to create video
                videoUrl = await triggerRPAGeneration(visualPrompt);

                if (videoUrl) {
                    console.log("🎉 Video Generated via RPA!");
                }
            } catch (rpaError) {
                console.error("RPA Generation Failed:", rpaError);
                // No fallback to DALL-E (Indirect policy)
            }
        }

        return {
            script,
            audioUrl,
            videoUrl,
            imageUrl,
            generatedPrompt
        };

    } catch (e) {
        console.error("Workflow Failed:", e);
        throw e;
    }
};
