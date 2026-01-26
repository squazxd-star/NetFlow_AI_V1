
// Helper for random selection
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- 1. DIVERSE STYLES & ATMOSPHERES (To make prompts multi-dimensional) ---
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

const qualityBoosters = "8k resolution, hyperrealistic, highly detailed texture, professional cinematography, award-winning photography, sharp focus";

// --- 2. IDENTITY LOCK COMMANDS (To fix facial distortion) ---
const identityLockInstruction = `
*** GROUND TRUTH IDENTITY - CRITICAL ***
- The AI MUST use the uploaded reference image as the absolute source for the character's face.
- DO NOT hallucinate a new face.
- MATCH THE FACE in the uploaded image EXACTLY.
- Maintain: Eye shape, nose structure, mouth, and skin texture from the reference.
- If the reference is a collage, look at the PERSON on the LEFT.
`;

export interface PromptVariables {
    productName: string;
    genderText: string;
    sceneDescription?: string;
    movement?: string;
    emotion?: string;
    // New: Optional advanced controls
    style?: string;
}

export const basePromptTemplate = `
[Concept]: {{sceneDescription}}
[Action]: {{movement}}
[Atmosphere]: {{lighting}}
[Subject]: {{genderText}} interacting with {{productName}}.
[Emotion]: {{emotion}}

*** VISUAL INPUT INSTRUCTION ***
- An image has been uploaded to the input. USE IT.
- The video must be based on this visual input.

{{identityLock}}

*** AESTHETIC GUIDELINES ***
- Style: {{qualityBoosters}}
- Nationality: Thai people only.
- Age: Adult only. NO children.
- Text: None.
`;

export const getFormattedPrompt = (variables: PromptVariables): string => {
    // 1. Fill empty fields with High-Quality Random Defaults if not provided
    const lighting = variables.style || sample(lightingStyles);
    const move = variables.movement || sample(cameraMovements);

    // 2. Variable Substitution
    let result = basePromptTemplate;

    // Standard Vars
    result = result.replace(/{{productName}}/g, variables.productName);
    result = result.replace(/{{genderText}}/g, variables.genderText);
    result = result.replace(/{{sceneDescription}}/g, variables.sceneDescription || `Reviewing ${variables.productName} with genuine interest`);
    result = result.replace(/{{emotion}}/g, variables.emotion || "Engaging and confident");

    // Dynamic Creative Vars
    result = result.replace(/{{movement}}/g, move);
    result = result.replace(/{{lighting}}/g, lighting);
    result = result.replace(/{{qualityBoosters}}/g, qualityBoosters);

    // Strict Rules
    result = result.replace(/{{identityLock}}/g, identityLockInstruction);

    return result.trim();
};
