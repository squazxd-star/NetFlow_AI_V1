import { z } from "zod";

export const tikTokSettingsSchema = z.object({
    // Product Data
    productId: z.string().default(""),
    productName: z.string().default(""),

    // Posting Settings
    postingFrequency: z.string().default("auto"),
    autoCaption: z.boolean().default(true),
    notifications: z.boolean().default(true),
});

export type TikTokSettingsFormData = z.infer<typeof tikTokSettingsSchema>;

// Default values for useForm
export const tikTokSettingsDefaultValues: TikTokSettingsFormData = {
    productId: "",
    productName: "",
    postingFrequency: "auto",
    autoCaption: true,
    notifications: true,
};
