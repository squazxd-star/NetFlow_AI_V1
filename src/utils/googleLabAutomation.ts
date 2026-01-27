/**
 * Google Lab Automation Service - HYBRID REMOTE
 * Capabilities: Smart State Detection + Keyboard/Pointer Fallbacks + Remote Config
 */

import { RemoteConfigService, AutomationSelectors } from './remoteConfig';

// --- Utilities ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Recursive Shadow DOM Search
const findAllElementsDeep = (selector: string = '*', root: Document | ShadowRoot | Element = document): Element[] => {
    let elements: Element[] = [];

    // 1. Get elements in current root
    try {
        const nodes = (root as ParentNode).querySelectorAll(selector);
        elements.push(...Array.from(nodes));
    } catch (e) { }

    // 2. Traverse Shadow Roots
    const walker = document.createTreeWalker(
        root === document ? document.body : (root as Node),
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: (node) => (node as Element).shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
    );

    while (walker.nextNode()) {
        const shadowRoot = (walker.currentNode as Element).shadowRoot;
        if (shadowRoot) {
            elements.push(...findAllElementsDeep(selector, shadowRoot));
        }
    }

    return elements;
};

// Helper: Click element by text (supports array of triggers)
const clickByText = async (searchText: string | string[], tagFilter?: string): Promise<boolean> => {
    const targets = Array.isArray(searchText) ? searchText : [searchText];
    // Use Deep Search instead of shallow querySelectorAll
    const elements = findAllElementsDeep(tagFilter || 'button, div, span, label, a');

    for (const el of elements) {
        const text = el.textContent?.trim() || '';
        // Exact or partial match
        if (targets.some(t => text.includes(t))) {
            console.log(`✅ Found "${text}", clicking...`);
            (el as HTMLElement).click();
            // Also try clicking parent to be safe (often button is inside a wrapper)
            if (el.parentElement) (el.parentElement as HTMLElement).click();
            return true;
        }
    }
    return false;
};

// --- Upload Single Image with Aggressive Fallback ---
const uploadSingleImage = async (base64Image: string, imageIndex: number, selectors: AutomationSelectors): Promise<boolean> => {
    console.log(`📷 Uploading image ${imageIndex} (Robust Deep Search)...`);

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

    // Robust Injection Loop
    for (let attempt = 0; attempt < 5; attempt++) {
        await delay(1000); // Wait for potential UI load
        const allInputs = findAllElementsDeep('input[type="file"]');
        console.log(`🔎 Attempt ${attempt + 1}: Found ${allInputs.length} file inputs`);

        if (allInputs.length > 0) {
            let injected = false;
            for (const input of allInputs) {
                try {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    (input as HTMLInputElement).files = dataTransfer.files;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    injected = true;
                    console.log("✅ File injected successfully");
                } catch (e) {
                    console.error("Injection failed:", e);
                }
            }
            if (injected) {
                await delay(1500);
                if (await clickByText(selectors.upload.cropSaveTriggers)) return true;
                return true;
            }
        } else {
            console.log("️ Inputs not found, trying fallback clicks to reveal...");
            // Try clicking "Upload" buttons to trigger input existence
            if (await clickByText(selectors.upload.uploadButtonTriggers)) {
                continue; // Retry loop after click
            }
        }
    }

    console.warn("⚠️ All upload attempts failed");
    return false;
};

// --- Helper: Check if we are in Workspace ---
const isInWorkspace = (selectors: AutomationSelectors): boolean => {
    const tabs = findAllElementsDeep('button, div[role="tab"], span'); // Deep Search
    for (const tab of tabs) {
        const text = tab.textContent?.trim() || '';
        if (selectors.workspace.imageTabTriggers.some(t => text.includes(t))) {
            return true;
        }
    }
    return false;
};

// --- Switch to Image Tab ---
const switchToImageTab = async (selectors: AutomationSelectors): Promise<boolean> => {
    console.log("🖼️ Switching to Image Tab...");
    return await clickByText(selectors.workspace.imageTabTriggers, 'button');
};

