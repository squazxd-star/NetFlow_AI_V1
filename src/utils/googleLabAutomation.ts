/**
 * Google Lab Automation Service
 * Handles the 2-Stage Pipeline: Image Gen -> Video Gen
 */

// --- Utility: Wait for a duration ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Utility: Wait for an element to appear ---
const waitForElement = async (selector: string, timeout = 10000): Promise<HTMLElement | null> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) return el;
        await delay(300);
    }
    console.warn(`Timeout waiting for element: ${selector}`);
    return null;
};

// --- Utility: Wait for image generation to complete ---
const waitForGeneratedImage = async (containerSelector: string, timeout = 60000): Promise<string | null> => {
    console.log("⏳ Waiting for image generation to complete...");
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        // Look for generated image in the result area
        const container = document.querySelector(containerSelector);
        if (container) {
            // Try to find img elements that might be the result
            const images = container.querySelectorAll('img');
            for (const img of images) {
                const src = img.src;
                // Check if it's a data URL or a generated image URL (not a UI icon)
                if (src && (src.startsWith('data:') || src.includes('generated') || img.width > 200)) {
                    console.log("✅ Generated image found!");
                    return src;
                }
            }
            // Also check for canvas elements
            const canvases = container.querySelectorAll('canvas');
            for (const canvas of canvases) {
                if (canvas.width > 200) {
                    try {
                        const dataUrl = canvas.toDataURL('image/png');
                        console.log("✅ Generated image captured from canvas!");
                        return dataUrl;
                    } catch (e) {
                        console.warn("Canvas tainted, cannot capture.");
                    }
                }
            }
        }
        await delay(1000);
    }
    console.warn("⚠️ Timeout waiting for generated image.");
    return null;
};

// --- Step 1: Switch to Image Tab ---
export const switchToImageTab = async (): Promise<boolean> => {
    console.log("🖼️ Switching to Image Tab...");

    // Common selectors for the "รูปภาพ" (Image) tab
    const possibleSelectors = [
        'button:has-text("รูปภาพ")',
        '[aria-label*="image"]',
        '[data-tab="image"]',
        'button[contains(text(), "รูปภาพ")]',
        // More generic: find buttons containing the Thai word
    ];

    // Try to find the tab by text content
    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
        const text = btn.textContent?.trim() || '';
        if (text.includes('รูปภาพ') || text.toLowerCase().includes('image')) {
            btn.click();
            console.log("✅ Clicked Image Tab");
            await delay(500);
            return true;
        }
    }

    console.warn("❌ Image tab not found");
    return false;
};

// --- Step 2: Switch to Video Tab ---
export const switchToVideoTab = async (): Promise<boolean> => {
    console.log("🎬 Switching to Video Tab...");

    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
        const text = btn.textContent?.trim() || '';
        if (text.includes('วิดีโอ') || text.toLowerCase().includes('video')) {
            btn.click();
            console.log("✅ Clicked Video Tab");
            await delay(500);
            return true;
        }
    }

    console.warn("❌ Video tab not found");
    return false;
};

// --- Step 3: Upload Image to Current Tab's Input ---
export const uploadImageToInput = async (base64Image: string): Promise<boolean> => {
    console.log("⬆️ Uploading image to input...");

    // Convert base64 to File
    const arr = base64Image.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], 'reference_image.png', { type: mime });

    // Find file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput) {
        // Try clicking the upload button first to reveal the input
        const uploadButtons = document.querySelectorAll('button, div');
        for (const btn of uploadButtons) {
            if (btn.textContent?.includes('อัพโหลด') || btn.textContent?.includes('Upload')) {
                (btn as HTMLElement).click();
                await delay(500);
                break;
            }
        }

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (!input) {
            console.warn("❌ File input not found");
            return false;
        }
    }

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("✅ Image uploaded");
        return true;
    }

    return false;
};

