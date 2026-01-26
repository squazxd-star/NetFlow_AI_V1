
export interface PromptVariables {
    productName: string;
    genderText: string; // "Thai woman" or "Thai man"
    sceneDescription?: string;
    movement?: string;
    emotion?: string;
}

export const basePromptTemplate = `
[Scene description]: {{sceneDescription}}
[Movement]: {{movement}}
[Thai dialogue]: Presenting {{productName}} with a {{emotion}} expression.
[Emotion]: {{emotion}}

*** VISUAL REFERENCE GUIDE ***
- The uploaded reference image contains TWO main elements side-by-side:
  1. LEFT SIDE: The Character reference ({{genderText}}).
  2. RIGHT SIDE: The Product reference ({{productName}}).
- Please generate a video where this character is interacting with this product.

*** STRICT REQUIREMENTS ***
- The person in the video MUST use the appearance of the person on the LEFT of the reference image.
- The product in the video MUST look like the object on the RIGHT of the reference image.
- Nationality: Thai people only.
- AGE: Adult only. DO NOT include babies, infants, or children.
- No text overlays unless specified in dialogue.
`;

export const substituteVariables = (template: string, variables: PromptVariables): string => {
    let result = template;

    // Replace standard variables
    result = result.replace(/{{productName}}/g, variables.productName);
    result = result.replace(/{{genderText}}/g, variables.genderText);
    result = result.replace(/{{sceneDescription}}/g, variables.sceneDescription || "Product showcase");
    result = result.replace(/{{movement}}/g, variables.movement || "Smooth cinematic pan");
    result = result.replace(/{{emotion}}/g, variables.emotion || "Happy and confident");

    return result;
};

export const getFormattedPrompt = (variables: PromptVariables): string => {
    return substituteVariables(basePromptTemplate, variables);
};
