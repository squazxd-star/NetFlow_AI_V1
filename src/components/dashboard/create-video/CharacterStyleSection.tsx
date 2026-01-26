import {
    User, Plus, Image, Settings, Sparkles, Palette, Video, RefreshCw, Mic, Check
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { CharacterStyleSectionProps } from "./types";
import {
    ClothingStyleOption,
    ExpressionOption,
    CameraAngleOption,
    MovementOption,
} from "@/types/netflow";

const CharacterStyleSection = ({
    register,
    setValue,
    watch,
    getValues,
    isOpen,
    onToggle,
    characterImages,
    onCharacterUpload
}: CharacterStyleSectionProps) => {
    const gender = watch("gender");
    const clothingStyles = watch("clothingStyles");
    const touchLevel = watch("touchLevel");
    const expression = watch("expression");
    const cameraAngles = watch("cameraAngles");
    const movement = watch("movement");

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

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={User}
                    title="ตัวละคร & สไตล์"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
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
                                    onClick={() => onCharacterUpload(index)}
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
    );
};

export default CharacterStyleSection;
