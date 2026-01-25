/**
 * NetflowAI Service Worker (Background Script)
 * Manages state machine for video generation workflow
 */

// State machine for tracking workflow
let workflowState = {
    isRunning: false,
    currentStep: null,
    prompt: null,
    videoUrl: null,
    error: null
};

// Listen for messages from Side Panel and Content Scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[ServiceWorker] Received message:", message.type);

    switch (message.type) {
        case "START_VIDEO_GENERATION":
            handleStartVideoGeneration(message.payload);
            sendResponse({ success: true, message: "Video generation started" });
            break;

        case "VIDEOFX_READY":
            console.log("[ServiceWorker] VideoFX page is ready");
            // Send prompt to content script
            if (workflowState.prompt) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: "INJECT_PROMPT",
                    prompt: workflowState.prompt
                });
            }
            sendResponse({ success: true });
            break;

        case "VIDEO_GENERATED":
            console.log("[ServiceWorker] Video generated:", message.videoUrl);
            workflowState.videoUrl = message.videoUrl;
            workflowState.currentStep = "completed";
            workflowState.isRunning = false;

            // Notify Side Panel
            chrome.runtime.sendMessage({
                type: "VIDEO_GENERATION_COMPLETE",
                videoUrl: message.videoUrl
            }).catch(() => {
                // Side panel might not be open
            });

            // Close the VideoFX tab
            if (sender.tab) {
                chrome.tabs.remove(sender.tab.id);
            }
            sendResponse({ success: true });
            break;

        case "GENERATION_ERROR":
            console.error("[ServiceWorker] Generation error:", message.error);
            workflowState.error = message.error;
            workflowState.isRunning = false;

            chrome.runtime.sendMessage({
                type: "VIDEO_GENERATION_ERROR",
                error: message.error
            }).catch(() => { });
            sendResponse({ success: false });
            break;

        case "GET_WORKFLOW_STATE":
            sendResponse(workflowState);
            break;

        default:
            sendResponse({ success: false, message: "Unknown message type" });
    }

    return true; // Keep message channel open for async response
});

// Handle video generation request from Side Panel
async function handleStartVideoGeneration(payload) {
    console.log("[ServiceWorker] Starting video generation with prompt:", payload.prompt);

    workflowState = {
        isRunning: true,
        currentStep: "opening_videofx",
        prompt: payload.prompt,
        videoUrl: null,
        error: null
    };

    try {
        // Open Google VideoFX in a new tab
        const tab = await chrome.tabs.create({
            url: "https://labs.google/fx/tools/video-fx",
            active: true
        });

        console.log("[ServiceWorker] Opened VideoFX tab:", tab.id);
        workflowState.currentStep = "waiting_for_page";

    } catch (error) {
        console.error("[ServiceWorker] Failed to open VideoFX:", error);
        workflowState.error = error.message;
        workflowState.isRunning = false;
    }
}

// Handle extension icon click - open side panel
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
});

console.log("[ServiceWorker] NetflowAI Service Worker initialized");
