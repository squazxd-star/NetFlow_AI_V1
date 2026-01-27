const o=t=>t[Math.floor(Math.random()*t.length)],a=["Soft studio lighting, rim light, high key","Golden hour sunlight, warm tones, cinematic glow","Neon city lights, cyberpunk atmosphere, cool blue and red highlights","Natural window light, airy and fresh, minimal shadows","Dramatic chiaroscuro, high contrast, moody luxury"],r=["Slow smooth dolly in","Handheld orbital movement, dynamic feel","Static shot with focus pull","Low angle tracking shot","Gentle pan revealing details"],c="8k resolution, hyperrealistic, highly detailed texture, professional cinematography, award-winning photography, sharp focus, 35mm lens, f/1.8",l=`
*** CRITICAL FACE & IDENTITY PRESERVATION ***
- REFERENCE IMAGE IS THE SOURCE OF TRUTH.
- YOU MUST TRANSFER THE EXACT FACE FROM THE IMAGE TO THE VIDEO.
- Do NOT create a generic face. Use the specific facial features, bone structure, and skin texture from the input image.
- If the image contains a specific product, KEEP IT EXACT. Do not hallucinate different packaging.
- CONSISTENCY LEVEL: 100%.
`,s=`
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
`,g=t=>{const n=t.style||o(a),i=t.movement||o(r);let e=s;return e=e.replace(/{{productName}}/g,t.productName),e=e.replace(/{{genderText}}/g,t.genderText),e=e.replace(/{{sceneDescription}}/g,t.sceneDescription||`Cinematic shot of ${t.productName}`),e=e.replace(/{{emotion}}/g,t.emotion||"Confident and natural"),e=e.replace(/{{movement}}/g,i),e=e.replace(/{{lighting}}/g,n),e=e.replace(/{{qualityBoosters}}/g,c),e=e.replace(/{{identityLock}}/g,l),e.trim()};export{s as basePromptTemplate,g as getFormattedPrompt};
