import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FileText, Sparkles, ShoppingBag, Settings,
    ChevronDown, Globe, Mic, Play, User, Image, Plus
} from "lucide-react";
import { createVideoSchema, CreateVideoFormData, createVideoDefaultValues } from "@/schemas";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { Loader2 } from "lucide-react";

// Template options
const TEMPLATE_OPTIONS = [
    { value: "product-review", label: "รีวิวสินค้า", emoji: "📦" },
    { value: "unboxing", label: "แกะกล่อง", emoji: "📬" },
    { value: "comparison", label: "เปรียบเทียบ", emoji: "⚖️" },
    { value: "testimonial", label: "รีวิวลูกค้า", emoji: "💬" },
    { value: "flash-sale", label: "Flash Sale", emoji: "⚡" },
    { value: "tutorial", label: "สอนใช้งาน", emoji: "📚" },
    { value: "lifestyle", label: "ไลฟ์สไตล์", emoji: "✨" },
    { value: "before-after", label: "ก่อน-หลัง", emoji: "🔄" },
];

const SALE_STYLE_OPTIONS = [
    { value: "hard", label: "ขายแรง", desc: "กระตุ้นซื้อทันที" },
    { value: "soft", label: "ขายนุ่ม", desc: "ไม่กดดัน" },
    { value: "educational", label: "ให้ความรู้", desc: "สอนก่อนขาย" },
    { value: "storytelling", label: "เล่าเรื่อง", desc: "สร้างอารมณ์" },
];

const VOICE_TONE_OPTIONS = [
    { value: "energetic", label: "ตื่นเต้น 🔥" },
    { value: "calm", label: "สงบ 😌" },
    { value: "friendly", label: "เป็นกันเอง 😊" },
    { value: "professional", label: "มืออาชีพ 💼" },
];

const LANGUAGE_OPTIONS = [
    { value: "th", label: "ไทยกลาง" },
    { value: "th-north", label: "ภาษาเหนือ" },
    { value: "th-south", label: "ภาษาใต้" },
    { value: "th-isan", label: "ภาษาอีสาน" },
];

// Section Header Component
const SectionHeader = ({
    icon: Icon,
    title,
    isOpen,
    onToggle,
}: {
    icon: React.ElementType;
    title: string;
    isOpen: boolean;
    onToggle: () => void;
}) => (
    <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2"
        type="button"
    >
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-neon-red" />
            <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
);

