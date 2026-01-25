import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus, Wand2, User, ChevronDown, Youtube, FileText, Sparkles,
    Video, Clock, RefreshCw, Palette, BarChart3,
    Radio, Mic, Save, Camera, MessageSquare, BookOpen, ShoppingBag, Zap, Settings
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { netCastSchema, NetCastFormData, netCastDefaultValues } from "@/schemas";
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

const NetCastTab = () => {
    // React Hook Form setup
    const form = useForm<NetCastFormData>({
        resolver: zodResolver(netCastSchema),
        defaultValues: netCastDefaultValues,
    });

    const { generate, isLoading } = useVideoGeneration();

    const { register, control, watch, setValue, getValues } = form;

    // Watch form values for conditional rendering
    const netcastMode = watch("netcastMode");
    const selectedStoryStyle = watch("selectedStoryStyle");
    const netcastEmotion = watch("netcastEmotion");
    const netcastBgStyle = watch("netcastBgStyle");
    const selectedAspectRatio = watch("selectedAspectRatio");
    const selectedPlatform = watch("selectedPlatform");
    const durationMode = watch("durationMode");
    const sceneCount = watch("sceneCount");
    const netcastAtmosphereVol = watch("netcastAtmosphereVol");

    // UI State (section open/close - stays as useState)
    const [netcastStoryOpen, setNetcastStoryOpen] = useState(true);
    const [netcastCharacterOpen, setNetcastCharacterOpen] = useState(true);
    const [netcastQualityOpen, setNetcastQualityOpen] = useState(true);
    const [netcastSoundOpen, setNetcastSoundOpen] = useState(true);
    const [netcastSalesOpen, setNetcastSalesOpen] = useState(true);
    const [netcastProductionOpen, setNetcastProductionOpen] = useState(true);
    const [showCustomStyleInput, setShowCustomStyleInput] = useState(false);

    // Form submission handler
    const onSubmit = async (data: NetCastFormData) => {
        console.log("NetCast form data ready:", data);
        await generate({
            type: "netcast-pro",
            ...data
        });
    };

    return (
        <div className="p-4 space-y-3">
            {/* Main NetCast Pro Banner - Hero Style Refined */}
            <section className="relative overflow-hidden rounded-3xl border border-neon-red/20 bg-gradient-to-b from-neon-red/10 to-background p-6">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Title & Badge Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-neon-red/20 blur-lg rounded-full animate-pulse-glow"></div>
                                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-red to-neon-red-dark flex items-center justify-center shadow-lg shadow-neon-red/20">
                                    <Radio className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-white neon-text">
                                    NetCast Pro
                                </h2>
                                <div className="h-1 w-12 bg-neon-red rounded-full mt-1"></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            <span className="text-[10px] font-medium text-yellow-500">ใหม่</span>
                        </div>
                    </div>

                    {/* Sub-function Navigation */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                        <button
                            onClick={() => setValue("netcastMode", "podcast")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${netcastMode === 'podcast'
                                ? 'bg-neon-red text-white shadow-lg shadow-neon-red/25 scale-105'
                                : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-neon-red/30 hover:bg-neon-red/5'
                                }`}
                        >
                            <Mic className="w-4 h-4" />
                            พอดแคสต์
                        </button>
                        <button
                            onClick={() => setValue("netcastMode", "storyboard")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${netcastMode === 'storyboard'
                                ? 'bg-neon-red text-white shadow-lg shadow-neon-red/25 scale-105'
                                : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-neon-red/30 hover:bg-neon-red/5'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            สตอรี่บอร์ด
                        </button>
                        <button
                            onClick={() => setValue("netcastMode", "script")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${netcastMode === 'script'
                                ? 'bg-neon-red text-white shadow-lg shadow-neon-red/25 scale-105'
                                : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-neon-red/30 hover:bg-neon-red/5'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            บทเรียน
                        </button>
                    </div>
                </div>
            </section>

            {/* Story and Style Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Sparkles}
                        title="เนื้อเรื่องและสไตล์"
                        isOpen={netcastStoryOpen}
                        onToggle={() => setNetcastStoryOpen(!netcastStoryOpen)}
                    />
                </div>

                {netcastStoryOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Topic / Main Point */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-3 h-3 text-muted-foreground" />
                                <label className="text-xs text-muted-foreground">หัวข้อเรื่อง / ประเด็นหลัก</label>
                            </div>
                            <textarea
                                placeholder="เช่น การลงทุนในยุค AI, รีวิวสกินแคร์สำหรับคนผิวแพ้ง่าย..."
                                {...register("netcastTopic")}
                                className="w-full neon-input text-xs min-h-[70px] resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Story Style */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-3 h-3 text-muted-foreground" />
                                <label className="text-xs text-muted-foreground">สไตล์การเล่าเรื่อง (Story Style)</label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setValue("selectedStoryStyle", "casual")}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${selectedStoryStyle === 'casual'
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                                        }`}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    สบายๆเป็นกันเอง
                                </button>
                                <button
                                    onClick={() => setValue("selectedStoryStyle", "educational")}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${selectedStoryStyle === 'educational'
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                                        }`}
                                >
                                    <Sparkles className="w-3 h-3" />
                                    ให้ความรู้/วิชาการ
                                </button>
                                <button
                                    onClick={() => setValue("selectedStoryStyle", "drama")}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${selectedStoryStyle === 'drama'
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                                        }`}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    ดราม่า/เล่าเรื่องผี
                                </button>
                                <button
                                    onClick={() => setValue("selectedStoryStyle", "news")}
                                    className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${selectedStoryStyle === 'news'
                                        ? 'bg-neon-red text-white'
                                        : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                                        }`}
                                >
                                    <Sparkles className="w-3 h-3" />
                                    ข่าวสาร/อัพเดต
                                </button>
                            </div>

                            {/* Add Custom Style Button */}
                            <button
                                onClick={() => setShowCustomStyleInput(!showCustomStyleInput)}
                                className="w-full mt-3 py-2.5 rounded-lg text-xs font-medium text-muted-foreground border border-dashed border-border hover:border-neon-red/50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3 h-3" />
                                เพิ่มสไตล์ที่กำหนดเอง (Custom Style)
                            </button>

                            {/* Custom Style Input */}
                            {showCustomStyleInput && (
                                <div className="mt-3 p-3 rounded-lg border border-neon-red/30 bg-neon-red/5 space-y-2">
                                    <label className="text-xs text-foreground font-medium">กรอกสไตล์ที่ต้องการ:</label>
                                    <input
                                        type="text"
                                        {...register("customStyleText")}
                                        placeholder="เช่น พูดเร็ว ตลก, พากย์เหมือนข่าว..."
                                        className="w-full neon-input text-xs"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const customText = getValues("customStyleText");
                                                if (customText?.trim()) {
                                                    setValue("selectedStoryStyle", "custom");
                                                    setShowCustomStyleInput(false);
                                                }
                                            }}
                                            className="flex-1 py-2 rounded-lg text-xs font-medium bg-neon-red text-white hover:opacity-90 transition-opacity"
                                        >
                                            ใช้สไตล์นี้
                                        </button>
                                        <button
                                            onClick={() => setShowCustomStyleInput(false)}
                                            className="px-4 py-2 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border"
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Smart Character Settings */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={User}
                        title="ตั้งค่าตัวตนอัจฉริยะ"
                        isOpen={netcastCharacterOpen}
                        onToggle={() => setNetcastCharacterOpen(!netcastCharacterOpen)}
                    />
                </div>
                {netcastCharacterOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Host & Guest Two Column Layout */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Host Column */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-neon-red" />
                                    <span className="text-xs text-foreground">โฮสต์</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-neon-red/20 text-neon-red font-medium">HOST</span>
                                </div>

                                {/* Host Upload Area */}
                                <button className="w-full aspect-square rounded-xl border-2 border-neon-red bg-neon-red/5 flex flex-col items-center justify-center gap-2 hover:bg-neon-red/10 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-neon-red/20 flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-neon-red" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-neon-red font-medium">อัปโหลด</p>
                                        <p className="text-xs text-neon-red">รูปหน้าตรง</p>
                                    </div>
                                </button>

                                {/* Host Character Select */}
                                <select
                                    {...register("netcastHostType")}
                                    className="w-full neon-input text-xs"
                                >
                                    <option value="สาววัยรุ่น (ไทย)">สาววัยรุ่น (ไทย)</option>
                                    <option value="หนุ่มวัยรุ่น (ไทย)">หนุ่มวัยรุ่น (ไทย)</option>
                                    <option value="สาวมืออาชีพ">สาวมืออาชีพ</option>
                                    <option value="หนุ่มมืออาชีพ">หนุ่มมืออาชีพ</option>
                                    <option value="ผู้ใหญ่ใจดี">ผู้ใหญ่ใจดี</option>
                                </select>
                            </div>

                            {/* Guest Column */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-foreground">แขกรับเชิญ</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">GUEST</span>
                                </div>

                                {/* Guest Upload Area */}
                                <button className="w-full aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-muted-foreground transition-all">
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground font-medium">อัปโหลด</p>
                                        <p className="text-[10px] text-muted-foreground">(ไม่บังคับ)</p>
                                    </div>
                                </button>

                                {/* Guest Voice Select */}
                                <select
                                    {...register("netcastGuestType")}
                                    className="w-full neon-input text-xs"
                                >
                                    <option value="เลือกเสียง">เลือกเสียง</option>
                                    <option value="เสียงชาย สุภาพ">เสียงชาย สุภาพ</option>
                                    <option value="เสียงหญิง สุภาพ">เสียงหญิง สุภาพ</option>
                                    <option value="เสียงเด็ก">เสียงเด็ก</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Quality & Emotion Control */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Palette}
                        title="ควบคุมภาพและอารมณ์"
                        isOpen={netcastQualityOpen}
                        onToggle={() => setNetcastQualityOpen(!netcastQualityOpen)}
                    />
                </div>
                {netcastQualityOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Lip Sync */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">ขยับปากตามเสียงอัตโนมัติ</label>
                            <select
                                {...register("netcastLipSync")}
                                className="w-full neon-select"
                            >
                                <option value="อัตโนมัติ">อัตโนมัติ</option>
                                <option value="ซิงค์แม่นยำ">ซิงค์แม่นยำ</option>
                            </select>
                        </div>

                        {/* Emotion Sync */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">การแสดงออก (Emotion Sync)</label>
                            <div className="flex gap-2">
                                {["เป็นปกติ", "ร้อนแรง", "สุขุม"].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setValue("netcastEmotion", opt)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${netcastEmotion === opt
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background Style */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">สไตล์พื้นหลัง</label>
                            <div className="flex gap-2">
                                {["เบลอโปร่ง", "โทนสี/ไวโบ", "ไม่เปลี่ยน"].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setValue("netcastBgStyle", opt)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${netcastBgStyle === opt
                                            ? 'bg-neon-red text-white'
                                            : 'bg-muted text-muted-foreground border border-border'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Crypto Live Data */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs font-medium">สตูดิโอ Crypto Live Data</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">แสดงราคาเหรียญแบบเรียลไทม์ในสตรีม</p>
                            </div>
                            <Controller
                                name="cryptoLiveData"
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
                    </div>
                )}
            </section>

            {/* Sound & Atmosphere Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Mic}
                        title="เสียงและบรรยากาศ"
                        isOpen={netcastSoundOpen}
                        onToggle={() => setNetcastSoundOpen(!netcastSoundOpen)}
                    />
                </div>

                {netcastSoundOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Atmosphere Volume Level */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground">ระดับเสียงบรรยากาศ</label>
                                <span className="text-xs text-neon-red font-medium">คาเฟ่</span>
                            </div>
                            <div className="relative">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-red to-red-400 rounded-full"
                                        style={{ width: `${netcastAtmosphereVol}%` }}
                                    ></div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    {...register("netcastAtmosphereVol", { valueAsNumber: true })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span>เงียบ</span>
                                <span>คาเฟ่</span>
                                <span>สตูดิโอ</span>
                                <span>ธรรมชาติ</span>
                                <span>ถนน</span>
                            </div>
                        </div>

                        {/* Add Realistic Human Sound */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                            <Controller
                                name="addRealisticHumanSound"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="w-4 h-4 rounded accent-neon-red"
                                    />
                                )}
                            />
                            <div className="flex-1">
                                <span className="text-xs font-medium text-foreground">เพิ่มเสียงมนุษย์สมจริง</span>
                                <p className="text-[10px] text-muted-foreground">เสียงถอนหายใจ, พลิกกระดาษ, จิบน้ำ</p>
                            </div>
                            <User className="w-4 h-4 text-neon-red" />
                        </div>
                    </div>
                )}
            </section>

            {/* Sales Banner & Closing Section */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={ShoppingBag}
                        title="สายป้ายยาและปิดการขาย"
                        isOpen={netcastSalesOpen}
                        onToggle={() => setNetcastSalesOpen(!netcastSalesOpen)}
                    />
                </div>

                {netcastSalesOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Product Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Settings className="w-3 h-3 text-muted-foreground" />
                                <label className="text-xs text-muted-foreground">ข้อมูลสินค้า</label>
                            </div>
                            <input
                                type="text"
                                {...register("salesProductId")}
                                placeholder="รหัสสินค้า (Product ID)"
                                className="w-full neon-input text-xs"
                            />
                        </div>

                        {/* 3D Floating Product Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                            <span className="text-xs font-medium text-foreground">โชว์สินค้า 3D ลอยตัว</span>
                            <Controller
                                name="show3DProduct"
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

                        {/* AI Scripting */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-muted-foreground" />
                                <label className="text-xs text-muted-foreground">AI Scripting</label>
                            </div>

                            {/* AI Hook Button */}
                            <button className="w-full py-3 px-4 rounded-xl font-medium text-white bg-neon-red hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                <Wand2 className="w-4 h-4" />
                                AI ช่วยคิด Hook หยุดนิ้ว
                            </button>

                            {/* AI CTA Button */}
                            <button className="w-full py-3 px-4 rounded-xl font-medium text-foreground bg-muted border border-border hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
                                <FileText className="w-4 h-4" />
                                AI เขียนบทปิดการขาย (CTA)
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Production & Preview Section (Combined) */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={Video}
                        title="การผลิตและพรีวิว"
                        isOpen={netcastProductionOpen}
                        onToggle={() => setNetcastProductionOpen(!netcastProductionOpen)}
                    />
                </div>

                {netcastProductionOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        {/* Aspect Ratio */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">สัดส่วนวิดีโอ (Aspect Ratio)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setValue("selectedAspectRatio", "9:16")}
                                    className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${selectedAspectRatio === '9:16'
                                        ? 'text-white bg-neon-red'
                                        : 'text-muted-foreground bg-muted border border-border hover:border-neon-red/50'
                                        }`}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="7" y="2" width="10" height="20" rx="2" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs font-medium">แนวตั้ง 9:16</div>
                                        <div className="text-[10px] opacity-70">TikTok</div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setValue("selectedAspectRatio", "16:9")}
                                    className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${selectedAspectRatio === '16:9'
                                        ? 'text-white bg-neon-red'
                                        : 'text-muted-foreground bg-muted border border-border hover:border-neon-red/50'
                                        }`}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="7" width="20" height="10" rx="2" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs font-medium">แนวนอน 16:9</div>
                                        <div className="text-[10px] opacity-70">YouTube</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Platform & Mode */}
                        <div className="flex items-start justify-between gap-4">
                            {/* Platform Selection */}
                            <div className="flex-1">
                                <label className="text-xs text-muted-foreground mb-2 block">แพลตฟอร์ม</label>
                                <div className="flex items-center bg-background rounded-xl border border-border overflow-hidden">
                                    <button
                                        onClick={() => setValue("selectedPlatform", "tiktok")}
                                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${selectedPlatform === 'tiktok' ? 'text-white bg-muted/50' : 'text-muted-foreground hover:text-white'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    </button>
                                    <div className="w-px h-8 bg-border"></div>
                                    <button
                                        onClick={() => setValue("selectedPlatform", "youtube")}
                                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${selectedPlatform === 'youtube' ? 'text-white bg-muted/50' : 'text-muted-foreground hover:text-white'
                                            }`}
                                    >
                                        <Youtube className="w-5 h-5" />
                                    </button>
                                    <div className="w-px h-8 bg-border"></div>
                                    <button
                                        onClick={() => setValue("selectedPlatform", "save")}
                                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${selectedPlatform === 'save' ? 'text-white bg-muted/50' : 'text-muted-foreground hover:text-white'
                                            }`}
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Mode */}
                            <div>
                                <label className="text-xs text-muted-foreground mb-2 block text-right">โหมด</label>
                                <div className="flex items-center justify-center bg-background rounded-xl border border-border py-3 px-6 hover:border-neon-red/50 transition-colors cursor-pointer">
                                    <Save className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        {/* Divider with Duration Title */}
                        <div className="flex items-center gap-2 pt-2">
                            <Clock className="w-4 h-4 text-neon-red" />
                            <span className="text-sm font-semibold text-foreground">ความยาว / จำนวนฉาก</span>
                        </div>

                        {/* Scene/Time Toggle Tabs */}
                        <div className="flex bg-muted/50 rounded-xl p-1 border border-border">
                            <button
                                onClick={() => setValue("durationMode", "scenes")}
                                className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${durationMode === 'scenes'
                                    ? 'bg-neon-red text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                ฉาก (Scenes)
                            </button>
                            <button
                                onClick={() => setValue("durationMode", "time")}
                                className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${durationMode === 'time'
                                    ? 'bg-neon-red text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                เวลา (Time)
                            </button>
                        </div>

                        {/* Scene Count Controls */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Scene Counter */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted/30">
                                    <div className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-foreground">
                                        {sceneCount}
                                    </div>
                                    <div className="flex flex-col border-l border-border">
                                        <button
                                            onClick={() => setValue("sceneCount", Math.min(sceneCount + 1, 10))}
                                            className="px-3 py-2 text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors"
                                        >
                                            <ChevronDown className="w-4 h-4 rotate-180" />
                                        </button>
                                        <div className="h-px bg-border"></div>
                                        <button
                                            onClick={() => setValue("sceneCount", Math.max(sceneCount - 1, 1))}
                                            className="px-3 py-2 text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors"
                                        >
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">จำนวนฉาก</span>
                            </div>

                            {/* Arrow */}
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-muted-foreground">ประมาณ</span>
                                <span className="text-muted-foreground">→</span>
                            </div>

                            {/* Total Duration */}
                            <div className="flex flex-col items-center p-4 rounded-xl border border-neon-red/30 bg-neon-red/5">
                                <span className="text-2xl font-bold text-neon-red">~{sceneCount * 8}s</span>
                                <span className="text-[10px] text-muted-foreground">ความยาวรวม</span>
                            </div>
                        </div>

                        {/* Auto-Calc Toggle */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                            <div className="w-2 h-2 rounded-full bg-neon-red"></div>
                            <div className="flex-1">
                                <span className="text-xs font-medium text-foreground">Auto-Calc</span>
                                <p className="text-[10px] text-muted-foreground">ระบบคำนวณจากความยาวเฉลี่ย 8 วินาทีต่อฉาก</p>
                            </div>
                        </div>

                        {/* Smart Loop Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                                <span className="text-xs font-medium text-foreground">โหมดวนซ้ำไร้รอยต่อ (Smart Loop)</span>
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
                            <Zap className="w-5 h-5" />
                            เริ่มสร้าง NetCast Pro
                        </>
                    )}
                </span>
            </button>
        </div>
    );
};

export default NetCastTab;
