import { Controller } from "react-hook-form";
import { Settings, Infinity as InfinityIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SectionHeader from "./SectionHeader";
import { GenerationSettingsSectionProps } from "./types";
import { clipCountOptions, restIntervalOptions } from "@/types/netflow";

const GenerationSettingsSection = ({
    register,
    control,
    setValue,
    watch,
    isOpen,
    onToggle
}: GenerationSettingsSectionProps) => {
    const clipCount = watch("clipCount");
    const videoDuration = watch("videoDuration");

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={Settings}
                    title="การตั้งค่าการสร้าง"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
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
                </div>
            )}
        </section>
    );
};

export default GenerationSettingsSection;
