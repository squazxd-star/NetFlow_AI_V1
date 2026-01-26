
/**
 * Merges two base64 images into a single side-by-side image.
 * This is useful for single-input AI models to see both reference subjects.
 */
export const mergeImages = async (
    image1Base64: string,
    image2Base64: string,
    align: 'horizontal' | 'vertical' = 'horizontal'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img1 = new Image();
        const img2 = new Image();

        // Helper to load image
        const loadImg = (img: HTMLImageElement, src: string) => {
            return new Promise<void>((r, f) => {
                img.onload = () => r();
                img.onerror = f;
                img.src = src;
            });
        };

        Promise.all([
            loadImg(img1, image1Base64),
            loadImg(img2, image2Base64)
        ]).then(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            if (align === 'horizontal') {
                // Determine dimensions
                const height = Math.max(img1.height, img2.height);
                // Resize images to have same height for cleaner look? 
                // Or just draw them as is. Let's keep original aspect ratios but fit to a coherent container if needed.
                // For simplicity: Just side by side, aligned top.
                canvas.width = img1.width + img2.width;
                canvas.height = height;

                // Draw
                // Fill background white
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img1, 0, 0);
                ctx.drawImage(img2, img1.width, 0);
            } else {
                const width = Math.max(img1.width, img2.width);
                canvas.width = width;
                canvas.height = img1.height + img2.height;

                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img1, 0, 0);
                ctx.drawImage(img2, 0, img1.height);
            }

            resolve(canvas.toDataURL('image/png'));
        }).catch(err => {
            console.error("Error merging images:", err);
            reject(err);
        });
    });
};
