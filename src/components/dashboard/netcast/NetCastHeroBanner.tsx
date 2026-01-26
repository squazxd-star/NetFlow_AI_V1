import { Radio, Sparkles, Mic, FileText, BookOpen } from "lucide-react";
import { NetCastHeroBannerProps } from "./types";

const NetCastHeroBanner = ({ netcastMode, setValue }: NetCastHeroBannerProps) => {
    return (
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
    );
};

export default NetCastHeroBanner;
