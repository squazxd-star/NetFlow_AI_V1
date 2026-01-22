import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus, Terminal, Wand2, User, Settings, Play, Infinity as InfinityIcon,
    ShoppingBag, ChevronDown, Youtube, FileText, Sparkles,
    Image, Video, Clock, RefreshCw, Check, Palette,
    Pencil, Stars, Link, Mic, Globe, Save
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    ClipCountOption,
    AspectRatioOption,
    RestIntervalOption,
    VideoDurationOption,
    GenderOption,
    SaleStyleOption,
    LanguageOption,
    TemplateOption,
    VoiceToneOption,
    AgeRangeOption,
    PersonalityOption,
    ClothingStyleOption,
    BackgroundOption,
    VoiceSettingOption,
    ExpressionOption,
    CameraAngleOption,
    MovementOption,
    clipCountOptions,
    restIntervalOptions,
    saleStyleOptions,
    templateOptions,
    languageOptions,
    accentOptions,
    voiceToneOptions,
} from "@/types/netflow";
import { createVideoSchema, CreateVideoFormData, createVideoDefaultValues } from "@/schemas";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { Loader2 } from "lucide-react";

// SectionHeader Component
const SectionHeader = ({
    icon: Icon,
    title,
    isOpen,
    onToggle,
    badge
}: {
    icon: React.ElementType;
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    badge?: string;
}) => (
    <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2"
    >
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-neon-red" />
            <span className="text-sm font-semibold text-foreground">{title}</span>
            {badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-red/10 text-neon-red">
                    {badge}
                </span>
            )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
);

