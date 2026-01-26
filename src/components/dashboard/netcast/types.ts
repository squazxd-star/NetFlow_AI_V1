import { UseFormRegister, Control, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { NetCastFormData } from "@/schemas";

// Shared props for NetCast section components
export interface NetCastSectionProps {
    register: UseFormRegister<NetCastFormData>;
    control: Control<NetCastFormData>;
    setValue: UseFormSetValue<NetCastFormData>;
    getValues: UseFormGetValues<NetCastFormData>;
    watch: <T extends keyof NetCastFormData>(name: T) => NetCastFormData[T];
}

export interface NetCastStorySectionProps extends NetCastSectionProps {
    isOpen: boolean;
    onToggle: () => void;
    showCustomStyleInput: boolean;
    setShowCustomStyleInput: (value: boolean) => void;
}

export interface NetCastCharacterSectionProps extends NetCastSectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export interface NetCastQualitySectionProps extends NetCastSectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export interface NetCastSoundSectionProps extends NetCastSectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export interface NetCastSalesSectionProps extends NetCastSectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export interface NetCastProductionSectionProps extends NetCastSectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export interface NetCastHeroBannerProps {
    netcastMode: "podcast" | "storyboard" | "script";
    setValue: UseFormSetValue<NetCastFormData>;
}
