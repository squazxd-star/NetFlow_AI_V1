import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Wand2, User, ShoppingBag, Video, Settings,
    Sparkles, Image, Loader2, Download, Play
} from "lucide-react";
import { createVideoSchema, CreateVideoFormData, createVideoDefaultValues } from "@/schemas";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";

const CreateVideoTab = () => {
    const form = useForm<CreateVideoFormData>({
        resolver: zodResolver(createVideoSchema),
        defaultValues: createVideoDefaultValues,
    });

    const { generate, isLoading, result, downloadVideo, rpaStatus, isExtension } = useVideoGeneration();
    const hasVideo = !!result?.data?.videoUrl;

    const { register, watch, setValue, handleSubmit, formState: { errors } } = form;

    // Watch key values
    const useAiScript = watch("useAiScript");
    const gender = watch("gender");
    const aspectRatio = watch("aspectRatio");
    const template = watch("template");

    // Character image state
    const [characterImage, setCharacterImage] = useState<string | null>(null);

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

    const onSubmit = async (data: CreateVideoFormData) => {
        console.log("🎬 Full Form Data:", data);

        await generate({
            ...data,
            userImage: characterImage || undefined,
            loopCount: data.clipCount,
            concatenate: data.smartLoop
        });
    };

    const templateLabels: Record<string, string> = {
        "product-review": "รีวิวสินค้า",
        "brainrot-product": "Brainrot + ขายของ",
        "unboxing": "แกะกล่อง",
        "comparison": "เปรียบเทียบ",
        "testimonial": "รีวิวจากลูกค้า",
        "flash-sale": "Flash Sale",
        "tutorial": "สอนใช้งาน",
        "lifestyle": "ไลฟ์สไตล์",
        "trending": "ตามเทรนด์",
        "mini-drama": "มินิดราม่า",
        "before-after": "ก่อน-หลัง"
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            {/* Section 1: Product Info */}
            <section className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-neon-red mb-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm font-semibold">ข้อมูลสินค้า</span>
                </div>

                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">ชื่อสินค้า *</label>
                    <input
                        {...register("productName")}
                        placeholder="เช่น ครีมหน้าใส Premium"
                        className="w-full neon-input"
                    />
                    {errors.productName && (
                        <p className="text-xs text-red-500 mt-1">{errors.productName.message}</p>
                    )}
                </div>

                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">รายละเอียดสินค้า</label>
                    <textarea
                        {...register("productDescription")}
                        placeholder="จุดเด่น คุณสมบัติ ราคา โปรโมชั่น..."
                        rows={2}
                        className="w-full neon-textarea"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">รหัสสินค้า (TikTok)</label>
                        <input
                            {...register("productId")}
                            placeholder="1729384..."
                            className="w-full neon-input"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">คำสำคัญ</label>
                        <input
                            {...register("mustUseKeywords")}
                            placeholder="คั่นด้วย ,"
                            className="w-full neon-input"
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: AI Script Settings */}
            <section className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-neon-red mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">สคริปต์ AI</span>
                </div>

                {/* AI Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setValue("useAiScript", true)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${useAiScript ? 'bg-neon-red text-white' : 'bg-muted text-muted-foreground border border-border'}`}
                    >
                        🤖 AI สร้างอัตโนมัติ
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue("useAiScript", false)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${!useAiScript ? 'bg-neon-red text-white' : 'bg-muted text-muted-foreground border border-border'}`}
                    >
                        ✏️ เขียนเอง
                    </button>
                </div>

                {/* Template Selection */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">เทมเพลตสคริปต์</label>
                    <select {...register("template")} className="w-full neon-select">
                        {Object.entries(templateLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Voice Settings */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">น้ำเสียง</label>
                        <select {...register("voiceTone")} className="w-full neon-select">
                            <option value="energetic">กระตือรือร้น</option>
                            <option value="calm">สงบ</option>
                            <option value="friendly">เป็นกันเอง</option>
                            <option value="professional">มืออาชีพ</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">ระดับพลังงาน</label>
                        <select {...register("saleStyle")} className="w-full neon-select">
                            <option value="hard">สูงมาก</option>
                            <option value="soft">สูง</option>
                            <option value="educational">ปานกลาง</option>
                            <option value="storytelling">เล่าเรื่อง</option>
                        </select>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">ภาษา</label>
                    <select {...register("language")} className="w-full neon-select">
                        <option value="th-central">ไทยกลาง</option>
                        <option value="th-north">ไทยเหนือ</option>
                        <option value="th-south">ไทยใต้</option>
                        <option value="th-isan">ไทยอีสาน</option>
                        <option value="en">English</option>
                    </select>
                </div>

                {/* Hook & CTA */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">ประโยคเปิด (Hook)</label>
                        <input
                            {...register("hookText")}
                            placeholder="หยุดดูก่อน!"
                            className="w-full neon-input"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">ปุ่มกระตุ้น (CTA)</label>
                        <input
                            {...register("ctaText")}
                            placeholder="กดตะกร้าเลย!"
                            className="w-full neon-input"
                        />
                    </div>
                </div>

                {/* Custom Prompt */}
                {!useAiScript && (
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">สคริปต์ของคุณ</label>
                        <textarea
                            {...register("aiPrompt")}
                            placeholder="เขียนสคริปต์เองที่นี่..."
                            rows={4}
                            className="w-full neon-textarea"
                        />
                    </div>
                )}
            </section>

            {/* Section 3: Character & Style */}
            <section className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-neon-red mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold">ตัวละคร & สไตล์</span>
                </div>

                {/* Gender */}
                <div className="flex gap-2">
                    {[
                        { value: "female", label: "♀ หญิง" },
                        { value: "male", label: "♂ ชาย" },
                        { value: "any", label: "🎭 ไม่ระบุ" }
                    ].map((g) => (
                        <button
                            key={g.value}
                            type="button"
                            onClick={() => setValue("gender", g.value as any)}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${gender === g.value ? 'bg-neon-red text-white' : 'bg-muted text-muted-foreground border border-border'}`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>

                {/* Character Image Upload */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">รูปตัวละคร (ถ้ามี)</label>
                    <button
                        type="button"
                        onClick={handleImageUpload}
                        className="w-full aspect-video rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 transition-all overflow-hidden"
                    >
                        {characterImage ? (
                            <img src={characterImage} alt="Character" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <Image className="w-8 h-8 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">คลิกเพื่ออัปโหลด</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Age & Personality */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">ช่วงอายุ</label>
                        <select {...register("ageRange")} className="w-full neon-select">
                            <option value="teen">วัยรุ่น (15-20)</option>
                            <option value="young-adult">ผู้ใหญ่ตอนต้น (21-30)</option>
                            <option value="adult">ผู้ใหญ่ (31-45)</option>
                            <option value="middle-age">วัยกลางคน (46-60)</option>
                            <option value="senior">สูงอายุ (60+)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">บุคลิก</label>
                        <select {...register("personality")} className="w-full neon-select">
                            <option value="cheerful">สดใส/กระฉับกระเฉง</option>
                            <option value="calm">สงบ/นิ่ง</option>
                            <option value="professional">มืออาชีพ</option>
                            <option value="playful">ขี้เล่น/ตลก</option>
                            <option value="mysterious">ลึกลับ/เท่</option>
                        </select>
                    </div>
                </div>

                {/* Background & Expression */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">ฉากหลัง</label>
                        <select {...register("background")} className="w-full neon-select">
                            <option value="studio">สตูดิโอ</option>
                            <option value="outdoor">กลางแจ้ง</option>
                            <option value="home">ในบ้าน</option>
                            <option value="office">สำนักงาน</option>
                            <option value="abstract">แอบสแตรกต์</option>
                            <option value="product-focused">เน้นสินค้า</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">อารมณ์</label>
                        <select {...register("expression")} className="w-full neon-select">
                            <option value="happy">ยิ้มแฉ่ง</option>
                            <option value="excited">ตื่นเต้น</option>
                            <option value="neutral">นิ่ง</option>
                            <option value="serious">จริงจัง</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Section 4: Video Settings */}
            <section className="glass-card p-4 space-y-3">
                <div className="flex items-center gap-2 text-neon-red mb-2">
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-semibold">ตั้งค่าวิดีโอ</span>
                </div>

                {/* Aspect Ratio */}
                <div className="flex gap-2">
                    {[
                        { value: "9:16", label: "📱 9:16 (TikTok)" },
                        { value: "16:9", label: "🖥️ 16:9 (YouTube)" },
                        { value: "1:1", label: "⬜ 1:1 (IG)" }
                    ].map((ar) => (
                        <button
                            key={ar.value}
                            type="button"
                            onClick={() => setValue("aspectRatio", ar.value as any)}
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${aspectRatio === ar.value ? 'bg-neon-red text-white' : 'bg-muted text-muted-foreground border border-border'}`}
                        >
                            {ar.label}
                        </button>
                    ))}
                </div>

                {/* Duration & Clips */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">ความยาว</label>
                        <select {...register("videoDuration")} className="w-full neon-select">
                            <option value="short">สั้น (15-30 วิ)</option>
                            <option value="medium">กลาง (30-60 วิ)</option>
                            <option value="long">ยาว (1-3 นาที)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">จำนวนคลิป</label>
                        <select {...register("clipCount", { valueAsNumber: true })} className="w-full neon-select">
                            <option value={1}>1 คลิป</option>
                            <option value={3}>3 คลิป</option>
                            <option value={5}>5 คลิป</option>
                            <option value={10}>10 คลิป</option>
                            <option value={25}>25 คลิป</option>
                        </select>
                    </div>
                </div>

                {/* Movement & Camera */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">การเคลื่อนไหว</label>
                        <select {...register("movement")} className="w-full neon-select">
                            <option value="static">นิ่ง</option>
                            <option value="minimal">ปานกลาง</option>
                            <option value="active">เคลื่อนไหวมาก</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1 block">เสียง</label>
                        <select {...register("voiceSetting")} className="w-full neon-select">
                            <option value="ai-generated">AI สร้างเสียง</option>
                            <option value="text-to-speech">Text-to-Speech</option>
                            <option value="original">ไม่มีเสียง</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Generate Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neon-red to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        กำลังสร้าง... {rpaStatus !== "idle" && `(${rpaStatus})`}
                    </>
                ) : (
                    <>
                        <Wand2 className="w-5 h-5" />
                        สร้างวิดีโอ AI
                    </>
                )}
            </button>

            {/* Result Section */}
            {result && (
                <section className="glass-card p-4 space-y-3">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold">ผลลัพธ์</span>
                    </div>

                    {result.data?.script && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">สคริปต์:</p>
                            <p className="text-sm whitespace-pre-wrap">{result.data.script}</p>
                        </div>
                    )}

                    {hasVideo && (
                        <div className="space-y-2">
                            <video
                                src={result.data.videoUrl}
                                controls
                                className="w-full rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={downloadVideo}
                                className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                ดาวน์โหลดวิดีโอ
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Extension Status */}
            {isExtension && (
                <div className="text-center text-xs text-muted-foreground">
                    🔌 Extension Mode: RPA พร้อมใช้งาน
                </div>
            )}
        </form>
    );
};

export default CreateVideoTab;
