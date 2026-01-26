/**
 * VideoFX Injector - Content Script
 * Automates Google VideoFX for free video generation
 * 
 * Target: https://labs.google/fx/tools/video-fx
 */

console.log("[VideoFX Injector] Content script loaded");

// Notify service worker that page is ready
function notifyReady() {
    chrome.runtime.sendMessage({ type: "VIDEOFX_READY" });
}

// Wait for element to appear with timeout
function waitForElement(selector, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const check = () => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            if (Date.now() - startTime > timeout) {
                reject(new Error(`Timeout waiting for: ${selector}`));
                return;
            }

            requestAnimationFrame(check);
        };

        check();
    });
}

// Wait for page to fully load
function waitForPageLoad() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            setTimeout(resolve, 2000); // Extra delay for React/SPA
        } else {
            window.addEventListener('load', () => {
                setTimeout(resolve, 2000);
            });
        }
    });
}

// Simulate human-like typing
function typeText(element, text) {
    element.focus();

    // Clear existing content
    element.value = '';
    element.textContent = '';

    // Use execCommand for contenteditable elements
    if (element.contentEditable === 'true') {
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, text);
    } else {
        // For regular inputs/textareas
        element.value = text;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

// Find the prompt textarea (try multiple selectors)
async function findPromptInput() {
    const selectors = [
        'textarea[placeholder*="prompt"]',
        'textarea[placeholder*="Prompt"]',
        'textarea[placeholder*="video"]',
        'textarea',
        '[contenteditable="true"]',
        'input[type="text"]'
    ];

    for (const selector of selectors) {
        try {
            const element = await waitForElement(selector, 5000);
            if (element) {
                console.log("[VideoFX] Found input with selector:", selector);
                return element;
            }
        } catch (e) {
            // Try next selector
        }
    }

    throw new Error("Could not find prompt input");
}

// Find the generate button
async function findGenerateButton() {
    const selectors = [
        'button[aria-label*="Generate"]',
        'button[aria-label*="generate"]',
        'button:contains("Generate")',
        '[data-testid="generate-button"]',
        'button[type="submit"]'
    ];

    // Also try by text content
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('generate') || text.includes('create') || text.includes('สร้าง')) {
            console.log("[VideoFX] Found button by text:", btn.textContent);
            return btn;
        }
    }

    for (const selector of selectors) {
        try {
            const element = await waitForElement(selector, 5000);
            if (element) {
                console.log("[VideoFX] Found button with selector:", selector);
                return element;
            }
        } catch (e) {
            // Try next selector
        }
    }

    throw new Error("Could not find generate button");
}

// Helper to check if element is actually visible to user
function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        el.offsetWidth > 0 &&
        el.offsetHeight > 0 &&
        el.offsetParent !== null;
}

// Help bypass splash screens, overlays and marketing banners
async function bypassSplashScreens() {
    console.log("[VideoFX] Checking for splash screens or overlays...");

    // 1. Try to dismiss marketing overlays (e.g. Nano Banana Pro)
    // We look for anything that looks like a Close button
    const dismissSelectors = [
        'button[aria-label*="Close"]',
        'button[aria-label*="Dismiss"]',
        'button[aria-label*="ปิด"]',
        'button[aria-label*="x"]',
        '.close-button',
        '.dismiss-button',
        '[class*="close"]',
        '[class*="dismiss"]'
    ];

    for (let i = 0; i < 3; i++) { // Try up to 3 times to clear overlays
        let found = false;
        for (const selector of dismissSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (isVisible(el)) {
                    console.log("[VideoFX] Dismissing visible overlay/banner:", selector);
                    el.click();
                    found = true;
                    await new Promise(r => setTimeout(r, 800));
                }
            }
        }
        if (!found) break;
    }

    // 2. Try to click "New Project" button if on landing page
    // We only do this if we don't see the editor elements yet
    const isAlreadyInEditor = isVisible(document.querySelector('textarea[placeholder*="Describe"]')) ||
        isVisible(document.querySelector('textarea[placeholder*="prompt"]'));

    if (isAlreadyInEditor) {
        console.log("[VideoFX] Already in editor, skipping Landing Page check.");
        return;
    }

    console.log("[VideoFX] Searching for New Project button...");
    const buttons = document.querySelectorAll('button, [role="button"]');
    for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        const aria = btn.getAttribute('aria-label')?.toLowerCase() || '';
        if (text.includes('new project') || text.includes('โปรเจกต์ใหม่') ||
            aria.includes('new project') || aria.includes('โปรเจกต์ใหม่') ||
            text === '+') {

            if (isVisible(btn)) {
                console.log("[VideoFX] Clicking New Project button:", btn.textContent || aria);
                btn.click();
                await new Promise(r => setTimeout(r, 3000)); // Wait for editor to load
                return;
            }
        }
    }
}

