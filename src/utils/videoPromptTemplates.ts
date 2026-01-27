
// Helper for random selection
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- 1. DIVERSE STYLES & ATMOSPHERES ---
const lightingStyles = [
    "Soft studio lighting, rim light, high key",
    "Golden hour sunlight, warm tones, cinematic glow",
    "Neon city lights, cyberpunk atmosphere, cool blue and red highlights",
    "Natural window light, airy and fresh, minimal shadows",
    "Dramatic chiaroscuro, high contrast, moody luxury"
];

const cameraMovements = [
    "Slow smooth dolly in",
    "Handheld orbital movement, dynamic feel",
    "Static shot with focus pull",
    "Low angle tracking shot",
    "Gentle pan revealing details"
];

const qualityBoosters = "8k resolution, hyperrealistic, highly detailed texture, professional cinematography, award-winning photography, sharp focus, 35mm lens, f/1.8";

// --- 2. IDENTITY LOCK COMMANDS (CRITICAL) ---
// This is recent best-practice for Vision-to-Video consistency
const identityLockInstruction = `
*** CRITICAL FACE & IDENTITY PRESERVATION ***
- REFERENCE IMAGE IS THE SOURCE OF TRUTH.
- YOU MUST TRANSFER THE EXACT FACE FROM THE IMAGE TO THE VIDEO.
- Do NOT create a generic face. Use the specific facial features, bone structure, and skin texture from the input image.
- If the image contains a specific product, KEEP IT EXACT. Do not hallucinate different packaging.
- CONSISTENCY LEVEL: 100%.
`;

export interface PromptVariables {
    productName: string;
    genderText: string;
    sceneDescription?: string;
    movement?: string;
    emotion?: string;
    style?: string;
}

export const basePromptTemplate = `
[Scene]: {{sceneDescription}}
[Camera]: {{movement}}
[Lighting]: {{lighting}}
[Subject]: {{genderText}} interacting with {{productName}}
[Emotion]: {{emotion}}

{{identityLock}}

*** TECH SPECS ***
- Style: {{qualityBoosters}}
- Resolution: 8K
- Framerate: 24fps
- Motion: Fluid, Natural
- NO TEXT OVERLAYS.
`;

export const getFormattedPrompt = (variables: PromptVariables): string => {
    // 1. Fill defaults
    const lighting = variables.style || sample(lightingStyles);
    const move = variables.movement || sample(cameraMovements);

    // 2. Variable Substitution
    let result = basePromptTemplate;

    result = result.replace(/{{productName}}/g, variables.productName);
    result = result.replace(/{{genderText}}/g, variables.genderText);
    result = result.replace(/{{sceneDescription}}/g, variables.sceneDescription || `Cinematic shot of ${variables.productName}`);
    result = result.replace(/{{emotion}}/g, variables.emotion || "Confident and natural");

    // Dynamic Creative Vars
    result = result.replace(/{{movement}}/g, move);
    result = result.replace(/{{lighting}}/g, lighting);
    result = result.replace(/{{qualityBoosters}}/g, qualityBoosters);

    // Strict Rules
    result = result.replace(/{{identityLock}}/g, identityLockInstruction);

    return result.trim();
};
