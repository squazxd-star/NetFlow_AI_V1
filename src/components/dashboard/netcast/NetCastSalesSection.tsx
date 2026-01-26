import { Controller } from "react-hook-form";
import { ShoppingBag, Settings, Sparkles, Wand2, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "../create-video";
import { NetCastSalesSectionProps } from "./types";

const NetCastSalesSection = ({
    register,
    control,
    isOpen,
    onToggle
}: NetCastSalesSectionProps) => {
    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={ShoppingBag}
                    title="สายป้ายยาและปิดการขาย"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Product Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-3 h-3 text-muted-foreground" />
                            <label className="text-xs text-muted-foreground">ข้อมูลสินค้า</label>
                        </div>
                        <input
                            type="text"
                            {...register("salesProductId")}
                            placeholder="รหัสสินค้า (Product ID)"
                            className="w-full neon-input text-xs"
                        />
                    </div>

                    {/* 3D Floating Product Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                        <span className="text-xs font-medium text-foreground">โชว์สินค้า 3D ลอยตัว</span>
                        <Controller
                            name="show3DProduct"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-neon-red"
                                />
                            )}
                        />
                    </div>

                    {/* AI Scripting */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-muted-foreground" />
                            <label className="text-xs text-muted-foreground">AI Scripting</label>
                        </div>

                        {/* AI Hook Button */}
                        <button className="w-full py-3 px-4 rounded-xl font-medium text-white bg-neon-red hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            AI ช่วยคิด Hook หยุดนิ้ว
                        </button>

                        {/* AI CTA Button */}
                        <button className="w-full py-3 px-4 rounded-xl font-medium text-foreground bg-muted border border-border hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            AI เขียนบทปิดการขาย (CTA)
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default NetCastSalesSection;
