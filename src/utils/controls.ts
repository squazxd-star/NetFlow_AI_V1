
/**
 * Converts a base64 string to a File object.
 */
function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

/**
 * Uploads an image to a web input[type="file"] element.
 * @param base64Image The base64 string of the image.
 * @param inputSelector The CSS selector for the file input.
 */
export const uploadImageToWeb = (base64Image: string | null, inputSelector: string = 'input[type="file"]'): boolean => {
    if (!base64Image) {
        console.warn("No image provided for upload.");
        return false;
    }

    const fileInput = document.querySelector(inputSelector) as HTMLInputElement;
    if (!fileInput) {
        console.error(`File input not found with selector: ${inputSelector}`);
        return false;
    }

    try {
        const file = base64ToFile(base64Image, "reference_image.png");
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        // Trigger change event to notify the page of the new file
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);

        console.log("Image uploaded successfully via script injection.");
        return true;
    } catch (error) {
        console.error("Error uploading image:", error);
        return false;
    }
};

/**
 * Uploads a person image (specifically for character reference).
 * This is a specialized wrapper around uploadImageToWeb if needed, 
 * or can target a specific input if the UI separates product vs person.
 */
export const uploadPersonToWeb = (base64Image: string | null, inputSelector: string = 'input[type="file"]'): boolean => {
    // Check if there's a specific input for "Person" or if it uses the same one
    // For now, we reuse the logic but log specifically
    console.log("Uploading person reference image...");
    return uploadImageToWeb(base64Image, inputSelector);
};

/**
 * Fills a text input or textarea with the provided prompt.
 */
export const fillPrompt = (text: string, selector: string = 'textarea'): boolean => {
    const input = document.querySelector(selector) as HTMLTextAreaElement | HTMLInputElement;
    if (!input) {
        console.error(`Prompt input not found with selector: ${selector}`);
        return false;
    }

    const genericInput = input as HTMLInputElement;
    genericInput.value = text;
    genericInput.dispatchEvent(new Event('input', { bubbles: true }));
    genericInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log("Prompt filled successfully.");
    return true;
};

/**
 * Clicks a button on the page.
 */
export const clickButton = (selector: string): boolean => {
    const button = document.querySelector(selector) as HTMLElement;
    if (!button) {
        console.error(`Button not found with selector: ${selector}`);
        return false;
    }
    button.click();
    console.log(`Clicked button: ${selector}`);
    return true;
};