const CreateVideoTab = () => {
    // React Hook Form setup
    const form = useForm<CreateVideoFormData>({
        resolver: zodResolver(createVideoSchema),
        defaultValues: createVideoDefaultValues,
    });

    const { generate, isLoading, result, downloadVideo } = useVideoGeneration();
    const hasVideo = !!result?.data?.videoUrl;

    const { register, control, watch, setValue, getValues } = form;

    // Watch form values for conditional rendering
    const useAiScript = watch("useAiScript");
    const template = watch("template");
    const gender = watch("gender");
    const clothingStyles = watch("clothingStyles");
    const touchLevel = watch("touchLevel");
    const expression = watch("expression");
    const cameraAngles = watch("cameraAngles");
    const movement = watch("movement");
    const aspectRatio = watch("aspectRatio");
    const autoPostTikTok = watch("autoPostTikTok");
    const autoPostYoutube = watch("autoPostYoutube");
    const clipCount = watch("clipCount");
    const videoDuration = watch("videoDuration");
    const hookEnabled = watch("hookEnabled");
    const ctaEnabled = watch("ctaEnabled");

    // UI State (not form data - stays as useState)
    const [characterImages, setCharacterImages] = useState<(string | null)[]>([null, null]);
    const [aiScriptOpen, setAiScriptOpen] = useState(true);
    const [characterOpen, setCharacterOpen] = useState(true);
    const [productDataOpen, setProductDataOpen] = useState(true);
    const [productionOpen, setProductionOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(true);

    // Determine if fields should be disabled (AI mode active)
    const isAiMode = useAiScript;

    const logs = [
        "ระบบพร้อมทำงาน...",
        "กำลังรีโหลดโมเดล AI...",
        "เชื่อมต่อระบบสำเร็จ",
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

    // Multi-select toggle helpers
    const toggleClothingStyle = (style: ClothingStyleOption) => {
        const current = getValues("clothingStyles");
        if (current.includes(style)) {
            setValue("clothingStyles", current.filter(s => s !== style));
        } else {
            setValue("clothingStyles", [...current, style]);
        }
    };

    const toggleCameraAngle = (angle: CameraAngleOption) => {
        const current = getValues("cameraAngles");
        if (current.includes(angle)) {
            setValue("cameraAngles", current.filter(a => a !== angle));
        } else {
            setValue("cameraAngles", [...current, angle]);
        }
    };

    // Form submission handler for n8n integration
    const onSubmit = async (data: CreateVideoFormData) => {
        console.log("Form data ready for n8n:", data);
        await generate({
            type: "video-generation",
            ...data
        });
    };

    return (
        <div className="p-4 space-y-3">
            {/* AI Scripting Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={FileText}
                        title="สคริปต์ AI"
                        isOpen={aiScriptOpen}
                        onToggle={() => setAiScriptOpen(!aiScriptOpen)}
                    />
                </div>

                {aiScriptOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Script Type Toggle - AI vs Manual */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                ประเภทสคริปต์
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setValue("useAiScript", true)}
                                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${useAiScript
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted text-muted-foreground border border-border'
                                        }`}
                                >
                                    <Stars className="w-4 h-4" />
                                    AI สร้างอัตโนมัติ
                                </button>
                                <button
                                    onClick={() => setValue("useAiScript", false)}
                                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${!useAiScript
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted text-muted-foreground border border-border'
                                        }`}
                                >
                                    <Pencil className="w-4 h-4" />
                                    เขียนเอง
                                </button>
                            </div>
                        </div>

                        {/* Template Selection - Always available */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                เทมเพลตสคริปต์
                            </label>
                            <select
                                {...register("template")}
                                className="w-full neon-select"
                            >
                                {templateOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {templateOptions.find(t => t.value === template)?.description}
                            </p>
                        </div>

                        {/* Prompt - Disabled in AI mode */}
                        <div>
                            <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                <RefreshCw className="w-3 h-3" />
                                คำสั่งเพิ่มเติม (Prompt)
                            </label>
                            <textarea
                                {...register("aiPrompt")}
                                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น จุดเด่นที่ต้องการเน้น, คำที่ต้องการใช้, สิ่งที่ต้องการหลีกเลี่ยง..."
                                rows={3}
                                disabled={isAiMode}
                                className={`w-full neon-textarea transition-all ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        {/* Sale Style & Voice Tone - Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    <Mic className="w-3 h-3" />
                                    น้ำเสียง & อารมณ์
                                </label>
                                <select
                                    {...register("voiceTone")}
                                    disabled={isAiMode}
                                    className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {voiceToneOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    <Sparkles className="w-3 h-3" />
                                    ระดับพลังงาน
                                </label>
                                <select
                                    {...register("saleStyle")}
                                    disabled={isAiMode}
                                    className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {saleStyleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Language & Dialect Selection - Always available */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    ภาษา
                                </label>
                                <select
                                    {...register("language")}
                                    className="w-full neon-select"
                                >
                                    {languageOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    สำเนียง/ภาษาถิ่น
                                </label>
                                <select
                                    disabled={isAiMode}
                                    className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {accentOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Hook & CTA - Disabled in AI mode */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Controller
                                        name="hookEnabled"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                disabled={isAiMode}
                                                className={`w-3 h-3 rounded accent-neon-red ${isAiMode ? 'opacity-50' : ''}`}
                                            />
                                        )}
                                    />
                                    <label className={`text-xs ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                        ประโยคเปิด (Hook)
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    {...register("hookText")}
                                    placeholder="เช่น หยุดดูคลิปนี้ก่อน..."
                                    disabled={!hookEnabled || isAiMode}
                                    className={`w-full neon-input text-xs ${(!hookEnabled || isAiMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Controller
                                        name="ctaEnabled"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                disabled={isAiMode}
                                                className={`w-3 h-3 rounded accent-neon-red ${isAiMode ? 'opacity-50' : ''}`}
                                            />
                                        )}
                                    />
                                    <label className={`text-xs ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                        ปุ่มกระตุ้น (CTA)
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    {...register("ctaText")}
                                    placeholder="เช่น กดตะกร้าเลย..."
                                    disabled={!ctaEnabled || isAiMode}
                                    className={`w-full neon-input text-xs ${(!ctaEnabled || isAiMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Keyword Tags - Disabled in AI mode */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`text-xs mb-1.5 block ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    คำสำคัญที่ต้องใช้
                                </label>
                                <input
                                    type="text"
                                    {...register("mustUseKeywords")}
                                    placeholder="ค้นด้วยเครื่องหมาย จุลภาค"
                                    disabled={isAiMode}
                                    className={`w-full neon-input text-xs ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                            <div>
                                <label className={`text-xs mb-1.5 block ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    คำที่ต้องหลีกเลี่ยง
                                </label>
                                <input
                                    type="text"
                                    {...register("avoidKeywords")}
                                    placeholder="ค้นด้วยเครื่องหมาย จุลภาค"
                                    disabled={isAiMode}
                                    className={`w-full neon-input text-xs ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Character & Style Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={User}
                        title="ตัวละคร & สไตล์"
                        isOpen={characterOpen}
                        onToggle={() => setCharacterOpen(!characterOpen)}
                    />
                </div>

                {characterOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Gender Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <User className="w-3 h-3 text-neon-red" />
                                เพศนักแสดง
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setValue("gender", "male")}
                                    className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${gender === "male"
                                        ? 'bg-muted border border-border text-foreground'
                                        : 'bg-muted/50 text-muted-foreground border border-transparent'
                                        }`}
                                >
                                    <span className="text-base">♂</span> ชาย
                                </button>
                                <button
                                    onClick={() => setValue("gender", "female")}
                                    className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${gender === "female"
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted/50 text-muted-foreground border border-transparent'
                                        }`}
                                >
                                    <span className="text-base">♀</span> หญิง
                                </button>
                            </div>
                        </div>

                        {/* Character Upload - 2 characters only */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Image className="w-3 h-3 text-neon-red" />
                                รูปภาพตัวละคร (สูงสุด 2)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {characterImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCharacterUpload(index)}
                                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200 overflow-hidden"
                                    >
                                        {img ? (
                                            <img src={img} alt={`Character ${index + 1}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Plus className="w-6 h-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">ตัวที่ {index + 1}</span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Age Range */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <User className="w-3 h-3 text-neon-red" />
                                ช่วงอายุ
                            </label>
                            <select
                                {...register("ageRange")}
                                className="w-full neon-select text-xs"
                            >
                                <option value="teen">วัยรุ่น (15-20 ปี)</option>
                                <option value="young-adult">วัยผู้ใหญ่ตอนต้น (21-30 ปี)</option>
                                <option value="adult">วัยผู้ใหญ่ (31-45 ปี)</option>
                                <option value="middle-age">วัยกลางคน (46-60 ปี)</option>
                                <option value="senior">วัยสูงอายุ (60+ ปี)</option>
                            </select>
                        </div>

                        {/* Personality */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Sparkles className="w-3 h-3 text-neon-red" />
                                บุคลิกตัวละคร
                            </label>
                            <select
                                {...register("personality")}
                                className="w-full neon-select text-xs"
                            >
                                <option value="cheerful">วัยรุ่นสดใส/กระฉับกระเฉง</option>
                                <option value="calm">สงบ/นิ่ง</option>
                                <option value="professional">มืออาชีพ/น่าเชื่อถือ</option>
                                <option value="playful">ขี้เล่น/ตลก</option>
                                <option value="mysterious">ลึกลับ/เท่</option>
                            </select>
                        </div>

                        {/* Clothing Style - Multi-select buttons */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Settings className="w-3 h-3 text-neon-red" />
                                สไตล์การแต่งกาย
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "casual", label: "ลำลอง" },
                                    { value: "formal", label: "ทางการ" },
                                    { value: "fashion", label: "แฟชั่น" },
                                    { value: "sporty", label: "กีฬา" },
                                ].map((style) => (
                                    <button
                                        key={style.value}
                                        onClick={() => toggleClothingStyle(style.value as ClothingStyleOption)}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${clothingStyles.includes(style.value as ClothingStyleOption)
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                                            }`}
                                    >
                                        <Check className={`w-3 h-3 ${clothingStyles.includes(style.value as ClothingStyleOption) ? 'opacity-100' : 'opacity-0'}`} />
                                        {style.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Image className="w-3 h-3 text-neon-red" />
                                ฉากหลัง
                            </label>
                            <select
                                {...register("background")}
                                className="w-full neon-select text-xs"
                            >
                                <option value="studio">สตูดิโอ/พื้นหลังสีพื้น</option>
                                <option value="outdoor">กลางแจ้ง/ธรรมชาติ</option>
                                <option value="home">ในบ้าน/ห้องนั่งเล่น</option>
                                <option value="office">สำนักงาน/ที่ทำงาน</option>
                                <option value="abstract">แอบสแตรกต์/กราฟิก</option>
                            </select>
                        </div>

                        {/* Voice Setting */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Mic className="w-3 h-3 text-neon-red" />
                                การตั้งค่าเสียง
                            </label>
                            <select
                                {...register("voiceSetting")}
                                className="w-full neon-select text-xs"
                            >
                                <option value="original">ต้นฉบับ/กระฉับกระเฉง</option>
                                <option value="ai-generated">AI สร้างเสียง</option>
                                <option value="text-to-speech">Text-to-Speech</option>
                            </select>
                        </div>

                        {/* Touch Level - Slider-like buttons */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Palette className="w-3 h-3 text-neon-red" />
                                ความเข้ม
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">ต่ำ</span>
                                <div className="flex-1 flex gap-1">
                                    {(["low", "medium", "high"] as const).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setValue("touchLevel", level)}
                                            className={`flex-1 h-2 rounded-full transition-all ${(level === "low" && (touchLevel === "low" || touchLevel === "medium" || touchLevel === "high")) ||
                                                (level === "medium" && (touchLevel === "medium" || touchLevel === "high")) ||
                                                (level === "high" && touchLevel === "high")
                                                ? 'bg-neon-red'
                                                : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">สูง</span>
                            </div>
                        </div>

                        {/* Expression */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Sparkles className="w-3 h-3 text-neon-red" />
                                การแสดงออก
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "neutral", label: "นิ่ง" },
                                    { value: "happy", label: "ยิ้มแฉ่ง" },
                                    { value: "excited", label: "ตื่นเต้น" },
                                ].map((exp) => (
                                    <button
                                        key={exp.value}
                                        onClick={() => setValue("expression", exp.value as ExpressionOption)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${expression === exp.value
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {exp.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Camera Angles - Multi-select */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Video className="w-3 h-3 text-neon-red" />
                                มุมกล้อง
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "front", label: "ด้านหน้า" },
                                    { value: "side", label: "ด้านข้าง" },
                                    { value: "close-up", label: "ใกล้ชิด" },
                                    { value: "full-body", label: "ทั้งตัว" },
                                    { value: "dynamic", label: "เคลื่อนไหว" },
                                ].map((angle) => (
                                    <button
                                        key={angle.value}
                                        onClick={() => toggleCameraAngle(angle.value as CameraAngleOption)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${cameraAngles.includes(angle.value as CameraAngleOption)
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {angle.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Movement */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <RefreshCw className="w-3 h-3 text-neon-red" />
                                การเคลื่อนไหว
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "static", label: "นิ่ง" },
                                    { value: "minimal", label: "ปานกลาง" },
                                ].map((mov) => (
                                    <button
                                        key={mov.value}
                                        onClick={() => setValue("movement", mov.value as MovementOption)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${movement === mov.value
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {mov.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Warning Note */}
                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                            <p className="text-xs text-muted-foreground">
                                AI จะวิเคราะห์ตัวละครของคุณและปรับแต่งให้เหมาะกับสินค้าอัตโนมัติ
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Product Data Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={ShoppingBag}
                        title="ข้อมูลสินค้า"
                        isOpen={productDataOpen}
                        onToggle={() => setProductDataOpen(!productDataOpen)}
                    />
                </div>

                {productDataOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Product ID */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Link className="w-3 h-3 text-neon-red" />
                                รหัสสินค้า (TikTok)
                            </label>
                            <input
                                type="text"
                                {...register("productId")}
                                placeholder="ตัวอย่าง 1729384..."
                                className="w-full neon-input text-xs"
                            />
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <FileText className="w-3 h-3 text-neon-red" />
                                ชื่อสินค้า
                            </label>
                            <input
                                type="text"
                                {...register("productName")}
                                placeholder="ระบุชื่อสินค้า..."
                                className="w-full neon-input text-xs"
                            />
                        </div>

                        {/* Product Images */}
                        <div>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Image className="w-3 h-3 text-neon-red" />
                                รูปภาพ (สูงสุด 2)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[0, 1].map((index) => (
                                    <button
                                        key={index}
                                        className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200"
                                    >
                                        <Plus className="w-6 h-6 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground">คลิกเพื่อเลือก</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                            <Sparkles className="w-4 h-4 text-neon-red flex-shrink-0" />
                            <p className="text-[10px] text-muted-foreground">
                                AI จะวิเคราะห์ข้อมูลสินค้าเพื่อสร้างคลิปโฆษณาได้ตรงจุด
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Production & Preview Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Video}
                        title="การผลิตและพรีวิว"
                        isOpen={productionOpen}
                        onToggle={() => setProductionOpen(!productionOpen)}
                    />
                </div>

                {productionOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Aspect Ratio */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                สัดส่วนวิดีโอ (Aspect Ratio)
                            </label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setValue("aspectRatio", "9:16")}
                                    className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${aspectRatio === "9:16"
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted border border-border text-muted-foreground'
                                        }`}
                                >
                                    <div className="w-4 h-7 border-2 border-current rounded-sm"></div>
                                    <span className="text-[10px]">แนวตั้ง 9:16</span>
                                    <span className="text-[10px] opacity-70">TikTok</span>
                                </button>
                                <button
                                    onClick={() => setValue("aspectRatio", "16:9")}
                                    className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${aspectRatio === "16:9"
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted border border-border text-muted-foreground'
                                        }`}
                                >
                                    <div className="w-7 h-4 border-2 border-current rounded-sm"></div>
                                    <span className="text-[10px]">แนวนอน 16:9</span>
                                    <span className="text-[10px] opacity-70">YouTube</span>
                                </button>
                            </div>
                        </div>

                        {/* Platform & Mode Selection */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Platform Selection */}
                            <div className="flex-1">
                                <label className="text-xs text-neon-red mb-2 block">แพลตฟอร์ม</label>
                                <div className="flex items-center bg-background rounded-xl border border-border overflow-hidden">
                                    <button
                                        onClick={() => setValue("autoPostTikTok", !autoPostTikTok)}
                                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${autoPostTikTok ? 'text-white' : 'text-muted-foreground'
                                            }`}
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </button>
                                    <div className="w-px h-8 bg-border"></div>
                                    <button
                                        onClick={() => setValue("autoPostYoutube", !autoPostYoutube)}
                                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${autoPostYoutube ? 'text-white' : 'text-muted-foreground'
                                            }`}
                                    >
                                        <Youtube className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Mode Selection */}
                            <div className="flex-1">
                                <label className="text-xs text-neon-red mb-2 block text-right">โหมด</label>
                                <div className={`flex items-center justify-center bg-background rounded-xl border border-border overflow-hidden transition-all ${hasVideo ? 'border-neon-red/50 shadow-[0_0_10px_rgba(255,46,87,0.1)]' : ''}`}>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            downloadVideo();
                                        }}
                                        disabled={!hasVideo}
                                        className={`w-full py-3 px-6 flex items-center justify-center transition-all ${hasVideo
                                            ? 'text-white hover:bg-neon-red hover:text-white cursor-pointer'
                                            : 'text-muted-foreground opacity-50 cursor-not-allowed'
                                            }`}
                                        title="บันทึกวิดีโอลงเครื่อง"
                                    >
                                        <Save className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Generation Settings */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Settings}
                        title="การตั้งค่าการสร้าง"
                        isOpen={settingsOpen}
                        onToggle={() => setSettingsOpen(!settingsOpen)}
                    />
                </div>

                {settingsOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Clip Count */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                จำนวนคลิปที่ต้องการสร้าง
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {clipCountOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setValue("clipCount", option)}
                                        className={`pill-button ${clipCount === option ? "pill-button-active" : "pill-button-inactive"
                                            }`}
                                    >
                                        {option === "unlimited" ? (
                                            <span className="flex items-center gap-1">
                                                <InfinityIcon className="w-3 h-3" /> ไม่จำกัด
                                            </span>
                                        ) : (
                                            option
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration & Interval */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground mb-2 block">
                                    ความยาว
                                </label>
                                <select
                                    {...register("videoDuration")}
                                    className="w-full neon-select text-xs"
                                >
                                    <option value="short">สั้น (8วิ)</option>
                                    <option value="medium">กลาง (16วิ)</option>
                                    <option value="long">ยาว (24วิ+)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-2 block">
                                    ระยะเวลา (Delay)
                                </label>
                                <select
                                    {...register("restInterval")}
                                    className="w-full neon-select text-xs"
                                >
                                    {restIntervalOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Quick Count Display */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30 flex-1">
                                <span className="text-xs text-muted-foreground">จำนวน</span>
                                <span className="text-2xl font-bold text-neon-red">
                                    {videoDuration === "short" ? 1 : videoDuration === "medium" ? 2 : 3}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground mx-3">รวมเป็น</span>
                            <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
                                <span className="text-lg font-bold text-neon-red">
                                    {videoDuration === "short" ? "8" : videoDuration === "medium" ? "16" : "24"}วิ
                                </span>
                            </div>
                        </div>

                        {/* Smart Loop */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-medium">โหมดวนซ้ำใช้วิดีโอเดิม (Smart Loop)</span>
                            </div>
                            <Controller
                                name="smartLoop"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-neon-red"
                                    />
                                )}
                            />
                        </div>
                        {/* Save Button (Under Mode) */}
                    </div>
                )}
            </section>

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

            {/* Console Log */}
            <section className="glass-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/50">
                    <Terminal className="w-4 h-4 text-neon-red" />
                    <span className="text-xs font-medium">Console Log</span>
                </div>
                <div className="p-3 space-y-1 h-24 overflow-y-auto bg-background/70 font-mono text-[10px]">
                    {logs.map((log, index) => (
                        <div
                            key={index}
                            className={`${log.includes("สำเร็จ") ? "text-green-500" : "text-muted-foreground"
                                }`}
                        >
                            {log}
                        </div>
                    ))}
                </div>
            </section >
        </div >
    );
};

export default CreateVideoTab;
