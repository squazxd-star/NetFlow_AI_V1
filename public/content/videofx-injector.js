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

// Enhanced visibility check that considers more edge cases
function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}

// Highlight element for debugging
function debugHighlight(el, color = 'red') {
    if (!el) return;
    el.style.border = `3px solid ${color}`;
    el.style.boxShadow = `0 0 10px ${color}`;
}

// Aggressive bypass using scroll, wait, and coordinate-based clicking
async function bypassSplashScreens() {
    console.log("[VideoFX] CRITICAL: Starting aggressive bypass v2...");

    // STEP 1: Wait for page to fully stabilize (SPA takes time to render)
    console.log("[VideoFX] Waiting 5 seconds for page to fully render...");
    await new Promise(r => setTimeout(r, 5000));

    // STEP 2: Scroll down to reveal the "New Project" button (it's hidden below banner)
    window.scrollTo(0, 400);
    console.log("[VideoFX] Scrolled down to reveal buttons...");
    await new Promise(r => setTimeout(r, 1000));

    // STEP 3: Try to find and click X button on the Nano Banana banner
    const allButtons = document.querySelectorAll('button, [role="button"]');
    for (const btn of allButtons) {
        const text = btn.textContent?.trim() || '';
        const ariaLabel = btn.getAttribute('aria-label') || '';

        // Close button on banner
        if (text === 'X' || text === '×' || ariaLabel.toLowerCase().includes('close') || ariaLabel.toLowerCase().includes('dismiss')) {
            if (isVisible(btn)) {
                console.log("[VideoFX] Found close button, clicking:", text || ariaLabel);
                debugHighlight(btn, 'yellow');
                btn.click();
                await new Promise(r => setTimeout(r, 1500));
            }
        }
    }

    // STEP 4: Look for anything containing "โปรเจกต์ใหม่" or "New project" text
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
        if (el.children.length > 5) continue; // Skip complex containers

        const text = el.textContent?.trim().toLowerCase() || '';
        if (text.includes('โปรเจกต์ใหม่') || text.includes('new project') || text === '+' || text === '+ โปรเจกต์ใหม่') {
            if (isVisible(el) && el.offsetHeight < 200) { // Avoid clicking the whole page
                console.log("[VideoFX] Found 'New Project' element:", el.textContent?.trim());
                debugHighlight(el, 'lime');

                // Try clicking directly
                el.click();
                await new Promise(r => setTimeout(r, 2000));

                // Check if we entered editor
                if (document.querySelector('textarea[placeholder]')) {
                    console.log("[VideoFX] Successfully entered editor!");
                    return;
                }

                // If click didn't work, try dispatching events manually
                el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                await new Promise(r => setTimeout(r, 2000));

                if (document.querySelector('textarea[placeholder]')) {
                    console.log("[VideoFX] Entered editor after forced click!");
                    return;
                }
            }
        }
    }

    // STEP 5: FALLBACK - Click at center-bottom of visible area (where the button appears)
    console.log("[VideoFX] FALLBACK: Attempting coordinate-based click...");
    const centerX = window.innerWidth / 2;
    const bottomY = window.innerHeight - 150; // Near bottom of visible area

    const elementAtCenter = document.elementFromPoint(centerX, bottomY);
    if (elementAtCenter) {
        console.log("[VideoFX] Found element at center-bottom:", elementAtCenter.tagName, elementAtCenter.textContent?.substring(0, 30));
        debugHighlight(elementAtCenter, 'orange');
        elementAtCenter.click();
        await new Promise(r => setTimeout(r, 2000));
    }
}

// Find the prompt textarea with high-level retry and multiple strategies
async function findPromptInput() {
    console.log("[VideoFX] Searching for target input area...");

    for (let attempt = 0; attempt < 10; attempt++) {
        // Strategy A: Direct selectors
        const selectors = [
            'textarea[placeholder*="Describe"]',
            'textarea[placeholder*="describe"]',
            'textarea[placeholder*="Prompt"]',
            'textarea',
            '[contenteditable="true"]'
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (isVisible(el) && el.offsetHeight > 50) {
                console.log("[VideoFX] Found input via Selector:", sel);
                debugHighlight(el, 'blue');
                return el;
            }
        }

        // Strategy B: XPath search for placeholder text
        const xpathQuery = "//*[contains(@placeholder, 'Describe') or contains(@placeholder, 'video')]";
        const res = document.evaluate(xpathQuery, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (res.singleNodeValue && isVisible(res.singleNodeValue)) {
            console.log("[VideoFX] Found input via XPath Strategy");
            debugHighlight(res.singleNodeValue, 'blue');
            return res.singleNodeValue;
        }

        // Strategy C: If we still can't find it, maybe we need to click "New Project" again?
        if (attempt === 3 || attempt === 7) {
            console.log("[VideoFX] Still not in editor, retrying landing page bypass...");
            await bypassSplashScreens();
        }

        await new Promise(r => setTimeout(r, 1500));
    }

    throw new Error("Unable to enter Editor mode. Please manually click '+ New Project' and I will take over.");
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
