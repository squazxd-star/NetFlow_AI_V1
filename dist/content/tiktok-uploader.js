/**
 * TikTok Uploader - Content Script
 * Automates TikTok Studio for video upload
 * 
 * Target: https://www.tiktok.com/tiktokstudio/*
 */

console.log("[TikTok Uploader] Content script loaded");

// Wait for element with timeout
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

// Simulate file drop for upload
async function uploadVideo(videoBlob, filename = 'netflow_video.mp4') {
    console.log("[TikTok] Starting video upload...");

    try {
        // Find the file input or drop zone
        const fileInput = await waitForElement('input[type="file"]', 10000);

        // Create a File object from the blob
        const file = new File([videoBlob], filename, { type: 'video/mp4' });

        // Create DataTransfer to simulate file selection
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));

        console.log("[TikTok] Video uploaded successfully");
        return true;

    } catch (error) {
        console.error("[TikTok] Upload failed:", error);
        throw error;
    }
}

// Fill caption with hashtags
async function fillCaption(caption, hashtags = []) {
    console.log("[TikTok] Filling caption...");

    try {
        // Find caption editor (usually contenteditable)
        const captionEditor = await waitForElement('[contenteditable="true"]', 10000);

        captionEditor.focus();

        // Clear and type caption
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, caption);

        // Add hashtags one by one
        for (const tag of hashtags) {
            await new Promise(r => setTimeout(r, 500));

            // Type the hashtag
            document.execCommand('insertText', false, ` #${tag}`);

            // Wait for dropdown to appear
            await new Promise(r => setTimeout(r, 800));

            // Try to click the first suggestion
            const dropdown = document.querySelector('.mention-list-popover, [class*="hashtag-dropdown"], [class*="suggestion"]');
            if (dropdown) {
                const firstItem = dropdown.querySelector('li, [role="option"]');
                if (firstItem) {
                    firstItem.click();
                    console.log("[TikTok] Hashtag confirmed:", tag);
                }
            }
        }

        console.log("[TikTok] Caption filled successfully");
        return true;

    } catch (error) {
        console.error("[TikTok] Caption fill failed:", error);
        throw error;
    }
}

// Click the post button
async function clickPost() {
    console.log("[TikTok] Looking for post button...");

    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('post') || text.includes('โพสต์') || text.includes('publish')) {
            console.log("[TikTok] Found post button:", btn.textContent);
            btn.click();
            return true;
        }
    }

    throw new Error("Could not find post button");
}

// Listen for commands from service worker
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("[TikTok] Received message:", message.type);

    switch (message.type) {
        case "UPLOAD_VIDEO":
            try {
                await uploadVideo(message.videoBlob, message.filename);
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
            break;

        case "FILL_CAPTION":
            try {
                await fillCaption(message.caption, message.hashtags);
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
            break;

        case "CLICK_POST":
            try {
                await clickPost();
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
            break;
    }

    return true;
});

// Notify service worker that TikTok page is ready
chrome.runtime.sendMessage({ type: "TIKTOK_READY" });
