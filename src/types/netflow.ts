// Shared types for Netflow AI dashboard

export type ClipCountOption = 5 | 10 | 25 | 50 | 100 | "unlimited";
export type AspectRatioOption = "9:16" | "16:9";
export type RestIntervalOption = "30s" | "1m" | "2m" | "5m" | "10m";
export type VideoDurationOption = "short" | "medium" | "long";
export type GenderOption = "male" | "female";
export type SaleStyleOption = "hard" | "soft" | "educational" | "storytelling";
export type LanguageOption = "th-central" | "th-north" | "th-south" | "th-isan";
export type TemplateOption =
    | "product-review"
    | "brainrot-product"
    | "unboxing"
    | "comparison"
    | "testimonial"
    | "flash-sale"
    | "tutorial"
    | "lifestyle"
    | "trending"
    | "mini-drama"
    | "before-after";
export type VoiceToneOption = "energetic" | "calm" | "friendly" | "professional";
export type EmotionSyncOption = "natural" | "lively" | "calm";
export type AgeRangeOption = "teen" | "young-adult" | "adult" | "middle-age" | "senior";
export type PersonalityOption = "cheerful" | "calm" | "professional" | "playful" | "mysterious";
export type ClothingStyleOption = "casual" | "formal" | "sporty" | "fashion" | "uniform";
export type BackgroundOption = "studio" | "outdoor" | "home" | "office" | "abstract";
export type VoiceSettingOption = "original" | "ai-generated" | "text-to-speech";
export type ExpressionOption = "neutral" | "happy" | "excited" | "serious";
export type CameraAngleOption = "front" | "side" | "close-up" | "full-body" | "dynamic";
export type MovementOption = "static" | "minimal" | "active";

// Option arrays for select elements
export const clipCountOptions: ClipCountOption[] = [5, 10, 25, 50, 100, "unlimited"];
export const restIntervalOptions: RestIntervalOption[] = ["30s", "1m", "2m", "5m", "10m"];

export const saleStyleOptions: { value: SaleStyleOption; label: string }[] = [
    { value: "hard", label: "สูงมาก" },
    { value: "soft", label: "สูง" },
    { value: "educational", label: "ปานกลาง" },
    { value: "storytelling", label: "ต่ำ" },
];

export const templateOptions: { value: TemplateOption; label: string; description: string }[] = [
    { value: "product-review", label: "รีวิวสินค้า (Product Review)", description: "เน้นรีวิวคุณภาพสินค้าและกลุ่มเป้าหมาย" },
    { value: "brainrot-product", label: "Brainrot + Product", description: "สไตล์ไวรัลผสมขายของ" },
    { value: "unboxing", label: "แกะกล่อง (Unboxing)", description: "เปิดกล่องสินค้าพร้อมรีวิว" },
    { value: "comparison", label: "เปรียบเทียบ (Comparison)", description: "เทียบสินค้าก่อน-หลังหรือคู่แข่ง" },
    { value: "testimonial", label: "รีวิวลูกค้า (Testimonial)", description: "เสียงจากลูกค้าจริง" },
    { value: "flash-sale", label: "Flash Sale", description: "โปรโมชั่นด่วน กระตุ้นตัดสินใจ" },
    { value: "tutorial", label: "สอนวิธีใช้ (How-To)", description: "สอนวิธีใช้สินค้าแบบ Step-by-Step" },
    { value: "lifestyle", label: "ไลฟ์สไตล์ (Lifestyle)", description: "แนะนำสินค้าผ่านการใช้ชีวิตประจำวัน" },
    { value: "trending", label: "ตามเทรนด์ (Trending)", description: "คอนเทนต์ตามกระแสไวรัล" },
    { value: "mini-drama", label: "มินิดราม่า (Mini-Drama)", description: "เล่าเรื่องสั้นๆ แบบละคร" },
    { value: "before-after", label: "ก่อน-หลัง (Before-After)", description: "แสดงผลลัพธ์ก่อนและหลังใช้" },
];

export const languageOptions: { value: LanguageOption; label: string }[] = [
    { value: "th-central", label: "ไทย" },
    { value: "th-north", label: "อังกฤษ" },
    { value: "th-south", label: "ลาว" },
    { value: "th-isan", label: "จีน" },
];

export const accentOptions: { value: string; label: string }[] = [
    { value: "central", label: "กลาง" },
    { value: "north", label: "เหนือ" },
    { value: "south", label: "ใต้" },
    { value: "isan", label: "อีสาน" },
];

export const voiceToneOptions: { value: VoiceToneOption; label: string }[] = [
    { value: "energetic", label: "ตื่นเต้น/กระตือรือร้น" },
    { value: "calm", label: "สงบ/ผ่อนคลาย" },
    { value: "friendly", label: "เป็นกันเอง/อบอุ่น" },
    { value: "professional", label: "มืออาชีพ/น่าเชื่อถือ" },
];

export interface VideoGenerationResponse {
    message: string;
    data?: any;
}

export interface AdvancedVideoRequest {
    productName: string;
    prompt: string;
    userImage?: string; // Base64 or Blob URL
    style: string;
    loopCount: number; // 1, 3, 5
    concatenate: boolean;
}

export interface GeneratedAsset {
    type: 'image' | 'video' | 'audio';
    url: string;
    blob?: Blob;
}
