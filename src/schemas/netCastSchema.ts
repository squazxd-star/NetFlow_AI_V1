import { z } from "zod";

export const netCastSchema = z.object({
    // Production Settings
    sceneCount: z.number().min(1).max(10).default(3),
    durationMode: z.enum(["scenes", "time"]).default("scenes"),
    selectedAspectRatio: z.enum(["9:16", "16:9"]).default("9:16"),
    selectedPlatform: z.enum(["tiktok", "youtube", "save"]).default("tiktok"),

    // Mode
    netcastMode: z.enum(["podcast", "storyboard", "script"]).default("podcast"),

    // Story & Style
    netcastTopic: z.string().default(""),
    selectedStoryStyle: z.string().default("casual"),
    customStyleText: z.string().default(""),

    // Character Settings
    netcastHostType: z.string().default("สาววัยรุ่น (ไทย)"),
    netcastGuestType: z.string().default("เลือกเสียง"),

    // Quality & Emotion
    netcastLipSync: z.string().default("อัตโนมัติ"),
    netcastEmotion: z.string().default("เป็นปกติ"),
    netcastBgStyle: z.string().default("เบลอโปร่ง"),
    cryptoLiveData: z.boolean().default(false),

    // Sound & Atmosphere
    netcastAtmosphereVol: z.number().min(0).max(100).default(33),
    addRealisticHumanSound: z.boolean().default(true),

    // Sales
    salesProductId: z.string().default(""),
    show3DProduct: z.boolean().default(false),

    // Smart Loop
    smartLoop: z.boolean().default(false),
});

export type NetCastFormData = z.infer<typeof netCastSchema>;

// Default values for useForm
export const netCastDefaultValues: NetCastFormData = {
    sceneCount: 3,
    durationMode: "scenes",
    selectedAspectRatio: "9:16",
    selectedPlatform: "tiktok",
    netcastMode: "podcast",
    netcastTopic: "",
    selectedStoryStyle: "casual",
    customStyleText: "",
    netcastHostType: "สาววัยรุ่น (ไทย)",
    netcastGuestType: "เลือกเสียง",
    netcastLipSync: "อัตโนมัติ",
    netcastEmotion: "เป็นปกติ",
    netcastBgStyle: "เบลอโปร่ง",
    cryptoLiveData: false,
    netcastAtmosphereVol: 33,
    addRealisticHumanSound: true,
    salesProductId: "",
    show3DProduct: false,
    smartLoop: false,
};
