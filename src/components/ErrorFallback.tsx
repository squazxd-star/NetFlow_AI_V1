import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
    error: Error | null;
    onRetry?: () => void;
}

/**
 * Error fallback UI component displayed when an error is caught.
 * Shows error message and retry button styled to match the neon theme.
 */
const ErrorFallback = ({ error, onRetry }: ErrorFallbackProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
            {/* Error Icon */}
            <div className="relative mb-4">
                <div className="absolute -inset-2 bg-red-500/20 blur-lg rounded-full"></div>
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <AlertTriangle className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Error Title */}
            <h3 className="text-lg font-bold text-foreground mb-2">
                เกิดข้อผิดพลาด
            </h3>

            {/* Error Message */}
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                ขออภัย เกิดข้อผิดพลาดในการแสดงผลส่วนนี้
            </p>

            {/* Error Details (dev mode) */}
            {error && import.meta.env.DEV && (
                <div className="w-full max-w-md mb-4 p-3 rounded-lg bg-black/40 border border-red-500/20">
                    <p className="text-[10px] font-mono text-red-400 break-all">
                        {error.message}
                    </p>
                </div>
            )}

            {/* Retry Button */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-neon-red hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <RefreshCw className="w-4 h-4" />
                    ลองใหม่อีกครั้ง
                </button>
            )}

            {/* Help Text */}
            <p className="text-xs text-muted-foreground/70 mt-4">
                หากปัญหายังคงอยู่ กรุณารีเฟรชหน้าเว็บ
            </p>
        </div>
    );
};

export default ErrorFallback;
