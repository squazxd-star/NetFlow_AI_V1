/**
 * Google Lab Automation Service - SIMPLIFIED FLOW
 * Uses "เพิ่มไปยังพรอมต์" → "ส่วนผสมในวิดีโอ" for seamless transfer
 */

// --- Utilities ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const clickByText = async (searchText: string, tagFilter?: string): Promise<boolean> => {
    const elements = document.querySelectorAll(tagFilter || 'button, div, span, label, a');
    for (const el of elements) {
        const text = el.textContent?.trim() || '';
        if (text.includes(searchText)) {
            (el as HTMLElement).click();
            console.log(`✅ Clicked: "${searchText}"`);
            return true;
        }
    }
    console.warn(`❌ Not found: "${searchText}"`);
    return false;
};

// --- Upload Single Image with Crop Dialog ---
const uploadSingleImage = async (base64Image: string, imageIndex: number): Promise<boolean> => {
    console.log(`📷 Uploading image ${imageIndex}...`);

    // Convert base64 to File
    const arr = base64Image.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], `image_${imageIndex}.png`, { type: mime });

    // Click + button
    const buttons = document.querySelectorAll('button, div');
    for (const btn of buttons) {
        if (btn.clientWidth < 80 && btn.clientHeight < 80) {
            const text = btn.textContent?.trim();
            if (text === '+' || btn.querySelector('svg')) {
                (btn as HTMLElement).click();
                console.log("✅ Clicked + button");
                await delay(800);
                break;
            }
        }
    }

    // Click Upload area
    await delay(500);
    await clickByText('อัพโหลด');
    await delay(500);

    // Find file input
    let fileInput: HTMLInputElement | null = null;
    for (let i = 0; i < 10; i++) {
        fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) break;
        await delay(300);
    }

    if (!fileInput) {
        console.warn("❌ File input not found");
        return false;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("✅ File injected");
    await delay(1500);

    // Click Crop and Save
    for (let i = 0; i < 20; i++) {
        if (await clickByText('ครอบตัดและบันทึก')) {
            await delay(1500);
            return true;
        }
        await delay(500);
    }

    return true;
};

// --- Wait for Generation to Complete ---
const waitForGenerationComplete = async (timeout = 180000): Promise<boolean> => {
    console.log("⏳ Waiting for generation to complete...");
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        // Check progress percentage
        const allText = document.body.innerText;
        const percentMatch = allText.match(/(\d+)%/);

        if (percentMatch) {
            const percent = parseInt(percentMatch[1]);
            console.log(`Generation progress: ${percent}%`);

            if (percent >= 100) {
                console.log("✅ Generation complete!");
                await delay(2000);
                return true;
            }
        }

        // Check if "เพิ่มไปยังพรอมต์" button appeared (means generation done)
        const addToPromptBtn = Array.from(document.querySelectorAll('button, div, span')).find(
            el => el.textContent?.includes('เพิ่มไปยังพรอมต์')
        );
        if (addToPromptBtn) {
            console.log("✅ 'Add to prompt' button detected - generation complete!");
            await delay(1000);
            return true;
        }

        await delay(2000);
    }

    console.warn("⚠️ Generation timeout");
    return false;
};

// --- Click on Generated Image ---
const clickOnGeneratedImage = async (): Promise<boolean> => {
    console.log("🔍 Clicking on generated image...");

    // Find large images that are likely results
    const images = document.querySelectorAll('img');
    for (const img of images) {
        if (img.width > 200 && img.height > 200) {
            const parent = img.closest('button, a, [role="button"], div');
            if (parent) {
                (parent as HTMLElement).click();
                console.log("✅ Clicked on result image");
                await delay(1500);
                return true;
            }
        }
    }
    return false;
};

// --- Fill Prompt and Generate ---
const fillPromptAndGenerate = async (prompt: string): Promise<boolean> => {
    console.log("📝 Filling prompt...");

    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) {
        console.warn("❌ Textarea not found");
        return false;
    }

    textarea.value = prompt;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    await delay(500);

    // Click arrow/send button
    const buttons = Array.from(document.querySelectorAll('button'));
    for (const btn of buttons.reverse()) {
        const svg = btn.querySelector('svg');
        if (svg && btn.clientWidth < 60) {
            btn.click();
            console.log("✅ Clicked generate button");
            return true;
        }
    }

    return false;
};

