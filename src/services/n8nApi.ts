export interface VideoGenerationResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Sends video generation data to the n8n webhook.
 * @param data The form data from NetCast or Create Video tabs.
 * @returns The response from the n8n webhook.
 */
export const generateVideo = async (data: any): Promise<VideoGenerationResponse> => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new Error("Configuration Error: VITE_N8N_WEBHOOK_URL is not set without .env file.");
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        // Attempt to parse JSON response, fallback to text/success if body is empty or non-JSON
        try {
            const responseData = await response.json();
            return {
                success: true,
                message: "Request sent successfully",
                data: responseData
            };
        } catch (e) {
            return {
                success: true,
                message: "Request sent successfully (No JSON response)",
            };
        }

    } catch (error) {
        console.error("Video Generation API Error:", error);
        throw error;
    }
};
