import { Terminal } from "lucide-react";
import { ConsoleLogSectionProps } from "./types";

const ConsoleLogSection = ({ logs }: ConsoleLogSectionProps) => {
    return (
        <section className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/50">
                <Terminal className="w-4 h-4 text-neon-red" />
                <span className="text-xs font-medium">Console Log</span>
            </div>
            <div className="p-3 space-y-1 h-24 overflow-y-auto bg-background/70 font-mono text-[10px]">
                {logs.map((log, index) => (
                    <div
                        key={index}
                        className={`${log.includes("สำเร็จ") ? "text-green-500" : "text-muted-foreground"
                            }`}
                    >
                        {log}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ConsoleLogSection;
