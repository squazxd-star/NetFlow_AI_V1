import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Loader2, ExternalLink, Wand2 } from "lucide-react";
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

    // Workflow State
    const [generatedVideoPrompt, setGeneratedVideoPrompt] = useState<string | null>(null);
    const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string | null>(null);
    const [flowOpened, setFlowOpened] = useState(false);

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

        // Try to trigger Browser Automation (Google Veo 2-Stage Pipeline)
        try {
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                const payload = {
                    productName: data.productName,
                    gender: data.gender,
                    emotion: data.expression,
                    productImage: userImage,         // Renamed for clarity
                    characterImage: characterImage,  // Renamed for clarity
                    sceneDescription: data.aiPrompt,
                    movement: data.movement
                };

                console.log("🚀 Sending 2-Stage Pipeline payload:", payload);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) {
                        // Use TWO_STAGE_PIPELINE for the new flow
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: 'TWO_STAGE_PIPELINE',
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
                productImages={productImages}
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

            {/* Workflow Control Section */}
            <div className="glass-card p-4 space-y-4 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-400">WORKFLOW CONTROL</span>
                    <div className="h-px bg-blue-500/30 flex-1" />
                </div>

                {/* Step 1: Preview Prompt */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-foreground flex items-center gap-2">
                            <span className="bg-blue-500/20 text-blue-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                            เตรียมคำสั่ง (Prompt)
                        </label>
                        <button
                            type="button"
                            onClick={async () => {
                                const isValid = await form.trigger();
                                if (!isValid) return;

                                const data = getValues();
                                const { getFormattedPrompt } = await import("@/utils/videoPromptTemplates");

                                const pVars = {
                                    productName: data.productName,
                                    genderText: data.gender === 'male' ? "Thai man" : "Thai woman",
                                    emotion: data.expression,
                                    sceneDescription: data.aiPrompt,
                                    movement: data.movement,
                                    style: "Cinematic, Photorealistic, 4k" // Default style or from form
                                };

                                const vPrompt = getFormattedPrompt(pVars);
                                setGeneratedVideoPrompt(vPrompt);

                                // Also update visual prompt if needed
                                setGeneratedImagePrompt(data.aiPrompt || `Product shot of ${data.productName}`);
                            }}
                            className="text-[10px] bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                        >
                            <Wand2 className="w-3 h-3" />
                            สร้าง/อัปเดต Prompt
                        </button>
                    </div>

                    {generatedVideoPrompt && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-black/40 p-3 rounded-lg border border-border space-y-2">
                                <div>
                                    <label className="text-[10px] text-muted-foreground block mb-1">Image Prompt (Visual)</label>
                                    <textarea
                                        value={generatedImagePrompt || ""}
                                        onChange={(e) => setGeneratedImagePrompt(e.target.value)}
                                        className="w-full bg-transparent text-[10px] text-foreground font-mono resize-none outline-none min-h-[40px]"
                                    />
                                </div>
                                <div className="h-px bg-border/50" />
                                <div>
                                    <label className="text-[10px] text-muted-foreground block mb-1">Video Prompt (Motion)</label>
                                    <textarea
                                        value={generatedVideoPrompt}
                                        onChange={(e) => setGeneratedVideoPrompt(e.target.value)}
                                        className="w-full bg-transparent text-[10px] text-foreground font-mono resize-none outline-none min-h-[60px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 2: Open Flow */}
                <div className={`space-y-2 transition-opacity duration-200 ${!generatedVideoPrompt ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-xs font-medium text-foreground flex items-center gap-2">
                        <span className="bg-blue-500/20 text-blue-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        เปิดหน้างาน (Google VideoFX)
                    </label>
                    <button
                        type="button"
                        onClick={() => {
                            window.open('https://labs.google/fx/tools/video-fx', '_blank');
                            setFlowOpened(true);
                        }}
                        className={`w-full py-2 px-4 rounded-lg text-xs font-medium border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 ${flowOpened ? 'bg-blue-500/10' : ''}`}
                    >
                        <ExternalLink className="w-3 h-3" />
                        {flowOpened ? "เปิดอีกครั้ง (Opened)" : "เปิด Google VideoFX"}
                    </button>
                </div>

                {/* Step 3: Generate Video */}
                <div className={`space-y-2 transition-opacity duration-200 ${!flowOpened ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="text-xs font-medium text-foreground flex items-center gap-2">
                        <span className="bg-neon-red/20 text-neon-red w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
                        สั่งทำงาน (Execution)
                    </label>
                    <button
                        onClick={form.handleSubmit(async (data) => {
                            // Run the refined OnSubmit here with explicit prompts

                            // 1. Prepare Payload
                            const payload = {
                                productName: data.productName,
                                gender: data.gender,
                                emotion: data.expression,
                                productImage: productImages[0],
                                characterImage: characterImages[0],
                                sceneDescription: data.aiPrompt, // Original scene desc
                                movement: data.movement,
                                // Pass the edited prompts!
                                videoPrompt: generatedVideoPrompt,
                                imagePrompt: generatedImagePrompt
                            };

                            console.log("🚀 Executing with Manual Context:", payload);

                            try {
                                if (typeof chrome !== 'undefined' && chrome.tabs) {
                                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                        if (tabs[0]?.id) {
                                            chrome.tabs.sendMessage(tabs[0].id, {
                                                type: 'TWO_STAGE_PIPELINE',
                                                payload
                                            });
                                        }
                                    });
                                }
                            } catch (e) { console.error(e); }

                            // Also trigger the standard hook logic for tracking (optional, or just for UI loading state)
                            // We might just want to use the hook's loading state manually?
                            // Actually the hook 'generate' function calls the API service, which we might NOT want if we are doing RPA.
                            // The 'useVideoGeneration' generic function decides based on localStorage... 
                            // But here we are explicitly doing the RPA flow via button.

                            // Let's rely on the RPA message listener in the hook to update state.

                        })}
                        className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Play className="w-5 h-5 fill-current" />
                            GENERATE VIDEO
                        </span>
                    </button>
                </div>
            </div>

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
