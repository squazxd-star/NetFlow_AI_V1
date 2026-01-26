import { Controller } from "react-hook-form";
import { Mic, User } from "lucide-react";
import { SectionHeader } from "../create-video";
import { NetCastSoundSectionProps } from "./types";

const NetCastSoundSection = ({
    register,
    control,
    watch,
    isOpen,
    onToggle
}: NetCastSoundSectionProps) => {
    const netcastAtmosphereVol = watch("netcastAtmosphereVol");

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={Mic}
                    title="เสียงและบรรยากาศ"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
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
    );
};

export default NetCastSoundSection;
