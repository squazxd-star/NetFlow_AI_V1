
import { describe, it, expect, vi } from 'vitest';
import { getFormattedPrompt } from './videoPromptTemplates';
import { generateVisualPrompt } from '../services/geminiService';

describe('Video Prompt Templates', () => {
    it('should include Strict Identity Lock and Product Name', () => {
        const prompt = getFormattedPrompt({
            productName: "Super Serum",
            genderText: "Thai Woman",
            sceneDescription: "Applying serum to face",
            emotion: "Happy"
        });

        // Check for Key Phrases
        expect(prompt).toContain("*** CRITICAL FACE & IDENTITY PRESERVATION ***");
        expect(prompt).toContain("Super Serum");
        expect(prompt).toContain("Thai Woman");
        expect(prompt).toContain("NO TEXT OVERLAYS");
    });

    it('should use provided style when available', () => {
        const prompt = getFormattedPrompt({
            productName: "Test Product",
            genderText: "Man",
            style: "Cyberpunk Neon"
        });
        expect(prompt).toContain("Cyberpunk Neon");
    });
});

describe('Gemini Service Logic', () => {
    // Mock global fetch
    global.fetch = vi.fn();

    it('should return cleaned prompt string from Vision API', async () => {
        const mockResponse = {
            json: async () => ({
                choices: [{
                    message: {
                        content: "Prompt: Cinematic shot of a Thai woman holding a product. Name: TestBrand"
                    }
                }]
            })
        };
        (global.fetch as any).mockResolvedValue(mockResponse);

        const result = await generateVisualPrompt("fake-key", "base64...", "Product", "Cinematic");

        // It should match the prompt part and remove "Prompt:"
        expect(result).toBe("Cinematic shot of a Thai woman holding a product. Name: TestBrand");
        // Actually my regex `replace(/^Prompt:\s*/i, "")` removes leading "Prompt: "
        // But `replace(/^Name:.*?\n/i, "")` removes leading Name line if it exists.
        // Let's test the specific cleanups I implemented.
    });

    it('should cleanup separate lines for Name and Prompt', async () => {
        const mockResponse = {
            json: async () => ({
                choices: [{
                    message: {
                        content: "Name: SuperBrand\nPrompt: Cinematic shot of SuperBrand."
                    }
                }]
            })
        };
        (global.fetch as any).mockResolvedValue(mockResponse);

        const result = await generateVisualPrompt("fake-key", "base64...", "Product", "Cinematic");

        expect(result).toBe("Cinematic shot of SuperBrand.");
    });
});
