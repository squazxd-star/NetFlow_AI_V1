# N8N Setup Guide (Google Flow Edition)

This guide helps you import the newly created workflows that use Google's ecosystem (Gemini, Cloud TTS, Veo).

## 📂 Generated Workflow Files
You will find these files in your `n8n_workflows` folder:
1.  `n8n_video_script_generator.json` - For the "Create Video" tab.
2.  `n8n_netcast_producer.json` - For the "NetCast" tab.
3.  `n8n_auto_poster.json` - For auto-posting to TikTok/YouTube.

## 🚀 How to Import
1.  **Open n8n**: Navigate to your n8n dashboard (e.g., `https://parunyu.app.n8n.cloud/`).
2.  **Add Workflow**: Click the **Add Workflow** button (top right).
3.  **Import**: Click the **three dots menu (...)** on the canvas → select **Import from File**.
4.  **Select File**: Upload one of the `.json` files listed above.
5.  **Repeat**: Do this for all 3 files.

## 🔑 Configuration Required (API Keys)
After importing, you will see some nodes with **Red Warning Signs**. You must click them and add your credentials:

### 1. Google Gemini (Scripting)
-   **Node:** "Gemini 1.5 (Script Writer)"
-   **Action:** Click "Credential" → Create New → Enter your Google AI Studio API Key.

### 2. Google Cloud Platform (TTS & Veo)
-   **Nodes:** "Google Cloud TTS" & "Google Veo (Vertex AI)"
-   **Action:** These are using `HTTP Request` nodes.
-   **Setup:**
    -   Header Name: `Authorization`
    -   Header Value: `Bearer INVALID_OR_YOUR_ACCESS_TOKEN`
    -   *(Note: For production, we recommend setting up "Google Cloud Vertex AI" credentials in n8n if available, or using a Service Account Key).*
-   **Project ID:** You MUST replace `YOUR_PROJECT_ID` in the URL of the Google Veo node with your actual Google Cloud Project ID.

### 3. TikTok / YouTube
-   **Nodes:** "Upload to TikTok" / "Upload to YouTube"
-   **Action:** OAuth setup is required via n8n credentials.

## 🔗 Connecting to Antigravity
1.  Double-click the **Webhook Webhook (Netflow UI)** node.
2.  Copy the **Test URL** or **Production URL**.
3.  Paste this URL into your `.env` file in the Netflow AI project:
    ```env
    VITE_N8N_WEBHOOK_URL=https://your-n8n-url/webhook/video-script-generator
    ```
4.  Make sure the path matches (e.g., ends in `/video-script-generator`).

## ✅ Testing
-   Go to the "Create Video" tab in Netflow AI.
-   Fill in details and click "Generate".
-   Watch the Execution tab in n8n to see the Google Flow in action!