// --- Step 4: Fill Prompt and Trigger Generation ---
export const fillPromptAndGenerate = async (prompt: string): Promise<boolean> => {
    console.log("📝 Filling prompt:", prompt);

    // Find textarea or input for prompt
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;

    const target = textarea || input;
    if (!target) {
        console.warn("❌ Prompt input not found");
        return false;
    }

    target.value = prompt;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));

    await delay(300);

    // Try to click generate/submit button
    const allButtons = document.querySelectorAll('button');
    for (const btn of allButtons) {
        const text = btn.textContent?.trim().toLowerCase() || '';
        // Look for common generate button patterns
        if (text.includes('generate') || text.includes('create') || text.includes('สร้าง') ||
            btn.querySelector('svg[data-icon="arrow"]') || // Arrow icon buttons
            btn.getAttribute('aria-label')?.includes('submit')) {
            btn.click();
            console.log("✅ Clicked Generate button");
            return true;
        }
    }

    // Fallback: Look for the arrow/send button (often in chat-like UIs)
    const arrowButton = document.querySelector('button[type="submit"], button:last-of-type');
    if (arrowButton) {
        (arrowButton as HTMLElement).click();
        console.log("✅ Clicked Submit button (fallback)");
        return true;
    }

    console.warn("⚠️ Generate button not found - prompt filled, user may need to click manually");
    return false;
};

// --- Main Orchestrator: 2-Stage Pipeline ---
export interface PipelineConfig {
    characterImage: string;  // Base64
    productImage: string;    // Base64
    imagePrompt: string;     // Prompt for image generation (combine character + product)
    videoPrompt: string;     // Prompt for video generation
}

export const runTwoStagePipeline = async (config: PipelineConfig): Promise<{
    success: boolean;
    generatedImageUrl?: string;
    error?: string;
}> => {
    console.log("🚀 Starting 2-Stage Pipeline...");

    try {
        // ========== STAGE 1: Image Generation ==========
        console.log("=== STAGE 1: Image Generation ===");

        // 1.1 Switch to Image tab
        const imageTabSuccess = await switchToImageTab();
        if (!imageTabSuccess) {
            return { success: false, error: "Failed to switch to Image tab" };
        }
        await delay(1000);

        // 1.2 Merge and upload images
        const { mergeImages } = await import('./imageProcessing');
        const mergedImage = await mergeImages(config.characterImage, config.productImage, 'horizontal');

        const uploadSuccess = await uploadImageToInput(mergedImage);
        if (!uploadSuccess) {
            console.warn("Image upload failed, continuing with prompt only...");
        }
        await delay(500);

        // 1.3 Fill prompt and trigger generation
        await fillPromptAndGenerate(config.imagePrompt);

        // 1.4 Wait for generated image
        const generatedImageUrl = await waitForGeneratedImage('main, [role="main"], .result-container', 90000);

        if (!generatedImageUrl) {
            return { success: false, error: "Image generation timed out or failed" };
        }

        console.log("=== STAGE 1 COMPLETE ===");

        // ========== STAGE 2: Video Generation ==========
        console.log("=== STAGE 2: Video Generation ===");

        // 2.1 Switch to Video tab
        const videoTabSuccess = await switchToVideoTab();
        if (!videoTabSuccess) {
            return { success: false, error: "Failed to switch to Video tab", generatedImageUrl };
        }
        await delay(1000);

        // 2.2 Upload the generated image
        const videoUploadSuccess = await uploadImageToInput(generatedImageUrl);
        if (!videoUploadSuccess) {
            console.warn("Video image upload failed, continuing with prompt only...");
        }
        await delay(500);

        // 2.3 Fill the video prompt (but don't auto-click generate for video - let user control)
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        if (textarea) {
            textarea.value = config.videoPrompt;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("✅ Video prompt filled - Ready for user to generate!");
        }

        console.log("=== STAGE 2 COMPLETE ===");
        console.log("🎉 Pipeline finished! User can now click Generate for video.");

        return { success: true, generatedImageUrl };

    } catch (error: any) {
        console.error("❌ Pipeline error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
};
