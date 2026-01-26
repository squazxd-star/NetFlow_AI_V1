/**
 * Google Lab Automation Service - SIMPLIFIED FLOW (FINAL ROBUST)
 * Strategies: Text -> Parent -> Coordinates -> Aggressive Upload
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
    return false;
};

// --- Upload Single Image with Aggressive Fallback ---
const uploadSingleImage = async (base64Image: string, imageIndex: number): Promise<boolean> => {
    console.log(`📷 Uploading image ${imageIndex} (Aggressive mode)...`);

    // Convert base64 to File
    const arr = base64Image.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const filename = imageIndex === 1 ? 'character.png' : 'product.png';
    const file = new File([u8arr], filename, { type: mime });

    // STRATEGY 1: Direct Input Injection (The most robust way)
    const allInputs = document.querySelectorAll('input[type="file"]');
    console.log(`🔍 Found ${allInputs.length} hidden file inputs`);

    let injected = false;

    // Try to inject into ANY file input found
    for (const input of allInputs) {
        try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            (input as HTMLInputElement).files = dataTransfer.files;

            // Dispatch multiple events to force detection
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('drop', { bubbles: true }));

            console.log("✅ Injected file into generic input");
            injected = true;
        } catch (e) {
            console.warn("Input injection failed:", e);
        }
    }

    if (injected) {
        // Wait briefly to see if upload/crop dialog triggers
        await delay(1500);
        if (await clickByText('ครอบตัดและบันทึก') || await clickByText('Crop and save')) {
            console.log("✅ Crop dialog handled immediately");
            return true;
        }
    }

    // STRATEGY 2: UI Interaction (Fallback)
    if (!injected) {
        console.log("⚠️ Trying UI click flow...");

        // Find visible + button
        const plusButtons = Array.from(document.querySelectorAll('button, div, [role="button"]')).filter(el => {
            const text = el.textContent?.trim();
            const html = el.innerHTML;
            return (text === '+' || text === '＋' ||
                (el.tagName === 'BUTTON' && el.clientWidth < 80 && el.innerHTML.includes('<svg')));
        });

        for (const btn of plusButtons) {
            if (btn.clientWidth > 0 && btn.clientWidth < 100) {
                (btn as HTMLElement).click();
                console.log("✅ Clicked + button");
                await delay(800);
            }
        }

        // Find Upload Button
        await clickByText('อัพโหลด');
        await delay(500);

        // Retrying Injection after UI interaction
        const inputsAfterClick = document.querySelectorAll('input[type="file"]');
        for (const input of inputsAfterClick) {
            const dt = new DataTransfer();
            dt.items.add(file);
            (input as HTMLInputElement).files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("✅ Injected file after clicking UI");
            injected = true;
        }
    }

    // Final Check for Crop Dialog
    await delay(1500);
    for (let i = 0; i < 10; i++) {
        if (await clickByText('ครอบตัดและบันทึก') || await clickByText('Crop and save')) {
            console.log("✅ Clicked Crop and Save");
            return true;
        }
        await delay(500);
    }

    return injected;
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

        // Check if "Add to prompt" button appeared
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
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            if (video.src && video.src.length > 50) {
                console.log("✅ Video found!");
                return video.src;
            }
        }

        const sources = document.querySelectorAll('source');
        for (const source of sources) {
            if (source.src && source.src.includes('.mp4')) {
                return source.src;
            }
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

// --- Config ---
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
        console.log("\n========== STAGE 0: DASHBOARD CHECK ==========\n");

        // STRATEGY: Text -> Parent -> Coordinate Fallback
        const dashboardKeywords = ['โปรเจ็กต์ใหม่', 'New project', 'Start new', 'Pro', 'สร้าง'];
        let clicked = false;

        // 1. TEXT SEARCH
        for (const kw of dashboardKeywords) {
            const elements = Array.from(document.querySelectorAll('*')).filter(el =>
                el.children.length === 0 && el.textContent?.includes(kw)
            );

            for (const el of elements) {
                console.log(`🎯 Found text "${kw}", attempting parent clicks...`);
                // Click text
                (el as HTMLElement).click();

                // Click 5 levels of parents
                let parent = el.parentElement;
                for (let i = 0; i < 5; i++) {
                    if (parent) {
                        try {
                            const opts = { bubbles: true, cancelable: true, view: window };
                            parent.dispatchEvent(new MouseEvent('mousedown', opts));
                            parent.dispatchEvent(new MouseEvent('mouseup', opts));
                            parent.dispatchEvent(new MouseEvent('click', opts));
                            console.log(`👆 Force-clicked parent L${i + 1}`);
                        } catch (e) { }
                        parent = parent.parentElement;
                    }
                }
                clicked = true;
                break;
            }
            if (clicked) break;
        }

        // 2. COORDINATE FALLBACK (User Requested Backup Plan)
        if (!clicked) {
            console.log("⚠️ Text search failed. Using COORDINATE FALLBACK (Backup Plan)...");

            // Try clicking the area where "New Project" usually sits.
            // Assumption: Fullscreen, Bottom-Center-Right area or Grid layout.
            // We try percentage-based points.
            const clickPoints = [
                { x: window.innerWidth * 0.5, y: window.innerHeight * 0.75 }, // Dead center bottom (most likely for grid)
                { x: window.innerWidth * 0.4, y: window.innerHeight * 0.75 }, // Slightly left
                { x: window.innerWidth * 0.6, y: window.innerHeight * 0.75 }, // Slightly right
                { x: window.innerWidth * 0.5, y: window.innerHeight * 0.85 }  // Lower center
            ];

            for (const p of clickPoints) {
                console.log(`📍 Clicking fallback coordinate: ${Math.round(p.x)}, ${Math.round(p.y)}`);
                const el = document.elementFromPoint(p.x, p.y);
                if (el) {
                    (el as HTMLElement).click();
                    const opts = { bubbles: true, clientX: p.x, clientY: p.y, view: window };
                    el.dispatchEvent(new MouseEvent('mousedown', opts));
                    el.dispatchEvent(new MouseEvent('mouseup', opts));
                    el.dispatchEvent(new MouseEvent('click', opts));

                    clicked = true;
                    await delay(500);
                }
            }
        }

        if (clicked) {
            console.log("✅ Executed Dashboard Click Sequence (Text or Fallback)");
            await delay(4000);
        } else {
            console.log("ℹ️ No dashboard action needed/found.");
        }

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
        console.log("📝 Filling IMAGE prompt...");
        await fillPromptAndGenerate(config.imagePrompt);
        await delay(2000);

        // 1.5 Wait for image generation
        const genComplete = await waitForGenerationComplete(180000);
        if (!genComplete) {
            return { success: false, error: "Image generation timeout" };
        }

        // 1.6 Click on the generated image
        await clickOnGeneratedImage();
        await delay(1500);

        // ==================== TRANSITION TO VIDEO ====================
        console.log("\n========== TRANSITIONING TO VIDEO ==========\n");

        // 1.7 Click "Add to Prompt" and "Video Composition"
        console.log("📌 Clicking 'Add to Prompt'...");
        await clickByText('เพิ่มไปยังพรอมต์');
        await delay(1500);

        console.log("🎬 Clicking 'Composition in Video'...");
        const switchedToVideo = await clickByText('ส่วนผสมในวิดีโอ') ||
            await clickByText('Video composition') ||
            await clickByText('วิดีโอ');
        await delay(2000);

        // ==================== STAGE 2: VIDEO GENERATION ====================
        console.log("\n========== STAGE 2: VIDEO GENERATION ==========\n");

        // 2.1 Fill video prompt
        console.log("📝 Filling video prompt...");
        await fillPromptAndGenerate(config.videoPrompt);
        await delay(2000);

        // 2.2 Wait for video
        console.log("⏳ Video generation started...");
        const videoUrl = await waitForVideoComplete(300000);

        if (!videoUrl) {
            return { success: false, error: "Video generation timeout" };
        }

        console.log("\n🎉🎉🎉 PIPELINE COMPLETE! 🎉🎉🎉\n");

        return { success: true, videoUrl };

    } catch (error: any) {
        console.error("❌ Pipeline error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
};
