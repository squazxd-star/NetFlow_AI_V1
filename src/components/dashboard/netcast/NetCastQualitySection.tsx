import { Controller } from "react-hook-form";
import { Palette, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "../create-video";
import { NetCastQualitySectionProps } from "./types";

const NetCastQualitySection = ({
    register,
    control,
    setValue,
    watch,
    isOpen,
    onToggle
}: NetCastQualitySectionProps) => {
    const netcastEmotion = watch("netcastEmotion");
    const netcastBgStyle = watch("netcastBgStyle");

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={Palette}
                    title="ควบคุมภาพและอารมณ์"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>
            {isOpen && (
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
    );
};

export default NetCastQualitySection;
