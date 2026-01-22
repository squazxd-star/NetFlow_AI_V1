import React from 'react';
import ReactDOM from 'react-dom/client';
import VideoResultOverlay from './components/overlay/VideoResultOverlay';
import './index.css'; // Reuse main styles or import specific overlay styles

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
        };

        chrome.runtime.onMessage.addListener(messageListener);
        return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, []);

    if (!videoUrl) return null;

    return <VideoResultOverlay videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />;
};

renderRoot.render(<ContentScriptApp />);
