/**
 * Google Lab Automation Service - ULTIMATE EDITION
 * Capabilities: Deep Shadow DOM + Pointer Events + Multiple Click Strategies
 */

import { RemoteConfigService, AutomationSelectors } from './remoteConfig';

// --- Utilities ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- DEEP DOM SEARCH HELPER ---
const getAllElementsDeep = (root: Document | ShadowRoot | Element = document): Element[] => {
    const all: Element[] = [];
    try {
        const startNode = root === document ? document.body : root as Node;
        if (!startNode) return all;
        
        const walker = document.createTreeWalker(startNode, NodeFilter.SHOW_ELEMENT, null);

        while (walker.nextNode()) {
            const node = walker.currentNode as Element;
            all.push(node);
            if (node.shadowRoot) {
                all.push(...getAllElementsDeep(node.shadowRoot));
            }
        }
    } catch (e) {
        console.warn("Tree walker error:", e);
    }
    return all;
};

// --- ROBUST CLICK SIMULATION ---
const simulateRealClick = (element: HTMLElement): void => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const eventOptions = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: centerX,
        clientY: centerY,
        screenX: centerX,
        screenY: centerY,
        button: 0,
        buttons: 1
    };

    // Sequence of events that simulate real user interaction
    element.dispatchEvent(new PointerEvent('pointerdown', { ...eventOptions, pointerType: 'mouse' }));
    element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
    element.dispatchEvent(new PointerEvent('pointerup', { ...eventOptions, pointerType: 'mouse' }));
    element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
    element.dispatchEvent(new MouseEvent('click', eventOptions));
    
    // Also try native click
    element.click();
    
    // Focus for keyboard accessibility
    if (element.focus) element.focus();
};

// --- Click at Coordinates ---
const clickAtCoordinates = (x: number, y: number): boolean => {
    const el = document.elementFromPoint(x, y);
    if (el) {
        console.log(`🎯 Clicking at (${x}, ${y}) on <${el.tagName}>`);
        simulateRealClick(el as HTMLElement);
        return true;
    }
    return false;
};

// --- Deep Click by Text (ENHANCED) ---
const deepClickByText = async (searchText: string, clickParent: boolean = true): Promise<boolean> => {
    console.log(`🔍 Deep searching for text "${searchText}"...`);
    const all = getAllElementsDeep();
    const lowerSearch = searchText.toLowerCase();

    // Sort by specificity - prefer exact matches and smaller elements
    const candidates: { el: Element; score: number }[] = [];

    for (const el of all) {
        const text = (el.textContent?.trim() || '').toLowerCase();
        const label = (el.getAttribute('aria-label') || '').toLowerCase();
        const rect = el.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) continue;
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') continue;

        let score = 0;
        if (text === lowerSearch || label === lowerSearch) score = 100;
        else if (text.includes(lowerSearch) || label.includes(lowerSearch)) score = 50;
        
        if (score > 0) {
            // Prefer smaller, more specific elements
            score += Math.max(0, 100 - (rect.width * rect.height / 1000));
            candidates.push({ el, score });
        }
    }

    candidates.sort((a, b) => b.score - a.score);

    for (const { el } of candidates.slice(0, 3)) {
        const text = el.textContent?.substring(0, 30) || '';
        console.log(`✅ Found: <${el.tagName}> "${text}..."`);
        
        simulateRealClick(el as HTMLElement);
        
        // Also click parent chain (for cards/buttons that have click handlers on container)
        if (clickParent) {
            let parent = el.parentElement;
            for (let i = 0; i < 5 && parent; i++) {
                const pRect = parent.getBoundingClientRect();
                if (pRect.width > 0 && pRect.height > 0) {
                    simulateRealClick(parent as HTMLElement);
                }
                parent = parent.parentElement;
            }
        }
        
        return true;
    }
    return false;
};

