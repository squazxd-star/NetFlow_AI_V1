import { Controller } from "react-hook-form";
import { Video, Youtube, Save, Clock, ChevronDown, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "../create-video";
import { NetCastProductionSectionProps } from "./types";

const NetCastProductionSection = ({
    register,
    control,
    setValue,
    watch,
    isOpen,
    onToggle
}: NetCastProductionSectionProps) => {
    const selectedAspectRatio = watch("selectedAspectRatio");
    const selectedPlatform = watch("selectedPlatform");
    const durationMode = watch("durationMode");
    const sceneCount = watch("sceneCount");

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={Video}
                    title="การผลิตและพรีวิว"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
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
    );
};

export default NetCastProductionSection;
