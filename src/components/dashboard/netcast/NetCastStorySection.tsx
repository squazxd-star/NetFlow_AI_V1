import { Sparkles, FileText, MessageSquare, Plus } from "lucide-react";
import { SectionHeader } from "../create-video";
import { NetCastStorySectionProps } from "./types";

const NetCastStorySection = ({
    register,
    setValue,
    getValues,
    watch,
    isOpen,
    onToggle,
    showCustomStyleInput,
    setShowCustomStyleInput
}: NetCastStorySectionProps) => {
    const selectedStoryStyle = watch("selectedStoryStyle");

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={Sparkles}
                    title="เนื้อเรื่องและสไตล์"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
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
    );
};

export default NetCastStorySection;