// --- Upload Single Image with Aggressive Fallback ---
const uploadSingleImage = async (base64Image: string, imageIndex: number, selectors: AutomationSelectors): Promise<boolean> => {
    console.log(`📷 Uploading image ${imageIndex} (Deep mode)...`);

    const arr = base64Image.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const filename = imageIndex === 1 ? 'character.png' : 'product.png';
    const file = new File([u8arr], filename, { type: mime });

    const allInputs = getAllElementsDeep().filter(el => el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'file');
    console.log(`🔍 Found ${allInputs.length} hidden file inputs`);

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

    // Try clicking crop/save if it appears immediately
    if (injected) {
        await delay(1500);
        for (const trig of selectors.upload.cropSaveTriggers) {
            if (await deepClickByText(trig)) return true;
        }
    }

    // Fallback: Click Upload Button then retry
    if (!injected) {
        for (const trig of selectors.upload.uploadButtonTriggers) {
            if (await deepClickByText(trig)) break;
        }
        await delay(1000);
        // Retry input injection
        const inputsRetry = getAllElementsDeep().filter(el => el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'file');
        for (const input of inputsRetry) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            (input as HTMLInputElement).files = dataTransfer.files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            injected = true;
        }
    }

    await delay(1500);
    // Handle Crop/Save Dialog
    for (let i = 0; i < 5; i++) {
        let clicked = false;
        for (const trig of selectors.upload.cropSaveTriggers) {
            if (await deepClickByText(trig)) {
                clicked = true;
                break;
            }
        }
        if (clicked) break;
        await delay(500);
    }

    return injected;
};

// --- Check Workspace ---
const isInWorkspace = (selectors: AutomationSelectors): boolean => {
    const all = getAllElementsDeep();
    const pageText = document.body?.innerText?.toLowerCase() || '';
    
    // Check for workspace indicators
    for (const trigger of selectors.workspace.imageTabTriggers) {
        if (pageText.includes(trigger.toLowerCase())) {
            return true;
        }
    }
    
    // Also check for specific elements
    return all.some(el => {
        const txt = (el.textContent || '').trim().toLowerCase();
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
        return selectors.workspace.imageTabTriggers.some(t => txt === t.toLowerCase());
    });
};

// --- AGGRESSIVE NEW PROJECT CLICK ---
const clickNewProject = async (selectors: AutomationSelectors): Promise<boolean> => {
    console.log("🎯 Attempting to click 'New Project'...");
    
    // Strategy 1: Text-based deep search
    for (const trigger of selectors.dashboard.newProjectTriggers) {
        if (await deepClickByText(trigger, true)) {
            console.log(`✅ Strategy 1 (Text): Clicked "${trigger}"`);
            return true;
        }
    }
    
    // Strategy 2: Find clickable cards with "+" icon or "new" text
    const all = getAllElementsDeep();
    for (const el of all) {
        const text = (el.textContent || '').toLowerCase();
        const hasPlus = text.includes('+') || el.innerHTML?.includes('add') || el.innerHTML?.includes('plus');
        const hasNew = text.includes('new') || text.includes('ใหม่') || text.includes('สร้าง');
        
        if ((hasPlus && hasNew) || (hasPlus && text.length < 50)) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 50 && rect.height > 50) {
                console.log(`✅ Strategy 2 (Card): Found <${el.tagName}> with "+" and "new"`);
                simulateRealClick(el as HTMLElement);
                return true;
            }
        }
    }
    
    // Strategy 3: Find buttons/divs with role="button" that might be the new project card
    const clickables = all.filter(el => {
        const role = el.getAttribute('role');
        const tag = el.tagName;
        return tag === 'BUTTON' || role === 'button' || tag === 'A' || 
               (el.getAttribute('tabindex') && parseInt(el.getAttribute('tabindex') || '-1') >= 0);
    });
    
    for (const el of clickables) {
        const text = (el.textContent || '').toLowerCase();
        if (selectors.dashboard.newProjectTriggers.some(t => text.includes(t.toLowerCase()))) {
            console.log(`✅ Strategy 3 (Role): Found clickable with trigger text`);
            simulateRealClick(el as HTMLElement);
            return true;
        }
    }
    
    // Strategy 4: Coordinate-based fallback (center-bottom area where cards usually are)
    const positions = [
        { x: window.innerWidth * 0.25, y: window.innerHeight * 0.6 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.6 },
        { x: window.innerWidth * 0.25, y: window.innerHeight * 0.75 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.75 },
    ];
    
    for (const pos of positions) {
        const el = document.elementFromPoint(pos.x, pos.y);
        if (el) {
            const text = (el.textContent || '').toLowerCase();
            // Only click if element looks like it could be the new project card
            if (text.includes('new') || text.includes('ใหม่') || text.includes('+') || text.includes('โปรเจ็กต์')) {
                console.log(`✅ Strategy 4 (Coords): Clicking at (${pos.x}, ${pos.y})`);
                simulateRealClick(el as HTMLElement);
                return true;
            }
        }
    }
    
    console.warn("⚠️ All strategies failed to find 'New Project' button");
    return false;
};

