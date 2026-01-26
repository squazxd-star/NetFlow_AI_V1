import { z } from "zod";

export const createVideoSchema = z.object({
    // Product Data
    productId: z.string().default(""),
    productName: z.string().min(1, "กรุณาระบุชื่อสินค้า").default(""),
    productDescription: z.string().default(""),

    // AI Scripting
    useAiScript: z.boolean().default(true),
    aiPrompt: z.string().default(""),
    saleStyle: z.enum(["hard", "soft", "educational", "storytelling"]).default("hard"),
    language: z.enum(["th-central", "th-north", "th-south", "th-isan", "en"]).default("th-central"),
    voiceTone: z.enum(["energetic", "calm", "friendly", "professional"]).default("energetic"),
    template: z.enum([
        "product-review",
        "brainrot-product",
        "unboxing",
        "comparison",
        "testimonial",
        "flash-sale",
        "tutorial",
        "lifestyle",
        "trending",
        "mini-drama",
        "before-after"
    ]).default("product-review"),
    hookText: z.string().default(""),
    ctaText: z.string().default(""),
    hookEnabled: z.boolean().default(true),
    ctaEnabled: z.boolean().default(true),

    // Character & Style
    gender: z.enum(["male", "female", "any"]).default("female"),
    ageRange: z.enum(["teen", "young-adult", "adult", "middle-age", "senior"]).default("young-adult"),
    personality: z.enum(["cheerful", "calm", "professional", "playful", "mysterious"]).default("cheerful"),
    clothingStyles: z.array(z.enum(["casual", "formal", "sporty", "fashion", "uniform"])).default(["casual"]),
    background: z.enum(["studio", "outdoor", "home", "office", "abstract", "product-focused"]).default("studio"),
    voiceSetting: z.enum(["original", "ai-generated", "text-to-speech"]).default("ai-generated"),
    touchLevel: z.enum(["low", "medium", "high"]).default("medium"),
    expression: z.enum(["neutral", "happy", "excited", "serious"]).default("happy"),
    cameraAngles: z.array(z.enum(["front", "side", "close-up", "full-body", "dynamic"])).default(["front"]),
    movement: z.enum(["static", "minimal", "active"]).default("minimal"),

    // Generation Settings
    clipCount: z.union([
        z.literal(1),
        z.literal(3),
        z.literal(5),
        z.literal(10),
        z.literal(25),
    ]).default(1),
    aspectRatio: z.enum(["9:16", "16:9", "1:1"]).default("9:16"),
    videoDuration: z.enum(["short", "medium", "long"]).default("short"),
    restInterval: z.enum(["30s", "1m", "2m", "5m", "10m"]).default("30s"),

    // Posting Settings
    autoPostTikTok: z.boolean().default(false),
    autoPostYoutube: z.boolean().default(false),
    smartLoop: z.boolean().default(false),

    // Keywords
    mustUseKeywords: z.string().default(""),
    avoidKeywords: z.string().default(""),
});

export type CreateVideoFormData = z.infer<typeof createVideoSchema>;

// Default values for useForm
export const createVideoDefaultValues: CreateVideoFormData = {
    productId: "",
    productName: "",
    productDescription: "",
    useAiScript: true,
    aiPrompt: "",
    saleStyle: "storytelling",
    language: "th-central",
    voiceTone: "energetic",
    template: "product-review",
    hookText: "",
    ctaText: "",
    hookEnabled: true,
    ctaEnabled: true,
    gender: "female",
    ageRange: "young-adult",
    personality: "cheerful",
    clothingStyles: ["casual"],
    background: "studio",
    voiceSetting: "ai-generated",
    touchLevel: "medium",
    expression: "happy",
    cameraAngles: ["front"],
    movement: "minimal",
    clipCount: 1,
    aspectRatio: "9:16",
    videoDuration: "short",
    restInterval: "30s",
    autoPostTikTok: false,
    autoPostYoutube: false,
    smartLoop: false,
    mustUseKeywords: "",
    avoidKeywords: "",
};
