import { useState } from "react";
import { runFullWorkflow } from "../services/geminiService";
import { generateNanoImage } from "../services/imageGenService";
import { stitchVideos } from "../services/videoProcessingService";
import { VideoGenerationResponse, AdvancedVideoRequest } from "../types/netflow";
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
            // New Logic: Use Local Gemini Service
            let payload: any = {
                productName: data.productName || "สินค้าทั่วไป",
                // Common fields
            };

            if (data.userImage) {
                // Advanced Workflow Mapping
                payload = {
                    ...payload,
                    prompt: data.aiPrompt || `Video for ${data.productName}`,
                    userImage: data.userImage,
                    style: data.saleStyle || "cinematic",
                    loopCount: data.loopCount || 1,
                    concatenate: data.concatenate || false
                };
            } else {
                // Basic Script Workflow Mapping
                payload = {
                    ...payload,
                    style: data.saleStyle || "fun",
                    tone: data.voiceTone || "excited",
                    language: data.language || "th"
                };
            }

            const serviceResult = await runFullWorkflow(payload);



            // Construct response compatible with expected format
            // If we have audioUrl, we treat it as a success. 
            // Note: VideoUrl is placeholder in local service for now.
            const response = {
                success: true,
                message: "Generated via Gemini Service",
                data: {
                    script: serviceResult.script,
                    videoUrl: serviceResult.videoUrl, // May be undefined
                    audioUrl: serviceResult.audioUrl
                }
            };

            // DEBUG: Check if we fell back to mock and warn the user
            const isMockImage = serviceResult.videoUrl?.includes("googleapis") || serviceResult.videoUrl?.includes("unsplash");
            const isMockVideo = serviceResult.videoUrl?.includes("gtv-videos-bucket");

            if (isMockVideo) {
                toast({
                    title: "ระบบทำงานในโหมดจำลอง (Simulation Mode)",
                    description: "Google Ultra API ไม่ตอบสนอง (อาจเกิดจาก Quota หรือ Rate Limit) ระบบจึงใช้ Video ตัวอย่างแทนครับ",
                    variant: "destructive", // Red alert
                    duration: 5000
                });
            } else if (serviceResult.videoUrl) {
                toast({
                    title: "Google Ultra Gen สำเร็จ! 🎉",
                    description: "วิดีโอนี้ถูกสร้างด้วย AI ของจริง 100%",
                    variant: "default",
                    className: "bg-green-600 text-white"
                });
            }

            setResult(response);

            // Check for video URL (or audio as fallback for preview if needed)
            const videoUrl = response.data?.videoUrl;

            if (videoUrl) {
                // Check if running as extension with access to tabs API
                // @ts-ignore
                if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
                    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                    if (tab?.id) {
                        chrome.tabs.sendMessage(tab.id, {
                            type: 'SHOW_VIDEO_RESULT',
                            videoUrl: videoUrl
                        }).catch(e => {
                            console.warn("Could not send message to content script (likely not injected on this page).", e);
                            window.open(videoUrl, '_blank');
                        });
                    }
                } else {
                    // Fallback for localhost / web app mode
                    console.log("Not in extension mode, opening video in new tab");
                    window.open(videoUrl, '_blank');
                }
            } else if (response.data?.audioUrl) {
                // If only audio is generated, maybe play it or log it
                toast({
                    title: "สร้างสคริปต์และเสียงสำเร็จ",
                    description: "สามารถฟังเสียงตัวอย่างได้ (วิดีโอต้องใช้ Cloud Backend)",
                    variant: "default",
                });
                // Optional: Open audio in new tab if no video
                // window.open(response.data.audioUrl, '_blank');
            }

            if (!response.data?.audioUrl && !videoUrl) {
                toast({
                    title: "สร้างสคริปต์สำเร็จ",
                    description: "แต่ไม่สามารถสร้างเสียง/วิดีโอได้ในขณะนี้",
                    variant: "default",
                });
            }

            return response;

        } catch (err: any) {
            const errorMessage = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI";
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