// --- Wait for Video Generation ---
const waitForVideoComplete = async (timeout = 300000): Promise<string | null> => {
    console.log("⏳ Waiting for video generation (2-5 minutes)...");
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        // Check for video elements
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            if (video.src && video.src.length > 50) {
                console.log("✅ Video found!");
                return video.src;
            }
        }

        // Check for video source
        const sources = document.querySelectorAll('source');
        for (const source of sources) {
            if (source.src && source.src.includes('.mp4')) {
                return source.src;
            }
        }

        // Check progress
        const allText = document.body.innerText;
        const percentMatch = allText.match(/(\d+)%/);
        if (percentMatch) {
            console.log(`Video progress: ${percentMatch[1]}%`);
        }

        await delay(5000);
    }

    return null;
};

// --- Switch to Image Tab ---
const switchToImageTab = async (): Promise<boolean> => {
    console.log("🖼️ Switching to Image Tab...");
    return await clickByText('รูปภาพ', 'button');
};

// --- Main Pipeline Config ---
export interface PipelineConfig {
    characterImage: string;
    productImage: string;
    imagePrompt: string;
    videoPrompt: string;
}

// ========== MAIN SIMPLIFIED PIPELINE ==========
export const runTwoStagePipeline = async (config: PipelineConfig): Promise<{
    success: boolean;
    generatedImageUrl?: string;
    videoUrl?: string;
    error?: string;
}> => {
    console.log("🚀🚀🚀 Starting SIMPLIFIED Pipeline 🚀🚀🚀");

    try {
        // ==================== STAGE 1: IMAGE GENERATION ====================
        console.log("\n========== STAGE 1: IMAGE GENERATION ==========\n");

        // 1.1 Switch to Image tab
        await switchToImageTab();
        await delay(1500);

        // 1.2 Upload Character image
        console.log("📷 Uploading Character...");
        await uploadSingleImage(config.characterImage, 1);
        await delay(1500);

        // 1.3 Upload Product image
        console.log("📷 Uploading Product...");
        await uploadSingleImage(config.productImage, 2);
        await delay(1500);

        // 1.4 Fill prompt and generate
        await fillPromptAndGenerate(config.imagePrompt);
        await delay(2000);

        // 1.5 Wait for image generation to complete
        const genComplete = await waitForGenerationComplete(180000);
        if (!genComplete) {
            return { success: false, error: "Image generation timeout" };
        }

        // 1.6 Click on the generated image to open detail view
        await clickOnGeneratedImage();
        await delay(1500);

        // ==================== TRANSITION TO VIDEO ====================
        console.log("\n========== TRANSITIONING TO VIDEO ==========\n");

        // 1.7 Click "เพิ่มไปยังพรอมต์" (Add to Prompt)
        console.log("📌 Clicking 'Add to Prompt'...");
        const addedToPrompt = await clickByText('เพิ่มไปยังพรอมต์');
        if (!addedToPrompt) {
            console.warn("⚠️ 'Add to Prompt' not found, trying alternative...");
        }
        await delay(1500);

        // 1.8 Click "ส่วนผสมในวิดีโอ" (Composition in Video)
        console.log("🎬 Clicking 'ส่วนผสมในวิดีโอ'...");
        const switchedToVideo = await clickByText('ส่วนผสมในวิดีโอ');
        if (!switchedToVideo) {
            // Try English version or alternative
            await clickByText('Video composition');
            await clickByText('วิดีโอ');
        }
        await delay(2000);

        // ==================== STAGE 2: VIDEO GENERATION ====================
        console.log("\n========== STAGE 2: VIDEO GENERATION ==========\n");

        // 2.1 Fill video prompt from NetFlow
        console.log("📝 Filling video prompt from NetFlow...");
        await fillPromptAndGenerate(config.videoPrompt);
        await delay(2000);

        // 2.2 Wait for video generation
        console.log("⏳ Video generation started...");
        const videoUrl = await waitForVideoComplete(300000);

        if (!videoUrl) {
            return {
                success: false,
                error: "Video generation timeout"
            };
        }

        console.log("\n🎉🎉🎉 PIPELINE COMPLETE! 🎉🎉🎉\n");
        console.log("Video URL:", videoUrl.substring(0, 100));

        return {
            success: true,
            videoUrl
        };

    } catch (error: any) {
        console.error("❌ Pipeline error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
};

// --- Exports ---
export {
    switchToImageTab,
    uploadSingleImage,
    fillPromptAndGenerate,
    waitForVideoComplete,
    clickByText
};
