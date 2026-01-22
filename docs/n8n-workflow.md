# n8n Workflow Documentation

This document describes the structure of the n8n workflow required to handle requests from the NetFlow AI dashboard.

## Overview

The workflow receives a POST request from the dashboard, processes the data based on the request type, and triggers the video generation process.

## Triggers

### 1. Webhook
- **Method**: POST
- **Path**: `/video-gen` (or as configured in your n8n)
- **Authentication**: None (or Header Auth if you add it to the frontend)

## Workflow Logic

### Switch Node (Router)
Route the logic based on `body.type`:

#### Case 1: `video-generation` (Create Video Tab)
- **Input Data**:
    - `template`: Script template ID
    - `aiPrompt`: User prompt
    - `aspectRatio`: "9:16" | "16:9"
    - `platform`: "tiktok" | "youtube"
    - `gender`: "male" | "female"
    - `productName`, `productId`: Product details
- **Action**:
    - Generate script using LLM (OpenAI/Claude).
    - Generate voice using TTS (ElevenLabs/OpenAI).
    - Generate video using video AI provider (HeyGen/D-ID/SadTalker).
    - Upload to platform (optional).

#### Case 2: `netcast-pro` (NetCast Pro Tab)
- **Input Data**:
    - `netcastMode`: "podcast" | "storyboard" | "script"
    - `netcastTopic`: Main topic
    - `hostType`, `guestType`: Character settings
    - `sceneCount`: Number of scenes
- **Action**:
    - Generate conversation script between Host and Guest.
    - Generate audio for both characters.
    - Combine into a video sequence.

## Response
The workflow should return a JSON response to the frontend (though the frontend currently just notifies "Success" upon sending).

```json
{
  "success": true,
  "message": "Workflow started",
  "executionId": "..."
}
```
