import { User, Plus, Camera } from "lucide-react";
import { SectionHeader } from "../create-video";
import { NetCastCharacterSectionProps } from "./types";

const NetCastCharacterSection = ({
    register,
    isOpen,
    onToggle
}: NetCastCharacterSectionProps) => {
    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={User}
                    title="ตั้งค่าตัวตนอัจฉริยะ"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>
            {isOpen && (
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
    );
};

export default NetCastCharacterSection;
