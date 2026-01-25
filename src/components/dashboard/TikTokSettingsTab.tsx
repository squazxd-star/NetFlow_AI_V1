import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus, Wand2, ChevronDown, FileText, Sparkles,
    Clock, RefreshCw, Check, ShoppingBag, Link, Globe
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { tikTokSettingsSchema, TikTokSettingsFormData, tikTokSettingsDefaultValues } from "@/schemas";

// SectionHeader Component
const SectionHeader = ({
    icon: Icon,
    title,
    isOpen,
    onToggle,
    badge
}: {
    icon: React.ElementType;
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    badge?: string;
}) => (
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

const TikTokSettingsTab = () => {
    // React Hook Form setup
    const form = useForm<TikTokSettingsFormData>({
        resolver: zodResolver(tikTokSettingsSchema),
        defaultValues: tikTokSettingsDefaultValues,
    });

    const { register, control, getValues } = form;

    // UI State (section open/close - stays as useState)
    const [productDataOpen, setProductDataOpen] = useState(true);
    const [characterImages, setCharacterImages] = useState<(string | null)[]>([null, null]);

    // Synced products (static data - stays as useState)
    const [syncedProducts] = useState([
        { id: "1729384756", name: "ครีมกันแดด SPF50+", image: true },
        { id: "1729384921", name: "เซรั่มวิตามินซี", image: true },
        { id: "1729385102", name: "มาส์กหน้าคอลลาเจน", image: true },
    ]);

    const handleCharacterUpload = (index: number) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newImages = [...characterImages];
                    newImages[index] = e.target?.result as string;
                    setCharacterImages(newImages);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // Form submission handler
    const onSubmit = (data: TikTokSettingsFormData) => {
        console.log("TikTok settings form data ready:", data);
        // TODO: Send to backend
    };

    return (
        <div className="p-4 space-y-3">
            {/* TikTok Shop Connection Banner */}
            <section className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-neon-red" />
                        <span className="text-sm font-semibold text-foreground">ข้อมูลสินค้า</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">สำหรับเชื่อมต่อ TikTok Shop</span>
                </div>

                {/* Sync Button */}
                <button className="w-full py-3 rounded-xl font-medium text-white bg-neon-red hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    ซิงค์รหัสสินค้าจาก TikTok Studio
                </button>

                {/* Status */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-green-500 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Studio Extension Active
                    </span>
                    <span className="text-muted-foreground">Last Synced: 2 mins ago</span>
                </div>
            </section>

            {/* Auto-detect Product ID */}
            <section className="glass-card p-4 space-y-3">
                <button className="w-full py-3 rounded-xl font-medium text-foreground bg-muted border border-border hover:border-neon-red/50 transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-neon-red" />
                    Auto-detect Product ID
                </button>
                <p className="text-[10px] text-muted-foreground text-center">
                    ระบบจะตรวจจับรหัสสินค้าจากหน้าเว็บอัตโนมัติ
                </p>
            </section>

            {/* Synced Products List */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-neon-red" />
                        <span className="text-sm font-semibold text-foreground">รายการสินค้าที่ซิงค์</span>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    {syncedProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                                IMG
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                                <p className="text-[10px] text-muted-foreground">ID: {product.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>



            {/* Product Data Card */}
            <section className="glass-card overflow-hidden">
                <div className="px-4 pt-3">
                    <SectionHeader
                        icon={ShoppingBag}
                        title="ข้อมูลสินค้า"
                        isOpen={productDataOpen}
                        onToggle={() => setProductDataOpen(!productDataOpen)}
                    />
                </div>

                {productDataOpen && (
                    <div className="px-4 pb-4 space-y-4">
                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">
                                รหัสสินค้า (TikTok)
                            </label>
                            <input
                                type="text"
                                {...register("productId")}
                                placeholder="ตัวอย่าง 1729384..."
                                className="w-full neon-input"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">
                                ใส่รหัสสินค้าจาก TikTok Shop เพื่อเชื่อมต่ออัตโนมัติ
                            </p>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">
                                ชื่อสินค้า
                            </label>
                            <input
                                type="text"
                                {...register("productName")}
                                placeholder="ระบุชื่อสินค้า..."
                                className="w-full neon-input"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">
                                รูปภาพ (สูงสุด 2)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {characterImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleCharacterUpload(index)}
                                        className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200 overflow-hidden"
                                    >
                                        {img ? (
                                            <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <Plus className="w-6 h-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">คลิกเพื่ออัปโหลด</span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* AI Product Analysis */}
            <section className="glass-card p-4 space-y-4">
                <h2 className="text-sm font-semibold text-neon-red flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    AI วิเคราะห์สินค้า
                    <span className="text-[10px] text-muted-foreground font-normal ml-auto">อัตโนมัติ</span>
                </h2>

                <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">กลุ่มเป้าหมายที่แนะนำ</span>
                            <span className="text-xs text-neon-red">AI แนะนำ</span>
                        </div>
                        <p className="text-sm text-foreground">วัยรุ่น-วัยทำงาน, สนใจความงาม</p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">จุดเด่นหลัก</span>
                            <span className="text-xs text-neon-red">AI แนะนำ</span>
                        </div>
                        <p className="text-sm text-foreground">รอข้อมูลสินค้า...</p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">แฮชแท็กแนะนำ</span>
                            <span className="text-xs text-neon-red">AI แนะนำ</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-neon-red/10 text-neon-red">#สินค้าขายดี</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-neon-red/10 text-neon-red">#ของมันต้องมี</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-neon-red/10 text-neon-red">#รีวิว</span>
                        </div>
                    </div>
                </div>

                <button className="w-full py-2.5 rounded-xl text-sm font-medium text-neon-red border border-neon-red hover:bg-neon-red/10 transition-colors">
                    <span className="flex items-center justify-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        วิเคราะห์ใหม่ด้วย AI
                    </span>
                </button>
            </section>

            {/* Posting Schedule */}
            <section className="glass-card p-4 space-y-4">
                <h2 className="text-sm font-semibold text-neon-red flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ตั้งค่าการโพสต์
                </h2>

                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                            เวลาที่ดีที่สุดสำหรับโพสต์
                        </label>
                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">AI แนะนำ: 18:00 - 21:00</span>
                                <span className="text-xs text-green-500">Engagement สูง</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                            ความถี่ในการโพสต์
                        </label>
                        <select
                            {...register("postingFrequency")}
                            className="w-full neon-select"
                        >
                            <option value="auto">อัตโนมัติ (AI ตัดสินใจ)</option>
                            <option value="1h">ทุก 1 ชั่วโมง</option>
                            <option value="2h">ทุก 2 ชั่วโมง</option>
                            <option value="4h">ทุก 4 ชั่วโมง</option>
                            <option value="daily">วันละครั้ง</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                            Caption อัตโนมัติ
                        </label>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                            <span className="text-sm text-foreground">ให้ AI สร้าง Caption</span>
                            <Controller
                                name="autoCaption"
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
                        <p className="text-[10px] text-muted-foreground mt-1">
                            AI จะสร้าง caption ที่เหมาะสมกับเนื้อหาและใส่แฮชแท็กให้อัตโนมัติ
                        </p>
                    </div>

                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                            การแจ้งเตือน
                        </label>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                            <span className="text-sm text-foreground">แจ้งเตือนเมื่อโพสต์สำเร็จ</span>
                            <Controller
                                name="notifications"
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
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <button
                onClick={form.handleSubmit(onSubmit)}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
                <span className="flex items-center justify-center gap-2">
                    บันทึกการตั้งค่า
                </span>
            </button>
        </div>
    );
};

export default TikTokSettingsTab;