const CreateVideoTab = () => {
    // React Hook Form
    const form = useForm<CreateVideoFormData>({
        resolver: zodResolver(createVideoSchema),
        defaultValues: createVideoDefaultValues,
    });

    const { generate, isLoading, result, downloadVideo } = useVideoGeneration();
    const hasVideo = !!result?.data?.videoUrl;

    const { register, control, watch, setValue } = form;

    // Watch values
    const template = watch("template");
    const saleStyle = watch("saleStyle");
    const gender = watch("gender");
    const aspectRatio = watch("aspectRatio");
    const hookEnabled = watch("hookEnabled");
    const ctaEnabled = watch("ctaEnabled");

    // UI State
    const [characterImage, setCharacterImage] = useState<string | null>(null);
    const [scriptOpen, setScriptOpen] = useState(true);
    const [productOpen, setProductOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(true);

    // Handle image upload
    const handleImageUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCharacterImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Form submission
    const onSubmit = async (data: CreateVideoFormData) => {
        console.log("📋 Form submitted with data:", data);

        await generate({
            ...data,
            userImage: characterImage || undefined,
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-3">
            {/* === Product Data Section === */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={ShoppingBag}
                        title="ข้อมูลสินค้า"
                        isOpen={productOpen}
                        onToggle={() => setProductOpen(!productOpen)}
                    />
                </div>

                {productOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">
                                ชื่อสินค้า *
                            </label>
                            <input
                                type="text"
                                {...register("productName")}
                                placeholder="เช่น เซรั่มหน้าใส, รองเท้าวิ่ง..."
                                className="w-full neon-input"
                            />
                        </div>

                        {/* Product ID (Optional) */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">
                                รหัสสินค้า TikTok (ถ้ามี)
                            </label>
                            <input
                                type="text"
                                {...register("productId")}
                                placeholder="สำหรับ Pin Cart อัตโนมัติ"
                                className="w-full neon-input"
                            />
                        </div>

                        {/* Character Image */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                                <Image className="w-3 h-3" />
                                รูปตัวละคร/นักแสดง (ถ้ามี)
                            </label>
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className="w-full aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all overflow-hidden"
                            >
                                {characterImage ? (
                                    <img src={characterImage} alt="Character" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Plus className="w-6 h-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">อัปโหลดรูป</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* === Script Settings Section === */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={FileText}
                        title="ตั้งค่าสคริปต์"
                        isOpen={scriptOpen}
                        onToggle={() => setScriptOpen(!scriptOpen)}
                    />
                </div>

                {scriptOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Template Selection */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                รูปแบบวิดีโอ
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {TEMPLATE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setValue("template", opt.value as any)}
                                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${template === opt.value
                                                ? 'bg-neon-red text-white'
                                                : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                                            }`}
                                    >
                                        <span className="text-lg">{opt.emoji}</span>
                                        <span className="text-[10px]">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sale Style */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                <Sparkles className="w-3 h-3 inline mr-1" />
                                สไตล์การขาย
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {SALE_STYLE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setValue("saleStyle", opt.value as any)}
                                        className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all text-left ${saleStyle === opt.value
                                                ? 'bg-neon-red text-white'
                                                : 'bg-muted text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {opt.label}
                                        <span className="block text-[10px] opacity-70">{opt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Voice Tone & Language */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">
                                    <Mic className="w-3 h-3 inline mr-1" />
                                    น้ำเสียง
                                </label>
                                <select {...register("voiceTone")} className="w-full neon-select">
                                    {VOICE_TONE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1.5 block">
                                    <Globe className="w-3 h-3 inline mr-1" />
                                    ภาษา
                                </label>
                                <select {...register("language")} className="w-full neon-select">
                                    {LANGUAGE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                <User className="w-3 h-3 inline mr-1" />
                                เพศผู้พูด
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setValue("gender", "male")}
                                    className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${gender === "male"
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                        }`}
                                >
                                    ♂ ชาย
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue("gender", "female")}
                                    className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${gender === "female"
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                        }`}
                                >
                                    ♀ หญิง
                                </button>
                            </div>
                        </div>

                        {/* Hook & CTA */}
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
                                                className="w-3 h-3 rounded accent-neon-red"
                                            />
                                        )}
                                    />
                                    <label className="text-xs text-muted-foreground">
                                        ประโยคเปิด (Hook)
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    {...register("hookText")}
                                    placeholder="เช่น หยุดดูก่อน..."
                                    disabled={!hookEnabled}
                                    className={`w-full neon-input text-xs ${!hookEnabled ? 'opacity-50' : ''}`}
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
                                                className="w-3 h-3 rounded accent-neon-red"
                                            />
                                        )}
                                    />
                                    <label className="text-xs text-muted-foreground">
                                        CTA (ปิดท้าย)
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    {...register("ctaText")}
                                    placeholder="เช่น กดตะกร้าเลย..."
                                    disabled={!ctaEnabled}
                                    className={`w-full neon-input text-xs ${!ctaEnabled ? 'opacity-50' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Additional Prompt */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">
                                คำสั่งเพิ่มเติม (Optional)
                            </label>
                            <textarea
                                {...register("aiPrompt")}
                                placeholder="เช่น เน้นเรื่องราคาถูก, อย่าพูดถึงคู่แข่ง..."
                                rows={2}
                                className="w-full neon-textarea"
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* === Video Settings Section === */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Settings}
                        title="ตั้งค่าวิดีโอ"
                        isOpen={settingsOpen}
                        onToggle={() => setSettingsOpen(!settingsOpen)}
                    />
                </div>

                {settingsOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Aspect Ratio */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                สัดส่วนวิดีโอ
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setValue("aspectRatio", "9:16")}
                                    className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${aspectRatio === "9:16"
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted border border-border text-muted-foreground'
                                        }`}
                                >
                                    <div className="w-4 h-7 border-2 border-current rounded-sm"></div>
                                    <span className="text-[10px]">9:16 (TikTok)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue("aspectRatio", "16:9")}
                                    className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${aspectRatio === "16:9"
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted border border-border text-muted-foreground'
                                        }`}
                                >
                                    <div className="w-7 h-4 border-2 border-current rounded-sm"></div>
                                    <span className="text-[10px]">16:9 (YouTube)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* === Generate Button === */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-red to-pink-500 text-white font-bold text-base shadow-lg shadow-neon-red/30 hover:shadow-neon-red/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        กำลังสร้าง...
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5" />
                        สร้างวิดีโอ
                    </>
                )}
            </button>

            {/* === Result Section === */}
            {hasVideo && (
                <div className="glass-card p-4 space-y-3">
                    <div className="flex items-center gap-2 text-green-500">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">สร้างวิดีโอสำเร็จ!</span>
                    </div>
                    <video
                        src={result?.data?.videoUrl}
                        controls
                        className="w-full rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={downloadVideo}
                        className="w-full py-2 rounded-lg bg-green-500 text-white font-medium"
                    >
                        ดาวน์โหลดวิดีโอ
                    </button>
                </div>
            )}
        </form>
    );
};

export default CreateVideoTab;
