import { ShoppingBag, Link, FileText, Image, Plus, Sparkles } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { ProductDataSectionProps } from "./types";

const ProductDataSection = ({
    register,
    isOpen,
    onToggle,
    productImages,
    onProductImageUpload
}: ProductDataSectionProps) => {
    return (
        <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
                <SectionHeader
                    icon={ShoppingBag}
                    title="ข้อมูลสินค้า"
                    isOpen={isOpen}
                    onToggle={onToggle}
                />
            </div>

            {isOpen && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Product ID */}
                    <div>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Link className="w-3 h-3 text-neon-red" />
                            รหัสสินค้า (TikTok)
                        </label>
                        <input
                            type="text"
                            {...register("productId")}
                            placeholder="ตัวอย่าง 1729384..."
                            className="w-full neon-input text-xs"
                        />
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <FileText className="w-3 h-3 text-neon-red" />
                            ชื่อสินค้า
                        </label>
                        <input
                            type="text"
                            {...register("productName")}
                            placeholder="ระบุชื่อสินค้า..."
                            className="w-full neon-input text-xs"
                        />
                    </div>

                    {/* Product Images */}
                    <div>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Image className="w-3 h-3 text-neon-red" />
                            รูปภาพ (สูงสุด 2)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {productImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => onProductImageUpload(index)}
                                    className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200 overflow-hidden"
                                >
                                    {img ? (
                                        <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Plus className="w-6 h-6 text-muted-foreground" />
                                            <span className="text-[10px] text-muted-foreground">คลิกเพื่อเลือก</span>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                        <Sparkles className="w-4 h-4 text-neon-red flex-shrink-0" />
                        <p className="text-[10px] text-muted-foreground">
                            AI จะวิเคราะห์ข้อมูลสินค้าเพื่อสร้างคลิปโฆษณาได้ตรงจุด
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductDataSection;
