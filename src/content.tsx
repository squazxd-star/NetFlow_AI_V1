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

        // 3. Upload Reference Image (Product)
        if (imageBase64) {
            // Assuming the input is the standard file input
            uploadImageToWeb(imageBase64, 'input[type="file"]');
        }

        // 4. Upload Person/Character Image (if separate input exists)
        if (personImageBase64) {
            // If the site has a second input for character ref, use a specific selector
            // For now, assuming it might be the same or a different one. 
            // If it's the same, we might need to wait or handle multiple file uploads.
            // Let's assume a hypothetical second input or just log it for now.
            console.log("Person image injection requested (selector needs verification)");
            // uploadImageToWeb(personImageBase64, 'input[name="character_ref"]'); 
        }

        // 5. Click Generate (Selector needs to be verified on actual site)
        // clickButton('button:contains("Generate")'); 
    };

    if (!videoUrl) return null;

    return <VideoResultOverlay videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />;
};

renderRoot.render(<ContentScriptApp />);
