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

// Help bypass splash screens, overlays and marketing banners
async function bypassSplashScreens() {
    console.log("[VideoFX] Checking for splash screens or overlays...");

    // 1. Try to dismiss marketing overlays (e.g. Nano Banana Pro)
    const dismissSelectors = [
        'button[aria-label*="Close"]',
        'button[aria-label*="Dismiss"]',
        'button[aria-label*="ปิด"]',
        '.close-button',
        '.dismiss-button',
        '[class*="close"]'
    ];

    for (const selector of dismissSelectors) {
        try {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                if (el.offsetParent !== null) { // Check if visible
                    console.log("[VideoFX] Dismissing overlay:", selector);
                    el.click();
                    await new Promise(r => setTimeout(r, 500));
                }
            }
        } catch (e) { }
    }

    // 2. Try to click "New Project" button if on landing page
    const newProjectSelectors = [
        'button[aria-label*="New project"]',
        'button[aria-label*="โปรเจกต์ใหม่"]',
        'button:contains("New project")',
        'button:contains("โปรเจกต์ใหม่")',
        '[data-testid*="new-project"]'
    ];

    // Also search by text content for "New project" or "โปรเจกต์ใหม่"
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('new project') || text.includes('โปรเจกต์ใหม่')) {
            if (btn.offsetParent !== null) {
                console.log("[VideoFX] Clicking New Project button by text:", btn.textContent);
                btn.click();
                await new Promise(r => setTimeout(r, 2000)); // Wait for editor to load
                return;
            }
        }
    }

    for (const selector of newProjectSelectors) {
        try {
            const btn = document.querySelector(selector);
            if (btn && btn.offsetParent !== null) {
                console.log("[VideoFX] Clicking New Project button:", selector);
                btn.click();
                await new Promise(r => setTimeout(r, 2000));
                return;
            }
        } catch (e) { }
    }
}

// Watch for video element to appear
async function waitForVideo() {
    console.log("[VideoFX] Waiting for video to generate...");

    // This could take a while (1-5 minutes)
    const maxWait = 5 * 60 * 1000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
        // Look for video element
        const video = document.querySelector('video[src]');
        if (video && video.src) {
            console.log("[VideoFX] Video found:", video.src);
            return video.src;
        }

        // Look for download button
        const downloadBtn = document.querySelector('a[download], button[aria-label*="download"], button[aria-label*="Download"]');
        if (downloadBtn) {
            const href = downloadBtn.href || downloadBtn.getAttribute('data-url');
            if (href) {
                console.log("[VideoFX] Download link found:", href);
                return href;
            }
        }

        // Check for error
        const errorElement = document.querySelector('[class*="error"], [class*="Error"]');
        if (errorElement && errorElement.textContent?.length > 0) {
            throw new Error("VideoFX Error: " + errorElement.textContent);
        }

        await new Promise(r => setTimeout(r, 3000)); // Check every 3 seconds
    }

    throw new Error("Video generation timed out");
}

// Main automation flow
async function runAutomation(prompt) {
    try {
        console.log("[VideoFX] Starting automation with prompt:", prompt);

        // Step 0: Bypass splash screens and enter editor
        await bypassSplashScreens();

        // Step 1: Find and fill prompt
        const input = await findPromptInput();
        typeText(input, prompt);
        console.log("[VideoFX] Prompt entered");

        await new Promise(r => setTimeout(r, 1000));

        // Step 2: Click generate
        const generateBtn = await findGenerateButton();
        generateBtn.click();
        console.log("[VideoFX] Generate button clicked");

        // Step 3: Wait for video
        const videoUrl = await waitForVideo();
        console.log("[VideoFX] Video URL obtained:", videoUrl);

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