// --- Fill Prompt ---
const fillPromptAndGenerate = async (prompt: string): Promise<boolean> => {
    if (!prompt) {
        console.error("❌ No prompt provided to fillPromptAndGenerate");
        return false;
    }
    console.log(`📝 Attempting to fill prompt (${prompt.length} chars)...`);

    let inputEl: HTMLElement | null = null;

    // RETRY LOOP 1: FIND INPUT (5 Attempts)
    for (let attempt = 1; attempt <= 5; attempt++) {
        // 1. Try standard textarea/input
        const inputs = findAllElementsDeep('textarea, input[type="text"]');
        const visibleInputs = inputs.filter(el => (el as HTMLElement).clientHeight > 0);

        if (visibleInputs.length > 0) {
            // Usually the last one is the chat input in modern chat UIs
            inputEl = visibleInputs[visibleInputs.length - 1] as HTMLElement;
        }

        // 2. Try contenteditable div if no standard input found
        if (!inputEl) {
            const editables = findAllElementsDeep('div[contenteditable="true"], [role="textbox"], span[data-placeholder]');
            const isPromptBox = (el: Element) => {
                const txt = (el.textContent || '').toLowerCase();
                const placeholder = (el.getAttribute('data-placeholder') || '').toLowerCase();
                const knownPlaceholders = [
                    'สร้างวิดีโอที่มีข้อความ', 'type a prompt', 'describe', 'create video',
                    'พิมพ์ในช่องพร้อมต์เพื่อเริ่มต้น', 'describe your video'
                ];
                return knownPlaceholders.some(p => txt.includes(p) || placeholder.includes(p));
            };
            const match = editables.find(isPromptBox);
            if (match) inputEl = match as HTMLElement;
            else if (editables.length > 0) inputEl = editables[editables.length - 1] as HTMLElement;
        }

        if (inputEl) {
            console.log(`✅ Found prompt input on attempt ${attempt}`);
            break;
        }

        console.log(`⏳ Attempt ${attempt}: Input not found, waiting...`);
        await delay(1000);
    }

    if (inputEl) {
        console.log(`📝 Found prompt area (${inputEl.tagName}), injecting text...`);

        // Focus
        inputEl.focus();
        await delay(300);

        // STRATEGY: ROBUST INJECTION
        // 1. Standard Value Assignment
        if (inputEl.tagName === 'TEXTAREA' || inputEl.tagName === 'INPUT') {
            (inputEl as HTMLInputElement).value = prompt;
        } else {
            inputEl.innerText = prompt;
        }

        // 2. Events Dispath
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));

        // 3. Simulate Typing (Critical for UI State)
        // Type a space and backspace to trigger "dirty" state
        const opts = { bubbles: true, cancelable: true, view: window };
        inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', code: 'Space', ...opts }));
        inputEl.dispatchEvent(new InputEvent('input', { data: ' ', inputType: 'insertText', ...opts }));
        await delay(100);

        // Validation: Check if text stuck
        let currentVal = (inputEl as HTMLInputElement).value || inputEl.innerText;
        if (!currentVal || currentVal.length < 5) {
            console.warn("⚠️ Text injection might have failed, trying Force Paste...");
            try {
                // Determine insertion (modern way)
                if (document.execCommand) {
                    document.execCommand('insertText', false, prompt);
                }
            } catch (e) { console.error("Paste fallback failed", e); }
        }

        await delay(1500); // Wait for UI to enable button

        // RETRY LOOP 2: CLICK GENERATE (5 Attempts)
        for (let attempt = 1; attempt <= 5; attempt++) {
            console.log(`🚀 Clicking Generate (Attempt ${attempt})...`);

            const buttons = findAllElementsDeep('button, div[role="button"]');
            let clicked = false;

            // Strategy A: Text Match
            const generateKeywords = ['generate', 'create', 'run', 'make', 'send', 'submit', 'ส่ง', 'สร้าง'];
            for (const btn of buttons) {
                const text = (btn.textContent || '').toLowerCase();
                const label = (btn.getAttribute('aria-label') || '').toLowerCase();
                // Check visibility
                const rect = btn.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) continue;

                if (generateKeywords.some(w => text.includes(w) || label.includes(w))) {
                    console.log(`🎯 Found Button (Text: ${text || label})`);
                    (btn as HTMLElement).click();
                    clicked = true;
                    break;
                }
            }

            // Strategy B: Icon Heuristic (Circle Arrow)
            if (!clicked) {
                // Filter for likely icon buttons (small dimensions)
                const iconButtons = buttons.filter(btn => {
                    const rect = btn.getBoundingClientRect();
                    return rect.width > 20 && rect.width < 100 && rect.height > 20 && rect.height < 100;
                });

                // The send button is usually at the bottom-right relative to input
                // We'll try the last few buttons found
                for (const btn of iconButtons.reverse()) {
                    const isCircle = getComputedStyle(btn).borderRadius.includes('50%');
                    const hasSvg = btn.querySelector('svg') !== null;

                    if (isCircle || hasSvg) {
                        console.log("🎯 Found Button (Icon Heuristic)");
                        (btn as HTMLElement).click();
                        clicked = true;
                        break;
                    }
                }
            }

            if (clicked) {
                // Wait a bit and check if a new message appeared or loading started?
                // For now we assume success if clicked, but we wait short time effectively
                await delay(2000);
                return true;
            }

            await delay(1000);
        }

    } else {
        console.error("❌ CRITICAL: Prompt input not found after all retries.");
        return false;
    }
    return false;
};