// Find the prompt textarea (try multiple selectors)
async function findPromptInput() {
    console.log("[VideoFX] Searching for prompt input...");
    const selectors = [
        'textarea[placeholder*="Describe"]', // Most specific for Veo editor
        'textarea[placeholder*="describe"]',
        'textarea[placeholder*="prompt"]',
        'textarea[placeholder*="Prompt"]',
        'textarea[placeholder*="video"]',
        'textarea',
        '[contenteditable="true"]'
    ];

    for (const selector of selectors) {
        try {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (isVisible(el)) {
                    // Check if it's the BIG textarea, not a small search box
                    if (el.tagName === 'TEXTAREA' || el.offsetHeight > 40) {
                        console.log("[VideoFX] Found visible input with selector:", selector);
                        return el;
                    }
                }
            }
        } catch (e) { }
    }

    throw new Error("Could not find prompt input (Ensure you are in the Editor)");
}

// Find the generate button
async function findGenerateButton() {
    console.log("[VideoFX] Searching for generate button...");
    const selectors = [
        'button[aria-label*="Generate"]',
        'button[aria-label*="generate"]',
        'button[aria-label*="สร้าง"]',
        '[data-testid*="generate"]',
        'button[type="submit"]'
    ];

    // Priority 1: Semantic button with "Generate" text/label
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
            if (isVisible(el)) {
                console.log("[VideoFX] Found visible button with selector:", selector);
                return el;
            }
        }
    }

    // Priority 2: Any visible button containing keywords
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('generate') || text.includes('create') || text.includes('สร้าง')) {
            if (isVisible(btn)) {
                console.log("[VideoFX] Found visible button by text:", btn.textContent);
                return btn;
            }
        }
    }

    throw new Error("Could not find generate button (Is the prompt too short or invalid?)");
}

// Watch for video element to appear
async function waitForVideo() {
    console.log("[VideoFX] Waiting for video to generate...");

    const maxWait = 5 * 60 * 1000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
        // Look for video element
        const video = document.querySelector('video[src]');
        if (video && video.src && !video.src.startsWith('blob:')) {
            console.log("[VideoFX] Video found with source URL:", video.src);
            return video.src;
        }

        // Look for download link (often the most reliable way to get URL)
        const downloadBtn = document.querySelector('a[download], button[aria-label*="download"], button[aria-label*="Download"]');
        if (downloadBtn) {
            const href = downloadBtn.href || downloadBtn.getAttribute('data-url');
            if (href && !href.startsWith('blob:')) {
                console.log("[VideoFX] Download link found:", href);
                return href;
            }
        }

        // If only blob is found, try to capture it (though we prefer direct URLs for TikTok)
        const blobVideo = document.querySelector('video[src^="blob:"]');
        if (blobVideo && blobVideo.src) {
            // We'll let it wait a bit more to see if a real URL appears, 
            // but if we hit 4 mins, we take the blob.
            if (Date.now() - startTime > 4 * 60 * 1000) {
                console.log("[VideoFX] Taking blob source as last resort:", blobVideo.src);
                return blobVideo.src;
            }
        }

        // Check for error messages on page
        const errorElement = document.querySelector('[class*="error"], [class*="Error"]');
        if (errorElement && isVisible(errorElement) && errorElement.textContent?.length > 10) {
            throw new Error("VideoFX Cloud Error: " + errorElement.textContent);
        }

        await new Promise(r => setTimeout(r, 4000));
    }

    throw new Error("Video generation timed out (Check your Google account/credits)");
}

// Main automation flow
async function runAutomation(prompt) {
    try {
        console.log("[VideoFX] Starting automation with prompt:", prompt);

        // Step 0: Ensure we are in the editor and clear of overlays
        await bypassSplashScreens();

        // Step 1: Find and fill prompt
        const input = await findPromptInput();
        typeText(input, prompt);
        console.log("[VideoFX] Prompt entered");

        await new Promise(r => setTimeout(r, 1500));

        // Step 2: Click generate
        const generateBtn = await findGenerateButton();
        generateBtn.click();
        console.log("[VideoFX] Generate button clicked");

        // Step 3: Wait for video
        const videoUrl = await waitForVideo();
        console.log("[VideoFX] Video success!");

        // Step 4: Notify service worker
        chrome.runtime.sendMessage({
            type: "VIDEO_GENERATED",
            videoUrl: videoUrl
        });

    } catch (error) {
        console.error("[VideoFX] Automation error:", error);
        chrome.runtime.sendMessage({
            type: "GENERATION_ERROR",
            error: error.message
        });
    }
}

// Listen for commands from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[VideoFX] Received message:", message.type);

    if (message.type === "INJECT_PROMPT") {
        runAutomation(message.prompt);
        sendResponse({ success: true });
    }

    return true;
});

// Initialize
async function init() {
    await waitForPageLoad();
    console.log("[VideoFX] Page loaded, notifying service worker");
    notifyReady();
}

init();
