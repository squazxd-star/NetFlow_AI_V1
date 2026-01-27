/**
 * Google Lab Automation Service - SHADOW DOM EDITION
 * Capabilities: Deep Shadow Root Traversal + Recursive Text Search
 */

import { RemoteConfigService, AutomationSelectors } from './remoteConfig';

// --- Utilities ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- DEEP DOM SEARCH HELPER ---
const getAllElementsDeep = (root: Document | ShadowRoot | Element = document): Element[] => {
    const all: Element[] = [];
    const walker = document.createTreeWalker(
        root === document ? document.body : root as Node,
        NodeFilter.SHOW_ELEMENT,
        null
    );

    while (walker.nextNode()) {
        const node = walker.currentNode as Element;
        all.push(node);
        if (node.shadowRoot) {
            all.push(...getAllElementsDeep(node.shadowRoot));
        }
    }
    return all;
};

// --- Deep Click by Text ---
const deepClickByText = async (searchText: string): Promise<boolean> => {
    console.log(`🔍 Deep searching for text "${searchText}"...`);
    const all = getAllElementsDeep();

    for (const el of all) {
        const text = el.textContent?.trim() || '';
        const label = el.getAttribute('aria-label') || '';

        if (text.includes(searchText) || label.includes(searchText)) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                console.log(`✅ Found deep element: <${el.tagName}> "${text.substring(0, 20)}..."`);
                (el as HTMLElement).click();
                if (el.parentElement) el.parentElement.click();
                return true;
            }
        }
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
    return all.some(el => {
        const txt = el.textContent || '';
        return selectors.workspace.imageTabTriggers.includes(txt) && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
    });
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
    console.log("🚀 Starting Pipeline - REMOTE SELECTOR EDITION");

    try {
        // Initialize Config
        const configService = RemoteConfigService.getInstance();
        await configService.init(); // Uses default or previously cached
        const selectors = configService.getSelectors();

        console.log("👀 Deep Checking State...");

        let inWorkspace = isInWorkspace(selectors);
        if (!inWorkspace) {
            console.log("ℹ️ Not in workspace. Deep searching for 'New Project'...");

            for (let i = 0; i < 15; i++) {
                let clicked = false;
                for (const kw of selectors.dashboard.newProjectTriggers) {
                    if (await deepClickByText(kw)) {
                        clicked = true;
                        break;
                    }
                }

                if (clicked) {
                    console.log("✅ Deep Click sent. Waiting...");
                    await delay(3000);
                    if (isInWorkspace(selectors)) {
                        console.log("✅ Entered Workspace!");
                        inWorkspace = true;
                        break;
                    }
                }

                if (!clicked && i > 5) {
                    console.log("⚠️ Low confidence. Trying fallback coordinates...");
                    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.75);
                    if (el) (el as HTMLElement).click();
                }

                await delay(1000);
            }
        }

        if (!inWorkspace) {
            console.warn("⚠️ Could not confirm workspace entry. Proceeding anyway...");
        }

        await switchToImageTab(selectors);
        await delay(1500);

        await uploadSingleImage(config.characterImage, 1, selectors);
        await delay(1500);
        await uploadSingleImage(config.productImage, 2, selectors);
        await delay(1500);

        console.log("📝 Generating Image...");
        await fillPromptAndGenerate(config.imagePrompt, selectors);

        const genSuccess = await waitForGenerationComplete(selectors);
        if (!genSuccess) throw new Error("Gen Timeout");

        await clickOnGeneratedImage();
        await delay(1500);

        // Transition to Video
        for (const trig of selectors.generation.addToPromptTriggers) {
            await deepClickByText(trig);
        }
        await delay(1000);

        let switchedToVideo = false;
        for (const trig of selectors.generation.videoTabTriggers) {
            if (await deepClickByText(trig)) {
                switchedToVideo = true;
                break;
            }
        }
        await delay(2000);

        console.log("📝 Generating Video...");
        await fillPromptAndGenerate(config.videoPrompt, selectors);

        const videoUrl = await waitForVideoComplete();
        if (!videoUrl) throw new Error("Video Timeout");

        return { success: true, videoUrl };

    } catch (error: any) {
        console.error("Deep Pipeline Error:", error);
        return { success: false, error: error.message };
    }
};
