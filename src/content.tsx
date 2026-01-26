import React from 'react';
import ReactDOM from 'react-dom/client';
import VideoResultOverlay from './components/overlay/VideoResultOverlay';
import './index.css'; // Reuse main styles or import specific overlay styles
import { getFormattedPrompt } from './utils/videoPromptTemplates';
import { uploadImageToWeb, fillPrompt, clickButton } from './utils/controls';

console.log('NetFlow AI Content Script Loaded');

// Create a container for our overlay
const containerId = 'netflow-ai-overlay-root';
let rootContainer = document.getElementById(containerId);

if (!rootContainer) {
    rootContainer = document.createElement('div');
    rootContainer.id = containerId;
    document.body.appendChild(rootContainer);
}

// Create a shadow root to isolate styles
const shadowRoot = rootContainer.attachShadow({ mode: 'open' });

// Inject styles into shadow DOM (This requires vite build process to handle css injection correctly, or we fetch standard css)
// For simplicity in this step, we will use inline styles or assume global css for now, 
// but in a production extension we would read chrome.runtime.getURL('assets/index.css') and append it.

const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = chrome.runtime.getURL('assets/index.css');
shadowRoot.appendChild(styleLink);

const renderRoot = ReactDOM.createRoot(shadowRoot);

const ContentScriptApp = () => {
    const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        const messageListener = (message: any, sender: any, sendResponse: any) => {
            if (message.type === 'SHOW_VIDEO_RESULT' && message.videoUrl) {
                console.log('Received video URL:', message.videoUrl);
                setVideoUrl(message.videoUrl);
            }

            if (message.type === 'INJECT_AUTOMATION_DATA') {
                console.log('Received automation data:', message);
                handleAutomation(message.payload);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);
        return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, []);

    const handleAutomation = async (data: any) => {
        const { productName, gender, emotion, imageBase64, personImageBase64 } = data;

        // 1. Generate Prompt
        const promptVars = {
            productName: productName || "Generic Product",
            genderText: gender === 'male' ? "Thai man" : "Thai woman",
            emotion: emotion || "Happy",
            sceneDescription: data.sceneDescription, // Optional
            movement: data.movement // Optional
        };

        const finalPrompt = getFormattedPrompt(promptVars);
        console.log("Generated Prompt:", finalPrompt);

        // 2. Fill Prompt into the textarea (assuming a generic textarea for now)
        // You might need to inspect the target site for the exact selector
        fillPrompt(finalPrompt, 'textarea[placeholder*="Describe"]');

        // 3. Image Handling Logic (Dual Image Strategy)
        let finalImageToUpload = imageBase64; // Default to product only

        if (imageBase64 && personImageBase64) {
            console.log("Both person and product images detected. Merging...");
            try {
                // Import dynamically to avoid loading canvas logic if not needed, 
                // but since it's a utility, static import is also fine if we moved it to top.
                // We'll trust the bundler or just do dynamic import here for safety.
                const { mergeImages } = await import('./utils/imageProcessing');
                finalImageToUpload = await mergeImages(personImageBase64, imageBase64, 'horizontal');
                console.log("Images merged successfully.");
            } catch (err) {
                console.error("Failed to merge images, falling back to product only:", err);
            }
        } else if (personImageBase64 && !imageBase64) {
            finalImageToUpload = personImageBase64;
        }

        // 4. Upload the final image (Merged or Single)
        if (finalImageToUpload) {
            // Assuming the input is the standard file input
            uploadImageToWeb(finalImageToUpload, 'input[type="file"]');
        }

        // 5. Click Generate (Selector needs to be verified on actual site)
        // clickButton('button:contains("Generate")'); 
    };

    if (!videoUrl) return null;

    return <VideoResultOverlay videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />;
};

renderRoot.render(<ContentScriptApp />);