const switchToImageTab = async (selectors: AutomationSelectors): Promise<boolean> => {
    for (const trig of selectors.workspace.imageTabTriggers) {
        if (await deepClickByText(trig)) return true;
    }
    return false;
};

const fillPromptAndGenerate = async (prompt: string, selectors: AutomationSelectors): Promise<boolean> => {
    const all = getAllElementsDeep();
    const textarea = all.find(el => el.tagName === 'TEXTAREA') as HTMLTextAreaElement;
    if (textarea) {
        textarea.value = prompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        await delay(500);

        const buttons = all.filter(el => el.tagName === 'BUTTON');
        for (const btn of buttons.reverse()) {
            if (btn.innerHTML.includes('<svg') && btn.clientWidth < 80) {
                (btn as HTMLElement).click();
                return true;
            }
        }
    }
    return false;
};

const waitForGenerationComplete = async (selectors: AutomationSelectors): Promise<boolean> => {
    const start = Date.now();
    while (Date.now() - start < 180000) {
        const bodyText = document.body.innerText;
        if (bodyText.includes('100%')) return true;

        for (const trig of selectors.generation.addToPromptTriggers) {
            if (await deepClickByText(trig) === true) return true;
        }
        await delay(2000);
    }
    // Final check
    const all = getAllElementsDeep();
    return all.some(el => {
        const txt = el.textContent || '';
        return selectors.generation.addToPromptTriggers.some(t => txt.includes(t));
    });
};

const clickOnGeneratedImage = async (): Promise<boolean> => {
    const all = getAllElementsDeep();
    const images = all.filter(el => el.tagName === 'IMG') as HTMLImageElement[];
    for (const img of images) {
        if (img.width > 200 && img.height > 200) {
            img.click();
            if (img.parentElement) img.parentElement.click();
            return true;
        }
    }
    return false;
};

