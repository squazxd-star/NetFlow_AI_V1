import { z } from "zod";

export const createVideoSchema = z.object({
    // Product Data
    productId: z.string().default(""),
    productName: z.string().default(""),

    // AI Scripting
    useAiScript: z.boolean().default(true),
    aiPrompt: z.string().default(""),
    saleStyle: z.enum(["hard", "soft", "educational", "storytelling"]).default("hard"),
    language: z.enum(["th-central", "th-north", "th-south", "th-isan"]).default("th-central"),
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
    gender: z.enum(["male", "female"]).default("female"),
    ageRange: z.enum(["teen", "young-adult", "adult", "middle-age", "senior"]).default("teen"),
    personality: z.enum(["cheerful", "calm", "professional", "playful", "mysterious"]).default("cheerful"),
    clothingStyles: z.array(z.enum(["casual", "formal", "sporty", "fashion", "uniform"])).default(["casual"]),
    background: z.enum(["studio", "outdoor", "home", "office", "abstract"]).default("studio"),
    voiceSetting: z.enum(["original", "ai-generated", "text-to-speech"]).default("original"),
    touchLevel: z.enum(["low", "medium", "high"]).default("medium"),
    expression: z.enum(["neutral", "happy", "excited", "serious"]).default("neutral"),
    cameraAngles: z.array(z.enum(["front", "side", "close-up", "full-body", "dynamic"])).default(["front"]),
    movement: z.enum(["static", "minimal", "active"]).default("minimal"),

    // Generation Settings
    clipCount: z.union([
        z.literal(5),
        z.literal(10),
        z.literal(25),
        z.literal(50),
        z.literal(100),
        z.literal("unlimited")
    ]).default(50),
    aspectRatio: z.enum(["9:16", "16:9"]).default("9:16"),
    videoDuration: z.enum(["short", "medium", "long"]).default("short"),
    restInterval: z.enum(["30s", "1m", "2m", "5m", "10m"]).default("30s"),

    // Posting Settings
    autoPostTikTok: z.boolean().default(true),
    autoPostYoutube: z.boolean().default(false),
    smartLoop: z.boolean().default(false),

    // Keywords (additional fields from the component)
    mustUseKeywords: z.string().default(""),
    avoidKeywords: z.string().default(""),
});

export type CreateVideoFormData = z.infer<typeof createVideoSchema>;

// Default values for useForm
export const createVideoDefaultValues: CreateVideoFormData = {
    productId: "DEMO-001",
    productName: "Future Warrior Model X",
    useAiScript: true,
    aiPrompt: "A futuristic cyberpunk warrior in neon armor, high detail, 8k resolution, cinematic lighting",
    saleStyle: "storytelling",
    language: "th-central",
    voiceTone: "energetic",
    template: "mini-drama",
    hookText: "",
    ctaText: "",
    hookEnabled: true,
    ctaEnabled: true,
    gender: "female",
    ageRange: "young-adult",
    personality: "mysterious",
    clothingStyles: ["fashion"],
    background: "abstract",
    voiceSetting: "original",
    touchLevel: "high",
    expression: "serious",
    cameraAngles: ["dynamic"],
    movement: "active",
    clipCount: 5,
    aspectRatio: "9:16",
    videoDuration: "medium",
    restInterval: "30s",
    autoPostTikTok: true,
    autoPostYoutube: false,
    smartLoop: true,
    mustUseKeywords: "Cyberpunk, Neon, Future",
    avoidKeywords: "blur, low quality",
};