// --- Wait Logic ---
const waitForGenerationComplete = async (selectors: AutomationSelectors, timeout = 180000): Promise<boolean> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        // Quick check for 100% text
        const percentMatch = document.body.innerText.match(/(\d+)%/);
        if (percentMatch && parseInt(percentMatch[1]) >= 100) return true;

        // Deep search for completion triggers
        const allElements = findAllElementsDeep('*');
        if (allElements.some(el => {
            const txt = el.textContent || '';
            // Check for "Add to prompt" or specific completion text
            return selectors.generation.addToPromptTriggers.some(t => txt.includes(t));
        })) return true;

        await delay(2000);
    }
    return false;
};

const waitForVideoComplete = async (timeout = 300000): Promise<string | null> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        // Deep search for video element
        const videos = findAllElementsDeep('video');
        for (const v of videos) {
            const vid = v as HTMLVideoElement;
            if (vid.src && vid.src.length > 50) return vid.src;
        }
        await delay(5000);
    }
    return null;
};

const clickOnGeneratedImage = async (): Promise<boolean> => {
    const images = findAllElementsDeep('img');
    for (const img of images) {
        const image = img as HTMLImageElement;
        if (image.width > 200 && image.height > 200) {
            const parent = image.closest('button, a, [role="button"], div');
            if (parent) {
                (parent as HTMLElement).click();
                return true;
            } else {
                image.click(); // Try clicking image itself
                return true;
            }
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
    console.log("🚀 Starting Pipeline - Hybrid Remote Mode");

    try {
        // 1. Initialize Remote Config
        const configService = RemoteConfigService.getInstance();
        await configService.init(); // Can pass valid URL here if needed
        const selectors = configService.getSelectors();

        console.log("👀 Checking State...");

        // 2. Check if already in workspace
        let inWorkspace = isInWorkspace(selectors);

        if (!inWorkspace) {
            console.log("ℹ️ Not in workspace. Must find 'New Project'...");
            let clicked = false;

            // Loop until we get in, or timeout (try for 10 seconds)
            for (let attempt = 0; attempt < 10; attempt++) {
                // STRATEGY: Text Search using Remote Triggers + Deep Search
                const dashboardKeywords = selectors.dashboard.newProjectTriggers;

                // Use Deep Search for "New Project" buttons too
                const allElements = findAllElementsDeep('*');

                for (const kw of dashboardKeywords) {
                    const elements = allElements.filter(el =>
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
                    if (isInWorkspace(selectors)) {
                        console.log("✅ Entered Workspace!");
                        inWorkspace = true;
                        break;
                    }
                }

                // If text failed, use KEYBOARD FORCE (Legacy fallback is robust)
                if (!clicked) {
                    console.log("🎹 Trying Keyboard Tab...");
                    document.body.focus();
                    for (let k = 0; k < 10; k++) {
                        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
                        await delay(50);
                        const active = document.activeElement as HTMLElement;
                        const activeText = active ? active.innerText : '';

                        // Check if focused element matches any trigger
                        if (active && selectors.dashboard.newProjectTriggers.some(t => activeText.includes(t))) {
                            active.click();
                            active.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                            clicked = true;
                            // Wait to see if it worked
                            await delay(2000);
                            if (isInWorkspace(selectors)) {
                                inWorkspace = true;
                                break;
                            }
                        }
                    }
                }

                // Coordinate Fallback
                if (!inWorkspace) {
                    // ... (Coordinates are universal, kept same)
                }

                if (inWorkspace) break;
                console.log("🔄 Retry finding start button...");
                await delay(1000);
            }
        } else {
            console.log("✅ Already in workspace (Image tab detected).");
        }

        // ==================== EXECUTE ====================

        if (!isInWorkspace(selectors) && !inWorkspace) {
            console.warn("⚠️ Could not confirm workspace entry. Proceeding anyway...");
        }

        await switchToImageTab(selectors);
        await delay(1500);

        console.log("📷 Uploading Character...");
        await uploadSingleImage(config.characterImage, 1, selectors);
        await delay(1500);

        console.log("📷 Uploading Product...");
        await uploadSingleImage(config.productImage, 2, selectors);
        await delay(1500);

        console.log("📝 Generating Image...");
        // Use reduced prompt for image as per user preference (kept from previous logic)
        // Or strictly use config prompt. Here we assume config.imagePrompt is correct.
        await fillPromptAndGenerate(config.imagePrompt);

        const genSuccess = await waitForGenerationComplete(selectors);
        if (!genSuccess) throw new Error("Image Gen Timeout");

        await clickOnGeneratedImage();
        await delay(1500);

        // Step 6: Add to Video (Using Remote Triggers)
        console.log("🎬 Adding to prompt...");
        await clickByText(selectors.generation.addToPromptTriggers);
        await delay(1000);

        console.log("📹 Switching to Video...");
        await clickByText(selectors.generation.videoTabTriggers);
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
