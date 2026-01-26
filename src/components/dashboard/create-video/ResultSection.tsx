import { Sparkles, Terminal, Download } from "lucide-react";
import { ResultSectionProps } from "./types";

const ResultSection = ({
    result,
    hasVideo,
    hasImage,
    onDownloadVideo
}: ResultSectionProps) => {
    if (!result) return null;

    return (
        <section className="glass-card overflow-hidden border border-green-500/30">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-green-500/10">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">ผลลัพธ์การสร้าง (Result)</span>
            </div>

            <div className="p-4 space-y-4">
                {/* Script Display */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-foreground">📜 สคริปต์ที่ได้ (Script)</label>
                        <span className="text-[10px] text-muted-foreground">OpenAI/Gemini</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap max-h-60 overflow-y-auto border border-border font-sans">
                        {result.data?.script || "No script generated"}
                    </div>
                </div>

                {/* Debug Prompt Display */}
                {result.data?.generatedPrompt && (
                    <div className="border-t border-border pt-4">
                        <label className="text-[10px] font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            <Terminal className="w-3 h-3" />
                            Debug Prompt (ข้อมูลที่ส่งไป AI):
                        </label>
                        <div className="p-2 bg-black/40 rounded text-[10px] font-mono text-muted-foreground whitespace-pre-wrap h-24 overflow-y-auto">
                            {result.data.generatedPrompt}
                        </div>
                    </div>
                )}

                {/* Visual Display (Video or Image) */}
                {(hasVideo || hasImage) && (
                    <div className="border-t border-border pt-4">
                        <label className="text-xs font-semibold text-foreground mb-2 block">
                            {hasVideo ? "🎬 วิดีโอตัวอย่าง" : "🖼️ รูปภาพตัวอย่าง (DALL-E 3)"}
                        </label>

                        {hasVideo ? (
                            <>
                                <video controls src={result.data?.videoUrl} className="w-full rounded-lg shadow-lg bg-black aspect-[9/16]" />
                                <button
                                    onClick={onDownloadVideo}
                                    className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-3 h-3" /> ดาวน์โหลดวิดีโอ
                                </button>
                            </>
                        ) : (
                            <>
                                <img src={result.data?.imageUrl} alt="Generated Visual" className="w-full rounded-lg shadow-lg bg-black aspect-[9/16] object-cover" />
                                <a
                                    href={result.data?.imageUrl}
                                    download={`netflow-ai-generated-${Date.now()}.png`}
                                    className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-3 h-3" /> ดาวน์โหลดรูปภาพ
                                </a>
                                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                    ⚠️ หมายเหตุ: สร้างเป็นภาพแทนเนื่องจาก API Video ไม่พร้อมใช้งาน
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ResultSection;
