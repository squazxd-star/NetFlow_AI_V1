import { Controller } from "react-hook-form";
import {
    FileText, Stars, Pencil, RefreshCw, Mic, Sparkles, Globe
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { AiScriptSectionProps } from "./types";
import {
    templateOptions,
    voiceToneOptions,
    saleStyleOptions,
    languageOptions,
    accentOptions,
} from "@/types/netflow";

const AiScriptSection = ({
    register,
    control,
    setValue,
    watch,
    isOpen,
    onToggle
}: AiScriptSectionProps) => {
    const useAiScript = watch("useAiScript");
    const template = watch("template");
    const hookEnabled = watch("hookEnabled");
    const ctaEnabled = watch("ctaEnabled");
    const isAiMode = useAiScript;

    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={FileText}
                    title="สคริปต์ AI"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Script Type Toggle - AI vs Manual */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                            ประเภทสคริปต์
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setValue("useAiScript", true)}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${useAiScript
                                    ? 'bg-neon-red text-white'
                                    : 'bg-muted text-muted-foreground border border-border'
                                    }`}
                            >
                                <Stars className="w-4 h-4" />
                                AI สร้างอัตโนมัติ
                            </button>
                            <button
                                onClick={() => setValue("useAiScript", false)}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${!useAiScript
                                    ? 'bg-neon-red text-white'
                                    : 'bg-muted text-muted-foreground border border-border'
                                    }`}
                            >
                                <Pencil className="w-4 h-4" />
                                เขียนเอง
                            </button>
                        </div>
                    </div>

                    {/* Template Selection - Always available */}
                    <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                            เทมเพลตสคริปต์
                        </label>
                        <select
                            {...register("template")}
                            className="w-full neon-select"
                        >
                            {templateOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {templateOptions.find(t => t.value === template)?.description}
                        </p>
                    </div>

                    {/* Prompt - Disabled in AI mode */}
                    <div>
                        <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                            <RefreshCw className="w-3 h-3" />
                            คำสั่งเพิ่มเติม (Prompt)
                        </label>
                        <textarea
                            {...register("aiPrompt")}
                            placeholder="ระบุรายละเอียดเพิ่มเติม เช่น จุดเด่นที่ต้องการเน้น, คำที่ต้องการใช้, สิ่งที่ต้องการหลีกเลี่ยง..."
                            rows={3}
                            disabled={isAiMode}
                            className={`w-full neon-textarea transition-all ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Sale Style & Voice Tone - Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                <Mic className="w-3 h-3" />
                                น้ำเสียง & อารมณ์
                            </label>
                            <select
                                {...register("voiceTone")}
                                disabled={isAiMode}
                                className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {voiceToneOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                <Sparkles className="w-3 h-3" />
                                ระดับพลังงาน
                            </label>
                            <select
                                {...register("saleStyle")}
                                disabled={isAiMode}
                                className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {saleStyleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Language & Dialect Selection - Always available */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                ภาษา
                            </label>
                            <select
                                {...register("language")}
                                className="w-full neon-select"
                            >
                                {languageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                สำเนียง/ภาษาถิ่น
                            </label>
                            <select
                                disabled={isAiMode}
                                className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {accentOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Hook & CTA - Disabled in AI mode */}
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
                                            disabled={isAiMode}
                                            className={`w-3 h-3 rounded accent-neon-red ${isAiMode ? 'opacity-50' : ''}`}
                                        />
                                    )}
                                />
                                <label className={`text-xs ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    ประโยคเปิด (Hook)
                                </label>
                            </div>
                            <input
                                type="text"
                                {...register("hookText")}
                                placeholder="เช่น หยุดดูคลิปนี้ก่อน..."
                                disabled={!hookEnabled || isAiMode}
                                className={`w-full neon-input text-xs ${(!hookEnabled || isAiMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                            disabled={isAiMode}
                                            className={`w-3 h-3 rounded accent-neon-red ${isAiMode ? 'opacity-50' : ''}`}
                                        />
                                    )}
                                />
                                <label className={`text-xs ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                    ปุ่มกระตุ้น (CTA)
                                </label>
                            </div>
                            <input
                                type="text"
                                {...register("ctaText")}
                                placeholder="เช่น กดตะกร้าเลย..."
                                disabled={!ctaEnabled || isAiMode}
                                className={`w-full neon-input text-xs ${(!ctaEnabled || isAiMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Keyword Tags - Disabled in AI mode */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs mb-1.5 block ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                คำสำคัญที่ต้องใช้
                            </label>
                            <input
                                type="text"
                                {...register("mustUseKeywords")}
                                placeholder="ค้นด้วยเครื่องหมาย จุลภาค"
                                disabled={isAiMode}
                                className={`w-full neon-input text-xs ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                        <div>
                            <label className={`text-xs mb-1.5 block ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                คำที่ต้องหลีกเลี่ยง
                            </label>
                            <input
                                type="text"
                                {...register("avoidKeywords")}
                                placeholder="ค้นด้วยเครื่องหมาย จุลภาค"
                                disabled={isAiMode}
                                className={`w-full neon-input text-xs ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AiScriptSection;