const waitForVideoComplete = async (): Promise<string | null> => {
    const start = Date.now();
    while (Date.now() - start < 300000) {
        const all = getAllElementsDeep();
        const v = all.find(el => el.tagName === 'VIDEO') as HTMLVideoElement;
        if (v && v.src && v.src.length > 50) return v.src;
        await delay(5000);
    }
    return null;
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
    console.log("🚀 Starting Pipeline - ULTIMATE EDITION");
    console.log("📋 Config received:", { 
        hasCharacter: !!config.characterImage, 
        hasProduct: !!config.productImage,
        imagePrompt: config.imagePrompt?.substring(0, 50),
        videoPrompt: config.videoPrompt?.substring(0, 50)
    });

    try {
        // Initialize Config
        const configService = RemoteConfigService.getInstance();
        await configService.init();
        const selectors = configService.getSelectors();

        // ========== STEP 1: Navigate to Workspace ==========
        console.log("👀 Step 1: Checking current state...");
        
        let inWorkspace = isInWorkspace(selectors);
        console.log(`📍 Currently in workspace: ${inWorkspace}`);
        
        if (!inWorkspace) {
            console.log("🔄 Not in workspace. Starting 'New Project' click sequence...");
            
            // Try up to 10 times with increasing aggression
            for (let attempt = 1; attempt <= 10; attempt++) {
                console.log(`🎯 Attempt ${attempt}/10 to click 'New Project'...`);
                
                const clicked = await clickNewProject(selectors);
                
                if (clicked) {
                    console.log("✅ Click action completed. Waiting for navigation...");
                    await delay(3000);
                    
                    // Check if we're now in workspace
                    if (isInWorkspace(selectors)) {
                        console.log("✅ Successfully entered workspace!");
                        inWorkspace = true;
                        break;
                    } else {
                        console.log("⏳ Not in workspace yet, retrying...");
                    }
                } else {
                    console.log(`⚠️ Attempt ${attempt} failed. Waiting before retry...`);
                }
                
                await delay(1500);
            }
            
            // Final aggressive fallback - click anything that might work
            if (!isInWorkspace(selectors)) {
                console.log("🔥 Final fallback: Scanning entire page for clickable new project elements...");
                const all = getAllElementsDeep();
                for (const el of all) {
                    const text = (el.textContent || '').toLowerCase();
                    if (text.includes('โปรเจ็กต์') || text.includes('project') || text.includes('สร้าง')) {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 30 && rect.height > 30 && rect.width < 500) {
                            console.log(`🔥 Fallback clicking: <${el.tagName}> "${text.substring(0, 30)}"`);
                            simulateRealClick(el as HTMLElement);
                            await delay(2000);
                            if (isInWorkspace(selectors)) {
                                inWorkspace = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (!inWorkspace) {
            console.warn("⚠️ Could not confirm workspace entry after all attempts. Proceeding anyway...");
        }

        // ========== STEP 2: Switch to Image Tab ==========
        console.log("📸 Step 2: Switching to Image tab...");
        await switchToImageTab(selectors);
        await delay(2000);

        // ========== STEP 3: Upload Images ==========
        console.log("📤 Step 3: Uploading images...");
        
        if (config.characterImage) {
            console.log("📷 Uploading character image...");
            await uploadSingleImage(config.characterImage, 1, selectors);
            await delay(2000);
        }
        
        if (config.productImage) {
            console.log("📷 Uploading product image...");
            await uploadSingleImage(config.productImage, 2, selectors);
            await delay(2000);
        }

        // ========== STEP 4: Generate Image ==========
        console.log("🎨 Step 4: Generating image...");
        await fillPromptAndGenerate(config.imagePrompt, selectors);

        console.log("⏳ Waiting for image generation to complete...");
        const genSuccess = await waitForGenerationComplete(selectors);
        if (!genSuccess) {
            console.warn("⚠️ Image generation may have timed out");
        }

        // ========== STEP 5: Select Generated Image ==========
        console.log("🖼️ Step 5: Selecting generated image...");
        await clickOnGeneratedImage();
        await delay(2000);

        // ========== STEP 6: Add to Video ==========
        console.log("🎬 Step 6: Adding image to video prompt...");
        for (const trig of selectors.generation.addToPromptTriggers) {
            if (await deepClickByText(trig)) break;
        }
        await delay(1500);

        // ========== STEP 7: Switch to Video Tab ==========
        console.log("📹 Step 7: Switching to video tab...");
        for (const trig of selectors.generation.videoTabTriggers) {
            if (await deepClickByText(trig)) break;
        }
        await delay(2000);

        // ========== STEP 8: Generate Video ==========
        console.log("🎥 Step 8: Generating video...");
        await fillPromptAndGenerate(config.videoPrompt, selectors);

        console.log("⏳ Waiting for video generation (this may take 2-5 minutes)...");
        const videoUrl = await waitForVideoComplete();
        
        if (!videoUrl) {
            return { success: false, error: "Video generation timed out" };
        }

        console.log("🎉 Pipeline completed successfully!");
        return { success: true, videoUrl };

    } catch (error: any) {
        console.error("❌ Pipeline Error:", error);
        return { success: false, error: error.message || "Unknown error" };
    }
};
