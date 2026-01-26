import { useState, useEffect, useCallback } from "react";
import { runFullWorkflow } from "../services/geminiService";
import { generateNanoImage } from "../services/imageGenService";
import { stitchVideos } from "../services/videoProcessingService";
import { VideoGenerationResponse, AdvancedVideoRequest } from "../types/netflow";
import { useToast } from "./use-toast";

// Check if running as Chrome Extension
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;

export const useVideoGeneration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<VideoGenerationResponse | null>(null);
    const [rpaStatus, setRpaStatus] = useState<string>("idle");
    const { toast } = useToast();

    // Listen for messages from Service Worker (RPA completion)
    useEffect(() => {
        if (!isExtension) return;

        const handleMessage = (message: any) => {
            console.log("[Hook] Received message from SW:", message.type);

            if (message.type === "VIDEO_GENERATION_COMPLETE") {
                setIsLoading(false);
                setRpaStatus("completed");
                setResult({
                    success: true,
                    message: "Generated via VideoFX RPA",
                    data: {
                        script: "Video generated via RPA",
                        videoUrl: message.videoUrl
                    }
                });
                toast({
                    title: "🎬 สร้างวิดีโอสำเร็จ!",
                    description: "VideoFX RPA ทำงานเสร็จสิ้น",
                    className: "bg-green-600 text-white"
                });
            }

            if (message.type === "VIDEO_GENERATION_ERROR") {
                setIsLoading(false);
                setRpaStatus("error");
                setError(message.error);
                toast({
                    title: "❌ เกิดข้อผิดพลาด",
                    description: message.error,
                    variant: "destructive"
                });
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, [toast]);

    // Generate video using RPA (VideoFX)
    const generateWithRPA = useCallback(async (prompt: string) => {
        if (!isExtension) {
            toast({
                title: "ไม่สามารถใช้ RPA ได้",
                description: "กรุณา Load Extension ใน Chrome ก่อน (chrome://extensions)",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        setRpaStatus("starting");

        try {
            toast({
                title: "🚀 เริ่ม VideoFX RPA",
                description: "กำลังเปิด Google VideoFX...",
            });

            // Send message to service worker to start RPA
            chrome.runtime.sendMessage({
                type: "START_VIDEO_GENERATION",
                payload: { prompt }
            }, (response) => {
                if (response?.success) {
                    setRpaStatus("running");
                    toast({
                        title: "⏳ กำลังสร้างวิดีโอ...",
                        description: "รอสักครู่ VideoFX กำลังทำงาน (1-5 นาที)",
                    });
                } else {
                    throw new Error("Failed to start RPA");
                }
            });

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
            setRpaStatus("error");
            toast({
                title: "เกิดข้อผิดพลาด",
                description: err.message,
                variant: "destructive"
            });
        }
    }, [toast]);

    // Generate video using API (existing logic)
    const generate = async (data: any) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Check if RPA mode is enabled
            const useRPA = localStorage.getItem("netflow_use_rpa") === "true";

            if (useRPA && data.aiPrompt) {
                // Use RPA mode
                await generateWithRPA(data.aiPrompt || `Create a video for ${data.productName}`);
                return;
            }

            // Pass ALL form fields to the workflow
            const payload = {
                // Product Info
                productName: data.productName || "สินค้าทั่วไป",
                productDescription: data.productDescription || "",
                productId: data.productId || "",
                mustUseKeywords: data.mustUseKeywords || "",
                avoidKeywords: data.avoidKeywords || "",

                // Script Settings
                style: data.saleStyle || "storytelling",
                tone: data.voiceTone || "energetic",
                language: data.language || "th-central",
                template: data.template || "product-review",
                hookText: data.hookText || "",
                ctaText: data.ctaText || "",

                // Character Settings
                gender: data.gender || "female",
                ageRange: data.ageRange || "young-adult",
                personality: data.personality || "cheerful",
                background: data.background || "studio",

                // Video Settings
                expression: data.expression || "happy",
                movement: data.movement || "minimal",
                aspectRatio: data.aspectRatio || "9:16",
                videoDuration: data.videoDuration || "short",

                // Advanced Video Settings (if image provided)
                userImage: data.userImage || undefined,
                characterImage: data.characterImage || undefined,
                prompt: data.aiPrompt || `Professional video of a ${data.gender || "person"} (${data.ageRange || "young"}) in ${data.background || "studio"} setting, holding ${data.productName}, ${data.expression || "happy"} expression, ${data.style || "cinematic"} style, high quality, 4k`,
                loopCount: data.loopCount || 1,
                concatenate: data.concatenate || false
            };

            console.log("📤 Sending full payload to workflow:", payload);

            const serviceResult = await runFullWorkflow(payload);

            const response = {
                success: true,
                message: "Generated via Gemini Service",
                data: {
                    script: serviceResult.script,
                    videoUrl: serviceResult.videoUrl,
                    audioUrl: serviceResult.audioUrl,
                    generatedPrompt: serviceResult.generatedPrompt,
                    imageUrl: serviceResult.imageUrl
                }
            };

            if (serviceResult.videoUrl) {
                toast({
                    title: "สร้างวิดีโอสำเร็จ! 🎉",
                    description: "วิดีโอถูกสร้างเรียบร้อยแล้ว",
                    className: "bg-green-600 text-white"
                });
            }

            setResult(response);
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
        generateWithRPA,
        isLoading,
        error,
        result,
        rpaStatus,
        downloadVideo,
        isExtension
    };
};
