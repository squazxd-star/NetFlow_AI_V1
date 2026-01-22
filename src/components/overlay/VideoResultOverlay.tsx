import React, { useEffect, useState } from 'react';
import { X, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoResultOverlayProps {
    videoUrl: string;
    onClose: () => void;
}

const VideoResultOverlay: React.FC<VideoResultOverlayProps> = ({ videoUrl, onClose }) => {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-gray-800 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#121212]">
                    <div className="flex items-center gap-2">
                        <Play className="w-5 h-5 text-red-500 fill-current" />
                        <h2 className="text-lg font-semibold text-white">NetFlow AI Video Result</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Video Player */}
                <div className="relative aspect-video bg-black flex items-center justify-center group">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-[#121212]">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-300 hover:text-white"
                    >
                        Close
                    </Button>
                    <a
                        href={videoUrl}
                        download="netflow-video.mp4"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                            <Download className="w-4 h-4" />
                            Download Video
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VideoResultOverlay;
