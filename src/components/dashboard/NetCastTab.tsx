import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, Loader2 } from "lucide-react";
import { netCastSchema, NetCastFormData, netCastDefaultValues } from "@/schemas";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import {
    NetCastHeroBanner,
    NetCastStorySection,
    NetCastCharacterSection,
    NetCastQualitySection,
    NetCastSoundSection,
    NetCastSalesSection,
    NetCastProductionSection
} from "./netcast";

const NetCastTab = () => {
    // React Hook Form setup
    const form = useForm<NetCastFormData>({
        resolver: zodResolver(netCastSchema),
        defaultValues: netCastDefaultValues,
    });

    const { generate, isLoading } = useVideoGeneration();

    const { register, control, watch, setValue, getValues } = form;

    // Watch netcastMode for hero banner
    const netcastMode = watch("netcastMode");

    // UI State (section open/close - stays as useState)
    const [netcastStoryOpen, setNetcastStoryOpen] = useState(true);
    const [netcastCharacterOpen, setNetcastCharacterOpen] = useState(true);
    const [netcastQualityOpen, setNetcastQualityOpen] = useState(true);
    const [netcastSoundOpen, setNetcastSoundOpen] = useState(true);
    const [netcastSalesOpen, setNetcastSalesOpen] = useState(true);
    const [netcastProductionOpen, setNetcastProductionOpen] = useState(true);
    const [showCustomStyleInput, setShowCustomStyleInput] = useState(false);

    // Form submission handler
    const onSubmit = async (data: NetCastFormData) => {
        console.log("NetCast form data ready:", data);
        await generate({
            type: "netcast-pro",
            ...data
        });
    };

    // Shared props for section components
    const sectionProps = {
        register,
        control,
        setValue,
        getValues,
        watch: watch as <T extends keyof NetCastFormData>(name: T) => NetCastFormData[T]
    };

    return (
        <div className="p-4 space-y-3">
            {/* Main NetCast Pro Banner - Hero Style Refined */}
            <NetCastHeroBanner
                netcastMode={netcastMode}
                setValue={setValue}
            />

            {/* Story and Style Section */}
            <NetCastStorySection
                {...sectionProps}
                isOpen={netcastStoryOpen}
                onToggle={() => setNetcastStoryOpen(!netcastStoryOpen)}
                showCustomStyleInput={showCustomStyleInput}
                setShowCustomStyleInput={setShowCustomStyleInput}
            />

            {/* Smart Character Settings */}
            <NetCastCharacterSection
                {...sectionProps}
                isOpen={netcastCharacterOpen}
                onToggle={() => setNetcastCharacterOpen(!netcastCharacterOpen)}
            />

            {/* Quality & Emotion Control */}
            <NetCastQualitySection
                {...sectionProps}
                isOpen={netcastQualityOpen}
                onToggle={() => setNetcastQualityOpen(!netcastQualityOpen)}
            />

            {/* Sound & Atmosphere Section */}
            <NetCastSoundSection
                {...sectionProps}
                isOpen={netcastSoundOpen}
                onToggle={() => setNetcastSoundOpen(!netcastSoundOpen)}
            />

            {/* Sales Banner & Closing Section */}
            <NetCastSalesSection
                {...sectionProps}
                isOpen={netcastSalesOpen}
                onToggle={() => setNetcastSalesOpen(!netcastSalesOpen)}
            />

            {/* Production & Preview Section */}
            <NetCastProductionSection
                {...sectionProps}
                isOpen={netcastProductionOpen}
                onToggle={() => setNetcastProductionOpen(!netcastProductionOpen)}
            />

            {/* Main Action Button */}
            <button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                <span className="flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            กำลังส่งคำสั่ง...
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5" />
                            เริ่มสร้าง NetCast Pro
                        </>
                    )}
                </span>
            </button>
        </div>
    );
};

export default NetCastTab;
