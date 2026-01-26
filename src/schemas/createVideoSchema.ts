import { z } from "zod";

/**
 * Simplified Video Creation Schema
 * Only essential fields that directly affect AI prompt generation
 */
export const createVideoSchema = z.object({
    // === Product Data ===
    productId: z.string().default(""),           // For TikTok Pin Cart
    productName: z.string().min(1, "กรุณาระบุชื่อสินค้า"),

    // === Script Settings ===
    template: z.enum([
        "product-review",    // รีวิวสินค้า
        "unboxing",          // แกะกล่อง
        "comparison",        // เปรียบเทียบ
        "testimonial",       // รีวิวลูกค้า
        "flash-sale",        // Flash Sale
        "tutorial",          // สอนใช้งาน
        "lifestyle",         // ไลฟ์สไตล์
        "before-after"       // ก่อน-หลัง
    ]).default("product-review"),

    saleStyle: z.enum([
        "hard",              // ขายแรง
        "soft",              // ขายนุ่ม
        "educational",       // ให้ความรู้
        "storytelling"       // เล่าเรื่อง
    ]).default("soft"),

    voiceTone: z.enum([
        "energetic",         // ตื่นเต้น
        "calm",              // สงบ
        "friendly",          // เป็นกันเอง
        "professional"       // มืออาชีพ
    ]).default("friendly"),

    language: z.enum([
        "th",                // ไทยกลาง
        "th-north",          // เหนือ
        "th-south",          // ใต้
        "th-isan"            // อีสาน
    ]).default("th"),

    // === Character/Visual ===
    gender: z.enum(["male", "female"]).default("female"),

    // === Hook & CTA ===
    hookEnabled: z.boolean().default(true),
    hookText: z.string().default(""),
    ctaEnabled: z.boolean().default(true),
    ctaText: z.string().default(""),

    // === Additional Prompt ===
    aiPrompt: z.string().default(""),            // User's custom instructions

    // === Video Settings ===
    aspectRatio: z.enum(["9:16", "16:9"]).default("9:16"),
});

export type CreateVideoFormData = z.infer<typeof createVideoSchema>;

// Default values
export const createVideoDefaultValues: CreateVideoFormData = {
    productId: "",
    productName: "",
    template: "product-review",
    saleStyle: "soft",
    voiceTone: "friendly",
    language: "th",
    gender: "female",
    hookEnabled: true,
    hookText: "",
    ctaEnabled: true,
    ctaText: "",
    aiPrompt: "",
    aspectRatio: "9:16",
};
