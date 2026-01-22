import { useState } from "react";
import { generateVideo, VideoGenerationResponse } from "../services/n8nApi";
import { useToast } from "./use-toast";

export const useVideoGeneration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<VideoGenerationResponse | null>(null);
    const { toast } = useToast();

    const generate = async (data: any) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // 1. Call API
            const response = await generateVideo(data);
            setResult(response);

            // 2. Check for video URL in response
            // Assuming response.data.videoUrl or similar exists based on n8n workflow
            // For testing purposes, we might fallback to a test video if API didn't return one yet
            const videoUrl = response.data?.videoUrl;

            if (videoUrl) {
                // 3. Send message to Content Script to show overlay
                // We need to query the active tab to send the message
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab?.id) {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'SHOW_VIDEO_RESULT',
                        videoUrl: videoUrl
                    }).catch(e => {
                        console.warn("Could not send message to content script. Is it loaded?", e);
                        // Fallback: Open in new tab if overlay fails
                        window.open(videoUrl, '_blank');
                    });
                }
            } else {
                // No video URL immediately? Maybe async? 
                // For now, let's toast success.
            }

            toast({
                title: "ส่งคำสั่งสำเร็จ",
                description: "ระบบกำลังเริ่มสร้างวิดีโอของคุณ",
                variant: "default",
            });
            return response;

        } catch (err: any) {
            const errorMessage = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ";
            setError(errorMessage);
            toast({
                title: "เกิดข้อผิดพลาด",
                description: errorMessage,
                variant: "destructive",
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const downloadVideo = () => {
        if (result?.data?.videoUrl) {
            const link = document.createElement('a');
            link.href = result.data.videoUrl;
            link.download = `netflow-video-${Date.now()}.mp4`;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "เริ่มการดาวน์โหลด",
                description: "กำลังบันทึกวิดีโอลงในเครื่องของคุณ",
            });
        } else {
            toast({
                title: "ไม่พบวิดีโอ",
                description: "โปรดสร้างวิดีโอก่อนทำการบันทึก",
                variant: "destructive",
            });
        }
    };

    return {
        generate,
        isLoading,
        error,
        result,
        downloadVideo,
    };
};
