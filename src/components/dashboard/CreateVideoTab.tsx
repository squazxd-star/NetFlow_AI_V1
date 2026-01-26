import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Loader2 } from "lucide-react";
import { createVideoSchema, CreateVideoFormData, createVideoDefaultValues } from "@/schemas";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import {
    AiScriptSection,
    CharacterStyleSection,
    ProductDataSection,
    ProductionPreviewSection,
    GenerationSettingsSection,
    ResultSection,
    ConsoleLogSection
} from "./create-video";

const CreateVideoTab = () => {
    // React Hook Form setup
    const form = useForm<CreateVideoFormData>({
        resolver: zodResolver(createVideoSchema),
        defaultValues: createVideoDefaultValues,
    });

    const { generate, isLoading, result, downloadVideo } = useVideoGeneration();
    const hasVideo = !!result?.data?.videoUrl;
    const hasImage = !!result?.data?.imageUrl;

    const { register, control, watch, setValue, getValues } = form;

    // UI State (not form data - stays as useState)
    const [characterImages, setCharacterImages] = useState<(string | null)[]>([null, null]);
    const [productImages, setProductImages] = useState<(string | null)[]>([null, null]);
    const [aiScriptOpen, setAiScriptOpen] = useState(true);
    const [characterOpen, setCharacterOpen] = useState(true);
    const [productDataOpen, setProductDataOpen] = useState(true);
    const [productionOpen, setProductionOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(true);

    const logs = [
        "ระบบพร้อมทำงาน...",
        ...(isLoading ? ["⏳ กำลังเชื่อมต่อ OpenAI/Gemini...", "🔄 กำลังสร้างสคริปต์และวิดีโอ..."] : []),
        ...(result ? ["✅ สร้างสำเร็จ! ผลลัพธ์แสดงอยู่ด้านล่าง"] : []),
    ];

    const handleCharacterUpload = (index: number) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImages = [...characterImages];
                    newImages[index] = e.target?.result as string;
                    setCharacterImages(newImages);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleProductImageUpload = (index: number) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImages = [...productImages];
                    newImages[index] = e.target?.result as string;
                    setProductImages(newImages);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Form submission handler
    const onSubmit = async (data: CreateVideoFormData) => {
        console.log("Form data ready for video generation:", data);

        // Prepare data for advanced workflow
        const userImage = productImages[0] || undefined;
        const characterImage = characterImages[0] || undefined;

        // Try to trigger Browser Automation (Google Veo Injection)
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                const payload = {
                    productName: data.productName,
                    gender: data.gender,
                    emotion: data.expression,
                    imageBase64: userImage,
                    personImageBase64: characterImage,
                    sceneDescription: data.aiPrompt, // Using prompt as scene desc
                    movement: data.movement
                };

                console.log("Sending automation payload:", payload);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: 'INJECT_AUTOMATION_DATA',
                            payload
                        });
                    }
                });
            }
        } catch (err) {
            console.warn("Automation trigger failed (context might not be extension):", err);
        }

        // Use clipCount as loop count (parse if string)
        const loopCount = typeof data.clipCount === 'number' ? data.clipCount : 1;

        // Use smartLoop toggle as "concatenate" trigger
        const concatenate = data.smartLoop;

        await generate({
            type: "video-generation",
            ...data,
            userImage,
            characterImage,
            loopCount,
            concatenate
        });
    };

    // Shared props for section components
    const sectionProps = {
        register,
        control,
        setValue,
        getValues,
        watch: watch as <T extends keyof CreateVideoFormData>(name: T) => CreateVideoFormData[T]
    };

    return (
        <div className="p-4 space-y-3">
            {/* AI Scripting Section */}
            <AiScriptSection
                {...sectionProps}
                isOpen={aiScriptOpen}
                onToggle={() => setAiScriptOpen(!aiScriptOpen)}
            />

            {/* Character & Style Section */}
            <CharacterStyleSection
                {...sectionProps}
                isOpen={characterOpen}
                onToggle={() => setCharacterOpen(!characterOpen)}
                characterImages={characterImages}
                onCharacterUpload={handleCharacterUpload}
            />

            {/* Product Data Section */}
            <ProductDataSection
                {...sectionProps}
                isOpen={productDataOpen}
                onToggle={() => setProductDataOpen(!productDataOpen)}
                productImages={productImages}
                onProductImageUpload={handleProductImageUpload}
            />

            {/* Production & Preview Section */}
            <ProductionPreviewSection
                {...sectionProps}
                isOpen={productionOpen}
                onToggle={() => setProductionOpen(!productionOpen)}
                hasVideo={hasVideo}
                onDownloadVideo={downloadVideo}
            />

            {/* Generation Settings */}
            <GenerationSettingsSection
                {...sectionProps}
                isOpen={settingsOpen}
                onToggle={() => setSettingsOpen(!settingsOpen)}
            />

            {/* Main Action Button */}
            <button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            กำลังส่งคำสั่ง...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            เริ่มสร้างวิดีโอ AI และโพสต์
                        </>
                    )}
                </span>
            </button>

            {/* Result Section */}
            <ResultSection
                result={result}
                hasVideo={hasVideo}
                hasImage={hasImage}
                onDownloadVideo={downloadVideo}
            />

            {/* Console Log */}
            <ConsoleLogSection logs={logs} />
        </div>
    );
};

export default CreateVideoTab;
