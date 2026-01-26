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
        const messageListener = async (message: any, sender: any, sendResponse: any) => {
            if (message.type === 'SHOW_VIDEO_RESULT' && message.videoUrl) {
                console.log('Received video URL:', message.videoUrl);
                setVideoUrl(message.videoUrl);
            }

            if (message.type === 'INJECT_AUTOMATION_DATA') {
                console.log('Received automation data:', message);
                handleAutomation(message.payload);
            }

            // NEW: 2-Stage Pipeline Handler
            if (message.type === 'TWO_STAGE_PIPELINE') {
                console.log('🚀 Starting 2-Stage Pipeline:', message);
                const { runTwoStagePipeline } = await import('./utils/googleLabAutomation');
                const { getFormattedPrompt } = await import('./utils/videoPromptTemplates');

                const { characterImage, productImage, productName, gender, emotion } = message.payload;

                // Generate video prompt
                const videoPrompt = getFormattedPrompt({
                    productName: productName || "Product",
                    genderText: gender === 'male' ? "Thai man" : "Thai woman",
                    emotion: emotion || "Happy"
                });

                // Image prompt - simple command only (detailed prompt goes to video stage)
                const imagePrompt = `create a prompt`;

                const result = await runTwoStagePipeline({
                    characterImage,
                    productImage,
                    imagePrompt,
                    videoPrompt
                });

                console.log("🎬 Pipeline Result:", result);

                // Show video result in overlay if successful
                if (result.success && result.videoUrl) {
                    console.log("✅ Video ready! Showing in overlay...");
                    setVideoUrl(result.videoUrl);

                    // Also notify the extension popup
                    chrome.runtime.sendMessage({
                        type: 'VIDEO_GENERATION_COMPLETE',
                        videoUrl: result.videoUrl,
                        generatedImageUrl: result.generatedImageUrl
                    });
                } else {
                    console.error("❌ Pipeline failed:", result.error);
                    // Send error back to extension
                    chrome.runtime.sendMessage({
                        type: 'PIPELINE_ERROR',
                        error: result.error
                    });
                }
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);
        return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, []);

    const handleAutomation = async (data: any) => {
        const { productName, gender, emotion, imageBase64, personImageBase64 } = data;

        console.log("🚀 Starting Automation Sequence...");

        // 1. Prepare Image (Merge if needed)
        // We do this FIRST so the image is ready effectively 'before' the prompt logic interacts with the page UI
        let finalImageToUpload = imageBase64;

        if (imageBase64 && personImageBase64) {
            console.log("🖼️ Merging Person + Product images...");
            try {
                const { mergeImages } = await import('./utils/imageProcessing');
                // Ensure Person is on LEFT (as per prompt instructions)
                finalImageToUpload = await mergeImages(personImageBase64, imageBase64, 'horizontal');
            } catch (err) {
                console.error("❌ Merge failed:", err);
            }
        } else if (personImageBase64 && !imageBase64) {
            finalImageToUpload = personImageBase64;
        }

        // 2. Upload Image to Veo (PRIORITY ACTION)
        if (finalImageToUpload) {
            console.log("⬆️ Uploading Image to Input...");
            const success = uploadImageToWeb(finalImageToUpload, 'input[type="file"]');
            if (success) {
                console.log("✅ Image Upload Triggered");
                // Add a small delay to let Veo process the image thumbnail
                await new Promise(r => setTimeout(r, 1000));
            } else {
                console.warn("⚠️ Image Upload Failed (Input not found?)");
            }
        }

        // 3. Generate & Fill Prompt
        // Now that image is set, we fill the text.
        const promptVars = {
            productName: productName || "Generic Product",
            genderText: gender === 'male' ? "Thai man" : "Thai woman",
            emotion: emotion || "Happy",
            sceneDescription: data.sceneDescription,
            movement: data.movement,
            style: data.style // Pass style from UI if available
        };

        const finalPrompt = getFormattedPrompt(promptVars);
        console.log("📝 Generated Prompt:", finalPrompt);

        fillPrompt(finalPrompt, 'textarea[placeholder*="Describe"]');

        console.log("✨ Automation Sequence Complete. Ready for User to clicking Generate.");
    };

    if (!videoUrl) return null;

    return <VideoResultOverlay videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />;
};

renderRoot.render(<ContentScriptApp />);
