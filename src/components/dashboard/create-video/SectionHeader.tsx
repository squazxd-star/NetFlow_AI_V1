import { ChevronDown } from "lucide-react";

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    badge?: string;
}

const SectionHeader = ({
    icon: Icon,
    title,
    isOpen,
    onToggle,
    badge
}: SectionHeaderProps) => (
    <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2"
    >
        <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-neon-red" />
            <span className="text-sm font-semibold text-foreground">{title}</span>
            {badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-red/10 text-neon-red">
                    {badge}
                </span>
            )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
);

export default SectionHeader;
