/**
 * Google Lab Automation Service - FINAL RECOVERY
 * Capabilities: Smart State Detection + Keyboard/Pointer Fallbacks
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

    // STRATEGY 1: Direct Input Injection
    const allInputs = document.querySelectorAll('input[type="file"]');
    let injected = false;

    for (const input of allInputs) {
        try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            (input as HTMLInputElement).files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            injected = true;
        } catch (e) { }
    }

    if (injected) {
        await delay(1500);
        if (await clickByText('ครอบตัดและบันทึก') || await clickByText('Crop and save')) {
            return true;
        }
    }

    // STRATEGY 2: UI Interaction
    if (!injected) {
        const plusButtons = Array.from(document.querySelectorAll('button, div, [role="button"]')).filter(el => {
            const text = el.textContent?.trim();
            const html = el.innerHTML;
            return (text === '+' || text === '＋' ||
                (el.tagName === 'BUTTON' && el.clientWidth < 80 && el.innerHTML.includes('<svg')));
        });

        for (const btn of plusButtons) {
            if (btn.clientWidth > 0 && btn.clientWidth < 100) {
                (btn as HTMLElement).click();
                await delay(800);
            }
        }

        await clickByText('อัพโหลด');
        await delay(500);

        const inputsAfterClick = document.querySelectorAll('input[type="file"]');
        for (const input of inputsAfterClick) {
            const dt = new DataTransfer();
            dt.items.add(file);
            (input as HTMLInputElement).files = dt.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            injected = true;
        }
    }

    await delay(1500);
    for (let i = 0; i < 10; i++) {
        if (await clickByText('ครอบตัดและบันทึก') || await clickByText('Crop and save')) {
            return true;
        }
        await delay(500);
    }

    return injected;
};

// --- Helper: Check if we are in Workspace ---
const isInWorkspace = (): boolean => {
    // Look for "Image" / "รูปภาพ" tab which indicates workspace
    const tabs = document.querySelectorAll('button, div[role="tab"], span');
    for (const tab of tabs) {
        if (tab.textContent?.includes('รูปภาพ') || tab.textContent?.includes('Image')) {
            return true;
        }
    }
    return false;
};

// --- Switch to Image Tab ---
const switchToImageTab = async (): Promise<boolean> => {
    console.log("🖼️ Switching to Image Tab...");
    return await clickByText('รูปภาพ', 'button');
};

// --- Fill Prompt ---
const fillPromptAndGenerate = async (prompt: string): Promise<boolean> => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
        textarea.value = prompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        await delay(500);
        const buttons = Array.from(document.querySelectorAll('button'));
        for (const btn of buttons.reverse()) {
            if (btn.querySelector('svg') && btn.clientWidth < 60) {
                btn.click();
                return true;
            }
        }
    }
    return false;
};

// --- Wait Logic ---
const waitForGenerationComplete = async (timeout = 180000): Promise<boolean> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const percentMatch = document.body.innerText.match(/(\d+)%/);
        if (percentMatch && parseInt(percentMatch[1]) >= 100) return true;
        if (Array.from(document.querySelectorAll('*')).some(el => el.textContent?.includes('เพิ่มไปยังพรอมต์'))) return true;
        await delay(2000);
    }
    return false;
};

const waitForVideoComplete = async (timeout = 300000): Promise<string | null> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const v = document.querySelector('video');
        if (v && v.src && v.src.length > 50) return v.src;
        await delay(5000);
    }
    return null;
};

const clickOnGeneratedImage = async (): Promise<boolean> => {
    const images = document.querySelectorAll('img');
    for (const img of images) {
        if (img.width > 200 && img.height > 200) {
            const parent = img.closest('button, a, [role="button"], div');
            if (parent) (parent as HTMLElement).click();
            return true;
        }
    }
    return false;
};

// ========== MAIN PIPELINE ==========
export interface PipelineConfig {
    characterImage: string;
    productImage: string;
    imagePrompt: string;
    videoPrompt: string;
}

export const runTwoStagePipeline = async (config: PipelineConfig): Promise<{
    success: boolean;
    generatedImageUrl?: string;
    videoUrl?: string;
    error?: string;
}> => {
    console.log("🚀 Starting Pipeline - Force New Project Check");

    try {
        console.log("👀 Checking State...");

        // 1. Check if already in workspace
        let inWorkspace = isInWorkspace();

        if (!inWorkspace) {
            console.log("ℹ️ Not in workspace. Must find 'New Project'...");
            let clicked = false;

            // Loop until we get in, or timeout (try for 10 seconds)
            for (let attempt = 0; attempt < 10; attempt++) {
                // STRATEGY: Text Search
                const dashboardKeywords = ['โปรเจ็กต์ใหม่', 'New project', 'Start new', 'Pro', 'สร้าง', 'ใหม่'];
                for (const kw of dashboardKeywords) {
                    const elements = Array.from(document.querySelectorAll('*')).filter(el =>
                        el.children.length === 0 && el.textContent?.includes(kw)
                    );
                    for (const el of elements) {
                        (el as HTMLElement).click();
                        // Try Parent (Card)
                        let parent = el.parentElement;
                        for (let p = 0; p < 5; p++) {
                            if (parent) {
                                try {
                                    const opts = { bubbles: true, cancelable: true, view: window };
                                    parent.dispatchEvent(new MouseEvent('click', opts));
                                } catch (e) { }
                                parent = parent.parentElement;
                            }
                        }
                        clicked = true;
                    }
                }

                if (clicked) {
                    console.log("✅ Click command sent. Waiting...");
                    await delay(3000);
                    if (isInWorkspace()) {
                        console.log("✅ Entered Workspace!");
                        inWorkspace = true;
                        break;
                    }
                }

                // If text failed, use KEYBOARD FORCE
                if (!clicked) {
                    console.log("🎹 Trying Keyboard Tab...");
                    document.body.focus();
                    for (let k = 0; k < 10; k++) {
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
                        await delay(50);
                        const active = document.activeElement as HTMLElement;
                        if (active && (active.innerText.includes('ใหม่') || active.innerText.includes('New'))) {
                            active.click();
                            active.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                            clicked = true;
                            // Wait to see if it worked
                            await delay(2000);
                            if (isInWorkspace()) {
                                inWorkspace = true;
                                break;
                            }
                        }
                    }
                }

                // If still not in workspace, try COORDINATES
                if (!inWorkspace) {
                    console.log("⚠️ Coordinate Fallback...");
                    const points = [
                        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.75 },
                        { x: 600, y: 750 },
                        { x: 950, y: 750 }
                    ];
                    for (const p of points) {
                        const el = document.elementFromPoint(p.x, p.y);
                        if (el) {
                            (el as HTMLElement).click();
                        }
                    }
                    await delay(2000);
                    if (isInWorkspace()) {
                        inWorkspace = true;
                        break;
                    }
                }

                if (inWorkspace) break;
                console.log("🔄 Retry finding start button...");
                await delay(1000);
            }
        } else {
            console.log("✅ Already in workspace (Image tab detected).");
        }

        // ==================== EXECUTE ====================

        // Final sanity check
        if (!isInWorkspace() && !inWorkspace) {
            // Just proceed blindly if we really can't verify, but warn user
            console.warn("⚠️ Could not confirm workspace entry. Proceeding anyway...");
        }

        await switchToImageTab();
        await delay(1500);

        console.log("📷 Uploading Character...");
        await uploadSingleImage(config.characterImage, 1);
        await delay(1500);

        console.log("📷 Uploading Product...");
        await uploadSingleImage(config.productImage, 2);
        await delay(1500);

        console.log("📝 Generating Image...");
        await fillPromptAndGenerate(config.imagePrompt);

        const genSuccess = await waitForGenerationComplete();
        if (!genSuccess) throw new Error("Image Gen Timeout");

        await clickOnGeneratedImage();
        await delay(1500);

        await clickByText('เพิ่มไปยังพรอมต์');
        await delay(1000);
        await clickByText('ส่วนผสมในวิดีโอ') || await clickByText('Video composition');
        await delay(2000);

        console.log("📝 Generating Video...");
        await fillPromptAndGenerate(config.videoPrompt);

        const videoUrl = await waitForVideoComplete();
        if (!videoUrl) throw new Error("Video Gen Timeout");

        return { success: true, videoUrl };

    } catch (error: any) {
        console.error("Pipeline Error:", error);
        return { success: false, error: error.message };
    }
};
